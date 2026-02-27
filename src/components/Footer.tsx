import { Box, Typography, Container, Stack, Chip } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = import.meta.env.VITE_APP_VERSION || "N/A";
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "grey.100",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2,
        mt: "auto"
      }}
    >
      <Container sx={{width: "100%", maxWidth: "100%!important"}}>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          justifyContent="space-between" 
          alignItems="center" 
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Luke Dale. Licensed under{" "}
            <Typography 
              component="a" 
              href="https://github.com/lukedale90/cable-zone/blob/main/LICENSE"
              target="_blank"
              variant="body2" 
              color="primary"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              MIT License
            </Typography>.
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label={`v${appVersion}`} 
              size="small" 
              variant="outlined" 
            />
            <Typography 
              component={Link} 
              to="help" 
              variant="body2" 
              color="primary"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Help
            </Typography>
            <Typography 
              component={Link} 
              to="changelog" 
              variant="body2" 
              color="primary"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Changelog
            </Typography>
            <Typography 
              component="a" 
              href="https://github.com/lukedale90/cable-zone"
              target="_blank"
              variant="body2" 
              color="primary"
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Source
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
