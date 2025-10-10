import { Chip, Stack, Typography } from "@mui/material";
import React from "react";

interface WindDialContainerProps {
  surfaceWind: {
    speed: number;
    direction: number;
  };
  twoThousandFtWind: {
    speed: number;
    direction: number;
  };
}

interface WindDialProps {
  direction: number;
  color: string;
}

const WindDial: React.FC<WindDialProps> = ({ direction, color }) => {
  return (
    <div>
    <svg
      width="40"
      height="80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${direction}deg)` }}>
      <line x1="20" y1="8" x2="20" y2="72" stroke={color} strokeWidth="4" />
      <polygon
        points="20,76 16,66 24,66"
        fill={color}
      />
    </svg>
    </div>
  );
};

const WindDialContainer: React.FC<WindDialContainerProps> = ({
  surfaceWind,
  twoThousandFtWind,
}) => {

    const surfaceDirection = surfaceWind.direction;
    const surfaceSpeed = surfaceWind.speed;
    const twoKDirection = twoThousandFtWind.direction;
    const twoKSpeed = twoThousandFtWind.speed;

    //surface direction as three digit string e.g 005, 045, 180
    const surfaceDirectionStr = surfaceDirection.toString().padStart(3, '0');
    const twoKDirectionStr = twoKDirection.toString().padStart(3, '0');

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        backgroundColor: "#ffffff94",
        padding: "5px",
        borderRadius: "20px",
        alignItems: "center",
      }}>
      <div style={{ position: "relative", padding: "5px", height: "120px" }}>
        <Typography variant="subtitle1" align="center">Wind</Typography>
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center" }}>
          <WindDial
            direction={surfaceDirection}
            color="blue"
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center" }}>
          <WindDial
            direction={twoKDirection}
            color="red"
          />
        </div>
      </div>
      <Stack spacing={1}>
        <Chip label={`${surfaceDirectionStr}/${surfaceSpeed}`} variant="outlined" color="primary"/>
        <Chip label={`${twoKDirectionStr}/${twoKSpeed}`} variant="outlined" color="error"/>
      </Stack>
    </div>
  );
};

export default WindDialContainer;
