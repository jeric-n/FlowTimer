import React from 'react';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import { formatTime } from '../utils/timeUtils';

import {
  Box,
  Typography,
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
  useMediaQuery // Import useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SessionHistoryProps {
  sessions: Session[];
  todayTotals: {totalFocus: number, totalBreak: number};
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, todayTotals }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen

  const formatPeriod = (period: FocusPeriod | BreakPeriod) => {
    const start = new Date(period.startTime).toLocaleTimeString();
    const end = new Date(period.endTime).toLocaleTimeString();
    return `${start} - ${end} (${formatTime(period.duration)})`;
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Today's FlowTime Sessions
      </Typography>
      <Box sx={{ mb: 3, color: theme.palette.text.secondary }}>
        <Typography variant="body1">Day's Total Focus: {formatTime(todayTotals.totalFocus)}</Typography>
        <Typography variant="body1">Day's Total Break: {formatTime(todayTotals.totalBreak)}</Typography>
      </Box>
      {sessions.length === 0 ? (
        <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>No sessions recorded yet.</Typography>
      ) : (
        isMobile ? ( // Mobile View: Card Layout
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sessions.map((session) => (
              <Paper key={session.id} elevation={2} sx={{
                p: 2,
                backgroundColor: theme.palette.background.default,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                textAlign: 'left', // Align text to the left for better readability
              }}>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Start Time:"
                      secondary={new Date(session.startTime).toLocaleString()}
                      primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="End Time:"
                      secondary={new Date(session.endTime).toLocaleString()}
                      primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Total Focus:"
                      secondary={formatTime(session.totalFocusTime)}
                      primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Total Break:"
                      secondary={formatTime(session.totalBreakTime)}
                      primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                    />
                  </ListItem>
                </List>

                {session.focusPeriods.length > 0 && (
                  <Box sx={{ mt: 1 }}>
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
                  <Box sx={{ mt: 1 }}>
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
        ) : ( // Desktop View: Table Layout
          <TableContainer component={Paper} sx={{
            backgroundColor: theme.palette.background.paper,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            overflowX: 'auto',
          }}>
            <Table sx={{ minWidth: 650 }} aria-label="session history table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ display: 'none' }}>ID</TableCell> {/* Hidden ID column */}
                  <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Start Time</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>End Time</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Total Focus</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.custom.tableHeaderBg, fontWeight: 600, wordBreak: 'break-word' }}>Total Break</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session, index) => (
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
        ))
      }
    </Box>
  );
};

export default SessionHistory;