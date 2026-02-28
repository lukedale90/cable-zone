import React from "react";
import { AppBar as MuiAppBar, Toolbar, Typography, Stack, Box, Button, IconButton, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import DirectionsIcon from '@mui/icons-material/Directions';

const AppBar: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME;
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const appDescription = import.meta.env.VITE_APP_DESCRIPTION;
  const appOrg = import.meta.env.VITE_APP_ORGANIZATION;

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1}>
          {appOrg === "2fts" ? (
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}2fts-crest.png`}
              alt="2FTS Crest"
              sx={{ height: "80px", marginRight: "5px", py: 1 }}
            />
          ) : (
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Logo"
              sx={{ height: "40px", marginRight: "10px" }}
            />
          )}
          <Stack spacing={0} alignItems="flex-start">
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h6"}
              sx={{ textTransform: "uppercase", fontWeight: "bold", lineHeight: 1.1 }}>
              {appName}
            </Typography>
            <Typography
              variant="caption"
              sx={isSmallScreen ? { fontSize: "0.6rem" } : { lineHeight: 1.1 }}>
              {appDescription} v{appVersion}
            </Typography>
          </Stack>
        </Stack>
        {/* back to app button */}
        {isSmallScreen ? (
          <IconButton
            color="inherit"
            size="small"
            component={Link}
            to={import.meta.env.BASE_URL}
            sx={{ ml: "auto" }}>
            <DirectionsIcon />
          </IconButton>
        ) : (
          <Button color="warning" variant="contained" size="small" component={Link} to={import.meta.env.BASE_URL} sx={{ ml: "auto" }}>
            Back to App
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
