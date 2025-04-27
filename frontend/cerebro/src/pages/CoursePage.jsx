// src/pages/CoursePage.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'

/**
 * Format a Date into "YYYY-MM-DDTHH:mm:ss" based on the browser’s local clock.
 */
function formatLocal(date) {
  const YYYY = date.getFullYear()
  const MM   = String(date.getMonth() + 1).padStart(2, '0')
  const DD   = String(date.getDate()).padStart(2, '0')
  const hh   = String(date.getHours()).padStart(2, '0')
  const mm   = String(date.getMinutes()).padStart(2, '0')
  const ss   = String(date.getSeconds()).padStart(2, '0')
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}`
}

export default function CoursePage() {
  const [courses, setCourses]                   = useState([])
  const [topics, setTopics]                     = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedTopicId, setSelectedTopicId]   = useState('')
  const [timer, setTimer]                       = useState(25 * 60)  // seconds
  const [isRunning, setIsRunning]               = useState(false)
  const [startTimestamp, setStartTimestamp]     = useState(null)    // "YYYY-MM-DDTHH:mm:ss"
  const [completedTopics, setCompletedTopics]   = useState(new Set())

  // 1) Load courses on mount
  useEffect(() => {
    axios.get('http://localhost:8080/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err))
  }, [])

  // 2) Load topics + completed flags when course changes
  useEffect(() => {
    if (!selectedCourseId) {
      setTopics([])
      setCompletedTopics(new Set())
      return
    }

    axios
      .get(`http://localhost:8080/api/courses/${selectedCourseId}/topics`)
      .then(res => {
        const list = res.data
        setTopics(list)
        const doneIds = list.filter(t => t.completed).map(t => t.id)
        setCompletedTopics(new Set(doneIds))
      })
      .catch(err => {
        console.error('Error fetching topics:', err)
        setTopics([])
        setCompletedTopics(new Set())
      })
  }, [selectedCourseId])

  // 3) Pomodoro countdown effect
  useEffect(() => {
    let interval = null
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            recordSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timer])

  // Format seconds → "MM:SS"
  const formatTime = () => {
    const mm = String(Math.floor(timer / 60)).padStart(2, '0')
    const ss = String(timer % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  // 4) Start/Pause button handler
  const handleStartPause = () => {
    if (!isRunning) {
      const localIso = formatLocal(new Date())
      setStartTimestamp(localIso)
      setIsRunning(true)
    } else {
      setIsRunning(false)
    }
  }

  // 5) Record study session (Stop or timer zero)
  const recordSession = () => {
    setIsRunning(false)
    if (!selectedCourseId || !selectedTopicId || !startTimestamp) return

    const elapsedMs = (25 * 60 - timer) * 1000
    const now       = new Date()
    const end       = formatLocal(now)
    const start     = formatLocal(new Date(now.getTime() - elapsedMs))

    axios.post('http://localhost:8080/api/sessions', {
      startTime: start,
      endTime:   end,
      course:    { id: selectedCourseId },
      topic:     { id: selectedTopicId }
    })
    .then(() => alert('✅ Study session recorded'))
    .catch(err => {
      console.error('❌ Could not record session', err)
      alert('❌ Failed to record session')
    })
    .finally(() => {
      setTimer(25 * 60)
      setStartTimestamp(null)
    })
  }

  // 6) Toggle a topic’s manual-complete flag
  const toggleTopicComplete = (topicId) => {
    const next = new Set(completedTopics)
    if (next.has(topicId)) next.delete(topicId)
    else next.add(topicId)
    setCompletedTopics(next)

    axios.patch(
      `http://localhost:8080/api/topics/${topicId}/toggle-complete`,
      { completed: next.has(topicId) }
    ).catch(err => console.error('Failed to toggle topic complete', err))
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6">📚 Course Tracker</h2>

      {/* Course Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Course</label>
        <select
          className="w-full px-4 py-2 border rounded-lg"
          value={selectedCourseId}
          onChange={e => {
            setSelectedCourseId(e.target.value)
            setSelectedTopicId('')
            setTimer(25 * 60)
            setIsRunning(false)
            setStartTimestamp(null)
          }}
        >
          <option value="">-- Choose a course --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Topic Selector & Manual Complete */}
      {topics.length > 0 && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Topic</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={selectedTopicId}
              onChange={e => {
                setSelectedTopicId(e.target.value)
                setTimer(25 * 60)
                setIsRunning(false)
                setStartTimestamp(null)
              }}
            >
              <option value="">-- Choose a topic --</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Mark Topics Complete</h3>
            <ul className="space-y-2">
              {topics.map(t => (
                <li key={t.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={completedTopics.has(t.id)}
                    onChange={() => toggleTopicComplete(t.id)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className={completedTopics.has(t.id) ? 'line-through text-gray-400' : ''}>
                    {t.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Pomodoro Timer UI */}
      {selectedTopicId && (
        <div className="mt-8 text-center">
          <div className="text-5xl font-mono mb-4">{formatTime()}</div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartPause}
              className={`px-6 py-2 rounded-full text-white font-semibold ${
                isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={recordSession}
              className="px-6 py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  )
}