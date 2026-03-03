import { useEffect, useState } from "react";
import { generateDynamicLaunchProfile } from "../utils/launch-profile";
import Slider from "@mui/material/Slider";
import { Alert, Button, Chip, Stack, Typography } from "@mui/material";
import { useParameters } from "../context/ParametersContext";
import { config } from '../config/env';

const LaunchProfileControl = ({
  activeWind,
  twoKWind,
  maxHeight,
  maxCableLength,
}: {
  activeWind: number;
  twoKWind: number;
  maxHeight: number;
  maxCableLength: number;
}) => {
  const [customProfileData, setCustomProfileData] = useState<number[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { parameters, setParameters } = useParameters();

  const appOrganization = config.APP_ORGANIZATION;

  const dynamicProfile = generateDynamicLaunchProfile(
      activeWind,
      twoKWind
    );

  const holding = {
    title: `Dynamic (${activeWind} kt surface, ${twoKWind} kt at 2000ft)`,
    data: dynamicProfile,
  }
  

  const handleSliderChange = (dataIndex: number, value: number) => {
    const dataArray = [];
    for (let i = 0; i < 10; i++) {
      let setValue;
      if (customProfileData[i] !== undefined) {
        setValue = customProfileData[i];
      } else {
        setValue = holding.data[i];
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
  }, [customProfileData, setParameters, editMode]);

  const closestProfile =
    parameters.customLaunchProfile &&
    parameters.customLaunchProfile.length === 10
      ? {
          wind: "custom",
          title: "Custom Profile",
          data: parameters.customLaunchProfile,
        }
      : holding;

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", marginTop: 16 }}>
      <Stack spacing={2} alignItems="center">
        <Chip label={`Profile: ${closestProfile.title}`} color="primary" />
        <Stack direction="row" spacing={0} alignItems="center">
          {closestProfile.data.map((value, dataIndex) => (
            <Stack
              key={dataIndex}
              className="slider-container"
              alignItems={"center"}
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
                sx={{ mt: 1 }}
                label={`${(maxCableLength * ((dataIndex + 1) / 10)).toFixed(
                  0,
                )}`}
              />
            </Stack>
          ))}
        </Stack>
        <Stack>
          <Typography variant="caption">Distance (m)</Typography>
        </Stack>
        {appOrganization !== "2fts" && (
          <>
            {editMode && (
              <Alert severity="info">
                Adjust the sliders to customise the launch profile. The profile
                will override the dynamic calculation when in edit mode.
              </Alert>
            )}
            <Button
              sx={{ width: "100%" }}
              variant={editMode ? "contained" : "outlined"}
              color={editMode ? "primary" : "error"}
              onClick={handleEditModeToggle}>
              {editMode ? "Dynamic Profile" : "Custom Override?"}
            </Button>
          </>
        )}
      </Stack>
    </div>
  );
};

export default LaunchProfileControl;
