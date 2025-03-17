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
async function fetchBlueSkyPosts() {
  try {
    // Validate credentials exist
    if (!BLUESKY_USERNAME || !BLUESKY_APP_PASSWORD) {
      console.error('BlueSky credentials not found in environment variables');
      return useFallbackPosts();
    }
    
    // Extract handle from username (remove @ if present)
    const handle = BLUESKY_USERNAME.startsWith('@') 
      ? BLUESKY_USERNAME.substring(1) 
      : BLUESKY_USERNAME;
    
    console.log('Attempting to login with handle:', handle);
    
    // Login to BlueSky
    try {
      await agent.login({
        identifier: handle,
        password: BLUESKY_APP_PASSWORD,
      });
      console.log('Login successful');
    } catch (loginError) {
      console.error('Login failed:', loginError.message);
      return useFallbackPosts();
    }
    
    // Specifically fetch posts from voicesignited.bsky.social
    try {
      const targetHandle = 'voicesignited.bsky.social';
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
      const feedResponse = await agent.getAuthorFeed({ actor: did, limit: 10 });
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
      // Continue to try other methods
    }
    
    // If specific profile fetch fails, try timeline as fallback
    try {
      console.log('Fetching timeline as fallback');
      const timelineResponse = await agent.getTimeline({ limit: 10 });
      
      if (timelineResponse.success && timelineResponse.data.feed && timelineResponse.data.feed.length > 0) {
        console.log('Successfully fetched timeline with', timelineResponse.data.feed.length, 'posts');
        
        // Format timeline posts
        const posts = timelineResponse.data.feed.map(item => {
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
      } else {
        console.log('Timeline fetch returned no posts, using fallback');
      }
    } catch (timelineError) {
      console.error('Error fetching timeline:', timelineError.message);
      // Continue to fallback
    }
    
    // If we get here, all methods failed, use fallback
    console.log('All methods failed, using fallback posts');
    return useFallbackPosts();
    
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
      url: 'https://bsky.app',
      images: [{
        alt: 'People protesting with signs',
        url: 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: null
      }
    },
    {
      id: 'sample2',
      text: 'Everyday people standing up against corruption and greed in our government. This isn\'t about left or right—it\'s about creating real change!',
      createdAt: yesterday.toISOString(),
      url: 'https://bsky.app',
      images: [{
        alt: 'Community meeting',
        url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: null
      }
    },
    {
      id: 'sample3',
      text: 'Join our movement today and help us build a better future for all Americans. Visit our website to learn more.',
      createdAt: twoDaysAgo.toISOString(),
      url: 'https://bsky.app',
      images: [{
        alt: 'American flag',
        url: 'https://images.unsplash.com/photo-1603766806347-bfd5c898b090?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: null
      }
    },
    {
      id: 'sample4',
      text: 'True change happens when we stand together. Our strength is in our unity and our willingness to speak truth to power. #VoicesIgnited',
      createdAt: twoDaysAgo.toISOString(),
      url: 'https://bsky.app',
      images: [{
        alt: 'People holding hands in unity',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80'
      }],
      author: {
        did: 'sample-did',
        handle: 'voicesignited.bsky.social',
        displayName: 'Voices Ignited',
        avatar: null
      }
    },
    {
      id: 'sample5',
      text: 'Access to healthcare is a human right, not a privilege. We need to keep fighting for a system that serves everyone. #VoicesIgnited',
      createdAt: twoDaysAgo.toISOString(),
      url: 'https://bsky.app',
      images: [{
        alt: 'Healthcare workers',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
      }],
      author: {
        did: 'sample-did',
        handle: 'community.bsky.social',
        displayName: 'Community Voice',
        avatar: null
      }
    }
  ];
}

// Express.js handler function
module.exports = async (req, res) => {
  try {
    const posts = await fetchBlueSkyPosts();
    console.log(`Returning ${posts.length} posts to client`);
    res.json(posts);
  } catch (error) {
    console.error('Error in BlueSky API endpoint:', error);
    // Even if there's an error, return fallback posts
    const fallbackPosts = useFallbackPosts();
    console.log(`Returning ${fallbackPosts.length} fallback posts due to error`);
    res.json(fallbackPosts);
  }
};
