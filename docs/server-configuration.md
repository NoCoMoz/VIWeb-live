# Server Configuration Guide

## Overview

The Voices Ignited website runs on a Node.js server using Express. This document explains the server configuration and how to customize it for different environments.

## Server Architecture

The main server file is `server.js`, which handles:

- Static file serving
- API routing
- Error handling
- Page routing

## Configuration

### Environment Variables

The server uses environment variables for configuration. These can be set in a `.env` file in the root directory:

```
NODE_ENV=development  # or production
PORT=3000             # the port to run the server on
```

### Port Configuration

By default, the server runs on port 3000 in development and port 8080 in production. You can override this by setting the `PORT` environment variable.

### Static Files

Static files are served from several directories:

- `/Pages`: HTML pages
- `/scripts`: Client-side JavaScript
- `/styles`: CSS stylesheets
- `/images`: Image assets

## API Endpoints

The server provides the following API endpoints:

### BlueSky API

- `GET /api/bluesky`: Fetches posts from the BlueSky social media platform
  - Query parameters:
    - `handle`: The BlueSky handle to fetch posts from (default: `voicesignited.bsky.social`)
    - `limit`: The number of posts to fetch (default: 5)

### Events API

- `GET /api/events`: Fetches upcoming events
- `POST /api/events`: Creates a new event
- `GET /api/events/:id`: Fetches a specific event by ID
- `PUT /api/events/:id/approve`: Approves a pending event

## Error Handling

The server includes comprehensive error handling:

- API errors return appropriate HTTP status codes and error messages
- 404 errors for non-existent pages are handled with a custom 404 page
- Server errors (500) are logged and return a generic error message to the client

## Development Mode

In development mode, the server uses `nodemon` to automatically restart when files change. To run the server in development mode:

```bash
npm run dev
```

## Production Mode

In production mode, the server is optimized for performance. To run the server in production mode:

```bash
npm start
```

## Extending the Server

### Adding New API Endpoints

To add a new API endpoint, create a new file in the `/api` directory, then import and use it in `server.js`:

```javascript
// In /api/new-endpoint/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'New endpoint working!' });
});

module.exports = router;

// In server.js
const newEndpoint = require('./api/new-endpoint');
app.use('/api/new-endpoint', newEndpoint);
```

### Adding New Pages

To add a new page, create an HTML file in the `/Pages` directory. The server will automatically serve it based on the filename:

- `/Pages/about.html` will be served at `/about`
- `/Pages/contact.html` will be served at `/contact`

## Security Considerations

- The server includes CORS headers to control access to API endpoints
- API keys and sensitive information should be stored in environment variables
- Input validation should be implemented for all API endpoints

## Troubleshooting

### Server Won't Start

If the server won't start, check:

1. Port conflicts (another application might be using the same port)
2. Missing dependencies (run `npm install`)
3. Environment variable issues (check your `.env` file)

### API Errors

If API endpoints are returning errors:

1. Check the server logs for detailed error messages
2. Verify that required environment variables are set
3. Check network connectivity for external API calls
