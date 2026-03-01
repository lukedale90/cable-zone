import PageLayout from "../components/PageLayout";
import { 
  Typography, 
  Box,
  Chip,
  Card,
  CardContent,
  Stack
} from "@mui/material";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: {
    category: "added" | "changed" | "fixed" | "removed";
    description: string;
  }[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "1.1",
    date: "2026-02-27",
    type: "major",
    changes: [
      { category: "added", description: "Initial Release" },
      { category: "added", description: "Crosswind Indicator highlights amber when above 11kts" },
    ]
  },
];

const getCategoryColor = (category: ChangelogEntry["changes"][number]["category"]): "success" | "info" | "warning" | "error" | "default" => {
  switch (category) {
    case "added": return "success";
    case "changed": return "info";
    case "fixed": return "warning";
    case "removed": return "error";
    default: return "default";
  }
};

const getVersionColor = (type: string) => {
  switch (type) {
    case "major": return "success";
    case "minor": return "info";
    case "patch": return "warning";
    default: return "default";
  }
};

const ChangelogPage = () => {
  return (
    <PageLayout 
      title="Changelog" 
      subtitle="Track the evolution of Strop Drop Visualiser"
    >
      <Stack spacing={3}>
        {changelogData.map((entry) => (
          <Card key={entry.version} elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip 
                  label={`v${entry.version}`} 
                  color={getVersionColor(entry.type)}
                  variant="filled"
                />
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Stack spacing={1.5}>
                {entry.changes.map((change, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Chip
                      label={change.category.toUpperCase()}
                      size="small"
                      color={getCategoryColor(change.category)}
                      sx={{ minWidth: 80, fontSize: "0.7rem" }}
                    />
                    <Typography variant="body2" sx={{ flex: 1, pt: 0.25 }}>
                      {change.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <strong>Legend:</strong> 
          <Chip label="ADDED" size="small" color="success" sx={{ mx: 0.5, fontSize: "0.7rem" }} /> New features • 
          <Chip label="CHANGED" size="small" color="info" sx={{ mx: 0.5, fontSize: "0.7rem" }} /> Modifications • 
          <Chip label="FIXED" size="small" color="warning" sx={{ mx: 0.5, fontSize: "0.7rem" }} /> Bug fixes • 
          <Chip label="REMOVED" size="small" color="error" sx={{ mx: 0.5, fontSize: "0.7rem" }} /> Removals
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default ChangelogPage;
