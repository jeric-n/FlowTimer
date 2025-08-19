import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { Session, FocusPeriod, BreakPeriod } from '../types/Session';
import { formatTime } from '../utils/timeUtils';
import useMediaQuery from '@mui/material/useMediaQuery';

interface DayVisualizationProps {
  sessions: Session[];
}

const DayVisualization: React.FC<DayVisualizationProps> = ({ sessions }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    name: `${i}:00`,
    focus: 0,
    break: 0,
  }));

  sessions.forEach((session) => {
    const distribute = (period: FocusPeriod | BreakPeriod, type: 'focus' | 'break') => {
      const start = new Date(period.startTime);
      const end = new Date(period.endTime);
      let current = start;

      while (current < end) {
        const hour = current.getHours();
        const nextHour = new Date(current);
        nextHour.setHours(hour + 1, 0, 0, 0);

        const endOfPeriod = end < nextHour ? end : nextHour;
        const duration = (endOfPeriod.getTime() - current.getTime()) / 60000; // in minutes

        hourlyData[hour][type] += duration;
        current = nextHour;
      }
    };

    if (session.focusPeriods) {
      session.focusPeriods.forEach((p) => distribute(p, 'focus'));
    }
    if (session.breakPeriods) {
      session.breakPeriods.forEach((p) => distribute(p, 'break'));
    }
  });

  const chartData = hourlyData;

  const renderLegend = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Box sx={{ width: 16, height: 16, backgroundColor: theme.palette.primary.main, mr: 1 }} />
        <Typography variant="body2">Focus Time</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 16, height: 16, backgroundColor: theme.palette.secondary.main, mr: 1 }} />
        <Typography variant="body2">Break Time</Typography>
      </Box>
    </Box>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'black' }}>
          <Typography variant="body2" sx={{ color: 'black' }}>{`${label}`}</Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={`item-${index}`} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)} minutes`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Session Breakdown
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: isMobile ? 20 : 30, left: isMobile ? -10 : 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${Math.round(value)}m`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="focus" stackId="a" fill={theme.palette.primary.main} name="Focus Time" />
          <Bar dataKey="break" stackId="a" fill={theme.palette.secondary.main} name="Break Time" />
        </BarChart>
      </ResponsiveContainer>
      {renderLegend()}

      {isMobile ? (
        <Box sx={{ mt: 4 }}>
          {sessions.map((session, index) => (
            <Paper 
              key={session.id} 
              sx={{
                p: 2, 
                mb: 2, 
                '&:last-child': { mb: 0 },
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '10px',
              }}
            >
              <Typography variant="body1">
                <strong>Start:</strong> {new Date(session.startTime).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>End:</strong> {new Date(session.endTime).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Focus:</strong> {formatTime(session.totalFocusTime)}
              </Typography>
              <Typography variant="body1">
                <strong>Break:</strong> {formatTime(session.totalBreakTime)}
              </Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table sx={{ minWidth: 650 }} aria-label="session history table">
            <TableHead>
              <TableRow>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Total Focus</TableCell>
                <TableCell>Total Break</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session, index) => (
                <TableRow key={session.id}>
                  <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(session.endTime).toLocaleString()}</TableCell>
                  <TableCell>{formatTime(session.totalFocusTime)}</TableCell>
                  <TableCell>{formatTime(session.totalBreakTime)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default DayVisualization;