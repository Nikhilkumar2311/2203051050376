import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import UrlShortenerForm from './components/UrlShortenerForm';
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <UrlShortenerForm />
      </Container>
    </>
  );
}

export default App;
