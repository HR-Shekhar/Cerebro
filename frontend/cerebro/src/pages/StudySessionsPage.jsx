import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, BookOpen, FileText, Filter, Search, ChevronDown } from 'lucide-react';

const StudySessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('startTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ totalSessions: 0, totalMinutes: 0 });

  // Fetch sessions data
  useEffect(() => {
    axios.get('http://localhost:8080/api/sessions')
      .then(res => {
        const data = res.data;
        let sessionsData = [];
        
        if (Array.isArray(data)) {
          sessionsData = data;
        } else if (Array.isArray(data.sessions)) {
          sessionsData = data.sessions;
        } else {
          console.error('Unexpected /api/sessions response format:', data);
        }
        
        setSessions(sessionsData);
        
        // Calculate stats
        const totalSessions = sessionsData.length;
        const totalMinutes = sessionsData.reduce((sum, session) => 
          sum + (session.durationInMinutes || 0), 0);
        setStats({ totalSessions, totalMinutes });
      })
      .catch(err => {
        console.error('Error fetching sessions:', err);
        setError('Failed to load study sessions.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format date and time
  // Removed unused function 'formatDateTime'

  // Format duration as hours and minutes
  const formatDuration = minutes => {
    if (!minutes) return '—';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };

  // Get unique courses for filter
  const courses = [...new Set(sessions.map(session => session.course?.name).filter(Boolean))];

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = searchTerm === '' || 
        (session.topic?.name && session.topic.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.course?.name && session.course.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCourse = selectedCourse === '' || 
        session.course?.name === selectedCourse;
      
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'startTime') {
        valueA = a.startTime ? new Date(a.startTime).getTime() : 0;
        valueB = b.startTime ? new Date(b.startTime).getTime() : 0;
      } else if (sortField === 'durationInMinutes') {
        valueA = a.durationInMinutes || 0;
        valueB = b.durationInMinutes || 0;
      } else if (sortField === 'course') {
        valueA = a.course?.name || '';
        valueB = b.course?.name || '';
      } else if (sortField === 'topic') {
        valueA = a.topic?.name || '';
        valueB = b.topic?.name || '';
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Get today's date for comparison
  const today = new Date().setHours(0, 0, 0, 0);
  
  // Group sessions by date
  const sessionsByDate = filteredSessions.reduce((groups, session) => {
    if (!session.startTime) return groups;
    
    const date = new Date(session.startTime);
    const dateStr = date.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const sessionDate = new Date(date).setHours(0, 0, 0, 0);
    let dateLabel = dateStr;

    if (sessionDate === today) {
      dateLabel = 'Today';
    } else if (sessionDate === today - 86400000) {
      dateLabel = 'Yesterday';
    }
    
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(session);
    return groups;
  }, {});

  // Sort function for table headers
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Study Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and analyze your learning progress</p>
        </div>
        
        <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-sm transition-colors">
            <div className="flex items-center text-blue-800 dark:text-blue-200">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">Total Sessions</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">{stats.totalSessions}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow-sm transition-colors">
            <div className="flex items-center text-green-800 dark:text-green-200">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Total Study Time</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">{formatDuration(stats.totalMinutes)}</p>
          </div>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="relative mb-4 md:mb-0 w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search topics or courses..."
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full pl-10 p-2.5 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-4 py-2 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform text-gray-700 dark:text-gray-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 transition-colors">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <label htmlFor="courseFilter" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Course
                </label>
                  Filter by Course
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform text-gray-700 dark:text-gray-300 ${showFilters ? 'rotate-180' : ''}`} />
                <select
                  id="courseFilter"
                  className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-colors"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="sortField" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by
                </label>
                <div className="flex space-x-2">
                  <select
                    id="sortField"
                    className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-colors"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  >
                    <option value="startTime">Date & Time</option>
                    <option value="durationInMinutes">Duration</option>
                    <option value="course">Course</option>
                    <option value="topic">Topic</option>
                  </select>
                  
                  <button
                    className="p-2.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sessions content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 dark:border-blue-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-700 border-l-4 border-red-500 p-4 rounded transition-colors">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-8 text-center transition-colors">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-500 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No study sessions found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedCourse 
              ? "Try adjusting your filters to see more results."
              : "Start logging your study sessions to track your progress."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
            <div key={date} className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-colors">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{date}</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-600 text-sm text-gray-500 dark:text-gray-300 uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => handleSort('startTime')}>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Time {renderSortIcon('startTime')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => handleSort('durationInMinutes')}>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Duration {renderSortIcon('durationInMinutes')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => handleSort('course')}>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Course {renderSortIcon('course')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left whitespace-nowrap cursor-pointer" onClick={() => handleSort('topic')}>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Topic {renderSortIcon('topic')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {dateSessions.map(session => (
                      <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                          {session.startTime
                            ? new Date(session.startTime).toLocaleTimeString(undefined, {
                                hour: '2-digit', minute: '2-digit'
                              })
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                          {formatDuration(session.durationInMinutes)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {session.course?.name 
                              ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                  {session.course.name}
                                </span>
                              : '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                          {session.topic?.name ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessionsPage;