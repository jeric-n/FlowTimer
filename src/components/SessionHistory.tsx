import React from 'react';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';

import { formatTime } from '../utils/timeUtils';

interface SessionHistoryProps {
  sessions: Session[];
  todayTotals: {totalFocus: number, totalBreak: number};
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, todayTotals }) => {
  const formatPeriod = (period: FocusPeriod | BreakPeriod) => {
    const start = new Date(period.startTime).toLocaleTimeString();
    const end = new Date(period.endTime).toLocaleTimeString();
    return `${start} - ${end} (${formatTime(period.duration)})`;
  };

  return (
    <div className="session-history-container">
      <h2>Today's FlowTime Sessions</h2>
      <div className="daily-summary">
        <p>Day's Total Focus: {formatTime(todayTotals.totalFocus)}</p>
        <p>Day's Total Break: {formatTime(todayTotals.totalBreak)}</p>
      </div>
      {sessions.length === 0 ? (
        <p>No sessions recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="hidden-id-column">ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Focus</th>
              <th>Total Break</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <React.Fragment key={session.id}>
                <tr>
                  <td className="hidden-id-column">{session.id}</td>
                  <td>{new Date(session.startTime).toLocaleString()}</td>
                  <td>{new Date(session.endTime).toLocaleString()}</td>
                  <td>{formatTime(session.totalFocusTime)}</td>
                  <td>{formatTime(session.totalBreakTime)}</td>
                </tr>
                {session.focusPeriods.length > 0 && (
                  <tr>
                    <td colSpan={5}>
                      <strong>Focus Periods:</strong>
                      <ul>
                        {session.focusPeriods.map((period, index) => (
                          <li key={index}>{formatPeriod(period)}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
                {session.breakPeriods.length > 0 && (
                  <tr>
                    <td colSpan={5}>
                      <strong>Break Periods:</strong>
                      <ul>
                        {session.breakPeriods.map((period, index) => (
                          <li key={index}>{formatPeriod(period)}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SessionHistory;