import React from 'react';
import api from '../api/API';

const TopicCheckbox = ({ topic, onToggle }) => {
  const toggleComplete = () => {
    api.put(`/topics/${topic.id}/toggle-complete`).then(() => onToggle(topic.id));
  };

  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={topic.completed}
        onChange={toggleComplete}
      />
      {topic.title}
    </label>
  );
};

export default TopicCheckbox;
