/**
 * BlueSky Feed Component
 * 
 * This script displays BlueSky posts on the Voices Ignited website.
 * It follows the official color palette and design guidelines.
 */

class BlueSkyFeed {
  /**
   * Initialize the BlueSky feed component
   * @param {string} containerId - The ID of the container element
   * @param {Object} options - Configuration options
   * @param {number} options.postLimit - Maximum number of posts to display
   * @param {string} options.handle - BlueSky handle to fetch posts from
   * @param {boolean} options.autoRefresh - Whether to automatically refresh the feed
   * @param {number} options.refreshInterval - Interval in milliseconds for auto-refresh
   */
  constructor(containerId, options = {}) {
    // Default options
    this.options = {
      postLimit: 5,
      handle: 'voicesignited.bsky.social',
      autoRefresh: true,
      refreshInterval: 300000, // 5 minutes
      ...options
    };
    
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.refreshTimer = null;
    this.isLoading = false;
    
    if (!this.container) {
      console.error(`BlueSky Feed: Container with ID '${containerId}' not found`);
      return;
    }
    
    this.init();
  }
  
  /**
   * Initialize the feed component
   */
  async init() {
    this.render();
    await this.loadPosts();
    
    // Set up auto-refresh if enabled
    if (this.options.autoRefresh) {
      this.startAutoRefresh();
    }
  }
  
  /**
   * Start auto-refresh timer
   */
  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    
    this.refreshTimer = setInterval(() => {
      this.loadPosts(true);
    }, this.options.refreshInterval);
    
    // Add event listener to pause refresh when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      } else if (!document.hidden && !this.refreshTimer && this.options.autoRefresh) {
        this.startAutoRefresh();
      }
    });
  }
  
  /**
   * Render the initial feed structure
   */
  render() {
    this.container.innerHTML = `
      <div class="bluesky-feed-container">
        <div class="feed-header">
          <h3 class="feed-title">Latest Updates</h3>
          <button id="${this.containerId}-refresh" class="refresh-button">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div id="${this.containerId}-content" class="feed-content">
          <div class="loading-container">
            <div class="loading-icon">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-text">Loading posts...</div>
          </div>
        </div>
      </div>
    `;
    
    this.contentContainer = document.getElementById(`${this.containerId}-content`);
    
    // Add refresh button handler
    const refreshButton = document.getElementById(`${this.containerId}-refresh`);
    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        this.loadPosts(true);
      });
    }
  }
  
  /**
   * Format date to be more readable
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      // Format relative time
      if (diffSecs < 60) {
        return 'just now';
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        // Fall back to date format for older posts
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(date);
      }
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // Fallback to original string
    }
  }
  
  /**
   * Load posts from the API
   * @param {boolean} forceRefresh - Whether to force a refresh even if already loading
   */
  async loadPosts(forceRefresh = false) {
    if (this.isLoading && !forceRefresh) return;
    
    this.isLoading = true;
    
    // Show loading indicator if forcing refresh
    if (forceRefresh && this.contentContainer) {
      this.contentContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-icon">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <div class="loading-text">Refreshing posts...</div>
        </div>
      `;
    }
    
    try {
      // Fetch posts from the API
      const response = await fetch(`/api/bluesky?handle=${encodeURIComponent(this.options.handle)}&limit=${this.options.postLimit}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we got an error response with fallback posts
      const posts = data.fallback ? data.posts : data;
      
      // Render the posts
      this.renderPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Show error message
      if (this.contentContainer) {
        this.contentContainer.innerHTML = `
          <div class="error-container">
            <div class="error-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="error-text">Unable to load posts. Please try again later.</div>
            <button id="${this.containerId}-retry" class="retry-button">Retry</button>
          </div>
        `;
        
        // Add retry button handler
        const retryButton = document.getElementById(`${this.containerId}-retry`);
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            this.loadPosts(true);
          });
        }
      }
    } finally {
      this.isLoading = false;
    }
  }
  
  /**
   * Render posts to the feed
   * @param {Array} posts - Array of post objects
   */
  renderPosts(posts) {
    if (!this.contentContainer) return;
    
    // Clear loading indicator
    this.contentContainer.innerHTML = '';
    
    if (!posts || posts.length === 0) {
      this.contentContainer.innerHTML = `
        <div class="no-posts-message">
          <p>No posts available at this time.</p>
          <p>Follow us on <a href="https://bsky.app/profile/voicesignited.bsky.social" target="_blank">BlueSky</a>!</p>
        </div>
      `;
      return;
    }
    
    // Create posts container
    const postsContainer = document.createElement('div');
    postsContainer.className = 'posts-container';
    this.contentContainer.appendChild(postsContainer);
    
    // Create post elements
    posts.forEach(post => {
      // Format hashtags with the brand color
      const formattedText = this.formatPostText(post.text);
      
      // Image HTML if available
      let imageHTML = '';
      if (post.images && post.images.length > 0) {
        imageHTML = `
          <div class="post-image">
            <img src="${post.images[0].url}" alt="${post.images[0].alt || 'Post image'}" loading="lazy">
          </div>
        `;
      }
      
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      postElement.id = post.id;
      postElement.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">
            <img src="${post.author.avatar || '/images/white-logo.76c7025e.png'}" alt="${post.author.displayName}">
          </div>
          <div class="post-author">
            <div class="post-author-name">${post.author.displayName}</div>
            <div class="post-author-handle">@${post.author.handle}</div>
          </div>
          <div class="post-date">${this.formatDate(post.createdAt)}</div>
        </div>
        <div class="post-content">
          ${formattedText}
        </div>
        ${imageHTML}
        <div class="post-actions">
          <div class="post-action like" data-post-id="${post.id}">
            <i class="far fa-heart"></i>
            <span class="count">${post.likes || 0}</span>
          </div>
          <div class="post-action repost">
            <i class="fas fa-retweet"></i>
            <span class="count">${post.reposts || 0}</span>
          </div>
          <div class="post-action">
            <a href="${post.url || `https://bsky.app/profile/${post.author.handle}`}" target="_blank" class="external-link">
              <i class="fas fa-external-link-alt"></i>
              <span>View</span>
            </a>
          </div>
        </div>
      `;
      
      postsContainer.appendChild(postElement);
    });
    
    // Add interaction handlers
    this.addInteractionHandlers();
  }
  
  /**
   * Format post text with links, mentions, and hashtags
   * @param {string} text - Post text
   * @returns {string} Formatted HTML
   */
  formatPostText(text) {
    if (!text) return '';
    
    // Format URLs
    let formattedText = text.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    // Format mentions
    formattedText = formattedText.replace(
      /@([\w.-]+)/g, 
      '<a href="https://bsky.app/profile/$1" target="_blank" class="mention">@$1</a>'
    );
    
    // Format hashtags
    formattedText = formattedText.replace(
      /#([\w]+)/g, 
      '<span class="hashtag">#$1</span>'
    );
    
    return formattedText;
  }
  
  /**
   * Add interaction handlers for likes, reposts, etc.
   */
  addInteractionHandlers() {
    // Like button handler
    const likeButtons = this.contentContainer.querySelectorAll('.post-action.like');
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        const count = button.querySelector('.count');
        
        if (icon.classList.contains('far')) {
          // Like
          icon.classList.remove('far');
          icon.classList.add('fas');
          icon.style.color = '#C6953B';
          count.textContent = parseInt(count.textContent) + 1;
        } else {
          // Unlike
          icon.classList.remove('fas');
          icon.classList.add('far');
          icon.style.color = '';
          count.textContent = Math.max(0, parseInt(count.textContent) - 1);
        }
      });
    });
  }
  
  /**
   * Clean up resources when the component is destroyed
   */
  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

/**
 * BlueSky API Client
 * Simple client for the BlueSky API
 */
class BlueSkyAPIClient {
  /**
   * Initialize the API client
   * @param {string} handle - BlueSky handle to fetch posts from
   */
  constructor(handle) {
    this.handle = handle;
  }
  
  /**
   * Fetch posts from the BlueSky API
   * @param {number} limit - Number of posts to fetch
   * @returns {Promise<Array>} Array of posts
   */
  async fetchBlueSkyPosts(limit = 5) {
    try {
      const response = await fetch(`/api/bluesky?handle=${encodeURIComponent(this.handle)}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching BlueSky posts:', error);
      return this.getFallbackPosts();
    }
  }
  
  /**
   * Get fallback posts when API calls fail
   * @returns {Array} Sample posts
   */
  getFallbackPosts() {
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
}

// Initialize the feed when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the container exists before initializing
  if (document.getElementById('bluesky-feed')) {
    // Create a new feed instance
    window.blueSkyFeed = new BlueSkyFeed('bluesky-feed', {
      postLimit: 5,
      handle: 'voicesignited.bsky.social',
      autoRefresh: true,
      refreshInterval: 300000 // 5 minutes
    });
  }
});
