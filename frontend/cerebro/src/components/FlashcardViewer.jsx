// src/components/FlashcardViewer.jsx
import { useEffect, useState } from 'react';
import Flashcard from './Flashcard';
import { fetchCardsBySet } from '../api/flashcardApi';

export default function FlashcardViewer({ setId }) {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchCardsBySet(setId).then(res => setCards(res.data));
  }, [setId]);

  const nextCard = () => setIndex((prev) => (prev + 1) % cards.length);

  if (cards.length === 0) return <div>No cards yet.</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <Flashcard card={cards[index]} />
      <button onClick={nextCard} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Next</button>
    </div>
  );
}
