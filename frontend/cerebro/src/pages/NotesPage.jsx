import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    const response = await axios.get('http://localhost:8080/api/notes');
    setNotes(response.data);
  };

  const handleCreateOrUpdate = async (note) => {
    if (note.id) {
      await axios.put(`http://localhost:8080/api/notes/${note.id}`, note);
    } else {
      await axios.post('http://localhost:8080/api/notes', note);
    }
    setEditingNote(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/notes/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      <NoteForm onSubmit={handleCreateOrUpdate} editingNote={editingNote} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => setEditingNote(note)}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
