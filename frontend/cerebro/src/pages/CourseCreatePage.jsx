import React, { useState } from 'react';
import axios from 'axios';

const CourseCreatePage = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [topics, setTopics] = useState([{ name: '', description: '' }]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [duration, setDuration] = useState('');

  // Form validation state
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!courseName.trim()) newErrors.courseName = 'Course name is required';
      if (!courseDescription.trim()) newErrors.courseDescription = 'Course description is required';
    } else if (currentStep === 2) {
      const emptyTopics = topics.filter(topic => !topic.name.trim());
      if (emptyTopics.length > 0) newErrors.topics = 'All topic names are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setTopics(updatedTopics);
  };

  const addTopic = () => {
    setTopics([...topics, { name: '', description: '' }]);
  };

  const removeTopic = (index) => {
    if (topics.length > 1) {
      const updatedTopics = topics.filter((_, i) => i !== index);
      setTopics(updatedTopics);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const courseResponse = await axios.post('http://localhost:8080/api/courses', {
        name: courseName,
        description: courseDescription,
        imageUrl,
        difficulty,
        estimatedDuration: duration
      });

      const courseId = courseResponse.data.id;

      await Promise.all(topics.map(async (topic) => {
        if (topic.name.trim()) {
          await axios.post('http://localhost:8080/api/topics', {
            name: topic.name,
            description: topic.description,
            course: { id: courseId }
          });
        }
      }));

      setNotification({ 
        type: 'success', 
        message: 'Course created successfully! Redirecting to course page...' 
      });
      
      // Simulate redirect after success
      setTimeout(() => {
        resetForm();
      }, 3000);
      
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: `Failed to create course: ${err.response?.data?.message || err.message}` 
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseName('');
    setCourseDescription('');
    setTopics([{ name: '', description: '' }]);
    setImageUrl('');
    setDifficulty('beginner');
    setDuration('');
    setStep(1);
  };

  // Difficulty options
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-3xl font-bold">Create a New Course</h2>
        <p className="text-blue-100 mt-2">Share your knowledge by creating an engaging course</p>
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-850 px-6 py-4 border-b border-gray-700" style={{ backgroundColor: 'rgb(28, 30, 40)' }}>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>1</div>
          <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>2</div>
          <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>3</div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Course Details</span>
          <span>Topics</span>
          <span>Review & Submit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 text-gray-200">
        {/* Step 1: Course Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Course Name</label>
              <input
                type="text"
                className={`w-full bg-gray-700 border ${errors.courseName ? 'border-red-500' : 'border-gray-600'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white`}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Introduction to React"
              />
              {errors.courseName && <p className="text-red-400 text-sm mt-1">{errors.courseName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Course Description</label>
              <textarea
                className={`w-full bg-gray-700 border ${errors.courseDescription ? 'border-red-500' : 'border-gray-600'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white`}
                rows={4}
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Provide a detailed description of your course..."
              ></textarea>
              {errors.courseDescription && <p className="text-red-400 text-sm mt-1">{errors.courseDescription}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Course Image URL</label>
                <input
                  type="text"
                  className={`w-full bg-gray-700 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-600'} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white`}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Duration (hours)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 12"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficultyOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition ${
                      difficulty === option.value 
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300' 
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                    onClick={() => setDifficulty(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Topics */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-200">Course Topics</h3>
                <button
                  type="button"
                  onClick={addTopic}
                  className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 text-blue-200 px-3 py-1 rounded-lg transition"
                >
                  <span>+</span> Add Topic
                </button>
              </div>
              
              {errors.topics && <p className="text-red-400 text-sm mb-3">{errors.topics}</p>}
              
              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <div key={index} className="bg-gray-750 p-4 rounded-lg border border-gray-700" style={{ backgroundColor: 'rgb(38, 40, 52)' }}>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-gray-200">Topic #{index + 1}</h4>
                      {topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTopic(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Topic Name</label>
                        <input
                          type="text"
                          className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white"
                          value={topic.name}
                          onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                          placeholder={`e.g., Module ${index + 1}: Introduction`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Topic Description</label>
                        <textarea
                          className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white"
                          rows={2}
                          value={topic.description}
                          onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                          placeholder="What will students learn in this topic?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-200">Review Your Course</h3>
            
            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700" style={{ backgroundColor: 'rgb(38, 40, 52)' }}>
              <h4 className="font-medium text-gray-300 mb-2">Course Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Course Name</p>
                  <p className="font-medium text-gray-200">{courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Difficulty</p>
                  <p className="font-medium capitalize text-gray-200">{difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-medium text-gray-200">{duration} hours</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Image URL</p>
                  <p className="font-medium text-blue-400 truncate">{imageUrl}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-gray-300">{courseDescription}</p>
              </div>
            </div>
            
            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700" style={{ backgroundColor: 'rgb(38, 40, 52)' }}>
              <h4 className="font-medium text-gray-300 mb-2">Topics ({topics.length})</h4>
              <div className="divide-y divide-gray-700">
                {topics.map((topic, index) => (
                  <div key={index} className="py-3">
                    <p className="font-medium text-gray-200">{topic.name || `Unnamed topic ${index + 1}`}</p>
                    <p className="text-gray-400 text-sm mt-1">{topic.description || '(No description provided)'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Back
            </button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-green-600 text-white rounded-lg transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-500'
                }`}
              >
                {loading ? 'Creating Course...' : 'Create Course'}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Notification */}
      {notification.message && (
        <div 
          className={`fixed bottom-4 right-4 rounded-lg shadow-lg p-4 max-w-md animate-fade-in-up
            ${notification.type === 'success' ? 'bg-green-900/90 border-l-4 border-green-500 text-green-100' : 
              'bg-red-900/90 border-l-4 border-red-500 text-red-100'}`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <span className="text-green-300">✓</span>
              ) : (
                <span className="text-red-300">✕</span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button 
              className="ml-auto pl-3 text-gray-300 hover:text-white" 
              onClick={() => setNotification({ type: '', message: '' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCreatePage;