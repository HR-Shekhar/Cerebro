import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4"
        />
        <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </span>
      </div>
      <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700">
        Delete
      </button>
    </div>
  );
};

export default TaskItem;
