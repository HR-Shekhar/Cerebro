import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InsightsPage = () => {
  const [tab, setTab] = useState('daily');
  const [dailySummary, setDailySummary] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState({});
  const [streak, setStreak] = useState(0);
  const [completion, setCompletion] = useState({});

  useEffect(() => {
    if (tab === 'daily') {
      axios.get('http://localhost:8080/api/sessions/daily-summary')
        .then(res => setDailySummary(res.data))
        .catch(() => setDailySummary([]));
    } else if (tab === 'weekly') {
      axios.get('http://localhost:8080/api/sessions/weekly-summary')
        .then(res => setWeeklySummary(res.data))
        .catch(() => setWeeklySummary({}));
    }
  }, [tab]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions/streak')
      .then(res => setStreak(res.data))
      .catch(() => setStreak(0));

    axios.get('http://localhost:8080/api/sessions/insights/completion')
      .then(res => setCompletion(res.data))
      .catch(() => setCompletion({}));
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold">📊 Study Insights</h2>

      {/* Streak */}
      <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between">
        <span className="text-lg font-semibold">🔥 Current Streak</span>
        <span className="text-xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</span>
      </div>

      {/* Course Completion */}
      <div>
        <h3 className="text-lg font-semibold mb-2">📘 Course Completion</h3>
        <div className="space-y-2">
          {Object.keys(completion).length > 0 ? (
            Object.entries(completion).map(([courseName, percentage], index) => (
              <div key={index} className="flex items-center justify-between border-b pb-1">
                <span>{courseName}</span>
                <span className="font-semibold">{percentage}%</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No course completion data available.</p>
          )}
        </div>
      </div>

      {/* Summary Tabs */}
      <div>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('daily')}
          >
            Daily
          </button>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('weekly')}
          >
            Weekly
          </button>
        </div>

        {/* Daily Summary */}
        {tab === 'daily' && (
          <div className="space-y-2">
            {dailySummary.length > 0 ? (
              dailySummary.map((entry, index) => (
                <div key={index} className="flex justify-between border-b pb-1">
                  <span>{entry.date}</span>
                  <span className="font-semibold">{entry.totalStudyTime ?? 0} min</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No daily study data yet.</p>
            )}
          </div>
        )}

        {/* Weekly Summary */}
        {tab === 'weekly' && (
          <div className="space-y-2">
            {Object.keys(weeklySummary).length > 0 ? (
              Object.entries(weeklySummary).map(([day, time], index) => (
                <div key={index} className="flex justify-between border-b pb-1">
                  <span>{day}</span>
                  <span className="font-semibold">{time ?? 0} min</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No weekly study summary yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
