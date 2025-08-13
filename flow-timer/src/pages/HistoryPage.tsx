import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { formatTime } from '../utils/time';
import { Session } from '../types/Session';
import Papa from 'papaparse';

const HistoryPage = () => {
  const { history, setHistory } = useHistory();

  const exportToCsv = () => {
    const csv = Papa.unparse(history);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'flowtimer-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const importedHistory = results.data as Session[];
          setHistory([...history, ...importedHistory]);
        },
      });
    }
  };

  return (
    <div>
      <h1>History</h1>
      <div className="my-3">
        <button className="btn btn-success mx-1" onClick={exportToCsv}>Export to CSV</button>
        <label htmlFor="csv-import" className="btn btn-primary mx-1">
          Import from CSV
          <input type="file" id="csv-import" accept=".csv" style={{ display: 'none' }} onChange={importFromCsv} />
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Focus Time</th>
            <th>Break Time</th>
          </tr>
        </thead>
        <tbody>
          {history.map((session: Session, index: number) => (
            <tr key={index}>
              <td>{new Date(session.endTime).toLocaleDateString()}</td>
              <td>{formatTime(session.workTime)}</td>
              <td>{formatTime(session.breakTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
