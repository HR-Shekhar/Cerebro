// src/pages/StudySessionsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudySessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setSessions(data);
        } else if (Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else {
          console.error('Unexpected /api/sessions response format:', data);
          setSessions([]);
        }
      })
      .catch(err => {
        console.error('Error fetching sessions:', err);
        setError('Failed to load study sessions.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDateTime = isoString => {
    try {
      const dt = new Date(isoString);
      return dt.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">📝 Past Study Sessions</h2>

      {loading ? (
        <p className="text-gray-500">Loading sessions…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No study sessions recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date &amp; Time</th>
                <th className="px-4 py-2 text-left">Duration (min)</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Topic</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} className="border-t">
                  <td className="px-4 py-2">
                    {session.startTime
                      ? formatDateTime(session.startTime)
                      : '—'}
                  </td>
                  <td className="px-4 py-2">
                    {session.durationInMinutes ?? '—'}
                  </td>
                  <td className="px-4 py-2">
                    {session.course?.name ?? '—'}
                  </td>
                  <td className="px-4 py-2">
                    {session.topic?.name ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudySessionsPage;