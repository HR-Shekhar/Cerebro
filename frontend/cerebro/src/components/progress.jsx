// src/components/ui/progress.jsx
import React from 'react';

export function Progress({ value, className = '' }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="bg-blue-600 h-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
