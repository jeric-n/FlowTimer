import React from 'react';
import { Box, Typography, Paper, Link, Container, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AboutPage: React.FC = () => {
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
          About
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            Website made by{' '}
            <Link href="https://www.linkedin.com/in/jeric-nufable-102539313/" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
              Jeric Nufable
            </Link>.
            Project repo here on{' '}
            <Link href="https://github.com/jeric-n/FlowTimer" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
              GitHub
            </Link>
            .
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            SFX Credits
          </Typography>
          <List dense sx={{ color: theme.palette.text.disabled }}>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://pixabay.com/users/olivia_parker-49036721/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=309545" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  Olivia Parker
                </Link>{' '}
                from{' '}
                <Link href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=309545" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  Pixabay
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://pixabay.com/users/stu9-50616646/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=356836" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  P F
                </Link>{' '}
                from{' '}
                <Link href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=356836" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  Pixabay
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://pixabay.com/users/dragon-studio-38165424/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=372479" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  DRAGON-STUDIO
                </Link>{' '}
                from{' '}
                <Link href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=372479" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  Pixabay
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            FlowTime Technique sources and additional reading:
          </Typography>
          <List dense sx={{ color: theme.palette.text.disabled }}>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://medium.com/@UrgentPigeon/abandoning-pomodoros-part-one-the-pros-and-cons-of-pomos-e3f3e9342ac9" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://medium.com/@UrgentPigeon/abandoning-pomodoros-part-one-the-pros-and-cons-of-pomos-e3f3e9342ac9
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://medium.com/@UrgentPigeon/the-flowtime-technique-7685101bd191" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://medium.com/@UrgentPigeon/the-flowtime-technique-7685101bd191
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://medium.com/@UrgentPigeon/flowtime-troubleshooting-if-you-find-yourself-not-taking-breaks-d33da913c7dd" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://medium.com/@UrgentPigeon/flowtime-troubleshooting-if-you-find-yourself-not-taking-breaks-d33da913c7dd
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://medium.com/@UrgentPigeon/the-flowtime-technique-cheat-sheet-30168b2e31d9" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://medium.com/@UrgentPigeon/the-flowtime-technique-cheat-sheet-30168b2e31d9
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://zapier.com/blog/flowtime-technique/#flowtime-technique" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://zapier.com/blog/flowtime-technique/#flowtime-technique
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://www.usemotion.com/blog/flowtime-technique" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://www.usemotion.com/blog/flowtime-technique
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://lifehacker.com/work/flowtime-time-management-technique" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://lifehacker.com/work/flowtime-time-management-technique
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://flowmo.io/blog/flowtime-technique" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://flowmo.io/blog/flowtime-technique
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText sx={{ wordBreak: 'break-word' }}>
                <Link href="https://www.reddit.com/r/productivity/comments/1l3ungu/comment/mw3t1l9/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" target="_blank" rel="noopener noreferrer" sx={{ color: theme.palette.info.main }}>
                  https://www.reddit.com/r/productivity/comments/1l3ungu/comment/mw3t1l9/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
