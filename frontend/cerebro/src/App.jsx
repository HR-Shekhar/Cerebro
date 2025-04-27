import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import CoursePage from './pages/CoursePage';

import NotesPage from './pages/NotesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudySessionsPage from './pages/StudySessionsPage';
import InsightsPage from './pages/InsightsPage'; // make sure this file exists
import ChallengesPage from "./pages/ChallengesPage";
import CourseCreatePage from './pages/CourseCreatePage';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Navigation */}
        <nav className="mb-6 flex gap-4">
        
          <Link to="/notes" className="text-blue-600 hover:underline">NOTES</Link>
          <Link to="/flashcards" className="text-blue-600 hover:underline">FLASHCARD</Link>
          <Link to="/study-sessions" className="text-blue-600 hover:underline">STUDY SESSION</Link>
          <Link to="/courses" className="text-blue-600 hover:underline">COURSES</Link>
          <Link to="/create-course" className="text-blue-600 hover:underline">CREATE COURSE</Link>
          <Link to="/insights" className="text-blue-600 hover:underline">INSIGHTS</Link>
          <Link to="/challenges" className="text-blue-600 hover:underline">CHALLENGES</Link>
         
        </nav>

        {/* Routes */}
        <Routes>
       
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/study-sessions" element={<StudySessionsPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/create-course" element={<CourseCreatePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
