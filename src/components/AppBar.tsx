import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Stack,
  Box,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import DirectionsIcon from "@mui/icons-material/Directions";
import { config } from '../config/env';
import AppLogo from "./AppLogo";


const AppBar: React.FC = () => {
  const appOrg = config.APP_ORGANIZATION;

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <MuiAppBar position="sticky" sx={{ backgroundColor: (theme) => theme.palette.grey[900], boxShadow: 1 }}>
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1}>
          {appOrg === "2fts" && (
            <Box
              component="img"
              src={`${config.BASE_URL}2fts-crest.png`}
              alt="2FTS Crest"
              sx={{ height: "2.75em", marginRight: "5px"}}
            />
          )}
          <Stack spacing={0} alignItems="flex-start">
            <AppLogo />
          </Stack>
        </Stack>
        {/* back to app button */}
        {isSmallScreen ? (
          <IconButton
            color="inherit"
            size="small"
            component={Link}
            to={config.BASE_URL}
            sx={{ ml: "auto" }}>
            <DirectionsIcon />
          </IconButton>
        ) : (
          <Button
            color="warning"
            variant="contained"
            size="small"
            component={Link}
            to={config.BASE_URL}
            sx={{ ml: "auto" }}>
            Back
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
