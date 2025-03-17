/**
 * BlueSky Feed Component
 * 
 * This script fetches and displays BlueSky posts on the Voices Ignited website.
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
    
    this.init();
  }
  
  /**
   * Initialize the feed component
   */
  init() {
    this.render();
    this.fetchPosts();
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
   * Fetch posts from the BlueSky API
   */
  async fetchPosts() {
    try {
      // Fetch posts from our API endpoint
      const response = await fetch('/api/bluesky');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from BlueSky API');
      }
      
      // Limit the number of posts
      const posts = data.slice(0, this.options.postLimit);
      
      // Render the posts
      this.renderPosts(posts);
    } catch (error) {
      console.error('Error fetching BlueSky posts:', error);
      this.renderError(error.message);
    }
  }
  
  /**
   * Render posts in the feed
   * @param {Array} posts - Array of post objects
   */
  renderPosts(posts) {
    if (posts.length === 0) {
      this.contentContainer.innerHTML = `
        <div class="empty-state">
          <p>No posts available at this time.</p>
        </div>
      `;
      return;
    }
    
    let postsHTML = '<div class="posts-container">';
    
    posts.forEach((post) => {
      // Truncate text if it's too long for horizontal layout
      const truncatedText = post.text.length > 120 
        ? post.text.substring(0, 120) + '...' 
        : post.text;
      
      // Check if post has images
      const hasImages = post.images && post.images.length > 0;
      const imageHTML = hasImages ? `
        <div class="post-image-container">
          <img 
            src="${post.images[0].url}" 
            alt="${post.images[0].alt || 'Post image'}" 
            class="post-image"
            loading="lazy"
          />
        </div>
      ` : '';
        
      postsHTML += `
        <div class="bluesky-post">
          <div class="post-header">
            <div class="author-info">
              <div class="display-name">${post.author.displayName}</div>
              <div class="handle">@${post.author.handle}</div>
            </div>
            <div class="post-date">${this.formatDate(post.createdAt)}</div>
          </div>
          ${imageHTML}
          <div class="post-content">${truncatedText}</div>
          <div class="post-footer">
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="view-post-link">
              View on BlueSky <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      `;
    });
    
    postsHTML += '</div>';
    this.contentContainer.innerHTML = postsHTML;
    
    // Add scroll buttons if there are many posts
    if (posts.length > 3) {
      this.addScrollButtons();
    }
  }
  
  /**
   * Add scroll buttons to navigate the horizontal feed
   */
  addScrollButtons() {
    const container = this.contentContainer.querySelector('.posts-container');
    if (!container) return;
    
    // Create scroll buttons container
    const scrollButtonsContainer = document.createElement('div');
    scrollButtonsContainer.className = 'scroll-buttons';
    
    // Create left scroll button
    const leftButton = document.createElement('button');
    leftButton.className = 'scroll-button scroll-left';
    leftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftButton.addEventListener('click', () => {
      container.scrollBy({ left: -350, behavior: 'smooth' });
    });
    
    // Create right scroll button
    const rightButton = document.createElement('button');
    rightButton.className = 'scroll-button scroll-right';
    rightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightButton.addEventListener('click', () => {
      container.scrollBy({ left: 350, behavior: 'smooth' });
    });
    
    // Add buttons to container
    scrollButtonsContainer.appendChild(leftButton);
    scrollButtonsContainer.appendChild(rightButton);
    
    // Add buttons container after the posts container
    container.parentNode.insertBefore(scrollButtonsContainer, container.nextSibling);
  }
  
  /**
   * Render error message
   * @param {string} message - Error message to display
   */
  renderError(message) {
    this.contentContainer.innerHTML = `
      <div class="error-container">
        <div class="error-message">${message || 'Failed to load posts'}</div>
        <button class="retry-button" id="${this.containerId}-retry">
          Try Again
        </button>
      </div>
    `;
    
    // Add retry event listener
    const retryButton = document.getElementById(`${this.containerId}-retry`);
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        this.contentContainer.innerHTML = `
          <div class="loading-container">
            <div class="loading-icon">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-text">Loading posts...</div>
          </div>
        `;
        this.fetchPosts();
      });
    }
  }
}

// Initialize the feed when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if the container exists before initializing
  if (document.getElementById('bluesky-feed')) {
    new BlueSkyFeed('bluesky-feed', {
      postLimit: 5
    });
  }
});
