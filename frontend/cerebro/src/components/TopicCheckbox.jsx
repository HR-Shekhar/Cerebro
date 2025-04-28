import React from 'react';
import api from '../api/API';
import { toast } from 'react-hot-toast'; // ✅ For user feedback

const TopicCheckbox = ({ topic, onToggle }) => {
  const toggleComplete = async () => {
    try {
      await api.patch(`/topics/${topic.id}/toggle-complete`, {
        completed: !topic.completed,
      });
      onToggle(topic.id); // Notify parent
      toast.success('Topic updated!');
    } catch (error) {
      console.error('Failed to toggle topic', error);
      toast.error('Failed to update topic.');
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={topic.completed}
        onChange={toggleComplete}
        className="accent-blue-600"
      />
      <span className={topic.completed ? 'line-through text-gray-400' : ''}>
        {topic.title}
      </span>
    </label>
  );
};

export default TopicCheckbox;
