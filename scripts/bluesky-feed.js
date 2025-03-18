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
   */
  constructor(containerId, options = {}) {
    // Default options
    this.options = {
      postLimit: 5,
      ...options
    };
    
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error(`BlueSky Feed: Container with ID '${containerId}' not found`);
      return;
    }
    
    // Initialize the API client
    this.apiClient = new BlueSkyAPIClient('voicesignited.bsky.social');
    
    this.init();
  }
  
  /**
   * Initialize the feed component
   */
  async init() {
    this.render();
    await this.loadPosts();
  }
  
  /**
   * Render the initial feed structure
   */
  render() {
    this.container.innerHTML = `
      <div class="bluesky-feed-container">
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
  }
  
  /**
   * Format date to be more readable
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // Fallback to original string
    }
  }
  
  /**
   * Load posts from the API
   */
  async loadPosts() {
    try {
      // Fetch posts from the API
      const posts = await this.apiClient.fetchPosts(this.options.postLimit);
      
      // Render the posts
      this.renderPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // If there's an error, use sample posts as fallback
      const fallbackPosts = this.apiClient.getFallbackPosts();
      this.renderPosts(fallbackPosts);
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
      const formattedText = post.text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
      
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
          count.textContent = parseInt(count.textContent) - 1;
        }
      });
    });
  }
}

// Initialize the feed when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the container exists before initializing
  if (document.getElementById('bluesky-feed')) {
    new BlueSkyFeed('bluesky-feed');
  }
});
