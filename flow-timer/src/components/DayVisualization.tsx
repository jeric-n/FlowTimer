import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { formatTime } from '../utils/time';

const DayVisualization = () => {
  const { history } = useHistory();

  const today = new Date().toISOString().split('T')[0];

  const todaysSessions = history.filter(
    (session) => session.endTime.split('T')[0] === today
  );

  const totalWorkTime = todaysSessions.reduce(
    (total, session) => total + session.workTime,
    0
  );

  const totalBreakTime = todaysSessions.reduce(
    (total, session) => total + session.breakTime,
    0
  );

  const totalTime = totalWorkTime + totalBreakTime;

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Today's Activity</h5>
        <div className="progress" style={{ height: '30px' }}>
          {todaysSessions.map((session, index) => {
            const workPercentage = (session.workTime / totalTime) * 100;
            const breakPercentage = (session.breakTime / totalTime) * 100;
            return (
              <React.Fragment key={index}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${workPercentage}%` }}
                  aria-valuenow={workPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  Focus
                </div>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${breakPercentage}%` }}
                  aria-valuenow={breakPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  Break
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-3">
          <p>Total Focus Time: {formatTime(totalWorkTime)}</p>
          <p>Total Break Time: {formatTime(totalBreakTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default DayVisualization;
