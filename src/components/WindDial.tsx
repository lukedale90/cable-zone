import { Chip, Stack, Tooltip, useMediaQuery } from "@mui/material";
import React from "react";
import { useParameters } from "../context/ParametersContext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { config } from "../config/env";
import { generateDynamicLaunchProfile } from "../utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend,
);
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
  size?: number; // Optional size prop, defaults to 40
}

interface RWYDialProps {
  direction: number;
  size?: number; // Optional size prop, defaults to 40
}

const RWYDial: React.FC<RWYDialProps> = ({ direction, size = 40 }) => {
  const height = size * 2; // Maintain 1:2 aspect ratio
  const centerX = size / 2;
  const strokeWidth = size / 5;
  const innerStrokeWidth = 1;

  return (
    <svg
      width={size}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${direction}deg)` }}>
      <line
        x1={centerX}
        y1={height * 0.1}
        x2={centerX}
        y2={height * 0.9}
        stroke="#00000050"
        strokeWidth={strokeWidth}
      />
      <line
        x1={centerX}
        y1={height * 0.125}
        x2={centerX}
        y2={height * 0.875}
        stroke="#ffffff65"
        strokeWidth={innerStrokeWidth}
      />
    </svg>
  );
};

const WindDial: React.FC<WindDialProps> = ({ direction, color, size = 40 }) => {
  const height = size * 2; // Maintain 1:2 aspect ratio
  const centerX = size / 2;
  const strokeWidth = size / 13;
  const arrowSize = size / 10;

  return (
    <svg
      width={size}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${direction}deg)` }}>
      <line
        x1={centerX}
        y1={height * 0.1}
        x2={centerX}
        y2={height * 0.9}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <polygon
        points={`${centerX},${height * 0.95} ${centerX - arrowSize},${height * 0.825} ${centerX + arrowSize},${height * 0.825}`}
        fill={color}
      />
    </svg>
  );
};

const CrossWindDial: React.FC<{
  crossWind: number;
}> = ({ crossWind }) => {
  //if a positive crosswind, arrow points right, if negative points left
  const direction = crossWind >= 0 ? 270 : 90;
  const color = "white";
  const speed = Math.abs(crossWind);
  const limit = config.CROSSWIND_LIMIT;

  return (
    <Tooltip title="Surface Crosswind Component">
      <Chip
        label={`${speed} kt`}
        variant="filled"
        color={speed > limit ? "warning" : "success"}
        sx={{ flexGrow: 1 }}
        size="small"
        icon={
          speed > 0 ? (
            <ArrowUpwardIcon
              style={{
                transform: `rotate(${direction}deg)`,
                color: color,
              }}
            />
          ) : undefined
        }
      />
    </Tooltip>
  );
};

const LaunchProfileMiniChart: React.FC<{
  profileData: number[];
  width?: number;
  height?: number;
}> = ({ profileData, width = 80, height = 60 }) => {
  const chartData = {
    labels: [
      "0%",
      "10%",
      "20%",
      "30%",
      "40%",
      "50%",
      "60%",
      "70%",
      "80%",
      "90%",
      "100%",
    ],
    datasets: [
      {
        data: [0, ...profileData],
        borderColor: "#e73cd3ff",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        beginAtZero: true,
        max: 1,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderCapStyle: "round" as const,
      },
    },
  };

  return (
    <div
      style={{
        width: width,
        height: height,
        // sky-like vertical gradient
        backgroundImage:
          "linear-gradient(180deg, #61b9e2ff 0%, #81d4fa 45%, #e1f5fe 100%)",
        borderRadius: "6px 6px 0 0",
        borderBottom: "6px solid rgba(50, 100, 6, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}>
      <div style={{ width: "100%", height: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
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

  const generateProfileData = generateDynamicLaunchProfile(
    surfaceSpeed,
    twoKSpeed,
  );

  const dynamicProfileData =
    parameters.customLaunchProfile &&
    parameters.customLaunchProfile.length === 10
      ? parameters.customLaunchProfile
      : generateProfileData;

  const isSmallScreen = useMediaQuery("(max-width: 768px)"); // iPad landscape width is 1024px

  return (
    <div
      style={{
        position: "absolute",
        top: isSmallScreen ? "unset" : "10px",
        bottom: isSmallScreen ? "60px" : "unset",
        right: isSmallScreen ? "unset" : "10px",
        left: isSmallScreen ? "10px" : "unset",
        width: isSmallScreen ? "calc(100% - 20px)" : "auto",
        zIndex: 1000,
        backgroundColor: "#ffffff94",
        borderRadius: "8px",
        padding: 10,
      }}>
      <Stack
        direction={isSmallScreen ? "row" : "column"}
        spacing={0}
        alignItems="center"
        justifyContent={isSmallScreen ? "space-between" : "center"}>
        <div
          style={{
            position: "relative",
            padding: "0px",
            height: isSmallScreen ? "60px" : "90px",
            width: isSmallScreen ? "150px" : "100%",
            // minWidth: isSmallScreen ? "100%" : "auto"
          }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
            }}>
            <RWYDial
              direction={parameters.RWYHeading}
              size={isSmallScreen ? 30 : 40}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
            }}>
            <WindDial
              direction={surfaceDirection}
              color="blue"
              size={isSmallScreen ? 30 : 40}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
            }}>
            <WindDial
              direction={twoKDirection}
              color="red"
              size={isSmallScreen ? 30 : 40}
            />
          </div>
        </div>
        {/* Launch Profile Mini Chart */}
        <Tooltip title="Launch Profile (S-Curve)">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: isSmallScreen ? "0" : "16px",
              marginRight: isSmallScreen ? "16px" : "0",
            }}>
            <LaunchProfileMiniChart
              profileData={dynamicProfileData}
              width={isSmallScreen ? 70 : 80}
              height={isSmallScreen ? 45 : 50}
            />
          </div>
        </Tooltip>
        <Stack
          spacing={1}
          direction={isSmallScreen ? "row" : "column"}
          flexWrap={isSmallScreen ? "wrap" : "nowrap"}
          sx={{
            maxWidth: isSmallScreen ? "calc(100% - 140px)" : "auto",
            gap: isSmallScreen ? 1 : 0,
          }}>
          <Tooltip title="Surface Wind">
            <Chip
              label={`${surfaceDirectionStr}° ${surfaceSpeed}kts`}
              variant="filled"
              color="primary"
              sx={{ flexGrow: 1 }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="2000ft Wind">
            <Chip
              label={`${twoKDirectionStr}° ${twoKSpeed}kts`}
              variant="filled"
              color="error"
              sx={{ flexGrow: 1 }}
              size="small"
            />
          </Tooltip>
          <CrossWindDial crossWind={crossWindComponent} />
          <Tooltip title="Launch Height">
            <Chip
              label={`${parameters.releaseHeight} ft`}
              variant="filled"
              color="default"
              sx={{ flexGrow: 1 }}
              size="small"
              icon={<FlightTakeoffIcon />}
            />
          </Tooltip>
        </Stack>
      </Stack>
    </div>
  );
};

export default WindDialContainer;
