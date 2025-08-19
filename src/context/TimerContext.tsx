import React, { createContext, useContext, ReactNode } from 'react';
import { useTimer, TimerStatus } from '../hooks/useTimer';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import { Settings } from '../types/Settings';

interface TimerContextType {
  timerStatus: TimerStatus;
  focusTime: number;
  breakTime: number;
  totalFocusTime: number;
  totalBreakTime: number;
  currentSessionStartTime: string | null;
  currentPeriodStartTime: string | null;
  focusPeriods: FocusPeriod[];
  breakPeriods: BreakPeriod[];
  breakDuration: number;
  startSession: () => void;
  startBreak: () => void;
  resumeFocus: () => void;
  endSession: () => void;
  recordCurrentPeriod: () => FocusPeriod | BreakPeriod | null;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
  settings: Settings;
  onSessionEnd: (session: Session) => void;
}

export const TimerProvider = ({ children, settings, onSessionEnd }: TimerProviderProps) => {
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
  } = useTimer({ settings, onSessionEnd });

  return (
    <TimerContext.Provider
      value={{
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
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
