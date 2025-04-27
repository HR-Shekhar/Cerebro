import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({ question: '', answer: '', topic: '' });
  const [editingCard, setEditingCard] = useState(null);

  const apiUrl = 'http://localhost:8080/api/flashcards';

  const fetchFlashcards = async () => {
    const res = await axios.get(apiUrl);
    setFlashcards(res.data);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleCreate = async () => {
    await axios.post(apiUrl, newCard);
    setNewCard({ question: '', answer: '', topic: '' });
    fetchFlashcards();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
    fetchFlashcards();
  };

  const handleEdit = (card) => {
    setEditingCard(card);
  };

  const handleUpdate = async () => {
    await axios.put(`${apiUrl}/${editingCard.id}`, editingCard);
    setEditingCard(null);
    fetchFlashcards();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Flashcards</h2>

      {/* New Flashcard Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New Flashcard</h3>
        <input
          type="text"
          placeholder="Question"
          value={newCard.question}
          onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Answer"
          value={newCard.answer}
          onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Topic"
          value={newCard.topic}
          onChange={(e) => setNewCard({ ...newCard, topic: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Flashcard
        </button>
      </div>

      {/* Flashcard List */}
      {flashcards.map((card) => (
        <div key={card.id} className="bg-white p-4 mb-3 rounded shadow">
          {editingCard?.id === card.id ? (
            <>
              <input
                type="text"
                value={editingCard.question}
                onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })}
                className="block w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                value={editingCard.answer}
                onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })}
                className="block w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                value={editingCard.topic}
                onChange={(e) => setEditingCard({ ...editingCard, topic: e.target.value })}
                className="block w-full mb-2 p-2 border rounded"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingCard(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Q:</strong> {card.question}</p>
              <p><strong>A:</strong> {card.answer}</p>
              <p><strong>Topic:</strong> {card.topic}</p>
              <button
                onClick={() => handleEdit(card)}
                className="bg-yellow-400 text-white px-3 py-1 rounded mt-2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default FlashcardsPage;
