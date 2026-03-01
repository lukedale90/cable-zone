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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const HelpPage = () => {
  return (
    <PageLayout title="Help">
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">What does this app do?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography>
              The Strop Drop Visualiser was created to assist users in
              calculating the likely impact areas for a glider strop drop during
              winch launch operations. By inputting various parameters such as
              launch height, wind conditions, and payload characteristics, users
              can visualise potential drop zones and landing areas on an
              interactive map. This tool is designed to enhance safety and
              planning for glider pilots and ground crews by providing a clear
              visual representation of strop drop scenarios.
            </Typography>
            <Typography>
              Input your expected full height for the launch along with surface
              and 2000ft wind conditions to Fsee the likely strop drop zone.
              Adjust the parameters to see how different conditions affect the
              drop.
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">How does it work?</Typography>
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
              determined that an average strop drops at approximately 20m/s.
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
            <Typography>Example data:</Typography>
            <Typography>
              Full Launch Height - 2000ft, Surface Wind - 10kts from 270°,
              2000ft Wind - 20kts from 290°
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Altitude (ft)</TableCell>
                  <TableCell>Wind Speed (kts)</TableCell>
                  <TableCell>Wind Direction (°)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Surface</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>270</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>200</TableCell>
                  <TableCell>11</TableCell>
                  <TableCell>272</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>400</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>274</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>600</TableCell>
                  <TableCell>13</TableCell>
                  <TableCell>276</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>800</TableCell>
                  <TableCell>14</TableCell>
                  <TableCell>278</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1000</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>280</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1200</TableCell>
                  <TableCell>16</TableCell>
                  <TableCell>282</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1400</TableCell>
                  <TableCell>17</TableCell>
                  <TableCell>284</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1600</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>286</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1800</TableCell>
                  <TableCell>19</TableCell>
                  <TableCell>288</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2000</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>290</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Need More Help?
        </Typography>
        <Typography>
          If you need additional assistance or have questions not covered in
          this help section, please contact Luke.Dale828@mod.gov.uk
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default HelpPage;
