import React, { useState } from "react";
import { TextField, Button, Typography, Box, Card, CardContent, Divider, Grid } from "@mui/material";
import { getStats } from "../utils/api";
import Log from "../../logger";

const StatsPage = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await getStats(code);
      setStats(res.data);
      Log("frontend", "info", "api", "Fetched stats");
    } catch (err) {
      console.error(err);
      Log("frontend", "error", "api", "Failed to fetch stats");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f7f9fa",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#008080" }}
          >
            URL Stats
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#006666", mb: 2 }}>
            View detailed statistics for your shortcodes
          </Typography>
          <Divider sx={{ my: 3, bgcolor: "#b2d8d8" }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Shortcode"
                fullWidth
                variant="outlined"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., mylink"
                sx={{ bgcolor: "#edf1f3", "& .MuiInputBase-input": { color: "#333" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFetch}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "medium",
                    bgcolor: "#008080",
                    "&:hover": { bgcolor: "#006666" },
                    color: "#ffffff",
                  }}
                >
                  Get Stats
                </Button>
              </Box>
            </Grid>
          </Grid>

          {stats && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: "#e6f3f3",
                borderRadius: 1,
                border: "1px solid #b2d8d8",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#008080" }}>
                URL Statistics
              </Typography>
              <Typography variant="body2" sx={{ color: "#333" }}>
                <strong>Original URL:</strong> {stats.originalUrl}
              </Typography>
              <Typography variant="body2" sx={{ color: "#333" }}>
                <strong>Total Clicks:</strong> {stats.totalClicks}
              </Typography>
              {stats.clickDetails.map((click, idx) => (
                <Box key={idx} mt={1} sx={{ bgcolor: "#ffffff", p: 1, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    <strong>Clicked at:</strong> {click.timestamp}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    <strong>Source:</strong> {click.source}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    <strong>Location:</strong> {click.location}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsPage;