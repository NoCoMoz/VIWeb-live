/**
 * BlueSky API Client
 * Handles communication with the BlueSky API
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
     * @returns {Promise<Array>} - Array of formatted posts
     */
    async fetchBlueSkyPosts(limit = 5) {
        try {
            const response = await fetch(`${this.apiEndpoint}?handle=${this.handle}&limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const posts = await response.json();
            return posts;
        } catch (error) {
            console.error('Error fetching BlueSky posts:', error);
            return this.getFallbackPosts();
        }
    }

    /**
     * Get fallback posts in case the API fails
     * @returns {Array} - Array of fallback posts
     */
    getFallbackPosts() {
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
                createdAt: new Date(Date.now() - 86400000).toISOString(),
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
            }
        ];
    }
}

// Export the BlueSkyAPIClient class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlueSkyAPIClient;
} else {
    window.BlueSkyAPIClient = BlueSkyAPIClient;
}
