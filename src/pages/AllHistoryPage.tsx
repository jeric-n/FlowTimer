import React, { useState } from 'react'; // Import useState
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import DayVisualization from '../components/DayVisualization'; // Import DayVisualization
import { formatTime } from '../utils/timeUtils';

interface AllHistoryPageProps {
  sessions: Session[];
  onImportSessions: (newSessions: Session[]) => void;
}

const AllHistoryPage: React.FC<AllHistoryPageProps> = ({ sessions, onImportSessions }) => {
  const [openVisualization, setOpenVisualization] = useState<string | null>(null); // State to manage open visualization

  const exportToCsv = () => {
    if (sessions.length === 0) {
      alert("No sessions to export.");
      return;
    }

    const headers = [
      "id",
      "startTime",
      "endTime",
      "totalFocusTime",
      "totalBreakTime",
      "focusPeriods", // Will be JSON string
      "breakPeriods", // Will be JSON string
    ];

    const rows = sessions.map((session) => ({
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      totalFocusTime: session.totalFocusTime,
      totalBreakTime: session.totalBreakTime,
      focusPeriods: JSON.stringify(session.focusPeriods),
      breakPeriods: JSON.stringify(session.breakPeriods),
    }));

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += Object.values(row)
        .map((value) => {
          // Escape double quotes and wrap in double quotes if value contains comma or double quote
          const stringValue = String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        })
        .join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "flowtimer_sessions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const importFromCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("Please select a CSV file to import.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        if (lines.length === 0) {
          alert("CSV file is empty or malformed.");
          return;
        }

        const headers = lines[0].split(",").map(header => header.trim().replace(/^"|"$/g, '')); // Remove quotes
        const importedSessions: Session[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/(?:"(?:(?="")|[^"])*"|[^,])+/g); // Regex to handle quoted commas
          if (!values || values.length !== headers.length) {
            console.warn(`Skipping malformed row: ${lines[i]}`);
            continue;
          }

          const session: Partial<Session> = {};
          headers.forEach((header, index) => {
            let value = values[index].trim();
            // Remove surrounding quotes and unescape internal quotes
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1).replace(/""/g, '"');
            }

            switch (header) {
              case "id":
                session.id = value;
                break;
              case "startTime":
                session.startTime = value;
                break;
              case "endTime":
                session.endTime = value;
                break;
              case "totalFocusTime":
              case "totalBreakTime":
                session[header] = parseInt(value, 10);
                break;
              case "focusPeriods":
              case "breakPeriods":
                try {
                  session[header] = JSON.parse(value);
                } catch (jsonError) {
                  console.error(`Error parsing JSON for ${header}:`, value, jsonError);
                  session[header] = []; // Default to empty array on error
                }
                break;
              default:
                // Handle any other potential fields, though not expected for this structure
                break;
            }
          });

          // Ensure all required fields are present and correctly typed
          if (
            session.id &&
            session.startTime &&
            session.endTime &&
            typeof session.totalFocusTime === "number" &&
            typeof session.totalBreakTime === "number" &&
            Array.isArray(session.focusPeriods) &&
            Array.isArray(session.breakPeriods)
          ) {
            importedSessions.push(session as Session);
          } else {
            console.warn("Skipping session due to missing or invalid data:", session);
          }
        }

        if (importedSessions.length > 0) {
          onImportSessions(importedSessions);
          alert(`Successfully imported ${importedSessions.length} sessions.`);
        } else {
          alert("No valid sessions found in the CSV file.");
        }
      } catch (error) {
        console.error("Error processing CSV file:", error);
        alert("Failed to import CSV. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };


  

  const formatPeriod = (period: FocusPeriod | BreakPeriod) => {
    const start = new Date(period.startTime).toLocaleTimeString();
    const end = new Date(period.endTime).toLocaleTimeString();
    return `${start} - ${end} (${formatTime(period.duration)})`;
  };

  // Group sessions by date
  const sessionsByDate: { [key: string]: Session[] } = sessions.reduce((acc, session) => {
    const date = new Date(session.startTime).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as { [key: string]: Session[] });

  // Sort dates in descending order
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const toggleVisualization = (date: string) => {
    setOpenVisualization(openVisualization === date ? null : date);
  };

  return (
    <div className="all-history-container">
      <h2>All Session History</h2>
      <div className="history-actions">
        <button onClick={exportToCsv}>Export to CSV</button>
        <input
          type="file"
          accept=".csv"
          onChange={importFromCsv}
          style={{ display: 'none' }}
          id="csvFileInput"
        />
        <label htmlFor="csvFileInput" className="button">
          Import from CSV
        </label>
      </div>
      {sessions.length === 0 ? (
        <p>No sessions recorded yet.</p>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="daily-history-section">
            <h3 onClick={() => toggleVisualization(date)}>
              {date} {openVisualization === date ? '▲' : '▼'} {/* Toggle indicator */}
            </h3>
            {
              (() => {
                const dailyTotalFocus = sessionsByDate[date].reduce((sum, session) => sum + session.totalFocusTime, 0);
                const dailyTotalBreak = sessionsByDate[date].reduce((sum, session) => sum + session.totalBreakTime, 0);
                return (
                  <div className="daily-summary">
                    <p>Daily Total Focus: {formatTime(dailyTotalFocus)}</p>
                    <p>Daily Total Break: {formatTime(dailyTotalBreak)}</p>
                  </div>
                );
              })()
            }
            {openVisualization === date && ( // Conditionally render visualization
              <DayVisualization sessions={sessionsByDate[date]} />
            )}
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
                {sessionsByDate[date].map((session) => (
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
          </div>
        ))
      )}
    </div>
  );
};

export default AllHistoryPage;
