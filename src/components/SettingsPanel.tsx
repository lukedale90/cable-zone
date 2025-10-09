import React from "react";
import { useParameters } from "../context/ParametersContext";
import { Slider, Typography, Stack, Chip } from "@mui/material";

const SettingsPanel = () => {
  const { parameters, setParameters } = useParameters();

  const handleChange = (key: string, value: string | number | object) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Stack spacing={3} p={2}>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center">
        <Typography gutterBottom>Surface Wind Speed</Typography>
        <Chip label={`${parameters.surfaceWind.speed} kts`} color="primary" />
      </Stack>
      <Slider
        value={parameters.surfaceWind.speed}
        onChange={(_, value) =>
          handleChange("surfaceWind", {
            ...parameters.surfaceWind,
            speed: value as number,
          })
        }
        min={0}
        max={50}
        valueLabelDisplay="auto"
      />
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center">
        <Typography gutterBottom>Surface Wind Direction</Typography>
        <Chip label={`${parameters.surfaceWind.direction}°`} color="primary" />
      </Stack>
      <Slider
        value={parameters.surfaceWind.direction}
        onChange={(_, value) =>
          handleChange("surfaceWind", {
            ...parameters.surfaceWind,
            direction: value as number,
          })
        }
        min={5}
        max={360}
        step={5}
        valueLabelDisplay="auto"
      />
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center">
        <Typography gutterBottom>2k ft Wind Speed</Typography>
        <Chip
          label={`${parameters.twoThousandFtWind.speed} kts`}
          color="primary"
        />
      </Stack>
      <Slider
        value={parameters.twoThousandFtWind.speed}
        onChange={(_, value) =>
          handleChange("twoThousandFtWind", {
            ...parameters.twoThousandFtWind,
            speed: value as number,
          })
        }
        min={0}
        max={50}
        valueLabelDisplay="auto"
      />
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center">
        <Typography gutterBottom>2k ft Wind Direction</Typography>
        <Chip
          label={`${parameters.twoThousandFtWind.direction
            .toString()
            .padStart(3, "0")}°`}
          color="primary"
        />
      </Stack>
      <Slider
        value={parameters.twoThousandFtWind.direction}
        onChange={(_, value) =>
          handleChange("twoThousandFtWind", {
            ...parameters.twoThousandFtWind,
            direction: value as number,
          })
        }
        min={5}
        max={360}
        step={5}
        valueLabelDisplay="auto"
      />
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems="center">
        <Typography gutterBottom>Release Height</Typography>
        <Chip label={`${parameters.releaseHeight} ft`} color="primary" />
      </Stack>
      <Slider
        value={parameters.releaseHeight}
        onChange={(_, value) => handleChange("releaseHeight", value as number)}
        min={100}
        step={100}
        max={3000}
        valueLabelDisplay="auto"
      />
    </Stack>
  );
};

export default SettingsPanel;
