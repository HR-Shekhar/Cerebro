import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Award, TrendingUp, BarChart2, Circle, Target, Clock } from 'lucide-react';

const InsightsPage = () => {
  const [tab, setTab] = useState('daily');
  const [dailySummary, setDailySummary] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState({});
  const [streak, setStreak] = useState(0);
  const [hasSessionToday, setHasSessionToday] = useState(false);
  const [completion, setCompletion] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'daily') {
      axios.get('http://localhost:8080/api/sessions/daily-summary')
        .then(res => {
          setDailySummary(res.data);
          setLoading(false);
        })
        .catch(() => {
          setDailySummary([]);
          setLoading(false);
        });
    } else if (tab === 'weekly') {
      axios.get('http://localhost:8080/api/sessions/weekly-summary')
        .then(res => {
          const data = res.data;
    
          // Normalize keys: "MONDAY" → "Monday"
          const normalized = {};
          Object.entries(data).forEach(([day, time]) => {
            const capitalized = day.charAt(0) + day.slice(1).toLowerCase();
            normalized[capitalized] = time;
          });
    
          setWeeklySummary(normalized);
          setLoading(false);
        })
        .catch(() => {
          setWeeklySummary({});
          setLoading(false);
        });
    }
    
  }, [tab]);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/sessions/streak')
        .then(res => setStreak(res.data))
        .catch(() => setStreak(0)),
        
      axios.get('http://localhost:8080/api/sessions/insights/completion')
        .then(res => setCompletion(res.data))
        .catch(() => setCompletion({})),
        
      // Check if there's a session today
      axios.get('http://localhost:8080/api/sessions/has-session-today')
        .then(res => setHasSessionToday(res.data))
        .catch(() => setHasSessionToday(false))
    ]);
  }, []);

  const nonZeroCourses = Object.entries(completion).filter(([_, percentage]) => percentage > 0);
  const weeklyTotal = Object.values(weeklySummary).reduce((sum, time) => sum + (time || 0), 0);
  const dailyTotal = dailySummary.reduce((sum, day) => sum + (day.totalStudyTime || 0), 0);
  const bestDay = Object.entries(weeklySummary).reduce(
    (best, [day, time]) => (time > best.time ? { day, time } : best),
    { day: '', time: 0 }
  );
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const recentDays = [...dailySummary].slice(0, 7);

  // Transform weekly summary data for the line chart
  const weeklyChartData = weekdays.map(day => ({
    day: day.substring(0, 3),
    minutes: weeklySummary[day] || 0
  }));

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getGradientColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-green-300';
    if (percentage >= 60) return 'from-teal-500 to-teal-300';
    if (percentage >= 40) return 'from-blue-500 to-blue-300';
    if (percentage >= 20) return 'from-indigo-500 to-indigo-300';
    return 'from-purple-500 to-purple-300';
  };

  const getDayName = (dayName) => dayName.substring(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Study Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Analyze your study habits and progress</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Streak card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-300 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm font-medium">Current Streak</p>
              <p className="text-3xl font-bold mt-2">{streak} {streak === 1 ? 'day' : 'days'}</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div className="flex space-x-1">
              {/* Current streak dots */}
              {[...Array(Math.min(streak, 7))].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full"></div>
              ))}
              
              {/* If no session today but had streak yesterday, show yesterday's streak in gray */}
              {!hasSessionToday && streak > 0 && (
                <div className="w-3 h-3 bg-white bg-opacity-40 rounded-full border border-white border-opacity-50"></div>
              )}
              
              {/* Empty dots */}
              {[...Array(Math.max(0, 7 - Math.min(streak, 7) - (!hasSessionToday && streak > 0 ? 1 : 0)))].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
              ))}
            </div>
            <p className="text-amber-100 text-sm">
              {!hasSessionToday && streak > 0 ? "Study today to keep your streak!" : "Keep it up!"}
            </p>
          </div>
        </div>

        {/* Total hours card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Study Time</p>
              <p className="text-3xl font-bold mt-2">{formatTime(tab === 'daily' ? dailyTotal : weeklyTotal)}</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-blue-100 text-sm">{tab === 'daily' ? 'Last 30 days' : 'Last 7 days'}</p>
            <div className="mt-2 h-2 bg-blue-200 bg-opacity-30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full" 
                style={{ width: `${Math.min(100, tab === 'daily' ? (dailyTotal / 900) * 100 : (weeklyTotal / 1200) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Best day card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Best Study Day</p>
              <p className="text-3xl font-bold mt-2">{bestDay.day || 'N/A'}</p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg font-semibold">
              {bestDay.time ? formatTime(bestDay.time) : '0m'}
            </p>
            <p className="text-purple-100 text-sm">Most productive day</p>
          </div>
        </div>

        {/* Course completion card */}
        <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Course Completion</p>
              <p className="text-3xl font-bold mt-2">
                {nonZeroCourses.length > 0 
                  ? Math.round(nonZeroCourses.reduce((sum, [_, pct]) => sum + pct, 0) / nonZeroCourses.length) + '%'
                  : '0%'}
              </p>
            </div>
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-green-100 text-sm">{nonZeroCourses.length} active {nonZeroCourses.length === 1 ? 'course' : 'courses'}</p>
            <div className="mt-2 h-2 bg-green-200 bg-opacity-30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full" 
                style={{ width: nonZeroCourses.length > 0 
                  ? `${Math.round(nonZeroCourses.reduce((sum, [_, pct]) => sum + pct, 0) / nonZeroCourses.length)}%`
                  : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Course completion */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Course Progress</h2>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {nonZeroCourses.length > 0 ? (
            <div className="space-y-6">
              {nonZeroCourses.map(([courseName, percentage], index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{courseName}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getGradientColor(percentage)} rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900 rounded-full mb-4">
                <Target className="h-6 w-6 text-blue-400 dark:text-blue-200" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No course progress data available yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start studying to track your progress!</p>
            </div>
          )}
        </div>

        {/* Right column: Time summaries */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Study Time Analytics</h2>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    tab === 'daily'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setTab('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    tab === 'weekly'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setTab('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : (
              <>
                {/* Daily Summary */}
                {tab === 'daily' && (
                  <div>
                    {dailySummary.length > 0 ? (
                      <>
                        {/* Daily chart */}
                        <div className="h-48 flex items-end space-x-2 mb-6">
                          {dailySummary.slice(0, 14).reverse().map((entry, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 hover:bg-blue-600 transition-all rounded-t-md"
                                style={{ 
                                  height: `${Math.max(4, (entry.totalStudyTime || 0) / 3)}px`,
                                  maxHeight: '160px'
                                }}
                              ></div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Recent daily summary list */}
                        <div className="mt-8">
                          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Recent Daily Summary</h3>
                          <div className="space-y-3">
                            {dailySummary.slice(0, 7).map((entry, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-3"></div>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {new Date(entry.date).toLocaleDateString(undefined, { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatTime(entry.totalStudyTime || 0)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900 rounded-full mb-4">
                          <BarChart2 className="h-6 w-6 text-blue-400 dark:text-blue-200" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No daily study data available yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Complete study sessions to see data here!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Weekly Summary */}
                {tab === 'weekly' && (
                  <div>
                    {Object.keys(weeklySummary).length > 0 ? (
                      <>
                        {/* Weekly Line Chart */}
                        <div className="h-64 mb-8">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="day" 
                                tick={{ fill: '#6b7280' }}
                                axisLine={{ stroke: '#cbd5e1' }}
                              />
                              <YAxis 
                                tick={{ fill: '#6b7280' }}
                                axisLine={{ stroke: '#cbd5e1' }}
                                label={{ 
                                  value: 'Minutes', 
                                  angle: -90, 
                                  position: 'insideLeft', 
                                  style: { fill: '#6b7280' } 
                                }}
                              />
                              <Tooltip 
                                formatter={(value) => [`${value} minutes`, 'Study Time']}
                                labelFormatter={(day) => `${day}`}
                                contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="minutes" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                                name="Study Minutes"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Weekly stats */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4">
                            <div className="text-sm text-blue-700 dark:text-blue-200">Weekly Average</div>
                            <div className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                              {formatTime(Math.round(weeklyTotal / 7))}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">per day</div>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900 rounded-xl p-4">
                            <div className="text-sm text-purple-700 dark:text-purple-200">Total This Week</div>
                            <div className="text-xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                              {formatTime(weeklyTotal)}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">study time</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900 rounded-full mb-4">
                          <TrendingUp className="h-6 w-6 text-blue-400 dark:text-blue-200" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No weekly study data available yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back after logging some study sessions!</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;