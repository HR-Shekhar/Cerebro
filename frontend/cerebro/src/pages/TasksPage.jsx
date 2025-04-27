import React, { useEffect, useState } from 'react';
import TaskItem from '../components/TaskItem';
import axios from 'axios';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:8080/api/tasks');
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;
    const res = await axios.post('http://localhost:8080/api/tasks', { title: newTaskTitle });
    setNewTaskTitle('');
    setTasks([...tasks, res.data]);
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updated = await axios.put(`http://localhost:8080/api/tasks/${id}`, {
      ...task,
      completed: !task.completed,
    });
    setTasks(tasks.map(t => (t.id === id ? updated.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8080/api/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 My Tasks</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-grow px-4 py-2 rounded border border-gray-300 focus:outline-none"
        />
        <button
          onClick={createTask}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <div>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks yet.</p>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
