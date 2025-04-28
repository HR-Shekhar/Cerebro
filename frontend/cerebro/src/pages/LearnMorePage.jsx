// src/pages/LearnMorePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearnMorePage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white p-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Welcome to Cerebro
        </h1>

        <p className="text-gray-700 text-lg mb-8 text-center">
          Your Ultimate Study Companion to achieve your dreams.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">🚀 What is Cerebro?</h2>
            <p className="text-gray-600 leading-relaxed">
              Cerebro is your personal learning partner — helping you organize courses,
              track your study time with Pomodoro sessions, mark your progress,
              revise with flashcards, and analyze your study habits with insights and analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">🎯 Features</h2>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
              <li>Select and manage multiple courses.</li>
              <li>Track chapter, topic, and subtopic completion easily.</li>
              <li>Integrated Pomodoro timers for productive sessions.</li>
              <li>Flashcards to boost memory retention.</li>
              <li>Take notes and organize important information.</li>
              <li>View detailed insights of your study patterns.</li>
              <li>Enjoy beautiful Dark Mode UI support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">🧠 Why Cerebro?</h2>
            <p className="text-gray-600 leading-relaxed">
              Whether you're preparing for GRE, CAT, GATE, or learning skills like Machine Learning or Web Development, Cerebro adapts to your study style. It helps you stay focused, track your growth, and optimize your learning journey.
            </p>
          </section>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
