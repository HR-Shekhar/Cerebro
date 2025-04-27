import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pomodoro = ({ courseId, topicId }) => {
  // customizable intervals
  const presets = [
    { work: 25, break: 5 },
    { work: 50, break: 10 },
    { work: 90, break: 20 }
  ];
  const longBreak = 15; // long break in minutes (used in handleStop)
  
  const [mode, setMode] = useState('work'); // 'work' | 'break' (used in UI and logic)
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0); // used in handleStop
  const [startTime, setStartTime] = useState(null); // used in handleStop
  const [presetIndex, setPresetIndex] = useState(0); // used in UI and logic

  // initialize on preset change or reset
  useEffect(() => {
    const { work } = presets[presetIndex];
    setMode('work');
    setMinutes(work);
    setSeconds(0);
    setIsRunning(false);
    setSessionCount(0);
    setStartTime(null);
  }, [presetIndex]);

  // ticking
  useEffect(() => {
    if (!isRunning) return;
    const timerId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(s => s - 1);
      } else if (minutes > 0) {
        setMinutes(m => m - 1);
        setSeconds(59);
      } else {
        handleStop(); // auto-stop at end
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, minutes, seconds]);

  const format = (m, s) =>
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (!startTime && mode === 'work') {
        setStartTime(new Date());
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    // record only work sessions
    if (mode === 'work' && startTime && courseId && topicId) {
      const end = new Date();
      axios.post('http://localhost:8080/api/sessions', {
        startTime: startTime.toISOString(),
        endTime:   end.toISOString(),
        course: { id: courseId },
        topic:  { id: topicId }
      }).catch(console.error);
    }

    // switch mode
    let nextMode, nextMin;
    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      // every 4 sessions → long break
      if (newCount % 4 === 0) {
        nextMode = 'break';
        nextMin = longBreak;
      } else {
        nextMode = 'break';
        nextMin = presets[presetIndex].break;
      }
    } else {
      nextMode = 'work';
      nextMin = presets[presetIndex].work;
    }

    // reset times
    setMode(nextMode);
    setMinutes(nextMin);
    setSeconds(0);
    setStartTime(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <select
          value={presetIndex}
          onChange={e => setPresetIndex(+e.target.value)}
          className="border p-1 rounded"
        >
          {presets.map((p, i) => (
            <option key={i} value={i}>
              {p.work} min work / {p.break} min break
            </option>
          ))}
        </select>
        <span className="font-medium">
          Mode: {mode === 'work' ? 'Work' : 'Break'}
        </span>
      </div>

      <div className="text-center text-5xl font-mono mb-4">
        {format(minutes, seconds)}
      </div>

      <div className="flex justify-center gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
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
};

export default Pomodoro;