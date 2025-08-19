import React from 'react';
import { Settings } from '../types/Settings';
import { BreakPreset } from '../constants';

import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSettingsChange }) => {
  const theme = useTheme();

  const handlePresetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreset = event.target.value as BreakPreset;
    onSettingsChange({ ...settings, breakPreset: newPreset });
  };

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
          Settings
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            Break Timer Presets
          </Typography>
          <RadioGroup
            aria-label="break-preset"
            name="break-preset-radio-buttons-group"
            value={settings.breakPreset}
            onChange={handlePresetChange}
          >
            <FormControlLabel
              value={BreakPreset.DEFAULT}
              control={<Radio sx={{ color: theme.palette.primary.main }} />}
              label={
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  <strong>Default:</strong> Unlimited break time.
                </Typography>
              }
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              value={BreakPreset.PRESET2}
              control={<Radio sx={{ color: theme.palette.primary.main }} />}
              label={
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  <strong>Preset 2:</strong> Minimum 1 minute, or Focus Time / 5.
                </Typography>
              }
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              value={BreakPreset.PRESET3}
              control={<Radio sx={{ color: theme.palette.primary.main }} />}
              label={
                <Box>
                  <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                    <strong>Preset 3:</strong>
                  </Typography>
                  <List dense sx={{ ml: 2, color: theme.palette.text.disabled }}>
                    <ListItem disablePadding>
                      <ListItemText primary="5-minute break for less than 25 minutes of focus." />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="8-minute break for 25-50 minutes of focus." />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="10-minute break for 50-90 minutes of focus." />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText primary="15-minute break for more than 90 minutes of focus." />
                    </ListItem>
                  </List>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }} // Align label to top for multi-line content
            />
          </RadioGroup>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.text.secondary, borderBottom: '2px solid rgba(255, 255, 255, 0.1)', pb: 1.5, mb: 2.5 }}>
            Explainer
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            By default, the user decides how long their break should last. However, other presets are provided.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            Preset 2 is based on flowmo.io's implementation, where the break times are your last focus time divided by 5. But for FlowTimer, a 1 minute break minimum has been added. So if the user gets distracted often, a 1 minute minimum is enough to get back into a better mind state.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: theme.palette.text.disabled }}>
            Preset 3 is based on some loose guidelines by the creator of the FlowTime Technique. <br />"Right now I’m going with 5 minutes for around less than 25 minutes of work time, 8 for around 25–50, 10 for around 50–90 and 15 for more than that. The break times I suggest aren’t rules. If you need 10 minutes of break time after 40 minutes of work that’s fine, refreshed work is orders of magnitude better work than fatigued work."
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;