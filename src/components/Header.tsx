import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  Autocomplete,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HelpIcon from "@mui/icons-material/Help";
import { useParameters } from "../context/ParametersContext";
import { locationOptions, LocationOption } from "../utils/available-sites";
import { Link } from "react-router-dom";
import { config } from '../config/env';

type HeaderProps = {
  isSmallScreen?: boolean;
  toggleDrawer?: (
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
};

const Header: React.FC<HeaderProps> = ({ isSmallScreen, toggleDrawer }) => {
  const { setParameters } = useParameters();

  const [searchQuery, setSearchQuery] = useState("");
  const [predefinedOption, setPredefinedOption] =
    useState<LocationOption | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const appName = config.APP_NAME;
  const appVersion = config.APP_VERSION;
  const appDescription = config.APP_DESCRIPTION;
  const appOrg = config.APP_ORGANIZATION;

  //filter the location options to just 2FTS if the organisation is 2fts
  const filteredLocationOptions =
    appOrg === "2fts"
      ? locationOptions.filter((option) => option.group === "2FTS")
      : locationOptions;

  const handleSearch = () => {
    if (predefinedOption) {
      setParameters((prev) => ({
        ...prev,
        viewLocation: {
          lat: Number(predefinedOption.lat),
          lng: Number(predefinedOption.lng),
        },
        winchLocation: {
          lat: Number(predefinedOption.lat) - 0.0022,
          lng: Number(predefinedOption.lng) - 0.0045,
        },
        launchPoint: {
          lat: Number(predefinedOption.lat) + 0.0018,
          lng: Number(predefinedOption.lng) + 0.011,
        },
      }));

      setPredefinedOption(null);

      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery,
      )}&format=json`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          alert("Location not found. Please try a different address.");
          return;
        }
        const { lat, lon } = data[0];
        setParameters((prev) => ({
          ...prev,
          viewLocation: { lat: Number(lat), lng: Number(lon) },
          winchLocation: {
            lat: Number(lat) - 0.0022,
            lng: Number(lon) - 0.0045,
          },
          launchPoint: {
            lat: Number(lat) + 0.0018,
            lng: Number(lon) + 0.011,
          },
        }));
      })
      .catch(() => {
        alert("Error searching for location. Please try again.");
      });
  };

  const searchInput = (
    <Autocomplete
      sx={{ width: "100%" }}
      freeSolo
      options={filteredLocationOptions}
      groupBy={(option) => (typeof option === "string" ? "" : option.group)}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
      onChange={(_, newValue) => {
        if (newValue && typeof newValue !== "string") {
          setPredefinedOption(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Enter or select location"
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      )}
    />
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isSmallScreen && toggleDrawer && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Stack direction="row" alignItems="center" spacing={1}>
          {config.APP_ORGANIZATION === "2fts" ? (
            <Box
              component="img"
              src={`${config.BASE_URL}2fts-crest.png`}
              alt="2FTS Crest"
              sx={{ height: "80px", marginRight: "5px", py: 1 }}
            />
          ) : (
          <Box
            component="img"
            src={`${config.BASE_URL}logo.svg`}
            alt="Logo"
            sx={{ height: "40px", marginRight: "10px" }}
          />)}
          <Stack spacing={0} alignItems="flex-start">
            <Typography
              component={Link}
              to={`${config.BASE_URL}`}
              variant={isSmallScreen ? "subtitle1" : "h6"}
              sx={{
              textTransform: "uppercase",
              fontWeight: "bold",
              lineHeight: 1.1,
              textDecoration: "none",
              color: "inherit",
              '&:hover': {
                textDecoration: 'none',
                color: 'inherit',
              },
              }}>
              {appName}
            </Typography>
            <Typography
              variant="caption"
              sx={isSmallScreen ? { fontSize: "0.6rem" } : { lineHeight: 1.1 }}>
              {appDescription} v{appVersion}
            </Typography>
          </Stack>
        </Stack>
        {isSmallScreen ? (
          <>
            <IconButton
              color={showSearchBar ? "warning" : "inherit"}
              size="small"
              sx={{ ml: "auto" }}
              onClick={() => setShowSearchBar(!showSearchBar)}
              aria-label="toggle search"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              component={Link}
              to="help"
              size="small"
              color="inherit"
              sx={{ ml: 1 }}
              aria-label="help"
            >
              <HelpIcon />
            </IconButton>
          </>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ marginLeft: "auto" }}>
            <Stack sx={{ width: "400px" }}>{searchInput}</Stack>
            <Button
              variant="contained"
              color="warning"
              sx={{ ml: 1 }}
              onClick={handleSearch}>
              Go
            </Button>
            <Button
              component={Link}
              to="help"
              variant="contained"
              color="info"
              sx={{ ml: 2 }}>
              <HelpIcon />
            </Button>
          </Stack>
        )}
      </Toolbar>
      {isSmallScreen && showSearchBar && (
        <Stack direction="row" alignItems="center" sx={{ width: "100%", p: 1 }}>
          <Stack sx={{ width: "100%" }}>{searchInput}</Stack>
          <Button
            variant="contained"
            color="warning"
            sx={{ ml: 2 }}
            onClick={handleSearch}>
            Go
          </Button>
        </Stack>
      )}
    </AppBar>
  );
};

export default Header;
