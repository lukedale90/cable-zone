import { useParameters } from "../context/ParametersContext";
import {
  Slider,
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { calculateTerminalVelocity } from "../utils/calculate-strop-drift";
import LaunchProfileGraph from "./LaunchProfileGraph";

const SettingsPanel = () => {
  const { parameters, setParameters, resetStropParameters } = useParameters();

  const handleChange = (key: string, value: string | number | object) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const terminalVelocity = calculateTerminalVelocity(
    parameters.stropWeight,
    parameters.stropDiameter,
    parameters.stropLength
  );

  return (
    <Stack>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Wind Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Surface Wind Speed</Typography>
              <Chip
                label={`${parameters.surfaceWind.speed} kts`}
                color="primary"
              />
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
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Surface Wind Direction</Typography>
              <Chip
                label={`${parameters.surfaceWind.direction}°`}
                color="primary"
              />
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
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">2,000ft Wind Speed</Typography>
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
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">2,000ft Wind Direction</Typography>
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
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Release Height</Typography>
              <Chip label={`${parameters.releaseHeight} ft`} color="primary" />
            </Stack>
            <Slider
              value={parameters.releaseHeight}
              onChange={(_, value) =>
                handleChange("releaseHeight", value as number)
              }
              min={100}
              max={3000}
              step={100}
              valueLabelDisplay="auto"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Strop Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Strop Length</Typography>
              <Chip label={`${parameters.stropLength} m`} color="primary" />
            </Stack>
            <Slider
              value={parameters.stropLength}
              onChange={(_, value) =>
                handleChange("stropLength", value as number)
              }
              min={1}
              step={1}
              max={10}
              valueLabelDisplay="auto"
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Strop Diameter</Typography>
              <Chip
                label={`${(parameters.stropDiameter * 100).toFixed(0)} cm`}
                color="primary"
              />
            </Stack>
            <Slider
              value={parameters.stropDiameter * 100}
              onChange={(_, value) =>
                handleChange("stropDiameter", (value as number) / 100)
              }
              min={1}
              step={1}
              max={10}
              valueLabelDisplay="auto"
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Strop Weight</Typography>
              <Chip label={`${parameters.stropWeight} kg`} color="primary" />
            </Stack>
            <Slider
              value={parameters.stropWeight}
              onChange={(_, value) =>
                handleChange("stropWeight", value as number)
              }
              min={1}
              step={0.5}
              max={5}
              valueLabelDisplay="auto"
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Est. Terminal Velocity</Typography>
              <Chip
                label={`${terminalVelocity.toFixed(2)} m/s`}
                color="primary"
              />
            </Stack>
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetStropParameters}>
              Default SkyLaunch Strop
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
        Launch Profile
      </Typography>
      <Stack sx={{ p: 3 }}>
        <LaunchProfileGraph
          activeWind={parameters.surfaceWind.speed}
          maxHeight={parameters.releaseHeight}
          maxCableLength={parameters.cableLength}
        />
      </Stack>
    </Stack>
  );
};

export default SettingsPanel;
