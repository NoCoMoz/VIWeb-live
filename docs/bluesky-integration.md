# BlueSky Integration Guide

## Overview

The Voices Ignited website integrates with the BlueSky social media platform to display posts from the official Voices Ignited BlueSky account. This document explains how the integration works and how to customize it.

## Setup

### Prerequisites

- A BlueSky account
- An App Password for your BlueSky account (for API authentication)

### Environment Configuration

1. Create a `.env.local` file in the root directory of the project with the following variables:

   ```
   BLUESKY_USERNAME=your_bluesky_username
   BLUESKY_APP_PASSWORD=your_bluesky_app_password
   ```

   Replace `your_bluesky_username` with your BlueSky handle (e.g., `voicesignited.bsky.social`) and `your_bluesky_app_password` with your App Password.

2. Restart the server for the changes to take effect.

## How It Works

### Server-Side

The BlueSky integration consists of two main components:

1. **API Endpoint**: Located at `/api/bluesky/index.js`, this endpoint handles the communication with the BlueSky API. It fetches posts from the specified BlueSky account and formats them for display on the website.

2. **Fallback Mechanism**: If the BlueSky API is unavailable or returns an error, the integration will use a set of fallback posts to ensure that the feed always displays content.

### Client-Side

The client-side component is implemented in `/scripts/bluesky-feed.js`, which handles:

- Rendering the posts in the feed
- Auto-refreshing the feed at regular intervals
- Formatting post text with links and hashtags
- Error handling and retry logic

## Customization

### Changing the BlueSky Account

To display posts from a different BlueSky account, modify the `handle` parameter in the BlueSky feed initialization:

```javascript
const feed = new BlueSkyFeed('bluesky-feed-container', {
  handle: 'new-account.bsky.social',
  postLimit: 5
});
```

### Adjusting the Number of Posts

To change the number of posts displayed in the feed, modify the `postLimit` parameter:

```javascript
const feed = new BlueSkyFeed('bluesky-feed-container', {
  handle: 'voicesignited.bsky.social',
  postLimit: 10  // Change this value to display more or fewer posts
});
```

### Auto-Refresh Settings

By default, the feed auto-refreshes every 5 minutes. To change this behavior, modify the following options:

```javascript
const feed = new BlueSkyFeed('bluesky-feed-container', {
  autoRefresh: true,  // Set to false to disable auto-refresh
  refreshInterval: 300000  // Time in milliseconds (5 minutes by default)
});
```

## Troubleshooting

### Feed Not Displaying

If the BlueSky feed is not displaying correctly, check the following:

1. Verify that your BlueSky credentials are correctly set in the `.env.local` file
2. Check the browser console for any JavaScript errors
3. Ensure that the BlueSky API is operational
4. Check the server logs for any API-related errors

### API Rate Limiting

The BlueSky API has rate limits. If you encounter rate limiting issues, consider:

1. Reducing the refresh frequency
2. Implementing caching on the server-side
3. Using a different App Password

## Advanced Customization

### Custom Styling

To customize the appearance of the BlueSky feed, modify the CSS in your stylesheets. The feed uses the following CSS classes:

- `.bluesky-feed-container`: The main container for the feed
- `.bluesky-post`: Individual post container
- `.bluesky-post-header`: Header section of a post (avatar, name, handle)
- `.bluesky-post-content`: The main content of the post
- `.bluesky-post-footer`: Footer section with engagement metrics

### Custom Post Rendering

To customize how posts are rendered, you can modify the `renderPost` method in the `BlueSkyFeed` class in `/scripts/bluesky-feed.js`.
