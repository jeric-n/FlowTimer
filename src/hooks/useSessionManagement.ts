import { useState, useEffect } from 'react';
import { Session } from '../types/Session';
import { LOCAL_STORAGE_KEYS } from '../constants';

export const useSessionManagement = () => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const storedSessions = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSIONS);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

  const [dailyTotals, setDailyTotals] = useState<{ [date: string]: { totalFocus: number, totalBreak: number } }>(() => {
    const storedDailyTotals = localStorage.getItem(LOCAL_STORAGE_KEYS.DAILY_TOTALS);
    return storedDailyTotals ? JSON.parse(storedDailyTotals) : {};
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DAILY_TOTALS, JSON.stringify(dailyTotals));
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

  return {
    sessions,
    dailyTotals,
    handleSessionEnd,
    handleImportSessions,
  };
};
