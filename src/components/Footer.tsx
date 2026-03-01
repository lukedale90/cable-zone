import { Box, Typography, Container, Stack, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { config } from '../config/env';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = config.APP_VERSION || "N/A";

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "grey.100",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2,
        mt: "auto",
      }}>
      <Container sx={{ width: "100%", maxWidth: "100%!important" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Luke Dale.{" "}
            <Typography
              component="a"
              href="https://github.com/lukedale90/cable-zone/blob/main/LICENSE"
              target="_blank"
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}>
              MIT License
            </Typography>
            .
          </Typography>
          {config.APP_ORGANIZATION === "2fts" && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Adapted for 2FTS RAF
              </Typography>
              <Box
                component="img"
                src={`${config.BASE_URL}2fts-crest.png`}
                alt="2FTS Logo"
                sx={{
                  height: 24,
                  mr: 1,
                  opacity: 0.5,
                  filter: "grayscale(100%)",
                  WebkitFilter: "grayscale(100%)",
                }}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={`v${appVersion}`} size="small" variant="outlined" />
            <Typography
              component={Link}
              to={`${config.BASE_URL}help`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}>
              Help
            </Typography>
            <Typography
              component={Link}
              to={`${config.BASE_URL}changelog`}
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}>
              Changelog
            </Typography>
            <Typography
              component="a"
              href="https://github.com/lukedale90/cable-zone"
              target="_blank"
              variant="body2"
              color="primary"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}>
              Source
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
