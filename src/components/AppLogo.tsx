import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { config } from "../config/env";
import { Link } from "react-router-dom";

export default function AppLogo() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component={Link}
      to={config.BASE_URL}
      sx={{ textDecoration: "none", color: "inherit", "&:hover": { color: (theme) => theme.palette.grey[400] } }}>
      <Stack direction="row" alignItems="center">
        <Typography
          variant={isSmallScreen ? "subtitle1" : "h6"}
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            lineHeight: 1.1,
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              textDecoration: "none",
              color: "inherit",
            },
          }}>
          STROP
        </Typography>
        <Box
          component="img"
          src={`${config.BASE_URL}weaklink-icon.svg`}
          alt="Logo"
          sx={{ height: "2em", mx: 0.25 }}
        />
        <Typography
          variant={isSmallScreen ? "subtitle1" : "h6"}
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            lineHeight: 1.1,
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              textDecoration: "none",
              color: "inherit",
            },
          }}>
          DROP
        </Typography>
      </Stack>
    </Box>
  );
}
