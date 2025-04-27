import React, { useState } from 'react';
import CourseSelector from '../components/CourseSelector';
import PomodoroTimer from '../components/PomodoroTimer';
import CoursePage from './CoursePage';

const StudyDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <CourseSelector
        onCourseChange={setSelectedCourse}
        onTopicChange={setSelectedTopic}
      />

      {selectedTopic && <PomodoroTimer topicId={selectedTopic} />}
      {selectedCourse && <CoursePage courseId={selectedCourse} />}
    </div>
  );
};

export default StudyDashboard;
