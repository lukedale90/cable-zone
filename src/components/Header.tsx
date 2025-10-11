import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useParameters } from "../context/ParametersContext";

type HeaderProps = {
  isSmallScreen: boolean;
  toggleDrawer: (
    open: boolean
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
};

const Header: React.FC<HeaderProps> = ({ isSmallScreen, toggleDrawer }) => {
  const { setParameters } = useParameters();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = () => {
    // Implement geocoding API call here to convert address to lat/lng
    // For example, using OpenCage Geocoding API or Nominatim
    // Update the viewLocation in parameters context with the new lat/lng

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        setParameters((prev) => ({
          ...prev,
          viewLocation: { lat: Number(lat), lng: Number(lon) },
        }));
      });
  };

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
            <TextField
              variant="outlined"
              size="small"
              placeholder="Enter location"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
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
          <TextField
            variant="outlined"
            size="small"
            placeholder="Enter location"
            sx={{ backgroundColor: "white", borderRadius: 1, width: "100%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
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
