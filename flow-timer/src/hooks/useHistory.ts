import { useState, useEffect } from 'react';
import { Session } from '../types/Session';

const getStoredHistory = (): Session[] => {
  const stored = localStorage.getItem('flowtimer-history');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const useHistory = () => {
  const [history, setHistory] = useState<Session[]>(getStoredHistory());

  useEffect(() => {
    localStorage.setItem('flowtimer-history', JSON.stringify(history));
  }, [history]);

  const addSession = (session: Session) => {
    setHistory([...history, session]);
  };

  return { history, addSession, setHistory };
};
