import { useState, useEffect, useCallback } from 'react';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import { Settings } from '../types/Settings';
import { BreakPreset, TIME_IN_SECONDS, BREAK_DURATIONS } from '../constants';
import { useAudio } from './useAudio';

export enum TimerStatus {
  STOPPED = 'STOPPED',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}

interface UseTimerProps {
  settings: Settings;
  onSessionEnd: (session: Session) => void;
}

export const useTimer = ({ settings, onSessionEnd }: UseTimerProps) => {
  const { playStartFocusSound, playBreakTimeSound, playEndSessionSound } = useAudio();

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
      onSessionEnd(session); // Call the existing handleSessionEnd in App.tsx
    }
    playEndSessionSound();
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

  const startSession = () => {
    playStartFocusSound();
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
    playStartFocusSound();
    const completedBreakPeriod = recordCurrentPeriod(); // Get the completed break period
    if (completedBreakPeriod) {
      addPeriodToState(completedBreakPeriod, 'break');
    }
    setBreakTime(0); // Reset current break period timer
    setTimerStatus(TimerStatus.FOCUS);
    setCurrentPeriodStartTime(new Date().toISOString());
  }, [recordCurrentPeriod, addPeriodToState, playStartFocusSound]);

  const startBreak = () => {
    playBreakTimeSound();
    const completedFocusPeriod = recordCurrentPeriod(); // Get the completed focus period
    if (completedFocusPeriod) {
      addPeriodToState(completedFocusPeriod, 'focus');
    }
    setFocusTime(0); // Reset current focus period timer

    const lastFocusDuration = focusPeriods.length > 0 ? focusPeriods[focusPeriods.length - 1].duration : 0;
    let duration = 0;
    if (settings.breakPreset === BreakPreset.PRESET2) {
      duration = Math.max(TIME_IN_SECONDS.MINUTE, lastFocusDuration / 5);
    } else if (settings.breakPreset === BreakPreset.PRESET3) {
      if (lastFocusDuration < 25 * TIME_IN_SECONDS.MINUTE) {
        duration = BREAK_DURATIONS.PRESET3_SHORT_FOCUS;
      } else if (lastFocusDuration >= 25 * TIME_IN_SECONDS.MINUTE && lastFocusDuration < 50 * TIME_IN_SECONDS.MINUTE) {
        duration = BREAK_DURATIONS.PRESET3_MEDIUM_FOCUS;
      } else if (lastFocusDuration >= 50 * TIME_IN_SECONDS.MINUTE && lastFocusDuration < 90 * TIME_IN_SECONDS.MINUTE) {
        duration = BREAK_DURATIONS.PRESET3_LONG_FOCUS_50_90;
      } else {
        duration = BREAK_DURATIONS.PRESET3_VERY_LONG_FOCUS;
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
      if (settings.breakPreset === BreakPreset.DEFAULT) {
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

  return {
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
  };
};
