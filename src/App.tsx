import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllHistoryPage from './pages/AllHistoryPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

import { useTimer } from './hooks/useTimer';
import { useSessionManagement } from './hooks/useSessionManagement';
import { useSettings } from './hooks/useSettings';

function App() {
  const { settings, handleSettingsChange } = useSettings();
  const { sessions, dailyTotals, handleSessionEnd, handleImportSessions } = useSessionManagement();
  const {
    timerStatus,
    focusTime,
    breakTime,
    totalFocusTime,
    totalBreakTime,
    currentSessionStartTime,
    currentPeriodStartTime,
    focusPeriods,
    breakPeriods,
    breakDuration,
    startSession,
    startBreak,
    resumeFocus,
    endSession,
    recordCurrentPeriod,
  } = useTimer({ settings, onSessionEnd: handleSessionEnd });

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
                timerStatus={timerStatus}
                focusTime={focusTime}
                breakTime={breakTime}
                totalFocusTime={totalFocusTime}
                totalBreakTime={totalBreakTime}
                currentSessionStartTime={currentSessionStartTime}
                currentPeriodStartTime={currentPeriodStartTime}
                focusPeriods={focusPeriods}
                breakPeriods={breakPeriods}
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
