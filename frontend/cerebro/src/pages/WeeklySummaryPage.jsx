import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklySummaryPage = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/weekly-summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Weekly Study Summary</h1>
      <ul className="space-y-2">
        {Object.entries(summary).map(([day, minutes], idx) => (
          <li key={idx} className="p-4 bg-white rounded shadow">
            <p><strong>{day}:</strong> {minutes} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklySummaryPage;
