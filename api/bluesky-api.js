/**
 * BlueSky API Server
 * 
 * This script provides an API endpoint for fetching BlueSky posts
 * that can be used by the client-side code.
 */

const express = require('express');
const cors = require('cors');
const { BskyAgent } = require('@atproto/api');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Create Express app
const app = express();
app.use(cors());

// BlueSky credentials
const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;

// Create BlueSky agent
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

/**
 * Fetch posts from BlueSky API
 * @param {string} handle - The BlueSky handle to fetch posts from
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Promise<Array>} Array of formatted posts
 */
async function fetchBlueSkyPosts(handle = 'voicesignited.bsky.social', limit = 5) {
  try {
    // Validate credentials exist
    if (!BLUESKY_USERNAME || !BLUESKY_APP_PASSWORD) {
      console.error('BlueSky credentials not found in environment variables');
      return useFallbackPosts();
    }
    
    // Extract handle from username (remove @ if present)
    const loginHandle = BLUESKY_USERNAME.startsWith('@') 
      ? BLUESKY_USERNAME.substring(1) 
      : BLUESKY_USERNAME;
    
    console.log('Attempting to login with handle:', loginHandle);
    
    // Login to BlueSky
    try {
      await agent.login({
        identifier: loginHandle,
        password: BLUESKY_APP_PASSWORD,
      });
      console.log('Login successful');
    } catch (loginError) {
      console.error('Login failed:', loginError.message);
      return useFallbackPosts();
    }
    
    // Specifically fetch posts from the requested handle
    try {
      const targetHandle = handle.startsWith('@') ? handle.substring(1) : handle;
      console.log(`Fetching posts from ${targetHandle}`);
      
      // First, resolve the DID for the handle
      const resolveResponse = await agent.resolveHandle({ handle: targetHandle });
      if (!resolveResponse.success) {
        console.error('Failed to resolve handle:', targetHandle);
        throw new Error('Handle resolution failed');
      }
      
      const did = resolveResponse.data.did;
      console.log(`Resolved DID: ${did}`);
      
      // Get the profile
      const profileResponse = await agent.getProfile({ actor: did });
      if (!profileResponse.success) {
        console.error('Failed to get profile for:', targetHandle);
        throw new Error('Profile fetch failed');
      }
      
      // Get the author feed
      const feedResponse = await agent.getAuthorFeed({ actor: did, limit: parseInt(limit) });
      if (!feedResponse.success || !feedResponse.data.feed || feedResponse.data.feed.length === 0) {
        console.error('Failed to get author feed or feed is empty');
        throw new Error('Author feed fetch failed or empty');
      }
      
      console.log(`Successfully fetched ${feedResponse.data.feed.length} posts from ${targetHandle}`);
      
      // Format the posts
      const posts = feedResponse.data.feed.map(item => {
        const post = item.post;
        
        // Extract images if they exist
        let images = [];
        if (post.embed) {
          if (post.embed.images) {
            images = post.embed.images.map(img => ({
              alt: img.alt || '',
              url: img.fullsize || img.thumb
            }));
          } else if (post.embed.media && post.embed.media.images) {
            images = post.embed.media.images.map(img => ({
              alt: img.alt || '',
              url: img.fullsize || img.thumb
            }));
          }
        }
        
        return {
          id: post.uri.split('/').pop(),
          text: post.record.text,
          createdAt: post.indexedAt,
          url: `https://bsky.app/profile/${post.author.did}/post/${post.uri.split('/').pop()}`,
          images: images,
          author: {
            did: post.author.did,
            handle: post.author.handle,
            displayName: post.author.displayName || post.author.handle,
            avatar: post.author.avatar || null
          }
        };
      });
      
      return posts;
    } catch (authorFeedError) {
      console.error('Error fetching author feed:', authorFeedError.message);
      return useFallbackPosts();
    }
  } catch (error) {
    console.error('Error in main fetchBlueSkyPosts function:', error.message);
    return useFallbackPosts();
  }
}

/**
 * Provide fallback posts when API calls fail
 * @returns {Array} Sample posts
 */
function useFallbackPosts() {
  console.log('Using fallback posts');
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  return [
    {
      id: 'sample1',
      text: 'We believe in a government that serves the people, not corporate interests. Join us in fighting for change! #VoicesIgnited',
      createdAt: now.toISOString(),
      url: 'https://bsky.app/profile/voicesignited.bsky.social',
      images: [{
        alt: 'People protesting with signs',
        url: '/VIWeb-live/images/protestors.jpg'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/VIWeb-live/images/vi_logo_white.jpg'
      }
    },
    {
      id: 'sample2',
      text: 'Everyday people standing up against corruption and greed in our government. This isn\'t about left or right—it\'s about creating real change!',
      createdAt: yesterday.toISOString(),
      url: 'https://bsky.app/profile/voicesignited.bsky.social',
      images: [{
        alt: 'Community meeting',
        url: '/VIWeb-live/images/rps5RoMG.jpg'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/VIWeb-live/images/vi_logo_white.jpg'
      }
    },
    {
      id: 'sample3',
      text: 'Join our movement today and help us build a better future for all Americans. Visit our website to learn more. #VoicesIgnited',
      createdAt: twoDaysAgo.toISOString(),
      url: 'https://bsky.app/profile/voicesignited.bsky.social',
      images: [{
        alt: 'American flag',
        url: '/VIWeb-live/images/community-forum.jpg'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/VIWeb-live/images/vi_logo_white.jpg'
      }
    }
  ];
}

// API endpoint for fetching BlueSky posts
app.get('/api/bluesky', async (req, res) => {
  try {
    const handle = req.query.handle || 'voicesignited.bsky.social';
    const limit = req.query.limit || 5;
    
    console.log(`API request for handle: ${handle}, limit: ${limit}`);
    
    const posts = await fetchBlueSkyPosts(handle, limit);
    console.log(`Returning ${posts.length} posts to client`);
    
    res.json(posts);
  } catch (error) {
    console.error('Error in BlueSky API endpoint:', error);
    // Even if there's an error, return fallback posts
    const fallbackPosts = useFallbackPosts();
    console.log(`Returning ${fallbackPosts.length} fallback posts due to error`);
    res.json(fallbackPosts);
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BlueSky API server running on port ${PORT}`);
});
