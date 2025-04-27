import React, { useState } from 'react';
import axios from 'axios';

const CourseCreationForm = () => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState(['']); // one empty topic input by default

  const handleAddTopic = () => {
    setTopics([...topics, '']);
  };

  const handleTopicChange = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const handleSubmit = async () => {
    try {
      const courseRes = await axios.post('http://localhost:8080/api/courses', {
        name: courseName,
        description,
      });

      const courseId = courseRes.data.id;

      // POST each topic
      await Promise.all(
        topics.filter(t => t.trim()).map(topicName =>
          axios.post('http://localhost:8080/api/topics', {
            name: topicName,
            courseId,
          })
        )
      );

      alert('Course and topics created successfully!');
      setCourseName('');
      setDescription('');
      setTopics(['']);
    } catch (err) {
      console.error('Failed to create course/topics:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create New Course</h2>

      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Course Name"
        value={courseName}
        onChange={e => setCourseName(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-2 border rounded"
        placeholder="Course Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Topics</h3>
        {topics.map((topic, i) => (
          <input
            key={i}
            className="w-full mb-2 p-2 border rounded"
            placeholder={`Topic ${i + 1}`}
            value={topic}
            onChange={e => handleTopicChange(i, e.target.value)}
          />
        ))}
        <button
          onClick={handleAddTopic}
          className="text-blue-600 text-sm underline"
        >
          + Add Another Topic
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Course
      </button>
    </div>
  );
};

export default CourseCreationForm;