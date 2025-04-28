import React, { useState } from "react";

export default function FlashcardModal({ card, onClose }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Flashcard</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        <div
          className={`mt-4 p-4 border rounded ${flipped ? "bg-blue-100" : "bg-yellow-100"}`}
          onClick={handleFlip}
        >
          {flipped ? (
            <div>
              <h3 className="text-lg font-semibold">Answer</h3>
              <p>{card.answer}</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">Question</h3>
              <p>{card.question}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
