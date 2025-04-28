import React, { useEffect, useState } from "react";
import axios from "axios";

const ChallengePage = () => {
  const userId = 1; // Used for fetching progress
  const [challenges, setChallenges] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "STREAK",
    targetValue: 0,
    targetMinutes: 0,
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // fetch all challenges
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/challenges");
      setChallenges(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showNotification("Failed to load challenges", "error");
      console.error("Failed to fetch challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch progress for current user
  const fetchProgress = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/challenges/progress/${userId}`);
      setProgressData(res.data);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchProgress();
  }, []);

  // Helper function to show notifications
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  // find this challenge's progress entry
  const getProgressFor = (challengeId) =>
    progressData.find((p) => p.challenge?.id === challengeId);

  // form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // reset form fields
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "STREAK",
      targetValue: 0,
      targetMinutes: 0,
      startDate: "",
      endDate: "",
    });
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    
    if (form.type === "HOURS" && (parseInt(form.targetMinutes) <= 0)) {
      newErrors.targetMinutes = "Target minutes must be greater than zero";
    } else if (form.type !== "HOURS" && (parseInt(form.targetValue) <= 0)) {
      newErrors.targetValue = "Target value must be greater than zero";
    }
    
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // create
  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setActionLoading(true);
    try {
      await axios.post("http://localhost:8080/api/challenges", form);
      resetForm();
      setIsFormOpen(false);
      fetchChallenges();
      fetchProgress();
      showNotification("Challenge created successfully!");
    } catch (err) {
      showNotification("Failed to create challenge", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // update
  const handleUpdate = async (id) => { // Handles updating challenges
    if (!validateForm()) return;
    
    setActionLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/challenges/${id}`, form);
      setEditingId(null);
      resetForm();
      fetchChallenges();
      fetchProgress();
      showNotification("Challenge updated successfully!");
    } catch (err) {
      showNotification("Failed to update challenge", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // delete
  const handleDelete = async (id) => { // Handles deleting challenges
    if (!window.confirm("Are you sure you want to delete this challenge?")) return;
    
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/challenges/${id}`);
      fetchChallenges();
      fetchProgress();
      showNotification("Challenge deleted successfully!");
    } catch (err) {
      showNotification("Failed to delete challenge", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Begin editing a challenge
  const startEditing = (challenge) => {
    setEditingId(challenge.id);
    setIsFormOpen(true);
    setForm({
      title: challenge.title,
      description: challenge.description,
      type: challenge.type,
      targetValue: challenge.targetValue || 0,
      targetMinutes: challenge.targetMinutes || 0,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    resetForm();
    setIsFormOpen(false);
  };

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    if (filter === "all") return true;
    if (filter === "active") {
      const today = new Date().toISOString().split("T")[0];
      return challenge.startDate <= today && challenge.endDate >= today;
    }
    if (filter === "completed") {
      const progress = getProgressFor(challenge.id);
      if (!progress) return false;
      
      const total = challenge.type === "HOURS" ? challenge.targetMinutes : challenge.targetValue;
      return progress.currentValue >= total;
    }
    if (filter === "upcoming") {
      const today = new Date().toISOString().split("T")[0];
      return challenge.startDate > today;
    }
    return true;
  });

  // Get challenge status
  const getChallengeStatus = (challenge) => {
    const today = new Date().toISOString().split("T")[0];
    if (challenge.startDate > today) return "upcoming";
    if (challenge.endDate < today) return "expired";
    
    const progress = getProgressFor(challenge.id);
    if (progress) {
      const total = challenge.type === "HOURS" ? challenge.targetMinutes : challenge.targetValue;
      if (progress.currentValue >= total) return "completed";
    }
    return "active";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <span className="text-4xl mr-2">🎯</span> Challenges
              </h1>
              <p className="mt-1 text-indigo-200">Track your goals and build consistent habits</p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(!isFormOpen);
                setEditingId(null);
              }}
              className="mt-4 md:mt-0 bg-indigo-700 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium flex items-center transition shadow"
            >
              {isFormOpen ? "Cancel" : "+ New Challenge"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Notification */}
        {notification.show && (
          <div 
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-fade-in ${
              notification.type === "error" ? "bg-red-900 border-l-4 border-red-500 text-red-100" :
              "bg-green-900 border-l-4 border-green-500 text-green-100"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "error" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification({ show: false, message: "", type: "" })}
                className="ml-auto"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {isFormOpen && (
          <div className="bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              {editingId ? "✏ Edit Challenge" : "✨ Create a New Challenge"}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Challenge Title*
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Daily Meditation"
                  className={`w-full bg-gray-700 border ${errors.title ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Challenge Type*
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white"
                >
                  <option value="STREAK">Streak (Days in a Row)</option>
                  <option value="HOURS">Time-based (Minutes)</option>
                  <option value="SESSION_COUNT">Count-based (Sessions)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="What do you want to achieve with this challenge?"
                  rows="2"
                  className={`w-full bg-gray-700 border ${errors.description ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>

              <div>
                {form.type === "HOURS" ? (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Target Minutes*
                    </label>
                    <input
                      name="targetMinutes"
                      type="number"
                      value={form.targetMinutes}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      className={`w-full bg-gray-700 border ${errors.targetMinutes ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                    />
                    {errors.targetMinutes && <p className="mt-1 text-sm text-red-400">{errors.targetMinutes}</p>}
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Target Value*
                    </label>
                    <input
                      name="targetValue"
                      type="number"
                      value={form.targetValue}
                      onChange={handleInputChange}
                      placeholder={form.type === "STREAK" ? "e.g., 30 days" : "e.g., 20 sessions"}
                      className={`w-full bg-gray-700 border ${errors.targetValue ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                    />
                    {errors.targetValue && <p className="mt-1 text-sm text-red-400">{errors.targetValue}</p>}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date*
                </label>
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.startDate ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date*
                </label>
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-700 border ${errors.endDate ? "border-red-500" : "border-gray-600"} p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-white`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleCreate}
                disabled={actionLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center min-w-32 transition ${
                  actionLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {actionLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  editingId ? "Save Changes" : "Create Challenge"
                )}
              </button>
              <button
                onClick={cancelEditing}
                className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Challenge List Section */}
        <div>
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-100">📋 Your Challenges</h2>
            
            <div className="flex bg-gray-800 rounded-lg shadow-md p-1 border border-gray-700">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === "all" ? "bg-indigo-900 text-indigo-200" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === "active" ? "bg-green-900 text-green-200" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === "completed" ? "bg-purple-900 text-purple-200" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  filter === "upcoming" ? "bg-yellow-900 text-yellow-200" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredChallenges.length === 0 && (
            <div className="bg-gray-800 rounded-2xl shadow-md p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">No challenges found</h3>
              <p className="text-gray-400 mb-6">
                {filter !== "all" 
                  ? `You don't have any ${filter} challenges.` 
                  : "Create your first challenge to start tracking your progress!"}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View all challenges
                </button>
              )}
            </div>
          )}

          {/* Challenge cards */}
          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => {
                const progress = getProgressFor(challenge.id);
                const total = challenge.type === "HOURS" ? challenge.targetMinutes : challenge.targetValue;
                const value = progress?.currentValue ?? 0;
                const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
                const status = getChallengeStatus(challenge);
                
                // Status badge styles
                const statusConfig = {
                  active: { bg: "bg-green-900", text: "text-green-200", label: "Active" },
                  completed: { bg: "bg-blue-900", text: "text-blue-200", label: "Completed" },
                  upcoming: { bg: "bg-yellow-900", text: "text-yellow-200", label: "Upcoming" },
                  expired: { bg: "bg-gray-700", text: "text-gray-300", label: "Expired" }
                };

                // Type icon
                const typeIcon = challenge.type === "STREAK" ? "🔥" : 
                                 challenge.type === "HOURS" ? "⏱" : "🔄";

                return (
                  <div
                    key={challenge.id}
                    className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{typeIcon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100">{challenge.title}</h3>
                            <p className="text-gray-400 text-sm">{challenge.description}</p>
                          </div>
                        </div>
                        <span className={`${statusConfig[status].bg} ${statusConfig[status].text} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                          {statusConfig[status].label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500">Target</p>
                          <p className="font-medium text-gray-300">
                          {challenge.type === "HOURS" 
                          ? `${challenge.targetMinutes} minutes` 
                          : challenge.type === "STREAK" 
                            ? `${challenge.targetValue} days streak`
                            : `${challenge.targetValue} sessions`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Timeline</p>
                          <p className="font-medium text-gray-300">
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{percent}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              percent < 50 ? "bg-yellow-500" : 
                              percent < 100 ? "bg-green-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-sm text-right text-gray-400 mt-1">
                          {value} / {total}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => startEditing(challenge)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-center text-gray-500 text-sm">
        <p>Challenge Manager © 2025</p>
      </footer>
    </div>
  );
};

export default ChallengePage;