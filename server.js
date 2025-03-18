/**
 * Voices Ignited Website Server
 * This is the main entry point for the Voices Ignited website
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, '.env.local') }) || dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(__dirname));

// API endpoint for BlueSky
app.get('/api/bluesky', require('./api/bluesky/index'));

// Default route serves index.html from Pages directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'index.html'));
});

// Routes for specific pages
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'about.html'));
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'join.html'));
});

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'support.html'));
});

app.get('/break-the-ice', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'breaktheice.html'));
});

app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'events.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'shop.html'));
});

// Catch-all route for other pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'Pages', `${page}.html`);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).sendFile(path.join(__dirname, 'Pages', '404.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something went wrong! Please try again later.');
});

// Start the server
app.listen(port, () => {
  console.log(`Voices Ignited server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
