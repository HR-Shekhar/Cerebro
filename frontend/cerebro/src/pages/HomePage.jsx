// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
  const [courses, setCourses]     = useState([]);
  const [search, setSearch]       = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1) Load all courses once
  useEffect(() => {
    setIsLoading(true);
    axios
      .get('http://localhost:8080/api/courses')
      .then(res => {
        setCourses(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setIsLoading(false);
      });
  }, []);

  // Filter by search term
  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Handle clicking a course card
  const handleCourseClick = courseId => {
    localStorage.setItem('selectedCourseId', courseId);
    navigate(`/dashboard/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl font-bold text-white">
            Learning Portal
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Discover or create courses to expand your knowledge
          </p>
        </div>

        {/* Search + Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-md
                         bg-gray-900 border-none
                         focus:ring-2 focus:ring-emerald-500
                         transition-all duration-300 text-white"
            />
          </div>
          <Link
            to="/dashboard/create-course"
            className="whitespace-nowrap px-6 py-3 bg-emerald-600
                       text-white font-medium rounded-md
                       hover:bg-emerald-500 transition-colors duration-300"
          >
            + Create Course
          </Link>
        </div>

        {/* Course Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {filtered.map(course => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="bg-gray-900 rounded-lg overflow-hidden
                               transition-all duration-300 cursor-pointer
                               hover:translate-y-px hover:shadow-lg"
                  >
                    <div className="h-1 bg-emerald-500"></div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-white">
                        {course.name}
                      </h2>
                      <p className="mt-2 text-gray-400 text-sm">{course.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-400">
                          Course
                        </div>
                        <span className="inline-flex items-center text-emerald-500 text-sm font-medium">
                          View details
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-900 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M5.586 15H4a1 1 
                       0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 
                       12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-white">No courses found</h3>
                <p className="mt-2 text-gray-500 text-sm">
                  Try adjusting your search or create a new course
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 mt-8 mb-4 text-sm">
          © {new Date().getFullYear()} Learning Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
}