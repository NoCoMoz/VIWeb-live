const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static(__dirname));

// API endpoint for BlueSky
app.get('/api/bluesky', require('./api/bluesky/index'));

// Default route serves index.html from root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
        res.status(404).send('Page not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
