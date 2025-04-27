import React, { useEffect, useState } from 'react';
import api from '../api/API';

const CourseSelector = ({ onCourseChange, onTopicChange }) => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/topics/by-course/${selectedCourse}`).then(res => setTopics(res.data));
    }
  }, [selectedCourse]);

  return (
    <div className="mb-4">
      <label>Course:</label>
      <select value={selectedCourse} onChange={e => {
        setSelectedCourse(e.target.value);
        onCourseChange(e.target.value);
      }}>
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>

      {topics.length > 0 && (
        <>
          <label>Topic:</label>
          <select value={selectedTopic} onChange={e => {
            setSelectedTopic(e.target.value);
            onTopicChange(e.target.value);
          }}>
            <option value="">Select Topic</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.title}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CourseSelector;
