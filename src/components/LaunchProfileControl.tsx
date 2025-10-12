import { useEffect, useState } from "react";
import { launchProfile } from "../utils/launch-profile";
import Slider from "@mui/material/Slider";
import { Alert, Button, Chip, Stack, Typography } from "@mui/material";
import { useParameters } from "../context/ParametersContext";

const LaunchProfileControl = ({
  activeWind,
  maxHeight,
  maxCableLength,
}: {
  activeWind: number;
  maxHeight: number;
  maxCableLength: number;
}) => {
  const [customProfileData, setCustomProfileData] = useState<number[]>([]);
  const [profileKey, setProfileKey] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { parameters, setParameters } = useParameters();

  const handleSliderChange = (dataIndex: number, value: number) => {
    const dataArray = [];
    for (let i = 0; i < 10; i++) {
      let setValue;
      if (customProfileData[i] !== undefined) {
        setValue = customProfileData[i];
      } else {
        setValue = launchProfile[profileKey].data[i];
      }

      if (i === dataIndex) {
        setValue = value;
      }

      dataArray.push(setValue);
    }

    setCustomProfileData(dataArray);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      setCustomProfileData([]);
    }
  };

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      customLaunchProfile: customProfileData,
    }));
  }, [customProfileData, setParameters]);

  useEffect(() => {
    // Update profileKey when activeWind changes
    let closestKey = 0;
    for (let i = 1; i < launchProfile.length; i++) {
      if (
        Math.abs(launchProfile[i].wind - activeWind) <
        Math.abs(launchProfile[closestKey].wind - activeWind)
      ) {
        closestKey = i;
      }
    }
    setProfileKey(closestKey);
  }, [activeWind, setParameters]);

  const closestProfile =
    parameters.customLaunchProfile &&
    parameters.customLaunchProfile.length === 10
      ? { wind: "custom", title: "Custom Profile", data: parameters.customLaunchProfile }
      : launchProfile[profileKey];

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto" }}>
      <Stack spacing={2} alignItems="center">
        <Alert severity="info">
          Adjust the sliders to customise the launch profile. The profile will
          override preset profiles when in edit mode.
        </Alert>
        <Typography variant="subtitle1">
          Closest Profile:{" "}
          {closestProfile.title}
        </Typography>
        <Stack direction="row" spacing={0} alignItems="center">
          {closestProfile.data.map((value, dataIndex) => (
            <Stack
              key={dataIndex}
              className="slider-container"
              style={{ height: "400px" }}>
              <Slider
                orientation="vertical"
                disabled={!editMode}
                min={0}
                max={1}
                step={0.01}
                value={value}
                onChange={(_, newValue) =>
                  handleSliderChange(dataIndex, newValue as number)
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(value) =>
                  `${(maxHeight * value).toFixed(0)}ft`
                } // Format value as feet
              />
              <Chip
                size="small"
                label={`${(maxCableLength * ((dataIndex + 1) / 10)).toFixed(
                  0
                )}`}
              />
            </Stack>
          ))}
        </Stack>
        <Stack>
          <Typography variant="caption">Distance (m)</Typography>
        </Stack>
        <Button
          sx={{ width: "100%" }}
          variant={editMode ? "contained" : "outlined"}
          onClick={handleEditModeToggle}>
          {editMode ? "Use Presets?" : "Custom Override?"}
        </Button>
      </Stack>
    </div>
  );
};

export default LaunchProfileControl;
