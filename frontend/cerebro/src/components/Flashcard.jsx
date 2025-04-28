import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Stop event propagation to prevent opening the modal when flipping the card
  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="h-60 perspective-1000 w-full group">
      <motion.div 
        className="relative h-full w-full rounded-xl shadow-md preserve-3d transition-all duration-500 group-hover:shadow-lg"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-xl bg-white dark:bg-gray-800 p-5 flex flex-col ${isFlipped ? 'pointer-events-none' : ''}`}
          onClick={handleFlip}
        >
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {card.topic}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Question</h3>
            <p className="text-gray-800 dark:text-gray-200">{card.question}</p>
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Click to reveal answer
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-xl bg-indigo-50 dark:bg-indigo-900 p-5 flex flex-col rotate-y-180 ${!isFlipped ? 'pointer-events-none' : ''}`}
          onClick={handleFlip}
        >
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {card.topic}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Answer</h3>
            <p className="text-gray-800 dark:text-gray-200">{card.answer}</p>
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Click to see question
          </div>
        </div>
      </motion.div>
    </div>
  );
}