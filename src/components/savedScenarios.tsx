import { useState, useEffect } from "react";
import { useParameters } from "../context/ParametersContext";
import { Parameters } from "../context/ParametersProvider";
import {
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

type Scenario = {
  name: string;
  parameters: Pick<
    Parameters,
    "winchLocation" | "launchPoint" | "viewLocation"
  >;
};

const SavedScenarios = () => {
  const { parameters, setParameters } = useParameters();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState("");

  // Fetch scenarios from localStorage on component mount
  useEffect(() => {
    const storedScenarios = localStorage.getItem("scenarios");
    if (storedScenarios) {
      setScenarios(JSON.parse(storedScenarios));
    }
  }, []);

  // Save scenarios to localStorage
  const saveScenariosToLocalStorage = (updatedScenarios: Scenario[]) => {
    localStorage.setItem("scenarios", JSON.stringify(updatedScenarios));
  };

  // Load a scenario
  const loadScenario = (scenario: Scenario) => {
    setParameters((prev) => ({
      ...prev,
      ...scenario.parameters,
    }));
  };

  // Delete a scenario
  const deleteScenario = (name: string) => {
    const updatedScenarios = scenarios.filter(
      (scenario: Scenario) => scenario.name !== name,
    );
    setScenarios(updatedScenarios);
    saveScenariosToLocalStorage(updatedScenarios);
  };

  // Save the current scenario
  const saveScenario = () => {
    if (!newScenarioName.trim()) {
      alert("Please enter a name for the scenario.");
      return;
    }

    // Check if the name already exists
    const nameExists = scenarios.some(
      (scenario) =>
        scenario.name.toLowerCase() === newScenarioName.toLowerCase(),
    );

    if (nameExists) {
      alert(
        "A scenario with this name already exists. Please choose a different name.",
      );
      return;
    }

    // Only save the positions of winch, launch point, and view
    const { winchLocation, launchPoint, viewLocation } = parameters;

    const newScenario = {
      name: newScenarioName,
      parameters: { winchLocation, launchPoint, viewLocation },
    };

    const updatedScenarios = [...scenarios, newScenario];
    setScenarios(updatedScenarios);
    saveScenariosToLocalStorage(updatedScenarios);
    setNewScenarioName("");
  };

  // Download scenarios as JSON
  const downloadScenarios = () => {
    const blob = new Blob([JSON.stringify(scenarios, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "saved-scenarios.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import scenarios from JSON file
  const importScenarios = (file: File, append: boolean) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedScenarios = JSON.parse(event.target?.result as string);
        if (!Array.isArray(importedScenarios)) {
          alert("Invalid file format. Please upload a valid JSON file.");
          return;
        }

        const updatedScenarios = append
          ? [...scenarios, ...importedScenarios]
          : importedScenarios;

        setScenarios(updatedScenarios);
        saveScenariosToLocalStorage(updatedScenarios);
        alert("Scenarios imported successfully.");
      } catch (error) {
        alert("Failed to import scenarios. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Stack spacing={2}>
      {scenarios.length === 0 && (
        <Alert severity="warning">No locally saved scenarios</Alert>
      )}
      <List>
        {scenarios.map((scenario) => (
          <ListItem
            disableGutters
            key={scenario.name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
            }}>
            <LandscapeIcon sx={{ mr: 2, opacity: 0.5 }} />
            <ListItemText primary={scenario.name} />
            <Stack spacing={2} direction="row">
              <Tooltip title="Load scenario">
                <IconButton
                  color="success"
                  onClick={() => loadScenario(scenario)}>
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete scenario">
                <IconButton
                  color="error"
                  onClick={() => deleteScenario(scenario.name)}>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label="Add New Scenario"
          variant="outlined"
          size="small"
          slotProps={{ htmlInput: { maxLength: 50 } }}
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
          fullWidth
          sx={{ marginRight: 2 }}
        />
        <Tooltip title="Save current scenario">
          <IconButton color="primary" onClick={saveScenario}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Alert severity="info">
        These scenarios are saved locally in this browser. Refreshing the page
        will not cause data loss, but clearing cookies / session data will
        result in a loss of saved scenarios!
      </Alert>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={downloadScenarios}>
          Download Scenarios
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<UploadIcon />}
          component="label">
          Import Scenarios
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const append = window.confirm(
                  "Do you want to append the imported scenarios to the existing ones? Click Cancel to overwrite.",
                );
                importScenarios(file, append);
              }
            }}
          />
        </Button>
      </Box>
    </Stack>
  );
};

export default SavedScenarios;
