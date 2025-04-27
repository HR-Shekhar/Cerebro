import React, { useEffect, useState } from 'react';

const NoteForm = ({ onSubmit, editingNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: editingNote?.id,
      title,
      content,
      timestamp: new Date().toISOString(),
    });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">{editingNote ? 'Edit Note' : 'New Note'}</h2>
      <input
        className="w-full border p-2 rounded mb-2"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-2 rounded mb-2"
        placeholder="Content"
        rows="4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {editingNote ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default NoteForm;
