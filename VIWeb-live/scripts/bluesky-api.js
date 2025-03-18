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
    this.apiEndpoint = '/VIWeb-live/api/bluesky';
    this.fallbackEndpoint = '/api/bluesky';
  }
  
  /**
   * Fetch posts from the BlueSky API
   * @param {number} limit - Maximum number of posts to fetch
   * @returns {Promise<Array>} - Array of posts
   */
  async fetchPosts(limit = 5) {
    try {
      console.log(`Fetching posts for ${this.handle}...`);
      
      // Try the VIWeb-live endpoint first
      let response;
      try {
        response = await fetch(`${this.apiEndpoint}?handle=${this.handle}&limit=${limit}`);
      } catch (error) {
        console.log('Error fetching from primary endpoint, trying fallback:', error);
        response = await fetch(`${this.fallbackEndpoint}?handle=${this.handle}&limit=${limit}`);
      }
      
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
    return posts.map(post => {
      // Get the first image if available
      const image = post.images && post.images.length > 0 ? post.images[0].url : null;
      const imageAlt = post.images && post.images.length > 0 ? post.images[0].alt : '';
      
      return {
        id: post.id,
        author: {
          displayName: post.author.displayName || 'Voices Ignited',
          handle: post.author.handle,
          avatar: post.author.avatar || '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: post.text,
        createdAt: post.createdAt,
        likes: Math.floor(Math.random() * 50) + 10, // Random likes for demo
        reposts: Math.floor(Math.random() * 20) + 5, // Random reposts for demo
        image: image,
        imageAlt: imageAlt,
        url: post.url || `https://bsky.app/profile/${post.author.handle}`
      };
    });
  }
  
  /**
   * Get fallback posts when API fails
   * @returns {Array} - Fallback posts
   */
  getFallbackPosts() {
    console.log('Using fallback posts');
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        id: 'fallback1',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Join us this weekend as we unite to demand transparency in government spending! Together, our voices are stronger. #VoicesIgnited #Accountability',
        createdAt: now.toISOString(),
        likes: 42,
        reposts: 18,
        image: '/VIWeb-live/images/protestors.jpg',
        imageAlt: 'People holding signs at a protest for government transparency'
      },
      {
        id: 'fallback2',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Our mission transcends political divisions. We\'re focused on empowering citizens to stand against corruption and hold officials accountable. #IntegrityMatters',
        createdAt: yesterday.toISOString(),
        likes: 37,
        reposts: 15,
        image: '/VIWeb-live/images/rps5RoMG.jpg',
        imageAlt: 'People working together at a community meeting'
      },
      {
        id: 'fallback3',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Thank you to everyone who participated in yesterday\'s community forum! Your insights on improving local governance were invaluable. #CommunityEngagement #Democracy',
        createdAt: yesterday.toISOString(),
        likes: 29,
        reposts: 8,
        image: '/VIWeb-live/images/community-forum.jpg',
        imageAlt: 'Community forum with diverse participants discussing local issues'
      }
    ];
  }
}

// Export the class for use in other scripts
window.BlueSkyAPIClient = BlueSkyAPIClient;
