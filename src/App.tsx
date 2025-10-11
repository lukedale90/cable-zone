import { useState } from "react";
import { Drawer, useMediaQuery, Button } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import Map from "./components/Map";
import "./App.css";
import type { MouseEvent, KeyboardEvent } from "react";
import { ParametersProvider } from "./context/ParametersProvider";
import SettingsPanel from "./components/SettingsPanel";
import Header from "./components/Header";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  // Use Material-UI's useMediaQuery to detect screen size
  const isSmallScreen = useMediaQuery("(max-width: 1024px)"); // iPad landscape width is 1024px

  const toggleDrawer =
    (open: boolean) => (event: MouseEvent | KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <ParametersProvider>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
        }}>
        <CssBaseline />
        <Header isSmallScreen={isSmallScreen} toggleDrawer={toggleDrawer} />
        <div style={{ flex: 1, display: "flex", maxHeight: "100vh" }}>
          {!isSmallScreen && (
            <div
              style={{
                width: "500px",
                borderRight: "1px solid #ccc",
                backgroundColor: "#ffffff",
                height: "100%", // Ensure it fits the viewport
                overflowY: "auto", // Make content scrollable if it overflows
              }}>
              <SettingsPanel />
            </div>
          )}
          {isSmallScreen && (
            <Drawer
              anchor="left"
              open={drawerOpen}
              sx={{
                "& .MuiDrawer-paper": { maxWidth: "90vw", width: "100%" },
              }} // Set max width
              onClose={toggleDrawer(false)}>
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
