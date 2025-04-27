import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailySummaryPage = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/daily-summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daily Study Summary</h1>
      <ul className="space-y-2">
        {summary.map((item, index) => (
          <li key={index} className="p-4 bg-white rounded shadow">
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Total Minutes:</strong> {item.totalStudyTime}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailySummaryPage;