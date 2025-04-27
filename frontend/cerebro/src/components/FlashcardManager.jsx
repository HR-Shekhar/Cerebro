import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = 'http://localhost:8080/api/flashcards';

const FlashcardManager = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [form, setForm] = useState({ id: null, question: '', answer: '', topic: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchFlashcards = async () => {
    const res = await axios.get(api);
    setFlashcards(res.data);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`${api}/${form.id}`, form);
    } else {
      await axios.post(api, form);
    }
    setForm({ id: null, question: '', answer: '', topic: '' });
    setIsEditing(false);
    fetchFlashcards();
  };

  const handleEdit = (card) => {
    setForm(card);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${api}/${id}`);
    fetchFlashcards();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} Flashcard</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="question" value={form.question} onChange={handleChange} placeholder="Question" className="w-full p-2 border" required />
        <input name="answer" value={form.answer} onChange={handleChange} placeholder="Answer" className="w-full p-2 border" required />
        <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic" className="w-full p-2 border" required />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{isEditing ? 'Update' : 'Create'}</button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">All Flashcards</h2>
      <ul className="space-y-2">
        {flashcards.map((card) => (
          <li key={card.id} className="border p-3 flex justify-between items-start">
            <div>
              <p><strong>Q:</strong> {card.question}</p>
              <p><strong>A:</strong> {card.answer}</p>
              <p className="text-sm text-gray-500">Topic: {card.topic}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(card)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(card.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlashcardManager;
