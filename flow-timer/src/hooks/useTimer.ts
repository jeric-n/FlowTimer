import { useState, useEffect, useRef } from 'react';

export enum TimerStatus {
  STOPPED,
  RUNNING,
  ON_BREAK,
}

export const useTimer = (unlimitedBreak: boolean = false) => {
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.STOPPED);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [workTime, setWorkTime] = useState<number>(0);
  const [breakStartTime, setBreakStartTime] = useState<number>(0);
  const [breakTime, setBreakTime] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === TimerStatus.RUNNING) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else if (status === TimerStatus.ON_BREAK) {
      if (!unlimitedBreak) {
        const calculatedBreakTime = workTime / 5;
        if (breakTime >= calculatedBreakTime) {
          resumeTimer();
          return;
        }
      }
      intervalRef.current = setInterval(() => {
        setBreakTime(Date.now() - breakStartTime);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, startTime, breakStartTime, workTime, breakTime, unlimitedBreak]);

  const startTimer = () => {
    setStartTime(Date.now() - elapsedTime);
    setStatus(TimerStatus.RUNNING);
  };

  const startBreak = () => {
    setWorkTime(elapsedTime);
    setBreakStartTime(Date.now());
    setStatus(TimerStatus.ON_BREAK);
  };

  const resumeTimer = () => {
    setStartTime(Date.now() - workTime);
    setBreakTime(0);
    setStatus(TimerStatus.RUNNING);
  };

  const stopTimer = () => {
    setStatus(TimerStatus.STOPPED);
    setElapsedTime(0);
    setWorkTime(0);
    setBreakTime(0);
  };

  return { status, elapsedTime, breakTime, workTime, startTimer, startBreak, resumeTimer, stopTimer };
};