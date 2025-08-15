import React from 'react';
import { Settings } from '../types/Settings';

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSettingsChange }) => {
  const handlePresetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreset = event.target.value as Settings['breakPreset'];
    onSettingsChange({ ...settings, breakPreset: newPreset });
  };

  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Break Timer Presets</h2>
        <div>
          <label>
            <input
              type="radio"
              value="default"
              checked={settings.breakPreset === 'default'}
              onChange={handlePresetChange}
            />
            <strong>Default:</strong> Unlimited break time.
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="preset2"
              checked={settings.breakPreset === 'preset2'}
              onChange={handlePresetChange}
            />
            <strong>Preset 2:</strong> Minimum 1 minute, or Focus Time / 5.
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="preset3"
              checked={settings.breakPreset === 'preset3'}
              onChange={handlePresetChange}
            />
            <strong>Preset 3:</strong>
            <ul>
              <li>5-minute break for less than 25 minutes of focus.</li>
              <li>8-minute break for 25-50 minutes of focus.</li>
              <li>10-minute break for more than 50 minutes of focus.</li>
            </ul>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;