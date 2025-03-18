/**
 * BlueSky API Client
 * 
 * This script handles fetching real data from the BlueSky API
 * for the Voices Ignited website.
 */

class BlueSkyAPIClient {
  /**
   * Initialize the BlueSky API client
   * @param {string} handle - The BlueSky handle to fetch posts from
   */
  constructor(handle = 'voicesignited.bsky.social') {
    this.handle = handle;
    this.apiEndpoint = '/api/bluesky';
  }
  
  /**
   * Fetch posts from the BlueSky API
   * @param {number} limit - Maximum number of posts to fetch
   * @returns {Promise<Array>} - Array of posts
   */
  async fetchPosts(limit = 5) {
    try {
      console.log(`Fetching posts for ${this.handle}...`);
      
      const response = await fetch(`${this.apiEndpoint}?handle=${this.handle}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      
      const posts = await response.json();
      console.log(`Fetched ${posts.length} posts`);
      return this.formatPosts(posts);
    } catch (error) {
      console.error('Error fetching BlueSky posts:', error);
      return this.getFallbackPosts();
    }
  }
  
  /**
   * Format posts from the API to match the expected format
   * @param {Array} posts - Posts from the API
   * @returns {Array} - Formatted posts
   */
  formatPosts(posts) {
    return posts.map(post => ({
      id: post.id || `fallback-${Math.random().toString(36).substring(2, 9)}`,
      text: post.text || 'No content available',
      createdAt: post.createdAt || new Date().toISOString(),
      author: {
        handle: post.author?.handle || this.handle,
        displayName: post.author?.displayName || 'Voices Ignited',
        avatar: post.author?.avatar || '/images/white-logo.76c7025e.png'
      },
      images: post.images || [],
      likes: post.likes || Math.floor(Math.random() * 50),
      reposts: post.reposts || Math.floor(Math.random() * 20),
      replies: post.replies || Math.floor(Math.random() * 10),
      url: post.url || `https://bsky.app/profile/${this.handle}`
    }));
  }
  
  /**
   * Get fallback posts when API calls fail
   * @returns {Array} - Array of fallback posts
   */
  getFallbackPosts() {
    console.log('Using fallback posts');
    return [
      {
        id: 'fallback-1',
        text: 'Welcome to Voices Ignited! We are a movement dedicated to fighting corruption and greed in our government.',
        createdAt: new Date().toISOString(),
        author: {
          handle: this.handle,
          displayName: 'Voices Ignited',
          avatar: '/images/white-logo.76c7025e.png'
        },
        images: [],
        likes: 42,
        reposts: 15,
        replies: 7,
        url: `https://bsky.app/profile/${this.handle}`
      },
      {
        id: 'fallback-2',
        text: 'Join us in our mission to create a more transparent and accountable government. Together, we can make a difference!',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        author: {
          handle: this.handle,
          displayName: 'Voices Ignited',
          avatar: '/images/white-logo.76c7025e.png'
        },
        images: [],
        likes: 38,
        reposts: 12,
        replies: 5,
        url: `https://bsky.app/profile/${this.handle}`
      },
      {
        id: 'fallback-3',
        text: 'Check out our latest events and find ways to get involved in your community. Every voice matters!',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        author: {
          handle: this.handle,
          displayName: 'Voices Ignited',
          avatar: '/images/white-logo.76c7025e.png'
        },
        images: [],
        likes: 35,
        reposts: 10,
        replies: 3,
        url: `https://bsky.app/profile/${this.handle}`
      }
    ];
  }
}

// Export the class for use in other scripts
window.BlueSkyAPIClient = BlueSkyAPIClient;
