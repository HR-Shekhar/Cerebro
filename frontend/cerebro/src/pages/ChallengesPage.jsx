// src/pages/ChallengePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ChallengePage = () => {
  const userId = 1;
  const [challenges, setChallenges] = useState([]);
  const [progressData, setProgressData] = useState([]);
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

  // fetch all challenges
  const fetchChallenges = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/challenges");
      setChallenges(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    }
  };

  // fetch progress for current user
  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/challenges/progress/${userId}`
      );
      setProgressData(res.data);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchProgress();
  }, []);

  // find this challenge’s progress entry
  const getProgressFor = (challengeId) =>
    progressData.find((p) => p.challenge?.id === challengeId);

  // form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // reset form fields
  const resetForm = () =>
    setForm({
      title: "",
      description: "",
      type: "STREAK",
      targetValue: 0,
      targetMinutes: 0,
      startDate: "",
      endDate: "",
    });

  // create
  const handleCreate = async () => {
    await axios.post("http://localhost:8080/api/challenges", form);
    resetForm();
    fetchChallenges();
    fetchProgress();
  };

  // update
  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:8080/api/challenges/${id}`, form);
    setEditingId(null);
    resetForm();
    fetchChallenges();
    fetchProgress();
  };

  // delete
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/challenges/${id}`);
    fetchChallenges();
    fetchProgress();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">🎯 Challenge Manager</h1>

      {/* create / edit form */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Challenge" : "Create a New Challenge"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border p-3 rounded-xl"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-3 rounded-xl"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          >
            <option value="STREAK">Streak</option>
            <option value="HOURS">Minutes</option>
            <option value="SESSION_COUNT">Session Count</option>
          </select>

          {form.type === "HOURS" ? (
            <input
              name="targetMinutes"
              type="number"
              value={form.targetMinutes}
              onChange={handleInputChange}
              placeholder="Target Minutes"
              className="border p-3 rounded-xl"
            />
          ) : (
            <input
              name="targetValue"
              type="number"
              value={form.targetValue}
              onChange={handleInputChange}
              placeholder="Target Value"
              className="border p-3 rounded-xl"
            />
          )}

          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleInputChange}
            className="border p-3 rounded-xl"
          />
        </div>

        <button
          onClick={editingId ? () => handleUpdate(editingId) : handleCreate}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
        >
          {editingId ? "Save Changes" : "Create Challenge"}
        </button>
      </div>

      {/* list */}
      <h2 className="text-2xl font-semibold">📋 Your Challenges</h2>
      <div className="space-y-6">
        {challenges.map((ch) => {
          const progress = getProgressFor(ch.id);
          const total =
            ch.type === "HOURS" ? ch.targetMinutes : ch.targetValue;
          const value = progress?.currentValue ?? 0;
          const percent =
            total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

          return (
            <div
              key={ch.id}
              className="bg-white p-6 rounded-2xl shadow space-y-4"
            >
              {/* display or edit */}
              {editingId === ch.id ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="border p-3 rounded-xl"
                  />
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="border p-3 rounded-xl"
                  />
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="border p-3 rounded-xl"
                  >
                    <option value="STREAK">Streak</option>
                    <option value="HOURS">Minutes</option>
                    <option value="SESSION_COUNT">Session Count</option>
                  </select>
                  {form.type === "HOURS" ? (
                    <input
                      name="targetMinutes"
                      type="number"
                      value={form.targetMinutes}
                      onChange={handleInputChange}
                      className="border p-3 rounded-xl"
                    />
                  ) : (
                    <input
                      name="targetValue"
                      type="number"
                      value={form.targetValue}
                      onChange={handleInputChange}
                      className="border p-3 rounded-xl"
                    />
                  )}
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleInputChange}
                    className="border p-3 rounded-xl"
                  />
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleInputChange}
                    className="border p-3 rounded-xl"
                  />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{ch.title}</h3>
                      <p className="text-gray-600">{ch.description}</p>
                      <p className="text-sm text-gray-500">
                        {ch.type === "HOURS" ? "Minutes" : ch.type} •{" "}
                        {total} • {ch.startDate} ➡ {ch.endDate}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(ch.id);
                          setForm({
                            title: ch.title,
                            description: ch.description,
                            type: ch.type,
                            targetValue: ch.targetValue || 0,
                            targetMinutes: ch.targetMinutes || 0,
                            startDate: ch.startDate,
                            endDate: ch.endDate,
                          });
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ch.id)}
                        className="text-red-600 hover:underline"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${
                          percent < 100 ? "bg-green-500" : "bg-blue-600"
                        } transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-sm text-right text-gray-600 mt-1">
                      {value} / {total} ({percent}%)
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengePage;