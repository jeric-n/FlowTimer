import { useState, useEffect } from 'react';

export interface Settings {
  unlimitedBreak: boolean;
}

const getStoredSettings = (): Settings => {
  const stored = localStorage.getItem('flowtimer-settings');
  if (stored) {
    return JSON.parse(stored);
  }
  return { unlimitedBreak: false };
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(getStoredSettings());

  useEffect(() => {
    localStorage.setItem('flowtimer-settings', JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};
