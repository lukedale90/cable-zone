import PageLayout from "../components/PageLayout";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Divider,
  Box,
  Table,
  Stack,
  Slider,
  Paper,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  calculateStropHeights,
  calculateWindGradient,
  generateDynamicLaunchProfile,
} from "../utils";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { config } from "../config/env";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const HelpPage = () => {
  const [surfaceWind, setSurfaceWind] = useState<{
    speed: number;
    direction: number;
  }>({ speed: 10, direction: 270 });
  const [twoKWind, setTwoKWind] = useState<{
    speed: number;
    direction: number;
  }>({ speed: 20, direction: 290 });
  const [launchHeight, setLaunchHeight] = useState<number>(2000);

  const stropHeights = calculateStropHeights(
    1000,
    launchHeight,
    surfaceWind.speed,
    [],
    twoKWind.speed,
  );

  const dynamicProfile = generateDynamicLaunchProfile(
    surfaceWind.speed,
    twoKWind.speed,
  );

  const windGradient = calculateWindGradient(
    surfaceWind.speed,
    twoKWind.speed,
    surfaceWind.direction,
    twoKWind.direction,
    launchHeight,
  );

  const windData: {
    height: number;
    windSpeed: number;
    windDirection: number;
    launchHeight: number;
  }[] = [];

  stropHeights.forEach((data) => {
    const closestWindData = windGradient.reduce((prev, curr) => {
      return Math.abs(curr.height - data.height) <
        Math.abs(prev.height - data.height)
        ? curr
        : prev;
    });

    windData.push({ ...closestWindData, launchHeight: data.height });
  });

  //remove first element
  windData.shift();

  // Create chart data for launch profiles
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
        label: "Dynamic profile",
        data: [0, ...dynamicProfile.map((val) => Math.round(val * launchHeight))],
        borderColor: "#ff7f0e",
        backgroundColor: "#ff7f0e20",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Launch Profile by Wind Condition",
        font: { size: 16 },
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          title: (context: TooltipItem<"line">[]) => {
            return `Launch Progress: ${context[0].label}`;
          },
          label: (context: TooltipItem<"line">) => {
            return `${context.dataset.label}: ${context.parsed.y} ft`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Launch Progress (%)",
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Height (ft)",
        },
        beginAtZero: true,
        max: launchHeight,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <PageLayout title="Help Guide">
      <Accordion defaultExpanded sx={{ bgcolor: "rgba(0, 0, 0, 0.03)" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" fontWeight={600}>
            What does this app do?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "flex-start",
            }}>
            <Box sx={{ flex: 2 }}>
              <Typography>
                The Strop Drop Visualiser was created to assist users in
                calculating the likely impact areas for a cable strop when a
                weak link fails during winch launch operations. By inputting
                various parameters such as launch height, wind conditions and
                strop characteristics, users can visualise potential drop zones
                on an interactive map. This tool is designed to enhance safety
                and planning for glider pilots and ground crews by providing a
                clear visual representation of strop drop scenarios.
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Box
                component="img"
                src={`${config.BASE_URL}glider-strop.jpeg`}
                alt="Strop Example"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 3,
                }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ bgcolor: "rgba(0, 0, 0, 0.03)" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" fontWeight={600}>
            Getting Started
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography>
              Drag the winch and launch point to adjust their positions. Input
              your expected full height for the launch along with surface and
              2000ft wind conditions to see the likely strop drop zone. Adjust
              the parameters to see how different conditions affect the drop.
            </Typography>
            {/* videos */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ width: "100%" }}>
              <Box
                component="video"
                src={`${config.BASE_URL}launch.webm`}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controls={false}
                sx={{
                  width: { xs: "100%", lg: "50%" },
                  height: "auto",
                  borderRadius: 3,
                }}
              />
              <Stack>
                <Box
                  component="video"
                  src={`${config.BASE_URL}wind.webm`}
                  controls={false}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  sx={{
                    width: "100%",
                    height: "auto",
                  }}
                />
                <Box
                  component="video"
                  src={`${config.BASE_URL}map.webm`}
                  controls={false}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  sx={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ bgcolor: "rgba(0, 0, 0, 0.03)" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" fontWeight={600}>
            How does it work?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography>
              The Strop Drop Visualiser uses simplistic physics to simulate the
              likely behavior of a strop drop. By accounting for variables such
              as wind speed, direction and height, the app can predict the
              likely trajectory and landing zone of the dropped strop.
            </Typography>
            <Typography>
              Based on strop drop data from 2FTS and the RAFGSA it was
              determined that an average strop falls at approximately 20m/s.
              This value is used as a baseline for simulations, but actual drop
              speeds may vary based on specific conditions and the orientations
              in which the strop freefalls.
            </Typography>
            <Typography>
              By default a 25% safety margin is applied to all drop calculations
              to account for variability in real-world conditions. This is
              represented by the red 'impact area' on the map.
            </Typography>
            <Typography>
              The app works by calculating the intermediate wind speed and
              direction at each 10% interval of the launch profile. Knowing the
              height of the strop at that particular point we can then calculate
              the time it would take to reach the ground at 20m/s. This time is
              then used to determine the horizontal drift caused by the wind at
              that height, which is then applied to the strop drop trajectory to
              determine the likely landing zone.
            </Typography>

            {/* Interactive Controls */}
            <Divider />

            <Grid container spacing={2}>
              {/* Launch Profile Chart */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={1} sx={{ height: 400, width: "100%", mb: 2 }}>
                  <Line data={chartData} options={chartOptions} />
                </Paper>
                <Paper elevation={1} sx={{ width: "100%" }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Adjust Parameters:
                    </Typography>
                    <Slider
                      value={launchHeight}
                      onChange={(_, newValue) => setLaunchHeight(newValue)}
                      aria-labelledby="launch-height-slider"
                      valueLabelDisplay="auto"
                      color="success"
                      step={100}
                      min={500}
                      max={3000}
                      valueLabelFormat={(value) =>
                        `Launch Height - ${value} ft`
                      }
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                      <Slider
                        value={surfaceWind.speed}
                        onChange={(_, newValue) =>
                          setSurfaceWind({ ...surfaceWind, speed: newValue })
                        }
                        aria-labelledby="surface-wind-speed-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={50}
                        valueLabelFormat={(value) =>
                          `Surface Wind - ${value} kts`
                        }
                      />
                      <Slider
                        value={surfaceWind.direction}
                        onChange={(_, newValue) =>
                          setSurfaceWind({
                            ...surfaceWind,
                            direction: newValue,
                          })
                        }
                        aria-labelledby="surface-wind-direction-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        min={0}
                        max={360}
                        valueLabelFormat={(value) => `Surface Wind - ${value}°`}
                      />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                      <Slider
                        value={twoKWind.speed}
                        onChange={(_, newValue) =>
                          setTwoKWind({ ...twoKWind, speed: newValue })
                        }
                        aria-labelledby="2000ft-wind-speed-slider"
                        valueLabelDisplay="auto"
                        color="error"
                        step={1}
                        min={0}
                        max={50}
                        valueLabelFormat={(value) =>
                          `2000ft Wind - ${value} kts`
                        }
                      />
                      <Slider
                        value={twoKWind.direction}
                        color="error"
                        onChange={(_, newValue) =>
                          setTwoKWind({ ...twoKWind, direction: newValue })
                        }
                        aria-labelledby="2000ft-wind-direction-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        min={0}
                        max={360}
                        valueLabelFormat={(value) => `2000ft Wind - ${value}°`}
                      />
                    </Stack>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  width="100%"
                  sx={{ mb: 2, flexWrap: "wrap", gap: 2 }}>
                  <Chip
                    label={`Launch: ${Math.round(launchHeight)} ft`}
                    color="success"
                    sx={{ mb: 1, flexGrow: 1 }}
                  />
                  <Chip
                    label={`Surface: ${surfaceWind.speed} kts at ${surfaceWind.direction}°`}
                    color="primary"
                    sx={{ mb: 1, flexGrow: 1 }}
                  />
                  <Chip
                    label={`2000ft: ${twoKWind.speed} kts at ${twoKWind.direction}°`}
                    color="error"
                    sx={{ mb: 1, flexGrow: 1 }}
                  />
                </Stack>
                <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                  <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                    <TableRow>
                      <TableCell>Data Point</TableCell>
                      <TableCell>Height (ft)</TableCell>
                      <TableCell>Wind Speed (kts)</TableCell>
                      <TableCell>Wind Direction (°)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {windData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{Math.round(data.launchHeight)}ft</TableCell>
                        <TableCell>{data.windSpeed.toFixed(2)} kts</TableCell>
                        <TableCell>{data.windDirection.toFixed(2)}°</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Alert severity="info">
        If you need additional assistance or have questions not covered in this
        help section, please contact Luke.Dale828@mod.gov.uk
      </Alert>
    </PageLayout>
  );
};

export default HelpPage;
