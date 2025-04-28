// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // already imported ✅

import LandingPage       from './pages/LandingPage';
import HomePage          from './pages/HomePage';
import DashboardLayout   from './layouts/DashboardLayout';

import CoursePage        from './pages/CoursePage';
import CourseCreatePage  from './pages/CourseCreatePage';
import NotesPage         from './pages/NotesPage';
import FlashcardsPage    from './pages/FlashcardsPage';
import StudySessionsPage from './pages/StudySessionsPage';
import InsightsPage      from './pages/InsightsPage';
import ChallengesPage    from './pages/ChallengesPage';
import AIDoubtSolverPage from './pages/AIDoubtSolverPage';
import AiHistory         from './pages/AiHistory';
import NotFound          from './pages/NotFound';
import LearnMorePage     from './pages/LearnMorePage';

export default function App() {
  return (
    <Router>
      {/* Global Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* 1) Public Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />

        {/* 2) Home (minimal UI) */}
        <Route path="/home" element={<HomePage />} />

        {/* 3) Dashboard + sub-routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Redirect "/dashboard" → "/dashboard/courses" */}
          <Route index element={<Navigate to="courses" replace />} />
          
          <Route path="courses/:courseId" element={<CoursePage />} />
          <Route path="courses"           element={<CoursePage />} />
          <Route path="create-course"     element={<CourseCreatePage />} />
          <Route path="notes"             element={<NotesPage />} />
          <Route path="flashcards"        element={<FlashcardsPage />} />
          <Route path="study-sessions"    element={<StudySessionsPage />} />
          <Route path="insights"          element={<InsightsPage />} />
          <Route path="challenges"        element={<ChallengesPage />} />
          <Route path="ai-solver"         element={<AIDoubtSolverPage />} />
          <Route path="ai-history"        element={<AiHistory />} />
        </Route>

        {/* 4) Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
