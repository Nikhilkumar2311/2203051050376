
const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('URL Shortener Backend is running!');
});

app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Backend server started on http://localhost:${PORT}`);
});
