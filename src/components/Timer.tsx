import React from 'react';
import { useTimerContext } from '../context';
import { formatTime } from '../utils/timeUtils';

import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '../hooks/useSettings';

const Timer: React.FC = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const {
    timerStatus,
    focusTime,
    breakTime,
    totalFocusTime,
    totalBreakTime,
    startSession,
    startBreak,
    resumeFocus,
    endSession,
  } = useTimerContext();
  
  const renderTimerDisplay = () => {
    if (timerStatus === 'FOCUS') {
      return formatTime(focusTime);
    } else if (timerStatus === 'BREAK') {
      return formatTime(breakTime);
    }
    return formatTime(0); // When stopped, display 00:00:00
  };

  return (
    <Paper elevation={3} sx={{
      p: 4,
      textAlign: 'center',
      width: '100%',
      maxWidth: 550,
      backgroundColor: theme.palette.background.paper,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      borderRadius: '20px',
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.text.primary }}>
        FlowTimer
      </Typography>
      <Typography
        variant="h2"
        component="div"
        sx={{
          fontSize: '5em',
          marginBottom: '25px',
          fontWeight: 700,
          color: theme.palette.text.primary,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          [theme.breakpoints.down('md')]: {
            fontSize: '4em',
          },
          [theme.breakpoints.down('sm')]: {
            fontSize: '3em',
          },
        }}
      >
        {renderTimerDisplay()}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 3 }}
      >
        {timerStatus === 'STOPPED' && (
          <Button variant="contained" onClick={startSession}>
            Start Session
          </Button>
        )}
        {timerStatus === 'FOCUS' && (
          <>
            <Button variant="contained" onClick={startBreak}>
              Start Break
            </Button>
            <Button variant="contained" onClick={endSession}>
              End Session
            </Button>
          </>
        )}
        {timerStatus === 'BREAK' && (
          <>
            <Button variant="contained" onClick={resumeFocus}>
              Resume Focus
            </Button>
            <Button variant="contained" onClick={endSession}>
              End Session
            </Button>
          </>
        )}
      </Stack>

      <Box sx={{ mt: 4, textAlign: 'left', borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary }}>
          Live Stats (Current Session)
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>
          Total Focus Time: {formatTime(totalFocusTime)}
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>
          Total Break Time: {formatTime(totalBreakTime)}
        </Typography>
        {settings.breakPreset !== 'default' && (
          <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>
            Remaining Break Time: {formatTime(breakTime)}
          </Typography>
        )}
        {timerStatus === 'FOCUS' && (
          <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>
            Current Focus Period: {formatTime(focusTime)}
          </Typography>
        )}
        {timerStatus === 'BREAK' && (
          <Typography variant="body1" sx={{ color: theme.palette.text.disabled }}>
            Current Break Period: {formatTime(breakTime)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default Timer;