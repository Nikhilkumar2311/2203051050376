import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const UrlShortenerForm = () => {
  // State to hold the list of URLs to be shortened
  const [urlInputs, setUrlInputs] = useState([{ id: 1, value: '' }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to add a new URL input field
  const handleAddInput = () => {
    if (urlInputs.length < 5) {
      const newInput = { id: urlInputs.length + 1, value: '' };
      setUrlInputs([...urlInputs, newInput]);
    }
  };

  // Function to handle changes in any URL input field
  const handleInputChange = (id, event) => {
    const newUrlInputs = urlInputs.map(input => {
      if (id === input.id) {
        return { ...input, value: event.target.value };
      }
      return input;
    });
    setUrlInputs(newUrlInputs);
  };

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setShortenedUrls([]);

    const urlsToProcess = urlInputs.filter(input => input.value.trim() !== '');
    const results = [];

    for (const input of urlsToProcess) {
      try {
        const response = await axios.post('http://localhost:5000/shorturls', {
          longUrl: input.value
        });
        results.push({ longUrl: input.value, shortUrl: response.data.shortUrl, error: null });
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'An unknown error occurred.';
        results.push({ longUrl: input.value, shortUrl: null, error: errorMessage });
      }
    }

    setShortenedUrls(results);
    setIsLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>

      {urlInputs.map((input, index) => (
        <TextField
          key={input.id}
          label={`URL ${index + 1}`}
          variant="outlined"
          value={input.value}
          onChange={(e) => handleInputChange(input.id, e)}
          fullWidth
          sx={{ mb: 2, maxWidth: '600px' }}
          required
        />
      ))}

      {urlInputs.length < 5 && (
        <Button onClick={handleAddInput} variant="text" sx={{ mb: 2 }}>
          Add another URL
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Shorten URLs'}
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2, width: '100%', maxWidth: '600px' }}>{error}</Alert>}

      {shortenedUrls.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 2, width: '100%', maxWidth: '600px' }}>
          <Typography variant="h6" gutterBottom>Results:</Typography>
          {shortenedUrls.map((result, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2">Original: {result.longUrl}</Typography>
              {result.shortUrl ? (
                <Typography variant="body1">
                  Shortened: <Link href={result.shortUrl} target="_blank" rel="noopener noreferrer">{result.shortUrl}</Link>
                </Typography>
              ) : (
                <Typography variant="body1" color="error">Error: {result.error}</Typography>
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default UrlShortenerForm;
