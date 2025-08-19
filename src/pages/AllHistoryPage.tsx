import React, { useState } from 'react';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import DayVisualization from '../components/DayVisualization';
import { formatTime } from '../utils/timeUtils';

import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

interface AllHistoryPageProps {
  sessions: Session[];
  onImportSessions: (newSessions: Session[]) => void;
}

const AllHistoryPage: React.FC<AllHistoryPageProps> = ({ sessions, onImportSessions }) => {
  const theme = useTheme();
  const [openVisualization, setOpenVisualization] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen size

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
      "focusPeriods",
      "breakPeriods",
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

        const headers = lines[0].split(",").map(header => header.trim().replace(/^"|"$/g, ''));
        const importedSessions: Session[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].match(/(?:"(?:(?="")|[^"])*"|[^,])+/g);
          if (!values || values.length !== headers.length) {
            console.warn(`Skipping malformed row: ${lines[i]}`);
            continue;
          }

          const session: Partial<Session> = {};
          headers.forEach((header, index) => {
            let value = values[index].trim();
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
                  session[header] = [];
                }
                break;
              default:
                break;
            }
          });

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

  const sessionsByDate: { [key: string]: Session[] } = sessions.reduce((acc, session) => {
    const date = new Date(session.startTime).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as { [key: string]: Session[] });

  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleAccordionChange = (date: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setOpenVisualization(isExpanded ? date : null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        p: 3,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '20px',
      }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
          All Session History
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={exportToCsv}>Export to CSV</Button>
          <input
            type="file"
            accept=".csv"
            onChange={importFromCsv}
            style={{ display: 'none' }}
            id="csvFileInput"
          />
          <label htmlFor="csvFileInput">
            <Button variant="contained" component="span">
              Import from CSV
            </Button>
          </label>
        </Box>

        {sessions.length === 0 ? (
          <Typography variant="body1" sx={{ color: theme.palette.text.disabled, textAlign: 'center' }}>No sessions recorded yet.</Typography>
        ) : (
          <Box> {/* Add this Box to wrap the mapped Accordions */}
            {sortedDates.map(date => (
              <Accordion
                key={date}
                expanded={openVisualization === date}
                onChange={handleAccordionChange(date)}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  mb: 2,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />} 
                  aria-controls={`${date}-content`}
                  id={`${date}-header`}
                >
                  <Typography variant="h6" sx={{ color: theme.palette.custom.dailyHistoryHeader, fontWeight: 600 }}>
                    {date}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  {(() => {
                    const dailyTotalFocus = sessionsByDate[date].reduce((sum, session) => sum + session.totalFocusTime, 0);
                    const dailyTotalBreak = sessionsByDate[date].reduce((sum, session) => sum + session.totalBreakTime, 0);
                    return (
                      <Box sx={{ mb: 2, color: theme.palette.text.primary }}>
                        <Typography variant="body1">Daily Total Focus: {formatTime(dailyTotalFocus)}</Typography>
                        <Typography variant="body1">Daily Total Break: {formatTime(dailyTotalBreak)}</Typography>
                      </Box>
                    );
                  })()}
                  {openVisualization === date && (
                    <Box sx={{ mb: 2 }}>
                      <DayVisualization sessions={sessionsByDate[date]} />
                    </Box>
                  )}
                  {isMobile ? ( // Conditional rendering for mobile
                    <Box>
                      {sessionsByDate[date].map((session) => (
                        <Paper elevation={1} key={session.id} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.background.default, borderRadius: '10px' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            Start Time: {new Date(session.startTime).toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            End Time: {new Date(session.endTime).toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            Total Focus: {formatTime(session.totalFocusTime)}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                            Total Break: {formatTime(session.totalBreakTime)}
                          </Typography>

                          {session.focusPeriods.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="body2" component="strong" sx={{ color: theme.palette.text.primary }}>Focus Periods:</Typography>
                              <List dense>
                                {session.focusPeriods.map((period, idx) => (
                                  <ListItem key={idx} disablePadding>
                                    <ListItemText primary={formatPeriod(period)} sx={{ color: theme.palette.text.disabled }} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                          {session.breakPeriods.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="body2" component="strong" sx={{ color: theme.palette.text.primary }}>Break Periods:</Typography>
                              <List dense>
                                {session.breakPeriods.map((period, idx) => (
                                  <ListItem key={idx} disablePadding>
                                    <ListItemText primary={formatPeriod(period)} sx={{ color: theme.palette.text.disabled }} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  ) : ( // Original table for non-mobile
                    <TableContainer component={Paper} sx={{
                      backgroundColor: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      borderRadius: '10px',
                      overflowX: 'auto',
                    }}>
                      <Table aria-label={`sessions for ${date}`}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ display: 'none' }}>ID</TableCell>
                            <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Start Time</TableCell>
                            <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>End Time</TableCell>
                            <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Total Focus</TableCell>
                            <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Total Break</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sessionsByDate[date].map((session) => (
                            <React.Fragment key={session.id}>
                              <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.custom.tableRowEvenBg } }}>
                                <TableCell sx={{ display: 'none' }}>{session.id}</TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}>{new Date(session.startTime).toLocaleString()}</TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}>{new Date(session.endTime).toLocaleString()}</TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}>{formatTime(session.totalFocusTime)}</TableCell>
                                <TableCell sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}>{formatTime(session.totalBreakTime)}</TableCell>
                              </TableRow>
                              {session.focusPeriods.length > 0 && (
                                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.custom.tableRowEvenBg } }}>
                                  <TableCell colSpan={5} sx={{ color: theme.palette.text.primary }}>
                                    <Typography variant="body2" component="strong">Focus Periods:</Typography>
                                    <List dense>
                                      {session.focusPeriods.map((period, idx) => (
                                        <ListItem key={idx} disablePadding>
                                          <ListItemText primary={formatPeriod(period)} sx={{ color: theme.palette.text.disabled }} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </TableCell>
                                </TableRow>
                              )}
                              {session.breakPeriods.length > 0 && (
                                <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: theme.palette.custom.tableRowEvenBg } }}>
                                  <TableCell colSpan={5} sx={{ color: theme.palette.text.primary }}>
                                    <Typography variant="body2" component="strong">Break Periods:</Typography>
                                    <List dense>
                                      {session.breakPeriods.map((period, idx) => (
                                        <ListItem key={idx} disablePadding>
                                          <ListItemText primary={formatPeriod(period)} sx={{ color: theme.palette.text.disabled }} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AllHistoryPage;
