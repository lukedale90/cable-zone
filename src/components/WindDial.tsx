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
        stroke="#00000067"
        strokeWidth={strokeWidth}
      />
      <line
        x1={centerX}
        y1={height * 0.125}
        x2={centerX}
        y2={height * 0.875}
        stroke="#ffffff65"
        strokeDasharray="4"
        strokeWidth={innerStrokeWidth}
      />
    </svg>
  );
};

const WindDial: React.FC<WindDialProps> = ({ direction, color, size = 40 }) => {
  const height = size * 2; // Maintain 1:2 aspect ratio
  const centerX = size / 2;
  const strokeWidth = size / 13;
  const arrowSize = size / 7;

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
        beginAtZero: false,
        min: -0.05,
        max: 1.15,
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
          "linear-gradient(180deg, #4496d9ff 0%, #50b7eeff 45%, #a2ddf9ff 100%)",
        borderRadius: "6px 6px 0 0",
        borderBottom: "6px solid rgba(50, 100, 6, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "-10%",
          width: "18px",
          height: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "10px",
          zIndex: 1,
          boxShadow: `
            10px 1px 0px -1px rgba(255, 255, 255, 0.3),
            6px -4px 0px -1px rgba(255, 255, 255, 0.3)
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          right: "5%",
          width: "15px",
          height: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "10px",
          zIndex: 1,
          boxShadow: `
            10px 1px 0px -1px rgba(255, 255, 255, 0.3),
            6px -4px 0px -1px rgba(255, 255, 255, 0.3)
          `,
        }}
      />
      <div style={{ width: "100%", height: "100%", zIndex: 2, position: "relative" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const CompassRose: React.FC<{ size?: number, isSmallScreen?: boolean }> = ({ size = 40, isSmallScreen }) => {
  const SCALE_FACTOR = 2.2; // Adjust this single value to make compass bigger/smaller
  
  const height = size * 2; // Maintain 1:2 aspect ratio - SAME as other dials
  const centerX = size / 2;
  const centerY = height / 2; // Center vertically in the same space as other dials
  const radius = (size * 0.4) * SCALE_FACTOR; // Base radius scaled by factor
  
  // Generate tick marks and labels for compass
  const majorTicks = [];
  const minorTicks = [];
  const labels = [];
  
  for (let i = 0; i < 360; i += 30) {
    const angle = (i - 90) * (Math.PI / 180); // Rotate so 0° is at top
    const outerRadius = radius * 0.95; // Extend ticks closer to edge
    const innerRadius = radius * 0.7; // Longer tick marks
    const labelRadius = radius * 1.15; // Move labels closer to center for readability
    
    const x1 = centerX + Math.cos(angle) * innerRadius;
    const y1 = centerY + Math.sin(angle) * innerRadius;
    const x2 = centerX + Math.cos(angle) * outerRadius;
    const y2 = centerY + Math.sin(angle) * outerRadius;
    
    majorTicks.push(
      <line
        key={`major-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="1.2"
      />
    );
    
    // Add labels for cardinal directions
    const labelX = centerX + Math.cos(angle) * labelRadius;
    const labelY = centerY + Math.sin(angle) * labelRadius;
    
    if (i % 90 === 0) {
      const label = i === 0 ? 'N' : i === 90 ? 'E' : i === 180 ? 'S' : 'W';
      labels.push(
        <text
          key={`label-${i}`}
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size / 5}
          fill="rgba(0, 0, 0, 0.46)"
          fontWeight="bold"
        >
          {label}
        </text>
      );
    }
  }
  
  // Minor tick marks every 10 degrees
  for (let i = 0; i < 360; i += 10) {
    if (i % 30 !== 0) { // Skip major tick positions
      const angle = (i - 90) * (Math.PI / 180);
      const outerRadius = radius * 0.95; // Match major tick outer radius
      const innerRadius = radius * 0.85; // Longer minor ticks
      
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;
      
      minorTicks.push(
        <line
          key={`minor-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(0, 0, 0, 0.25)"
          strokeWidth="0.5"
        />
      );
    }
  }
  
  return (
    <svg
      width={size}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      {/* Outer compass ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.98} 
        fill="rgba(255, 255, 255, 0)"
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="1.5"
      />
    
      
      {/* Tick marks */}
      {isSmallScreen ? null : (
        <>
          {minorTicks}
          {majorTicks}
        </>
      )}

      {/* Labels */}
      {labels}
      
      {/* Center dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r="20"
        fill="rgba(0, 0, 0, 0.12)"
      />
    </svg>
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
          {/* Compass Rose - Behind everything */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 0,
            }}>
            <CompassRose size={isSmallScreen ? 30 : 40} isSmallScreen={isSmallScreen} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 1,
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
              zIndex: 2,
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
              zIndex: 3,
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
