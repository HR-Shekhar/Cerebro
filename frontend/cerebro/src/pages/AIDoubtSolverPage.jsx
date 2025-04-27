// src/pages/AiDoubtSolver.jsx
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

export default function AiDoubtSolver() {
  const [prompt, setPrompt]     = useState("");
  const [answerMd, setAnswerMd] = useState("");
  const [loading, setLoading]   = useState(false);
  const GEMINI_KEY = "Your_API_key";

  const handleSolve = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAnswerMd("");

    try {
      // 1) Call Gemini
      const geminiUrl =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      const { data } = await axios.post(geminiUrl, payload, {
        headers: { "Content-Type": "application/json" }
      });

      // 2) Extract Markdown text
      const md =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.candidates?.[0]?.output ||
        "❌ No answer from AI.";
      setAnswerMd(md);

      // 3) Persist to backend
      await axios.post("http://localhost:8080/api/ai/conversations", {
        prompt: prompt,
        answer: md
      });
    } catch (err) {
      console.error("AI error:", err);
      setAnswerMd("❌ Failed to get answer from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header with link to history */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🤖 AI Doubt Solver</h2>
        <Link
          to="/ai-history"
          className="text-blue-600 hover:underline"
        >
          View History
        </Link>
      </div>

      {/* Prompt Textarea */}
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Type your question here…"
        className="w-full p-3 border rounded-lg mb-4"
      />

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        disabled={loading}
        className={`px-6 py-2 rounded-lg text-white font-semibold mb-6 ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Solving…" : "Solve my doubt"}
      </button>

      {/* Render Markdown Answer */}
      {answerMd && (
        <div className="prose max-w-none border p-4 rounded-lg bg-gray-50">
          <ReactMarkdown>
            {answerMd}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}