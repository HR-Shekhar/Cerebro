// src/pages/AiHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function AiHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/ai/conversations")  // we’ll add this endpoint
      .then(res => setHistory(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💾 AI Conversation History</h2>

      {history.length === 0 && <p>No conversations saved yet.</p>}

      {history.map(c => (
        <div key={c.id} className="mb-8 border p-4 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            #{c.id} • {new Date(c.createdAt).toLocaleString()}
          </p>
          <h3 className="font-semibold mt-2">Q: {c.prompt}</h3>
          <div className="prose mt-2">
            <ReactMarkdown>{c.answer}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}