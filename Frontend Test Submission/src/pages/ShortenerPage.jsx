import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { createShortUrl } from "../utils/api";
import Log from "../../logger";

const ShortenerPage = () => {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [result, setResult] = useState(null);

  const handleShorten = async () => {
    if (!url.startsWith("http")) {
      alert("Enter a valid URL with http/https");
      Log("frontend", "error", "component", "Invalid URL format");
      return;
    }

    try {
      const payload = { url };
      if (validity) payload.validity = parseInt(validity);
      if (shortcode) payload.shortcode = shortcode;

      const res = await createShortUrl(payload);
      setResult(res.data);
      Log("frontend", "info", "api", "Short URL created");
    } catch (err) {
      console.error(err);
      Log("frontend", "error", "api", "Failed to create short URL");
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
            URL Shortener
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#006666", mb: 2 }}>
            Create short, shareable links with custom options
          </Typography>
          <Divider sx={{ my: 3, bgcolor: "#b2d8d8" }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Long URL"
                fullWidth
                variant="outlined"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                sx={{
                  bgcolor: "#edf1f3",
                  "& .MuiInputBase-input": { color: "#333" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Validity (minutes)"
                fullWidth
                variant="outlined"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                placeholder="e.g., 1440"
                type="number"
                sx={{
                  bgcolor: "#edf1f3",
                  "& .MuiInputBase-input": { color: "#333" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Custom Shortcode"
                fullWidth
                variant="outlined"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                placeholder="e.g., mylink"
                sx={{
                  bgcolor: "#edf1f3",
                  "& .MuiInputBase-input": { color: "#333" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                  variant="contained"
                  fullWidth
                  onClick={handleShorten}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "medium",
                    bgcolor: "#008080",
                    "&:hover": { bgcolor: "#006666" },
                    color: "#ffffff",
                  }}
                >
                  Shorten URL
                </Button>
            </Grid>
          </Grid>

          {result && (
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
                Your Shortened URL
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordBreak: "break-all", color: "#333" }}
              >
                <strong>Short Link:</strong> {result.shortLink}
              </Typography>
              <Typography variant="body2" sx={{ color: "#333" }}>
                <strong>Expires at:</strong> {result.expiry}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShortenerPage;
