import React, { useState } from 'react';
import axios from 'axios';

const CourseCreatePage = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [topics, setTopics] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = value;
    setTopics(updatedTopics);
  };

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const removeTopic = (index) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const courseResponse = await axios.post('http://localhost:8080/api/courses', {
        name: courseName,
        description: courseDescription,
      });

      const courseId = courseResponse.data.id;

      await Promise.all(topics.map(async (topic) => {
        if (topic.trim()) {
          await axios.post('http://localhost:8080/api/topics', {
            name: topic,
            course: { id: courseId }
          });
        }
      }));

      setSuccessMessage('✅ Course and topics created successfully!');
      resetForm();
    } catch (err) {
      setErrorMessage('❌ Error creating course or topics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseName('');
    setCourseDescription('');
    setTopics(['']);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Course Name:</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Course Description:</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-2">Topics:</label>
          {topics.map((topic, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                placeholder={`Topic ${index + 1}`}
                required
              />
              {topics.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTopic}
            className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
          >
            + Add Topic
          </button>
        </div>

        {loading ? (
          <div className="text-blue-600 font-semibold">Submitting...</div>
        ) : (
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
          >
            Create Course
          </button>
        )}

        {successMessage && (
          <div className="text-green-700 font-medium mt-4">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 font-medium mt-4">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CourseCreatePage;