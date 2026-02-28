import { Chip, Stack, Tooltip } from "@mui/material";
import React from "react";
import { useParameters } from "../context/ParametersContext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// interface WindDialContainerProps {
//   surfaceWind: {
//     speed: number;
//     direction: number;
//   };
//   twoThousandFtWind: {
//     speed: number;
//     direction: number;
//   };
// }

interface WindDialProps {
  direction: number;
  color: string;
}

interface RWYDialProps {
  direction: number;
}

const RWYDial: React.FC<RWYDialProps> = ({ direction }) => {
  //A grey rectangle with a white center line
  return (
    <div>
      <svg
        width="40"
        height="80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${direction}deg)` }}>
        <line
          x1="20"
          y1="8"
          x2="20"
          y2="72"
          stroke="#00000050"
          strokeWidth="8"
        />
        <line
          x1="20"
          y1="10"
          x2="20"
          y2="70"
          stroke="#ffffff65"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

const WindDial: React.FC<WindDialProps> = ({ direction, color }) => {
  return (
    <div>
      <svg
        width="40"
        height="80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${direction}deg)` }}>
        <line x1="20" y1="8" x2="20" y2="72" stroke={color} strokeWidth="3" />
        <polygon points="20,76 16,66 24,66" fill={color} />
      </svg>
    </div>
  );
};

const CrossWindDial: React.FC<{ crossWind: number }> = ({ crossWind }) => {
  //if a positive crosswind, arrow points right, if negative points left
  const direction = crossWind >= 0 ? 270 : 90;
  const color = "white";
  const speed = Math.abs(crossWind);

  return (
    <Tooltip title="Surface Crosswind Component">
      <Chip
        label={`${speed} kt`}
        variant="filled"
        color="success"
        icon={
          <ArrowUpwardIcon
            style={{
              transform: `rotate(${direction}deg)`,
              color: color,
            }}
          />
        }
      />
    </Tooltip>
  );
};

const WindDialContainer: React.FC = () => {
  const { parameters } = useParameters();

  const surfaceWind = parameters.surfaceWind;
  const twoThousandFtWind = parameters.twoThousandFtWind;
  const crossWindComponent = parameters.crossWindComponent;
  const surfaceDirection = surfaceWind.direction;
  const surfaceSpeed = surfaceWind.speed;
  const twoKDirection = twoThousandFtWind.direction;
  const twoKSpeed = twoThousandFtWind.speed;

  //surface direction as three digit string e.g 005, 045, 180
  const surfaceDirectionStr = surfaceDirection.toString().padStart(3, "0");
  const twoKDirectionStr = twoKDirection.toString().padStart(3, "0");

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        minWidth: "100px",
        zIndex: 1000,
        backgroundColor: "#ffffff94",
        padding: "5px",
        borderRadius: "20px",
        alignItems: "center",
      }}>
      <div style={{ position: "relative", padding: "5px", height: "100px" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
          }}>
          <RWYDial direction={parameters.RWYHeading} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
          }}>
          <WindDial direction={surfaceDirection} color="blue" />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
          }}>
          <WindDial direction={twoKDirection} color="red" />
        </div>
      </div>
      <Stack spacing={1}>
        <CrossWindDial crossWind={crossWindComponent} />
        <Tooltip title="Surface Wind">
          <Chip
            label={`${surfaceDirectionStr}° ${surfaceSpeed}kts`}
            variant="filled"
            color="primary"
          />
        </Tooltip>
        <Tooltip title="2000ft Wind">
          <Chip
            label={`${twoKDirectionStr}° ${twoKSpeed}kts`}
            variant="filled"
            color="error"
          />
        </Tooltip>
        <Tooltip title="Launch Height">
          <Chip
            label={`${parameters.releaseHeight} ft`}
            variant="filled"
            color="default"
            icon={<FlightTakeoffIcon />}
          />
        </Tooltip>
      </Stack>
    </div>
  );
};

export default WindDialContainer;
