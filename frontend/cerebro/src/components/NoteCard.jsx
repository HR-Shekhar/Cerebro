import React from 'react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">{note.title}</h2>
      <p className="text-gray-700 mt-2">{note.content}</p>
      <p className="text-sm text-gray-500 mt-1">{new Date(note.timestamp).toLocaleString()}</p>
      <div className="flex gap-2 mt-4">
        <button onClick={onEdit} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
        <button onClick={onDelete} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;
