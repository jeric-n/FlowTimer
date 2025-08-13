import React from 'react';
import { useTimer, TimerStatus } from '../hooks/useTimer';
import { formatTime } from '../utils/time';
import { useSettings } from '../hooks/useSettings';
import { useHistory } from '../hooks/useHistory';

const Timer = () => {
  const { settings } = useSettings();
  const { addSession } = useHistory();
  const {
    status,
    elapsedTime,
    breakTime,
    workTime,
    startTimer,
    startBreak,
    resumeTimer,
    stopTimer,
  } = useTimer(settings.unlimitedBreak);

  const handleMainButtonClick = () => {
    if (status === TimerStatus.STOPPED) {
      startTimer();
    } else if (status === TimerStatus.RUNNING) {
      startBreak();
    } else if (status === TimerStatus.ON_BREAK) {
      resumeTimer();
    }
  };

  const handleEndSessionClick = () => {
    addSession({
      workTime: elapsedTime,
      breakTime,
      endTime: new Date().toISOString(),
    });
    stopTimer();
  };

  const renderTimer = () => {
    if (status === TimerStatus.ON_BREAK) {
      if(settings.unlimitedBreak) {
        return formatTime(breakTime);
      }
      const remainingBreakTime = workTime / 5 - breakTime;
      return formatTime(remainingBreakTime > 0 ? remainingBreakTime : 0);
    }
    return formatTime(elapsedTime);
  };

  const getButtonText = () => {
    if (status === TimerStatus.STOPPED) {
      return 'Start';
    }
    if (status === TimerStatus.RUNNING) {
      return 'Take Break';
    }
    return 'Resume';
  };

  return (
    <div className="card text-center">
      <div className="card-body">
        <h2 className="card-title">{
          status === TimerStatus.ON_BREAK
            ? 'Break Time'
            : 'Focus Time'
        }</h2>
        <p className="display-4">{renderTimer()}</p>
        <button className="btn btn-primary mx-1" onClick={handleMainButtonClick}>
          {getButtonText()}
        </button>
        <button className="btn btn-danger mx-1" onClick={handleEndSessionClick} disabled={status === TimerStatus.STOPPED}>
          End Session
        </button>
      </div>
    </div>
  );
};

export default Timer;
