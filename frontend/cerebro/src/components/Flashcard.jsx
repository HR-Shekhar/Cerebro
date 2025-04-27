// src/components/Flashcard.jsx
import { useState } from 'react';

export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div onClick={() => setFlipped(!flipped)} className="bg-white border p-4 rounded-xl shadow-md cursor-pointer w-64 h-40 flex items-center justify-center text-xl text-center transition-all duration-300">
      {flipped ? card.answer : card.question}
    </div>
  );
}
