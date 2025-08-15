import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllHistoryPage from './pages/AllHistoryPage';
import { Session, FocusPeriod, BreakPeriod } from './types/Session';
import './index.css';

enum TimerStatus {
  STOPPED = 'STOPPED',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}

const LOCAL_STORAGE_KEY = 'flowtimer_sessions';
const DAILY_TOTALS_LOCAL_STORAGE_KEY = 'flowtimer_daily_totals';

const startFocusSound = new Audio('/sounds/Start_Focus.mp3');
const breakTimeSound = new Audio('/sounds/Break_Time.mp3');
const endSessionSound = new Audio('/sounds/End_Session.mp3');

function App() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

  const [dailyTotals, setDailyTotals] = useState<{[date: string]: {totalFocus: number, totalBreak: number}}>(() => {
    const storedDailyTotals = localStorage.getItem(DAILY_TOTALS_LOCAL_STORAGE_KEY);
    return storedDailyTotals ? JSON.parse(storedDailyTotals) : {};
  });

  // Timer related states
  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.STOPPED);
  const [focusTime, setFocusTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [currentSessionStartTime, setCurrentSessionStartTime] = useState<string | null>(null);
  const [currentPeriodStartTime, setCurrentPeriodStartTime] = useState<string | null>(null);
  const [focusPeriods, setFocusPeriods] = useState<FocusPeriod[]>([]);
  const [breakPeriods, setBreakPeriods] = useState<BreakPeriod[]>([]);

  // Timer useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerStatus === TimerStatus.FOCUS) {
      interval = setInterval(() => {
        setFocusTime((prevTime) => prevTime + 1);
        setTotalFocusTime((prevTotal) => prevTotal + 1);
      }, 1000);
    } else if (timerStatus === TimerStatus.BREAK) {
      interval = setInterval(() => {
        setBreakTime((prevTime) => prevTime + 1);
        setTotalBreakTime((prevTotal) => prevTotal + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus]);

  // Helper function (from Timer.tsx)
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hours, minutes, secs]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  // Timer control functions (from Timer.tsx)
  const recordCurrentPeriod = () => {
    if (currentPeriodStartTime) {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentPeriodStartTime).getTime()) / 1000);

      if (timerStatus === TimerStatus.FOCUS) {
        setFocusPeriods((prev) => [...prev, { startTime: currentPeriodStartTime, endTime, duration }]);
      } else if (timerStatus === TimerStatus.BREAK) {
        setBreakPeriods((prev) => [...prev, { startTime: currentPeriodStartTime, endTime, duration }]);
      }
    }
  };

  const startSession = () => {
    startFocusSound.play();
    setTimerStatus(TimerStatus.FOCUS);
    setFocusTime(0);
    setBreakTime(0);
    setTotalFocusTime(0);
    setTotalBreakTime(0);
    setFocusPeriods([]);
    setBreakPeriods([]);
    setCurrentSessionStartTime(new Date().toISOString());
    setCurrentPeriodStartTime(new Date().toISOString());
  };

  const startBreak = () => {
    breakTimeSound.play();
    recordCurrentPeriod(); // Record the completed focus period
    setFocusTime(0); // Reset current focus period timer
    setTimerStatus(TimerStatus.BREAK);
    setCurrentPeriodStartTime(new Date().toISOString());
  };

  const resumeFocus = () => {
    startFocusSound.play();
    recordCurrentPeriod(); // Record the completed break period
    setBreakTime(0); // Reset current break period timer
    setTimerStatus(TimerStatus.FOCUS);
    setCurrentPeriodStartTime(new Date().toISOString());
  };

  const endSession = () => {
    if (currentSessionStartTime && currentPeriodStartTime) {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentPeriodStartTime).getTime()) / 1000);

      let finalFocusPeriods = [...focusPeriods];
      let finalBreakPeriods = [...breakPeriods];

      if (timerStatus === TimerStatus.FOCUS) {
        finalFocusPeriods.push({ startTime: currentPeriodStartTime, endTime, duration });
      } else if (timerStatus === TimerStatus.BREAK) {
        finalBreakPeriods.push({ startTime: currentPeriodStartTime, endTime, duration });
      }

      const session: Session = {
        id: Date.now().toString(),
        startTime: currentSessionStartTime,
        endTime: new Date().toISOString(),
        totalFocusTime: totalFocusTime,
        totalBreakTime: totalBreakTime,
        focusPeriods: finalFocusPeriods,
        breakPeriods: finalBreakPeriods,
      };
      handleSessionEnd(session); // Call the existing handleSessionEnd in App.tsx
    }
    endSessionSound.play();
    setTimerStatus(TimerStatus.STOPPED);
    setFocusTime(0);
    setBreakTime(0);
    setTotalFocusTime(0);
    setTotalBreakTime(0);
    setFocusPeriods([]);
    setBreakPeriods([]);
    setCurrentSessionStartTime(null);
    setCurrentPeriodStartTime(null);
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(DAILY_TOTALS_LOCAL_STORAGE_KEY, JSON.stringify(dailyTotals));
  }, [dailyTotals]);

  const handleSessionEnd = (session: Session) => {
    setSessions((prevSessions) => [...prevSessions, session]);

    const sessionDate = new Date(session.startTime).toISOString().split('T')[0]; // YYYY-MM-DD
    setDailyTotals((prevDailyTotals) => {
      const currentDayTotals = prevDailyTotals[sessionDate] || { totalFocus: 0, totalBreak: 0 };
      return {
        ...prevDailyTotals,
        [sessionDate]: {
          totalFocus: currentDayTotals.totalFocus + session.totalFocusTime,
          totalBreak: currentDayTotals.totalBreak + session.totalBreakTime,
        },
      };
    });
  };

  const handleImportSessions = (newSessions: Session[]) => {
    setSessions((prevSessions) => {
      const existingSessionIds = new Set(prevSessions.map(s => s.id));
      const sessionsToAddNew = newSessions.filter(s => !existingSessionIds.has(s.id));
      return [...prevSessions, ...sessionsToAddNew];
    });
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">All History</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                sessions={sessions}
                handleSessionEnd={handleSessionEnd}
                timerStatus={timerStatus}
                focusTime={focusTime}
                breakTime={breakTime}
                totalFocusTime={totalFocusTime}
                totalBreakTime={totalBreakTime}
                currentSessionStartTime={currentSessionStartTime}
                currentPeriodStartTime={currentPeriodStartTime}
                focusPeriods={focusPeriods}
                breakPeriods={breakPeriods}
                formatTime={formatTime}
                dailyTotals={dailyTotals}
                currentDate={new Date().toISOString().split('T')[0]}
                recordCurrentPeriod={recordCurrentPeriod}
                startSession={startSession}
                startBreak={startBreak}
                resumeFocus={resumeFocus}
                endSession={endSession}
              />
            }
          />
          <Route path="/history" element={<AllHistoryPage sessions={sessions} onImportSessions={handleImportSessions} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;