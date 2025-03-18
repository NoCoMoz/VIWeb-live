# Voices Ignited BlueSky Feed Integration

## Overview

This integration adds a real-time BlueSky feed to the Voices Ignited website, displaying posts from the @voicesignited.bsky.social account. The implementation includes:

1. A dynamic feed that fetches real posts from the BlueSky API
2. Fallback to sample posts if the API is unavailable
3. Proper styling using the official Voices Ignited color palette
4. Responsive design for both desktop and mobile devices
5. Interactive elements like hover effects and external links

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your BlueSky credentials:

```
BLUESKY_USERNAME=@yourusername.bsky.social
BLUESKY_APP_PASSWORD=your-app-password
```

Note: The current implementation uses the credentials for @nocomozie.bsky.social. You should update these with the official Voices Ignited account credentials when available.

### 2. API Server Setup

The BlueSky feed requires a server-side component to handle API requests. To set up the server:

```bash
cd api
npm install
node bluesky-api.js
```

This will start the API server on port 3001 (or the port specified in your environment variables).

### 3. GitHub Pages Deployment

For GitHub Pages deployment, you'll need to host the API server separately. Options include:

- Using a service like Heroku, Vercel, or Netlify to host the API
- Setting up a GitHub Action to deploy the API to a cloud service
- Using a serverless function (e.g., AWS Lambda, Vercel Functions)

Update the API endpoint in `scripts/bluesky-api.js` to point to your hosted API:

```javascript
this.apiEndpoint = 'https://your-api-url.com/api/bluesky';
```

## Implementation Details

### Files Modified

1. `Pages/index.html` - Added BlueSky feed container and script references
2. `scripts/bluesky-feed.js` - Updated to fetch real posts instead of static samples
3. `scripts/bluesky-api.js` - New client-side API handler
4. `api/bluesky-api.js` - Server-side API endpoint
5. `api/package.json` - Dependencies for the API server

### Architecture

The implementation follows a client-server architecture:

1. The server-side component (`api/bluesky-api.js`) handles authentication with BlueSky and fetches posts
2. The client-side component (`scripts/bluesky-api.js`) communicates with the server API
3. The feed component (`scripts/bluesky-feed.js`) renders the posts on the website

### Fallback Mechanism

If the API is unavailable or returns an error, the feed will display sample posts that match the Voices Ignited brand voice. This ensures that the website always displays content, even if the API is down.

## Troubleshooting

### API Connection Issues

If the feed is not displaying real posts:

1. Check that the API server is running
2. Verify that your BlueSky credentials are correct
3. Check the browser console for any error messages
4. Ensure that the API endpoint in `scripts/bluesky-api.js` is correct

### CORS Issues

If you're experiencing CORS errors:

1. Make sure the API server is running with CORS enabled
2. Check that the API endpoint is using the correct protocol (http/https)
3. If hosting the API separately, ensure that your domain is allowed in the CORS configuration

## Future Improvements

1. Add caching to reduce API calls
2. Implement pagination for loading more posts
3. Add real-time updates using WebSockets
4. Enhance error handling and user feedback
5. Add analytics to track engagement with the feed
