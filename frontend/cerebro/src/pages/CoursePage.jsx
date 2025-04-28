import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Progress } from '../components/progress';
import PomodoroTimer from '../components/PomodoroTimer';
import { Check, Clock, Trophy, BookOpen, Bookmark, BarChart2, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function formatLocal(date) {
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}`;
}

export default function CoursePage() {
  const { courseId: paramCourseId } = useParams();

  const [course, setCourse] = useState({ name: 'Loading...' });
  const [topics, setTopics] = useState([]);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [completion, setCompletion] = useState({});
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [completionRes, topicsRes, courseRes, sessionsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/sessions/insights/completion'),
          axios.get(`http://localhost:8080/api/courses/${paramCourseId}/topics`),
          axios.get(`http://localhost:8080/api/courses/${paramCourseId}`),
          axios.get(`http://localhost:8080/api/sessions?courseId=${paramCourseId}&limit=5`)
        ]);

        setCompletion(completionRes.data);
        setCourse(courseRes.data);
        setRecentSessions(sessionsRes.data || []);

        const list = topicsRes.data;
        setTopics(list);

        const doneIds = list.filter(t => t.completed).map(t => t.id);
        setCompletedTopics(new Set(doneIds));

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    }

    if (paramCourseId) fetchData();
  }, [paramCourseId]);

  const formatSessionTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleTopicComplete = async (topicId) => {
    const next = new Set(completedTopics);
    next.has(topicId) ? next.delete(topicId) : next.add(topicId);
    setCompletedTopics(next);
  
    try {
      await axios.patch(`http://localhost:8080/api/topics/${topicId}/toggle-complete`, {
        completed: next.has(topicId),
      });
      toast.success(next.has(topicId) ? '✅ Topic marked complete!' : '↩ Topic marked incomplete!');
      
      // Recalculate completion percentage after toggling
      const updatedTopics = [...topics];
      const topicIndex = updatedTopics.findIndex(t => t.id === topicId);
      if (topicIndex !== -1) {
        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          completed: next.has(topicId)
        };
        setTopics(updatedTopics);
      }
      updateCourseCompletion();
    } catch (error) {
      console.error('Failed to toggle topic complete', error);
      toast.error('Failed to update topic status.');
    }
  };

  const updateCourseCompletion = () => {
    const totalTopics = topics.length;
    const completed = completedTopics.size;
    const completionPercentage = totalTopics > 0 ? (completed / totalTopics) * 100 : 0;
    setCompletion((prevCompletion) => ({
      ...prevCompletion,
      [paramCourseId]: completionPercentage
    }));
  };

  const getCourseCompletion = () => {
    if (!paramCourseId || !completion[paramCourseId]) return 0;
    return Math.round(completion[paramCourseId]);
  };

  const refreshSessions = async () => {
    try {
      const sessionsRes = await axios.get(`http://localhost:8080/api/sessions?courseId=${paramCourseId}&limit=5`);
      setRecentSessions(sessionsRes.data || []);
    } catch (error) {
      console.error('Failed to refresh sessions', error);
    }
  };

  const selectTopicForTimer = (topicId) => {
    setSelectedTopic(topicId);
    setActiveSession(topicId);
  };

  const handleSessionRecorded = () => {
    refreshSessions();
    setActiveSession(null);
  };

  const filteredTopics = topics.filter(topic => {
    if (filter === 'all') return true;
    if (filter === 'completed') return completedTopics.has(topic.id);
    if (filter === 'incomplete') return !completedTopics.has(topic.id);
    return true;
  });

  // Calculate overall progress metrics
  const totalTopics = topics.length;
  const completedCount = completedTopics.size;
  const remainingCount = totalTopics - completedCount;
  
  const progressColor = () => {
    const completion = getCourseCompletion();
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 text-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Course Header */}
          <div className="mb-8 relative">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-white mb-2">{course.name}</h1>
                  <p className="text-indigo-200">Track your progress and master new concepts</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-black bg-opacity-20 rounded-lg p-3">
                  <Trophy className="text-yellow-300 h-6 w-6" />
                  <div>
                    <p className="text-sm text-indigo-200">Progress</p>
                    <p className="text-xl font-bold text-white">{getCourseCompletion()}%</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <Progress value={getCourseCompletion()} className={`w-full h-3 rounded-full ${progressColor()}`} />
                  <div className="absolute -top-6 left-0 text-xs font-medium text-indigo-200">0%</div>
                  <div className="absolute -top-6 right-0 text-xs font-medium text-indigo-200">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="p-3 bg-indigo-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-300" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Topics</p>
                <p className="text-2xl font-bold text-white">{totalTopics}</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-900 rounded-lg">
                <Check className="h-6 w-6 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{completedCount} <span className="text-sm text-gray-400 font-normal">topics</span></p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="p-3 bg-amber-900 rounded-lg">
                <Bookmark className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Remaining</p>
                <p className="text-2xl font-bold text-white">{remainingCount} <span className="text-sm text-gray-400 font-normal">topics</span></p>
              </div>
            </div>
          </div>

          {/* Active Timer Section - Only shown when a topic is selected */}
          {selectedTopic && (
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {topics.find(t => t.id === selectedTopic)?.name}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Focus on this topic using the Pomodoro technique
                  </p>
                  <button 
                    onClick={() => setSelectedTopic(null)} 
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
                  >
                    Change Topic
                  </button>
                </div>
                <div className="w-full md:w-auto">
                  <PomodoroTimer 
                    courseId={paramCourseId} 
                    topicId={selectedTopic}
                    onSessionRecorded={handleSessionRecorded}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setFilter('all')}
              >
                All Topics
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'completed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'incomplete' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setFilter('incomplete')}
              >
                Incomplete
              </button>
            </div>
            
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
          </div>

          {/* Active Session Alert */}
          {activeSession && !selectedTopic && (
            <div className="mb-6 bg-indigo-900 border-l-4 border-indigo-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-indigo-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-indigo-200">
                    <span className="font-medium">Active session: </span>
                    {topics.find(t => t.id === activeSession)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Topics Section */}
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl shadow-md">
              <div className="inline-flex items-center justify-center p-4 bg-gray-700 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No topics found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {filter !== 'all' 
                  ? `There are no ${filter} topics to display. Try changing your filter.` 
                  : "This course doesn't have any topics yet."}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map(topic => (
                <div 
                  key={topic.id} 
                  className={`p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col ${
                    activeSession === topic.id ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={completedTopics.has(topic.id)}
                          onChange={() => toggleTopicComplete(topic.id)}
                          className="h-5 w-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                        />
                      </div>
                      <span className={`text-lg font-semibold ${completedTopics.has(topic.id) ? 'line-through text-gray-500' : 'text-white'}`}>
                        {topic.name}
                      </span>
                    </div>
                    
                    {completedTopics.has(topic.id) && (
                      <span className="bg-green-900 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="text-center my-6">
                    {activeSession === topic.id && selectedTopic !== topic.id ? (
                      <p className="text-sm text-indigo-400 mb-3">
                        Session in progress
                      </p>
                    ) : null}
                  </div>

                  <div className="flex justify-center gap-4 mt-auto">
                    <button
                      onClick={() => selectTopicForTimer(topic.id)}
                      disabled={completedTopics.has(topic.id)}
                      className={`flex-1 py-2 px-4 rounded-lg text-white font-medium transition flex items-center justify-center ${
                        completedTopics.has(topic.id)
                          ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <Clock size={18} className="mr-2" /> 
                      Start Timer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Topic</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id} className={activeSession === topic.id ? 'bg-indigo-900 bg-opacity-20' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={completedTopics.has(topic.id)}
                            onChange={() => toggleTopicComplete(topic.id)}
                            className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700 mr-3"
                          />
                          <span className={completedTopics.has(topic.id) ? 'line-through text-gray-500' : 'text-white'}>
                            {topic.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {completedTopics.has(topic.id) ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                            Completed
                          </span>
                        ) : activeSession === topic.id ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-900 text-indigo-300">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => selectTopicForTimer(topic.id)}
                            disabled={completedTopics.has(topic.id)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm ${
                              completedTopics.has(topic.id)
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : activeSession === topic.id
                                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            <Clock size={12} className="mr-1" />
                            {activeSession === topic.id ? 'In Progress' : 'Start Timer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Sessions Section */}
          {recentSessions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-white mb-4">Recent Study Sessions</h2>
              <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Topic</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {recentSessions.map((session, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {session.topic?.name || 'Unnamed Topic'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatSessionTime(session.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {session.durationInMinutes} minutes
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}