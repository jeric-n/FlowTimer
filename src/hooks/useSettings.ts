import { useState, useEffect } from 'react';
import { Settings } from '../types/Settings';
import { LOCAL_STORAGE_KEYS, BreakPreset } from '../constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return storedSettings ? JSON.parse(storedSettings) : { breakPreset: BreakPreset.DEFAULT };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return {
    settings,
    handleSettingsChange,
  };
};
