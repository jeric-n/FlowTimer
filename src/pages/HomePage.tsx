import React from 'react';
import Timer from '../components/Timer';
import SessionHistory from '../components/SessionHistory';
import DayVisualization from '../components/DayVisualization';

import { Session } from '../types/Session';
import { Settings } from '../types/Settings';

import { Container, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface HomePageProps {
  sessions: Session[];
  dailyTotals: {[date: string]: {totalFocus: number, totalBreak: number}};
  currentDate: string; // YYYY-MM-DD format
  settings: Settings;
}

const HomePage: React.FC<HomePageProps> = ({
  sessions,
  dailyTotals,
  currentDate,
  settings,
}) => {
  const theme = useTheme();
  
  
  const todayTotals = dailyTotals[currentDate] || { totalFocus: 0, totalBreak: 0 };
  

  // Filter sessions for the current day
  const today = new Date();
  const currentDaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate.getDate() === today.getDate() &&
           sessionDate.getMonth() === today.getMonth() &&
           sessionDate.getFullYear() === today.getFullYear();
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      <Timer />

      <Paper elevation={3} sx={{
        p: 3,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '20px',
      }}>
        <DayVisualization sessions={currentDaySessions} />
      </Paper>

      <Paper elevation={3} sx={{
        p: 3,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '20px',
      }}>
        <SessionHistory sessions={currentDaySessions} todayTotals={todayTotals} />
      </Paper>
    </Container>
  );
};

export default HomePage;