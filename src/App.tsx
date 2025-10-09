import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, useMediaQuery, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import Map from './components/Map';
import './App.css';
import type { MouseEvent, KeyboardEvent } from 'react';
import { ParametersProvider } from './context/ParametersProvider';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use Material-UI's useMediaQuery to detect screen size
  const isSmallScreen = useMediaQuery('(max-width: 1024px)'); // iPad landscape width is 1024px

  const toggleDrawer = (open: boolean) => (event: MouseEvent | KeyboardEvent) => {
    if (event.type === 'keydown' && ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <ParametersProvider>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            {isSmallScreen && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6">Strop Drop Zone Visualizer</Typography>
          </Toolbar>
        </AppBar>
        <div style={{ flex: 1, display: 'flex' }}>
          {!isSmallScreen && (
            <div style={{ width: '300px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
              <SettingsPanel />
            </div>
          )}
          {isSmallScreen && (
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <SettingsPanel />
              <Button onClick={toggleDrawer(false)}>Close</Button>
            </Drawer>
          )}
          <div style={{ flex: 1 }}>
            <Map />
          </div>
        </div>
      </div>
    </ParametersProvider>
  );
}

export default App;
