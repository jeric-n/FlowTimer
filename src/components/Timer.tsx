import React from 'react';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';

enum TimerStatus {
  STOPPED = 'STOPPED',
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}

interface TimerProps {
  onSessionEnd: (session: Session) => void;
  timerStatus: TimerStatus;
  focusTime: number;
  breakTime: number;
  totalFocusTime: number;
  totalBreakTime: number;
  currentSessionStartTime: string | null;
  currentPeriodStartTime: string | null;
  focusPeriods: FocusPeriod[];
  breakPeriods: BreakPeriod[];
  formatTime: (totalSeconds: number) => string;
  recordCurrentPeriod: () => void;
  startSession: () => void;
  startBreak: () => void;
  resumeFocus: () => void;
  endSession: () => void;
}

const Timer: React.FC<TimerProps> = ({
  onSessionEnd,
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
}) => {

  const renderTimerDisplay = () => {
    if (timerStatus === TimerStatus.FOCUS) {
      return formatTime(focusTime);
    } else if (timerStatus === TimerStatus.BREAK) {
      return formatTime(breakTime);
    }
    return formatTime(0); // When stopped, display 00:00:00
  };

  return (
    <div className="timer-container">
      <h1>FlowTimer</h1>
      <div className="time-display">
        {renderTimerDisplay()}
      </div>
      <div className="buttons">
        {timerStatus === TimerStatus.STOPPED && (
          <button onClick={startSession}>Start Session</button>
        )}
        {timerStatus === TimerStatus.FOCUS && (
          <>
            <button onClick={startBreak}>Start Break</button>
            <button onClick={endSession}>End Session</button>
          </>
        )}
        {timerStatus === TimerStatus.BREAK && (
          <>
            <button onClick={resumeFocus}>Resume Focus</button>
            <button onClick={endSession}>End Session</button>
          </>
        )}
      </div>

      <div className="live-stats">
        <h2>Live Stats (Current Session)</h2>
        <p>Total Focus Time: {formatTime(totalFocusTime)}</p>
        <p>Total Break Time: {formatTime(totalBreakTime)}</p>
        {timerStatus === TimerStatus.FOCUS && <p>Current Focus Period: {formatTime(focusTime)}</p>}
        {timerStatus === TimerStatus.BREAK && <p>Current Break Period: {formatTime(breakTime)}</p>}
      </div>
    </div>
  );
};

export default Timer;