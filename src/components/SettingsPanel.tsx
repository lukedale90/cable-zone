import { useParameters } from "../context/ParametersContext";
import {
  Slider,
  Typography,
  Stack,
  Chip,
  AccordionDetails,
  Button,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AirIcon from "@mui/icons-material/Air";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";

import { calculateTerminalVelocity } from "../utils/calculate-strop-drift";
import LaunchProfileControl from "./LaunchProfileControl";
import SavedScenarios from "./savedScenarios";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  [`&.Mui-expanded`]: {
    backgroundColor: theme.palette.grey[300],
  },
}));

const SettingsPanel = () => {
  const { parameters, setParameters, resetStropParameters } = useParameters();

  const appOrg = import.meta.env.VITE_APP_ORGANIZATION;

  const handleChange = (key: string, value: string | number | object) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const terminalVelocity = calculateTerminalVelocity(
    parameters.stropWeight,
    parameters.stropDiameter,
    parameters.stropLength,
  );

  return (
    <Stack>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SignalCellularAltIcon sx={{ opacity: 0.5 }} />
            <Typography>Launch Profile</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="caption">Expected Full Launch Height</Typography>
              {parameters.releaseHeight > parameters.theroreticalMaxHeight ? (
                <Tooltip
                  title={`Warning: The release height exceeds the theoretical maximum of ${parameters.theroreticalMaxHeight}ft based on the cable length and headwind component.`}>
                  <Chip
                    label={`${parameters.releaseHeight} ft`}
                    color="error"
                    icon={<WarningIcon fontSize="small" />}
                  />
                </Tooltip>
              ) : (
                <Chip
                  label={`${parameters.releaseHeight} ft`}
                  color="primary"
                />
              )}
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
              min={1}
              max={50}
              step={1}
              valueLabelDisplay="auto"
            />
            <LaunchProfileControl
              activeWind={parameters.surfaceWind.speed}
              maxHeight={parameters.releaseHeight}
              maxCableLength={parameters.cableLength}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AirIcon sx={{ opacity: 0.5 }} />
            <Typography>Wind Controls</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Stack spacing={3} direction="row" justifyContent="space-between">
              <Stack justifyContent="space-around" alignItems="center">
                <Typography variant="caption">Surface Wind</Typography>
                <Chip
                  label={`${parameters.surfaceWind.direction
                    .toString()
                    .padStart(3, "0")}° ${parameters.surfaceWind.speed} kts`}
                  color="primary"
                />
              </Stack>
              <Stack flexGrow={1}>
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
                  valueLabelFormat={(value) => `${value}°`}
                />
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
                  valueLabelFormat={(value) => `${value} kts`}
                />
              </Stack>
            </Stack>
            <Stack spacing={3} direction="row" justifyContent="space-between">
              <Stack justifyContent="space-around" alignItems="center">
                <Typography variant="caption">2000ft Wind</Typography>
                <Chip
                  label={`${parameters.twoThousandFtWind.direction
                    .toString()
                    .padStart(3, "0")}° ${
                    parameters.twoThousandFtWind.speed
                  } kts`}
                  color="error"
                />
              </Stack>
              <Stack flexGrow={1}>
                <Slider
                  color="error"
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
                  valueLabelFormat={(value) => `${value}°`}
                />
                <Slider
                  color="error"
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
                  valueLabelFormat={(value) => `${value} kts`}
                />
              </Stack>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
      {appOrg !== "2fts" && (
        <>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SwapCallsIcon sx={{ opacity: 0.5 }} />
                <Typography>Strop Controls</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
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
                  <Chip
                    label={`${parameters.stropWeight} kg`}
                    color="primary"
                  />
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
                  <Typography variant="caption">
                    Est. Terminal Velocity
                  </Typography>
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
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SecurityIcon sx={{ opacity: 0.5 }} />
                <Typography>Safety Margins</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Typography variant="caption">Safety Buffer</Typography>
                  <Chip
                    label={`${parameters.safetyBuffer.toFixed(0)} %`}
                    color="primary"
                  />
                </Stack>
                <Slider
                  value={parameters.safetyBuffer}
                  onChange={(_, value) =>
                    handleChange("safetyBuffer", value as number)
                  }
                  min={1}
                  step={1}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
        </>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SaveIcon sx={{ opacity: 0.5 }} />
            <Typography>Saved Scenarios</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <SavedScenarios />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default SettingsPanel;
