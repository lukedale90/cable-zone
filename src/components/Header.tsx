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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useParameters } from "../context/ParametersContext";
import { locationOptions, LocationOption } from "../utils/available-sites";

type HeaderProps = {
  isSmallScreen: boolean;
  toggleDrawer: (
    open: boolean
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
};

const Header: React.FC<HeaderProps> = ({ isSmallScreen, toggleDrawer }) => {
  const { setParameters } = useParameters();

  const [searchQuery, setSearchQuery] = useState("");
  const [predefinedOption, setPredefinedOption] =
    useState<LocationOption | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

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
        searchQuery
      )}&format=json`
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
      options={locationOptions}
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
        {isSmallScreen && (
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
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Stack spacing={0} alignItems="flex-start">
            <Typography variant={isSmallScreen ? "subtitle1" : "h6"}>
              Strop-Drop
            </Typography>
            <Typography
              variant="caption"
              sx={isSmallScreen ? { fontSize: "0.6rem" } : {}}>
              The Drop-Zone Visualiser - V1.0
            </Typography>
          </Stack>
        </Stack>
        {isSmallScreen ? (
          <Button
            variant="contained"
            color="warning"
            sx={{ ml: "auto" }}
            onClick={() => setShowSearchBar(!showSearchBar)}>
            <SearchIcon />
          </Button>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            sx={{ marginLeft: "auto" }}>
            <Stack sx={{ width: "400px" }}>{searchInput}</Stack>
            <Button
              variant="contained"
              color="warning"
              sx={{ ml: 2 }}
              onClick={handleSearch}>
              Go
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
