import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { Moon, Sun, Plus, X } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Dark mode as default

  // Apply dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch all notes from backend
  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/notes");
      setNotes(response.data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  // Create or update note
  const handleCreateOrUpdate = async (note) => {
    try {
      if (note.id) {
        await axios.put(`http://localhost:8080/api/notes/${note.id}`, note);
      } else {
        await axios.post("http://localhost:8080/api/notes", note);
      }
      setEditingNote(null);
      setShowNoteForm(false);
      fetchNotes();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle new note click
  const handleNewNote = () => {
    setEditingNote(null);
    setViewingNote(null);
    setShowNoteForm(true);
  };

  // Handle edit note
  const handleEditNote = (note) => {
    setEditingNote(note);
    setViewingNote(null);
    setShowNoteForm(true);
  };

  // Handle view note
  const handleViewNote = (note) => {
    setViewingNote(note);
    setEditingNote(null);
    setShowNoteForm(false);
  };

  // Fetch on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes by search term
  const filteredNotes = notes.filter((n) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.content.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white text-gray-800">
            <span className="mr-2">📓</span> My Notes
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewNote}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-all"
              aria-label="Create new note"
            >
              <Plus size={20} /> New Note
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full dark:bg-gray-700 bg-gray-200 dark:text-yellow-300 text-gray-700 hover:opacity-80 transition-all"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative rounded-lg shadow-sm dark:bg-gray-800 bg-white">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-800 dark:text-white dark:border-gray-700 bg-white text-gray-700 border border-gray-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 dark:text-gray-400 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Note Form or Note View */}
        {(showNoteForm || viewingNote) && (
          <div className="p-6 mb-8 rounded-lg shadow-md dark:bg-gray-800 bg-white relative">
            <button
              onClick={() => {
                setShowNoteForm(false);
                setViewingNote(null);
                setEditingNote(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-full dark:hover:bg-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} className="dark:text-gray-400 text-gray-500" />
            </button>
            
            {showNoteForm ? (
              <NoteForm
                onSubmit={handleCreateOrUpdate}
                editingNote={editingNote}
                onCancel={() => {
                  setShowNoteForm(false);
                  setEditingNote(null);
                }}
                darkMode={darkMode}
              />
            ) : viewingNote ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold dark:text-white text-gray-800">{viewingNote.title}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {viewingNote.tags && viewingNote.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </div>
                  ))}
                </div>
                <p className="dark:text-gray-300 text-gray-700 whitespace-pre-wrap">{viewingNote.content}</p>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleEditNote(viewingNote)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Edit Note
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDelete(note.id)}
              onView={() => handleViewNote(note)}
              darkMode={darkMode}
            />
          ))}
          {filteredNotes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="text-7xl mb-4">📝</div>
              <p className="text-xl dark:text-gray-400 text-gray-500 mb-6">
                No notes found. Time to create your first note!
              </p>
              <button
                onClick={handleNewNote}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-all"
              >
                <Plus size={20} /> Create Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}