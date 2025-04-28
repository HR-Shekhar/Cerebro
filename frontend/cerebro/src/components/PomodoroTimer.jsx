// src/components/PomodoroTimer.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Pause, StopCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PomodoroTimer({
  courseId,
  topicId,
  sessionsBeforeLong = 4,
  onSessionRecorded = () => {}
}) {
  // 1) Presets (work min / break min)
  const presets = [
    { label: '25 / 5',  work: 25, break: 5  },
    { label: '50 / 10', work: 50, break: 10 },
    { label: '100 / 20', work:100, break: 20 }
  ];

  // 2) State
  const [presetIndex, setPresetIndex] = useState(0);
  const [mode, setMode]               = useState('work');    // 'work' or 'break'
  const [minutes, setMinutes]         = useState(presets[0].work);
  const [seconds, setSeconds]         = useState(0);
  const [isRunning, setIsRunning]     = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [startTime, setStartTime]     = useState(null);

  // 3) Whenever preset changes, reset timer
  useEffect(() => {
    const { work } = presets[presetIndex];
    setMode('work');
    setMinutes(work);
    setSeconds(0);
    setIsRunning(false);
    setSessionCount(0);
    setStartTime(null);
  }, [presetIndex]);

  // 4) Countdown ticker
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      if (seconds > 0) {
        setSeconds(s => s - 1);
      } else if (minutes > 0) {
        setMinutes(m => m - 1);
        setSeconds(59);
      } else {
        clearInterval(id);
        handleStop();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, minutes, seconds]);

  // 5) Format MM:SS
  const fmt = (m, s) => 
    `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  // 6) Start button
  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (mode === 'work' && !startTime) {
        setStartTime(new Date());
      }
    }
  };

  // 7) Pause button
  const handlePause = () => {
    setIsRunning(false);
  };

  // 8) Stop—record work sessions only
  const handleStop = async () => {
    setIsRunning(false);

    // only record if it was a work session
    if (mode === 'work' && startTime && courseId && topicId) {
      const end = new Date();
      try {
        await axios.post('http://localhost:8080/api/sessions', {
          startTime: startTime.toISOString(),
          endTime:   end.toISOString(),
          course:    { id: courseId },
          topic:     { id: topicId },
          durationInMinutes: Math.ceil(((presets[presetIndex].work * 60) - (minutes*60 + seconds)) / 60)
        });
        toast.success('✅ Session recorded');
        onSessionRecorded();
      } catch (e) {
        console.error(e);
        toast.error('❌ Recording failed');
      }
    }

    // decide next mode & duration
    let nextMode, nextMin;
    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      nextMode = 'break';
      nextMin  = presets[presetIndex].break;
    } else {
      nextMode = 'work';
      nextMin  = presets[presetIndex].work;
    }

    setMode(nextMode);
    setMinutes(nextMin);
    setSeconds(0);
    setStartTime(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
      {/* Preset Selector */}
      <div className="flex justify-center mb-4">
        {presets.map((p,i) => (
          <button
            key={p.label}
            onClick={() => setPresetIndex(i)}
            disabled={i===presetIndex}
            className={`px-3 py-1 mx-1 rounded ${
              i===presetIndex 
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Mode Title */}
      <h3 className="text-center font-semibold text-lg dark:text-gray-100 mb-2">
        {mode === 'work' ? 'Work Session' : 'Break Time'}
      </h3>

      {/* Timer Display */}
      <div className="text-center text-4xl font-mono mb-4 dark:text-gray-200">
        {fmt(minutes, seconds)}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-2">
        {isRunning
          ? <button onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              <Pause size={16} /> Pause
            </button>
          : <button onClick={handleStart}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <Play size={16} /> Start
            </button>
        }
        <button onClick={handleStop}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          <StopCircle size={16} /> Stop
        </button>
      </div>
    </div>
  );
}