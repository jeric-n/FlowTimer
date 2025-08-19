import React from 'react';
import { Box, Typography, Paper, Link, Container, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const FlowTimeTechniquePage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '20px',
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.text.primary, textAlign: 'center' }}>
          What is the FlowTime Technique?
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            The FlowTime Technique is a time management productivity technique by{' '}
            <Link href="https://medium.com/@UrgentPigeon/abandoning-pomodoros-part-one-the-pros-and-cons-of-pomos-e3f3e9342ac9" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
              Zoe Read-Bivens (Urgent Pigeon)
            </Link>{' '}
            that aims to address the pitfalls of the Pomodoro Technique while still focusing on tracking time, focusing on one task at a time, and taking breaks.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            Why?
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            There are some downsides to the Pomodoro Technique. You should be focusing within the 25 minute block or the time you have set, followed by a set break. This misses situations where you take unexpected interruptions, or when your focus simply fades. You may also lose your flow state when you get alerted for the break while in the middle of a task you are immersed in.The FlowTime Technique instead works WITH your flow state and removes the stress and guilt when you havent fully made use of a pomodoro session.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            How?
          </Typography>
          <List sx={{ color: theme.palette.text.disabled, listStyleType: 'decimal', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Decide on a specific task that has an end. One thing at a time." sx={{ wordBreak: 'break-word' }} />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Click Start Session. This will start the session and a focus timer. Start working on that task." sx={{ wordBreak: 'break-word' }} />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="When you get interrupted or when you start getting distracted, Click Start Break. This will start a break timer." sx={{ wordBreak: 'break-word' }} />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="When you are ready, click Resume Focus to start another focus timer." sx={{ wordBreak: 'break-word' }} />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="When the task is finished or if you feel done for the time being, click End Session." sx={{ wordBreak: 'break-word' }} />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled, mt: 2 }}>
            Your progress is recorded below the timer. View how productive you were for the day! Stats are tracked for each day and everything is saved locally on your device. Click on All History to see all your FlowTime sessions and details per day. You can download or load your FlowTimer data in here as well.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FlowTimeTechniquePage;