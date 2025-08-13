import React from 'react';
import { useSettings } from '../hooks/useSettings';

const SettingsPage = () => {
  const { settings, setSettings } = useSettings();

  const handleUnlimitedBreakChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings({ ...settings, unlimitedBreak: e.target.checked });
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          checked={settings.unlimitedBreak}
          onChange={handleUnlimitedBreakChange}
          id="unlimitedBreakCheck"
        />
        <label className="form-check-label" htmlFor="unlimitedBreakCheck">
          Unlimited Break Time
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;