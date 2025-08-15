import React, { useMemo } from 'react';
import { Session } from '../types/Session';

interface HistoryPageProps {
  sessions: Session[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ sessions }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hours, minutes, secs]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  const formatPeriod = (period: any) => { // Using 'any' for now, will refine if needed
    const start = new Date(period.startTime).toLocaleTimeString();
    const end = new Date(period.endTime).toLocaleTimeString();
    return `${start} - ${end} (${formatTime(period.duration)})`;
  };

  const sessionsGroupedByDate = useMemo(() => {
    const grouped: { [key: string]: Session[] } = {};
    sessions.forEach(session => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(session);
    });
    return grouped;
  }, [sessions]);

  return (
    <div className="history-page-container">
      <h2>All Sessions History</h2>
      {Object.keys(sessionsGroupedByDate).length === 0 ? (
        <p>No sessions recorded yet.</p>
      ) : (
        Object.keys(sessionsGroupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => (
          <div key={date} className="day-history-section">
            <h3>{date}</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Focus</th>
                  <th>Total Break</th>
                </tr>
              </thead>
              <tbody>
                {sessionsGroupedByDate[date].map(session => (
                  <React.Fragment key={session.id}>
                    <tr>
                      <td>{session.id}</td>
                      <td>{new Date(session.startTime).toLocaleTimeString()}</td>
                      <td>{new Date(session.endTime).toLocaleTimeString()}</td>
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
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPage;