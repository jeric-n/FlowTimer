import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllHistoryPage from './pages/AllHistoryPage';
import SettingsPage from './pages/SettingsPage';
import { Session, FocusPeriod, BreakPeriod } from './types/Session';
import { Settings } from './types/Settings';
import './index.css';

enum TimerStatus {
  STOPPED = 'STOPPED',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}



const LOCAL_STORAGE_KEY = 'flowtimer_sessions';
const DAILY_TOTALS_LOCAL_STORAGE_KEY = 'flowtimer_daily_totals';
const SETTINGS_LOCAL_STORAGE_KEY = 'flowtimer_settings';

const startFocusSound = new Audio('/sounds/Start_Focus.mp3');
const breakTimeSound = new Audio('/sounds/Break_Time.mp3');
const endSessionSound = new Audio('/sounds/End_Session.mp3');

function App() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

  const [dailyTotals, setDailyTotals] = useState<{ [date: string]: { totalFocus: number, totalBreak: number } }>(() => {
    const storedDailyTotals = localStorage.getItem(DAILY_TOTALS_LOCAL_STORAGE_KEY);
    return storedDailyTotals ? JSON.parse(storedDailyTotals) : {};
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : { breakPreset: 'default' };
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
  const [breakDuration, setBreakDuration] = useState(0);

  const addPeriodToState = useCallback((period: FocusPeriod | BreakPeriod, type: 'focus' | 'break') => {
    if (type === 'focus') {
      setFocusPeriods((prev) => [...prev, period as FocusPeriod]);
    } else if (type === 'break') {
      setBreakPeriods((prev) => [...prev, period as BreakPeriod]);
    }
  }, []);

  const endSession = () => {
    if (currentSessionStartTime && currentPeriodStartTime) {
      const finalPeriod = recordCurrentPeriod(); // Get the final ongoing period

      let finalFocusPeriodsForSession = [...focusPeriods];
      let finalBreakPeriodsForSession = [...breakPeriods];

      if (finalPeriod) {
        if (timerStatus === TimerStatus.FOCUS) {
          finalFocusPeriodsForSession.push(finalPeriod as FocusPeriod);
        } else if (timerStatus === TimerStatus.BREAK) {
          finalBreakPeriodsForSession.push(finalPeriod as BreakPeriod);
        }
      }

      // Calculate totalFocusTime and totalBreakTime from the periods that will be in the session object
      const calculatedTotalFocusTime = finalFocusPeriodsForSession.reduce((sum, period) => sum + period.duration, 0);
      const calculatedTotalBreakTime = finalBreakPeriodsForSession.reduce((sum, period) => sum + period.duration, 0);

      const session: Session = {
        id: Date.now().toString(),
        startTime: currentSessionStartTime,
        endTime: new Date().toISOString(),
        totalFocusTime: calculatedTotalFocusTime,
        totalBreakTime: calculatedTotalBreakTime,
        focusPeriods: finalFocusPeriodsForSession,
        breakPeriods: finalBreakPeriodsForSession,
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

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hours, minutes, secs]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  const recordCurrentPeriod = useCallback((): FocusPeriod | BreakPeriod | null => {
    if (currentPeriodStartTime) {
      const endTime = new Date().toISOString();
      const duration = Math.floor((new Date(endTime).getTime() - new Date(currentPeriodStartTime).getTime()) / 1000);

      if (timerStatus === TimerStatus.FOCUS) {
        return { startTime: currentPeriodStartTime, endTime, duration };
      } else if (timerStatus === TimerStatus.BREAK) {
        return { startTime: currentPeriodStartTime, endTime, duration };
      }
    }
    return null;
  }, [currentPeriodStartTime, timerStatus]);

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
  const resumeFocus = useCallback(() => {
    startFocusSound.play();
    const completedBreakPeriod = recordCurrentPeriod(); // Get the completed break period
    if (completedBreakPeriod) {
      addPeriodToState(completedBreakPeriod, 'break');
    }
    setBreakTime(0); // Reset current break period timer
    setTimerStatus(TimerStatus.FOCUS);
    setCurrentPeriodStartTime(new Date().toISOString());
  }, [recordCurrentPeriod, addPeriodToState]);

  const startBreak = () => {
    breakTimeSound.play();
    const completedFocusPeriod = recordCurrentPeriod(); // Get the completed focus period
    if (completedFocusPeriod) {
      addPeriodToState(completedFocusPeriod, 'focus');
    }
    setFocusTime(0); // Reset current focus period timer

    const lastFocusDuration = focusPeriods.length > 0 ? focusPeriods[focusPeriods.length - 1].duration : 0;
    let duration = 0;
    if (settings.breakPreset === 'preset2') {
      duration = Math.max(60, lastFocusDuration / 5);
    } else if (settings.breakPreset === 'preset3') {
      if (lastFocusDuration < 25 * 60) {
        duration = 5 * 60;
      } else if (lastFocusDuration >= 25 * 60 && lastFocusDuration <= 50 * 60) {
        duration = 8 * 60;
      } else {
        duration = 10 * 60;
      }
    }

    setBreakDuration(duration);
    setBreakTime(duration);
    setTimerStatus(TimerStatus.BREAK);
    setCurrentPeriodStartTime(new Date().toISOString());
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerStatus === TimerStatus.FOCUS) {
      interval = setInterval(() => {
        setFocusTime((prevTime) => prevTime + 1);
        setTotalFocusTime((prevTotal) => prevTotal + 1);
      }, 1000);
    } else if (timerStatus === TimerStatus.BREAK) {
      if (settings.breakPreset === 'default') {
        interval = setInterval(() => {
          setBreakTime((prevTime) => prevTime + 1);
          setTotalBreakTime((prevTotal) => prevTotal + 1);
        }, 1000);
      } else {
        if (breakTime > 0) {
          interval = setInterval(() => {
            setBreakTime((prevTime) => prevTime - 1);
            setTotalBreakTime((prevTotal) => prevTotal + 1);
          }, 1000);
        } else {
          resumeFocus();
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStatus, settings.breakPreset, resumeFocus, breakTime]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(DAILY_TOTALS_LOCAL_STORAGE_KEY, JSON.stringify(dailyTotals));
  }, [dailyTotals]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

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

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
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
            <li>
              <Link to="/settings">Settings</Link>
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
                settings={settings}
                breakDuration={breakDuration}
              />
            }
          />
          <Route path="/history" element={<AllHistoryPage sessions={sessions} onImportSessions={handleImportSessions} />} />
          <Route path="/settings" element={<SettingsPage settings={settings} onSettingsChange={handleSettingsChange} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
