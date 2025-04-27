import React, { useState } from 'react';

const FlipCard = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-72 h-40 perspective cursor-pointer mx-auto my-4"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-xl shadow flex items-center justify-center p-4">
          <p className="text-center font-medium text-gray-800">{question}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-blue-100 border border-gray-300 rounded-xl shadow transform rotate-y-180 flex items-center justify-center p-4">
          <p className="text-center font-medium text-gray-800">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
