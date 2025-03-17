/**
 * BlueSky Feed Component
 * 
 * This script displays static BlueSky posts on the Voices Ignited website.
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
    this.displaySamplePosts();
  }
  
  /**
   * Render the initial feed structure
   */
  render() {
    this.container.innerHTML = `
      <div class="bluesky-feed-container">
        <div class="feed-header">
          <h3><i class="fas fa-cloud"></i> Latest from BlueSky</h3>
          <a href="https://bsky.app/profile/voicesignited.bsky.social" target="_blank" class="view-all-link">View All <i class="fas fa-external-link-alt"></i></a>
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
   * Display sample posts for static sites like GitHub Pages
   */
  displaySamplePosts() {
    // Sample posts that match the Voices Ignited brand voice
    const samplePosts = [
      {
        id: 'post1',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Join us this weekend as we unite to demand transparency in government spending! Together, our voices are stronger. #VoicesIgnited #Accountability',
        createdAt: '2025-03-15T14:30:00Z',
        likes: 42,
        reposts: 18,
        image: '/VIWeb-live/images/protestors.jpg',
        imageAlt: 'People holding signs at a protest for government transparency'
      },
      {
        id: 'post2',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Our mission transcends political divisions. We\'re focused on empowering citizens to stand against corruption and hold officials accountable. #IntegrityMatters',
        createdAt: '2025-03-14T18:15:00Z',
        likes: 37,
        reposts: 15,
        image: '/VIWeb-live/images/rps5RoMG.jpg',
        imageAlt: 'People working together at a community meeting'
      },
      {
        id: 'post3',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'Thank you to everyone who participated in yesterday\'s community forum! Your insights on improving local governance were invaluable. #CommunityEngagement #Democracy',
        createdAt: '2025-03-13T09:45:00Z',
        likes: 29,
        reposts: 8,
        image: '/VIWeb-live/images/community-forum.jpg',
        imageAlt: 'Community forum with diverse participants discussing local issues'
      },
      {
        id: 'post4',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'New blog post: "5 Ways to Hold Your Representatives Accountable" - practical steps every citizen can take to ensure government works for the people. Link in bio! #Advocacy #CitizenPower',
        createdAt: '2025-03-12T16:20:00Z',
        likes: 53,
        reposts: 24,
        image: '/VIWeb-live/images/blog-post.jpg',
        imageAlt: 'Person writing in a notebook with a laptop nearby'
      },
      {
        id: 'post5',
        author: {
          displayName: 'Voices Ignited',
          handle: 'voicesignited.bsky.social',
          avatar: '/VIWeb-live/images/vi_logo_white.jpg'
        },
        content: 'When we stand together against corruption, we create a government that truly represents the people. Join our movement today! #VoicesIgnited #PeoplePower',
        createdAt: '2025-03-11T11:10:00Z',
        likes: 61,
        reposts: 32,
        image: '/VIWeb-live/images/people-power.jpg',
        imageAlt: 'Diverse group of people with raised hands in unity'
      }
    ];

    // Render the posts
    this.renderPosts(samplePosts);
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
    
    // Create post elements
    const postsHTML = posts.map(post => {
      // Format hashtags with the brand color
      const formattedContent = post.content.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
      
      // Image HTML if available
      const imageHTML = post.image ? `
        <div class="post-image">
          <img src="${post.image}" alt="${post.imageAlt || 'Post image'}" loading="lazy">
        </div>
      ` : '';
      
      return `
        <div class="post-card" id="${post.id}">
          <div class="post-header">
            <div class="post-avatar">
              <img src="${post.author.avatar}" alt="${post.author.displayName}" />
            </div>
            <div class="post-author">
              <div class="post-author-name">${post.author.displayName}</div>
              <div class="post-author-handle">@${post.author.handle}</div>
            </div>
            <div class="post-date">${this.formatDate(post.createdAt)}</div>
          </div>
          <div class="post-content">${formattedContent}</div>
          ${imageHTML}
          <div class="post-actions">
            <div class="post-action like">
              <i class="far fa-heart"></i>
              <span>${post.likes}</span>
            </div>
            <div class="post-action repost">
              <i class="fas fa-retweet"></i>
              <span>${post.reposts}</span>
            </div>
            <div class="post-action reply">
              <i class="far fa-comment"></i>
            </div>
            <div class="post-action share">
              <i class="far fa-share-square"></i>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Add posts to container
    this.contentContainer.innerHTML = `
      <div class="posts-container">
        ${postsHTML}
      </div>
    `;
    
    // Add event listeners for post interactions
    this.addPostInteractions();
  }
  
  /**
   * Add interactive elements to posts
   */
  addPostInteractions() {
    // Like button interaction
    const likeButtons = this.contentContainer.querySelectorAll('.post-action.like');
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        const count = button.querySelector('span');
        
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          icon.style.color = '#C6953B'; // Gold from the brand palette
          count.textContent = parseInt(count.textContent) + 1;
        } else {
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
    new BlueSkyFeed('bluesky-feed', {
      postLimit: 5
    });
  }
});
