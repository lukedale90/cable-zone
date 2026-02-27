import { ReactNode } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const PageLayout = ({ title, subtitle, children, maxWidth = "md" }: PageLayoutProps) => {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ "& > *": { mb: 3 } }}>
          {children}
        </Box>
      </Paper>
    </Container>
  );
};

export default PageLayout;
