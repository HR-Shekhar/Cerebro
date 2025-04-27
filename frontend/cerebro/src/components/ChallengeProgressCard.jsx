import React from "react";

const ChallengeProgressCard = ({ challenge }) => {
  const { title, description, type, targetValue, currentProgress } = challenge;
  const progress = Math.min((currentProgress / targetValue) * 100, 100);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-700 font-medium">
        {type} Progress: {currentProgress} / {targetValue}
      </p>
    </div>
  );
};

export default ChallengeProgressCard;
