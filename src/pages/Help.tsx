import PageLayout from "../components/PageLayout";
import { 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HelpPage = () => {
  return (
    <PageLayout 
      title="Help & Documentation" 
      subtitle="Learn how to use the Strop Drop Visualiser effectively"
    >
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Getting Started</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The Strop Drop Visualiser helps you calculate and visualize drop zones for aerial operations. 
            Use the settings panel to configure your parameters and view the results on the interactive map.
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Set Your Parameters" 
                secondary="Configure aircraft speed, altitude, wind conditions, and other variables in the settings panel"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="View Results" 
                secondary="The map will display drop zones, flight paths, and landing areas based on your parameters"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Save Scenarios" 
                secondary="Use the saved scenarios feature to store and reload different configurations"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Map Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText 
                primary="Pan & Zoom" 
                secondary="Click and drag to pan around the map. Use the mouse wheel or zoom controls to zoom in/out"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Markers" 
                secondary="Click on the map to set drop points. Markers show calculated landing zones"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Layer Controls" 
                secondary="Toggle different map layers using the layer control in the top-right corner"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Settings Panel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The settings panel allows you to configure all parameters for your drop calculations:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Aircraft Parameters" 
                secondary="Set speed, altitude, and flight characteristics"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Wind Conditions" 
                secondary="Configure wind speed and direction for accurate drift calculations"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Payload Settings" 
                secondary="Specify payload weight, drag coefficient, and deployment parameters"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Saved Scenarios</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Manage your saved configurations for quick access to frequently used scenarios:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Save Current Settings" 
                secondary="Enter a name and click save to store your current parameter configuration"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Load Scenarios" 
                secondary="Click the play button next to any saved scenario to load its parameters"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Import/Export" 
                secondary="Use the download and upload buttons to backup scenarios or share with others"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Need More Help?
        </Typography>
        <Typography>
          If you need additional assistance or have questions not covered in this help section, 
          please refer to the project documentation or contact support.
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default HelpPage;
