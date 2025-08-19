import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllHistoryPage from './pages/AllHistoryPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import FlowTimeTechniquePage from './pages/FlowTimeTechniquePage';
// 

import { SessionProvider, TimerProvider, useSession } from './context';
import { useSettings } from './hooks/useSettings';
import { Settings } from './types/Settings';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

import theme from './theme'; // Import our custom theme

function App() {
  const { settings, handleSettingsChange } = useSettings();
  

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'All History', path: '/history' },
    { name: 'What is the FlowTime Technique?', path: '/flowtime-technique' },
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: theme.palette.background.default, height: '100%' }}>
      <Typography variant="h6" sx={{ my: 2, color: theme.palette.text.primary }}>
        FlowTimer
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} sx={{ color: theme.palette.text.primary }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <SessionProvider>
          {/* useSession must be called inside SessionProvider to get handleSessionEnd */}
          <TimerWrapper settings={settings} handleSettingsChange={handleSettingsChange} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} navItems={navItems} drawer={drawer} />
        </SessionProvider>
      </Router>
    </ThemeProvider>
  );
}

// New component to wrap TimerProvider and handle routing
interface NavItem {
  name: string;
  path: string;
}

interface TimerWrapperProps {
  settings: Settings;
  handleSettingsChange: (newSettings: Settings) => void;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  navItems: NavItem[];
  drawer: React.ReactNode;
}

const TimerWrapper: React.FC<TimerWrapperProps> = ({ settings, handleSettingsChange, mobileOpen, handleDrawerToggle, navItems, drawer }) => {
  const { sessions, handleSessionEnd, handleImportSessions, dailyTotals } = useSession();

  return (
    <TimerProvider settings={settings} onSessionEnd={handleSessionEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.gradientEnd} 100%)` }}>
        <AppBar component="nav" position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: theme.palette.text.primary }}
            >
              FlowTimer
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <RouterLink key={item.name} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography component="span" sx={{ color: theme.palette.text.primary, mx: 1.5, '&:hover': { color: theme.palette.primary.light } }}>
                    {item.name}
                  </Typography>
                </RouterLink>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  sessions={sessions}
                  dailyTotals={dailyTotals}
                  currentDate={new Date().toISOString().split('T')[0]}
                  settings={settings}
                />
              }
            />
            <Route path="/history" element={<AllHistoryPage sessions={sessions} onImportSessions={handleImportSessions} />} />
            <Route path="/settings" element={<SettingsPage settings={settings} onSettingsChange={handleSettingsChange} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/flowtime-technique" element={<FlowTimeTechniquePage />} />
          </Routes>
        </Box>
      </Box>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </TimerProvider>
  );
};

export default App;