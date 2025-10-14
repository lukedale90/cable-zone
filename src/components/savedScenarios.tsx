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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LandscapeIcon from "@mui/icons-material/Landscape";

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
      (scenario: Scenario) => scenario.name !== name
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
        scenario.name.toLowerCase() === newScenarioName.toLowerCase()
    );

    if (nameExists) {
      alert(
        "A scenario with this name already exists. Please choose a different name."
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

  return (
    <Stack spacing={2}>
      <List>
        {scenarios.length === 0 && (
          <Alert severity="warning">No locally saved scenarios</Alert>
        )}
        {scenarios.map((scenario) => (
          <ListItem
            disableGutters
            key={scenario.name}
            sx={{ display: "flex", justifyContent: "space-between" }}>
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
          label="Scenario Name"
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
    </Stack>
  );
};

export default SavedScenarios;
