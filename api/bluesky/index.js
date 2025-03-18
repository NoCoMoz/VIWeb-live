// BlueSky API endpoint
const { BskyAgent } = require('@atproto/api');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// BlueSky credentials from environment variables
const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;

// Create BlueSky agent
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

/**
 * Fetch posts from BlueSky API
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
    
    // Ensure target handle is properly formatted
    const targetHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    console.log('Fetching posts for handle:', targetHandle);
    
    // Resolve the DID for the handle
    const resolveResult = await agent.resolveHandle({ handle: targetHandle });
    if (!resolveResult.success) {
      console.error('Failed to resolve handle:', targetHandle);
      return useFallbackPosts();
    }
    
    const did = resolveResult.data.did;
    console.log('Resolved DID:', did);
    
    // Fetch the profile
    const profileResult = await agent.getProfile({ actor: did });
    if (!profileResult.success) {
      console.error('Failed to fetch profile for DID:', did);
      return useFallbackPosts();
    }
    
    const profile = profileResult.data;
    console.log('Fetched profile:', profile.displayName);
    
    // Fetch posts from the user's feed
    const feedResult = await agent.getAuthorFeed({
      actor: did,
      limit: limit
    });
    
    if (!feedResult.success) {
      console.error('Failed to fetch feed for DID:', did);
      return useFallbackPosts();
    }
    
    console.log(`Fetched ${feedResult.data.feed.length} posts`);
    
    // Format the posts
    const formattedPosts = feedResult.data.feed.map(item => {
      const post = item.post;
      const record = post.record;
      
      // Extract images if present
      const images = [];
      if (post.embed && post.embed.images) {
        post.embed.images.forEach((image, index) => {
          images.push({
            url: image.fullsize,
            alt: image.alt || `Image ${index + 1}`
          });
        });
      }
      
      return {
        id: post.uri.split('/').pop(),
        text: record.text,
        createdAt: record.createdAt,
        author: {
          handle: profile.handle,
          displayName: profile.displayName,
          avatar: profile.avatar || '/images/white-logo.76c7025e.png'
        },
        images: images,
        likes: post.likeCount || 0,
        reposts: post.repostCount || 0,
        replies: post.replyCount || 0,
        url: `https://bsky.app/profile/${profile.handle}/post/${post.uri.split('/').pop()}`
      };
    });
    
    return formattedPosts;
  } catch (error) {
    console.error('Error fetching BlueSky posts:', error);
    return useFallbackPosts();
  }
}

/**
 * Provide fallback posts when API calls fail
 * @returns {Array} Sample posts
 */
function useFallbackPosts() {
  return [
    {
      id: 'fallback-1',
      text: 'Welcome to Voices Ignited! We are a movement dedicated to fighting corruption and greed in our government.',
      createdAt: new Date().toISOString(),
      author: {
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/images/white-logo.76c7025e.png'
      },
      images: [],
      likes: 42,
      reposts: 15,
      replies: 7,
      url: 'https://bsky.app/profile/voicesignited.bsky.social'
    },
    {
      id: 'fallback-2',
      text: 'Join us in our mission to create a more transparent and accountable government. Together, we can make a difference!',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      author: {
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/images/white-logo.76c7025e.png'
      },
      images: [],
      likes: 38,
      reposts: 12,
      replies: 5,
      url: 'https://bsky.app/profile/voicesignited.bsky.social'
    },
    {
      id: 'fallback-3',
      text: 'Check out our latest events and find ways to get involved in your community. Every voice matters!',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      author: {
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: '/images/white-logo.76c7025e.png'
      },
      images: [],
      likes: 35,
      reposts: 10,
      replies: 3,
      url: 'https://bsky.app/profile/voicesignited.bsky.social'
    }
  ];
}

// Express.js handler function
module.exports = (req, res) => {
  // Get handle from query parameters or use default
  const handle = req.query.handle || 'voicesignited.bsky.social';
  const limit = parseInt(req.query.limit) || 5;
  
  // Fetch posts
  fetchBlueSkyPosts(handle, limit)
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      console.error('Error in API handler:', error);
      res.status(500).json(useFallbackPosts());
    });
};
