import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Drawer,
  useMediaQuery,
  Button,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import Map from "./components/Map";
import "./App.css";
import type { MouseEvent, KeyboardEvent } from "react";
import { ParametersProvider } from "./context/ParametersProvider";
import SettingsPanel from "./components/SettingsPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LandingPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
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

  const handleClose = () => setIsModalOpen(false);

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
              <Button
                onClick={toggleDrawer(false)}
                variant="outlined"
                sx={{ mt: "auto", mb: 2, mx: 2 }}>
                Close
              </Button>
            </Drawer>
          )}
          <div style={{ flex: 1 }}>
            <Map />
          </div>
        </div>
                  <Footer />

      </div>
      <Modal
        open={isModalOpen}
        //onClose={handleClose}
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id="welcome-modal-title" variant="h6" component="h2">
            Strop-Drop User Acceptance
          </Typography>
          <Typography id="welcome-modal-description" sx={{ mt: 2 }}>
            This application is provided for informational and visualisation
            purposes only. While we strive to ensure the accuracy of the data
            and calculations, we make no guarantees regarding their correctness,
            completeness, or reliability. This application is not intended to
            replace professional judgment or advice. Users are solely
            responsible for the data they input and any decisions made based on
            the results.
          </Typography>
          <Typography id="welcome-modal-description-cont" sx={{ mt: 2 }}>
            This application uses cookies and session storage to save
            configuration and scenario data. Nothing more.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            sx={{ mt: 2 }}>
            Accept
          </Button>
        </Box>
      </Modal>
    </ParametersProvider>
  );
}

export default LandingPage;
