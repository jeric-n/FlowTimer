import React from 'react';
import Timer from '../components/Timer';
import SessionHistory from '../components/SessionHistory';
import DayVisualization from '../components/DayVisualization'; // Uncommented DayVisualization import
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import { Settings } from '../types/Settings';


interface HomePageProps {
  sessions: Session[];
  handleSessionEnd: (session: Session) => void;
  // Props from App.tsx for Timer
  timerStatus: any;
  focusTime: number;
  breakTime: number;
  totalFocusTime: number;
  totalBreakTime: number;
  currentSessionStartTime: string | null;
  currentPeriodStartTime: string | null;
  focusPeriods: FocusPeriod[];
  breakPeriods: BreakPeriod[];
  formatTime: (totalSeconds: number) => string;
  dailyTotals: {[date: string]: {totalFocus: number, totalBreak: number}};
  currentDate: string;
  recordCurrentPeriod: () => void;
  startSession: () => void;
  startBreak: () => void;
  resumeFocus: () => void;
  endSession: () => void;
  settings: Settings;
  breakDuration: number;
}

const HomePage: React.FC<HomePageProps> = ({
  sessions,
  handleSessionEnd,
  timerStatus,
  focusTime,
  breakTime,
  totalFocusTime,
  totalBreakTime,
  currentSessionStartTime,
  currentPeriodStartTime,
  focusPeriods,
  breakPeriods,
  formatTime,
  recordCurrentPeriod,
  startSession,
  startBreak,
  resumeFocus,
  endSession,
  dailyTotals,
  currentDate,
  settings,
  breakDuration,
}) => {
  const todayTotals = dailyTotals[currentDate] || { totalFocus: 0, totalBreak: 0 };

  // Filter sessions for the current day
  const today = new Date();
  const currentDaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate.getDate() === today.getDate() &&
           sessionDate.getMonth() === today.getMonth() &&
           sessionDate.getFullYear() === today.getFullYear();
  });

  return (
    <>
      <Timer
        onSessionEnd={handleSessionEnd}
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
        recordCurrentPeriod={recordCurrentPeriod}
        startSession={startSession}
        startBreak={startBreak}
        resumeFocus={resumeFocus}
        endSession={endSession}
        settings={settings}
        breakDuration={breakDuration}
      />

      

      <DayVisualization sessions={currentDaySessions} /> {/* Uncommented DayVisualization */}
      <SessionHistory sessions={currentDaySessions} todayTotals={todayTotals} formatTime={formatTime} />
    </>
  );
};

export default HomePage;
