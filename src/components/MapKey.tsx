import { Chip, Stack, Typography } from "@mui/material";
import React from "react";

const MapKeyContainer: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        minWidth: "100px",
        zIndex: 1000,
        backgroundColor: "#ffffff94",
        padding: "5px",
        borderRadius: "20px",
        alignItems: "center",
      }}>
      <Stack spacing={1}>
        <Typography variant="caption" align="center">
          Map Key:
        </Typography>
        <Chip
          label="Potential Strop Impact Area"
          variant="filled"
          color="error"
        />
        <Chip label="Area of Drift" variant="filled" color="warning" />
      </Stack>
    </div>
  );
};

export default MapKeyContainer;
