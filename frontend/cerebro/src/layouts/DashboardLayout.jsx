import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBookOpen,
  FaPlusCircle,
  FaStickyNote,
  FaLayerGroup,
  FaClock,
  FaChartBar,
  FaBullseye,
  FaRobot,
  FaHistory,
  FaStar,
} from 'react-icons/fa';

const menuItems = [
  { to: 'home',          label: 'Home',           icon: <FaHome /> },
  { to: 'courses',       label: 'Courses',        icon: <FaBookOpen /> },
  { to: 'create-course', label: 'Create Course',  icon: <FaPlusCircle /> },
  { to: 'notes',         label: 'Notes',          icon: <FaStickyNote /> },
  { to: 'flashcards',    label: 'Flashcards',     icon: <FaLayerGroup /> },
  { to: 'study-sessions',label: 'Study Sessions', icon: <FaClock /> },
  { to: 'insights',      label: 'Insights',       icon: <FaChartBar /> },
  { to: 'challenges',    label: 'Challenges',     icon: <FaBullseye /> },
  { to: 'ai-solver',     label: 'AI Solver',      icon: <FaRobot /> },
  { to: 'popularCourses',     label: 'Popular Courses',      icon: <FaStar /> },
  // { to: 'ai-history',    label: 'AI History',     icon: <FaHistory /> },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigate logic: special-case "courses" to deep-link last selected course
  const handleMenuClick = (to) => {
    if (to === 'home') {
      navigate('/home');
    } else if (to === 'courses') {
      const lastCourse = localStorage.getItem('selectedCourseId');
      if (lastCourse) {
        navigate(`/dashboard/courses/${lastCourse}`);
      } else {
        navigate('/dashboard/courses');
      }
    } else {
      navigate(`/dashboard/${to}`);
    }
    setOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 font-sans">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 shadow-lg text-blue-400 rounded-full hover:bg-gray-700 transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-850 border-r border-gray-700 w-72 py-8 px-6
          fixed inset-y-0 left-0 transform shadow-2xl
          ${open ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex flex-col z-40
          font-inter
        `}
        style={{ backgroundColor: 'rgb(23, 25, 35)' }}
      >
        <div className="flex items-center mb-12 px-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-poppins">CEREBRO</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map(({ to, label, icon }) => {
            // Determine active state
            let isActive = false;
            if (to === 'home' && location.pathname === '/home') {
              isActive = true;
            } else if (to === 'courses' && location.pathname.startsWith('/dashboard/courses')) {
              isActive = true;
            } else if (to !== 'courses' && to !== 'home') {
              isActive = location.pathname.includes(`/dashboard/${to}`);
            }

            return (
              <button
                key={to}
                onClick={() => handleMenuClick(to)}
                className={`
                  flex items-center w-full text-left gap-4 px-5 py-4 rounded-xl text-gray-300
                  hover:bg-gray-800 hover:text-blue-400 transition-all duration-200
                  ${isActive ? 'bg-gray-800/70 text-blue-400 shadow-md border-l-4 border-blue-500' : ''}
                  font-inter
                `}
              >
                <span className={`text-xl ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>{icon}</span>
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
              </button>
            );
          })}
        </nav>
        
        
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto font-inter text-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-3 font-poppins">
              {location.pathname.includes('/home') ? 'Dashboard' : 
               location.pathname.includes('/courses') ? 'Courses' :
               location.pathname.includes('/notes') ? 'Notes' :
               location.pathname.includes('/flashcards') ? 'Flashcards' :
               location.pathname.includes('/study-sessions') ? 'Study Sessions' :
               location.pathname.includes('/insights') ? 'Insights' :
               location.pathname.includes('/challenges') ? 'Challenges' :
               location.pathname.includes('/ai-solver') ? 'AI Solver' :
               location.pathname.includes('/create-course') ? 'Create Course' : 'Dashboard'}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700/50 p-6 md:p-8 backdrop-blur-sm" 
               style={{ backgroundColor: 'rgba(30, 32, 45, 0.95)' }}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}