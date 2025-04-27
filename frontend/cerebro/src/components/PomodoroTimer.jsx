import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PomodoroTimer({
  courseId,
  topicId,
  workMinutes = 25,
  shortBreak = 5,
  longBreak = 15,
  sessionsBeforeLong = 4
}) {
  const [mode, setMode] = useState('work');      // 'work' | 'short' | 'long'
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // Countdown logic
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, mode]);

  // Format MM:SS
  const format = secs => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Called whenever a period finishes
  const handleComplete = () => {
    setIsRunning(false);

    // Only record real study sessions (work mode)
    if (mode === 'work' && courseId && topicId) {
      const end = new Date();
      const start = new Date(end.getTime() - workMinutes * 60 * 1000);

      axios.post('http://localhost:8080/api/sessions', {
        startTime: start.toISOString(),
        endTime:   end.toISOString(),
        course:    { id: courseId },
        topic:     { id: topicId }
      }).catch(console.error);
      
      setSessionCount(prev => prev + 1);
    }

    // Cycle modes
    if (mode === 'work') {
      const nextMode = (sessionCount + 1) % sessionsBeforeLong === 0
        ? 'long'
        : 'short';
      setMode(nextMode);
      setTimeLeft(
        nextMode === 'short' 
          ? shortBreak * 60 
          : longBreak * 60
      );
    } else {
      // After any break, go back to work
      setMode('work');
      setTimeLeft(workMinutes * 60);
    }
  };

  // Stop manually (record work if mid-session)
  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
      if (mode === 'work' && courseId && topicId) {
        const now = new Date();
        const elapsed = workMinutes * 60 - timeLeft;
        const start = new Date(now.getTime() - elapsed * 1000);

        axios.post('http://localhost:8080/api/sessions', {
          startTime: start.toISOString(),
          endTime:   now.toISOString(),
          course:    { id: courseId },
          topic:     { id: topicId }
        }).catch(console.error);
      }
    }
    // Reset to fresh work period
    setMode('work');
    setTimeLeft(workMinutes * 60);
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">
        {mode === 'work' 
          ? 'Work Session' 
          : mode === 'short' 
            ? 'Short Break' 
            : 'Long Break'}
      </h3>
      <div className="text-5xl font-mono text-center mb-4">
        {format(timeLeft)}
      </div>
      <div className="flex justify-center gap-2">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleStop}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );
}