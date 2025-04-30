import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { FiSend, FiSearch, FiClock, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function AiDoubtSolver() {
  const [prompt, setPrompt] = useState("");
  const [answerMd, setAnswerMd] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [charCount, setCharCount] = useState(0);
  const answerRef = useRef(null);
  const textareaRef = useRef(null);
  const GEMINI_KEY = "AIzaSyAxTyBL6ZN1DT6LoxfUi9iW9jw39WS9724";

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  useEffect(() => {
    if (answerMd && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [answerMd]);

  // Apply dark mode by default to document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSolve = async () => {
    if (!prompt.trim()) {
      showNotification("Please enter a question first", "error");
      textareaRef.current.focus();
      return;
    }

    setLoading(true);
    setAnswerMd("");

    try {
      // 1) Call Gemini
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
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
      
      // Simulate a slightly delayed response for better UX
      setTimeout(() => {
        setAnswerMd(md);
      }, 300);

      // 3) Persist to backend
      await axios.post("http://localhost:8080/api/ai/conversations", {
        prompt: prompt,
        answer: md
      });

      showNotification("Answer generated successfully!");
    } catch (err) {
      console.error("AI error:", err);
      setAnswerMd("❌ Failed to get answer from AI. Please try again later.");
      showNotification("Failed to get answer from AI", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSolve();
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-gradient-to-br from-gray-950 to-indigo-950">
      <div className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden bg-gray-900">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center ${
            notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}>
            {notification.type === "error" ? <FiAlertCircle className="mr-2" /> : <FiCheck className="mr-2" />}
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <span className="text-4xl mr-2">🤖</span> 
                AI Doubt Solver
              </h1>
              <p className="mt-2 text-blue-300">Ask any question and get instant answers</p>
            </div>
            <Link
              to="/dashboard/ai-history"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              <FiClock /> View History
            </Link>
          </div>
        </div>

        <div className="p-6 text-gray-200">
          {/* Prompt Textarea */}
          <div className="relative mb-6">
            <textarea
              ref={textareaRef}
              rows={5}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to ask? (Ctrl+Enter to submit)"
              className="w-full p-4 rounded-lg transition-all resize-none focus:ring-2 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{charCount} characters</span>
              <span>Ctrl+Enter to submit</span>
            </div>
          </div>

          {/* Solve Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSolve}
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-medium flex items-center gap-2 transform transition-all duration-300 ${
                loading 
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Thinking...
                </>
              ) : (
                <>
                  <FiSend /> Solve my doubt
                </>
              )}
            </button>
          </div>

          {/* Answer Section */}
          {answerMd && (
            <div 
              ref={answerRef}
              className="animate-fadeIn rounded-xl overflow-hidden shadow-md border border-gray-800"
            >
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 border-b border-gray-800">
                <h3 className="font-semibold text-blue-300">AI Response</h3>
              </div>
              <div className="prose max-w-none p-6 bg-gray-950 prose-invert prose-headings:text-blue-300 prose-a:text-blue-400">
                <ReactMarkdown>
                  {answerMd}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-950 px-6 py-4 border-t border-gray-800 text-gray-400">
          <p className="text-center text-sm">
            Powered by Gemini AI • Ask anything you're curious about
          </p>
        </div>
      </div>
    </div>
  );
}