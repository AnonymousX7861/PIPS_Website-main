// Dynamic Post Loading System for Pinetown Independent Primary School
// This system dynamically loads and displays school posts, news, events, and announcements

/**
 * Post data structure - stores all school posts
 */
const SchoolPosts = {
    posts: [
        {
            id: 1,
            type: 'news',
            title: 'New Library Books Arrive',
            content: 'We are excited to announce that 150 new books have arrived at our school library. The collection includes adventure stories, educational materials, and interactive learning books suitable for all grade levels. Students can now enjoy reading the latest bestsellers and explore new subjects through our expanded collection.',
            author: 'Mrs. Smith',
            date: '2025-10-25',
            image: '',
            category: 'Library',
            featured: true,
            likes: 15,
            views: 234,
            comments: [
                { author: 'Parent Jones', text: 'Great addition to the library!', date: '2025-10-26' }
            ]
        },
        {
            id: 2,
            type: 'event',
            title: 'Annual Sports Day 2025',
            content: 'Join us for our annual Sports Day on November 15th! Students will participate in various athletic events including relay races, long jump, high jump, and team sports. Parents and families are welcome to attend and cheer for their children. The event starts at 9:00 AM and will include a prize-giving ceremony.',
            author: 'Mr. Johnson',
            date: '2025-10-20',
            image: '',
            category: 'Sports',
            featured: true,
            likes: 28,
            views: 456,
            comments: [
                { author: 'Parent Williams', text: 'Looking forward to this event!', date: '2025-10-21' },
                { author: 'Teacher Brown', text: 'The children are very excited!', date: '2025-10-22' }
            ]
        },
        {
            id: 3,
            type: 'announcement',
            title: 'School Uniform Reminder',
            content: 'Please ensure that all students are wearing the correct school uniform daily. This includes proper shoes, navy blue socks, and school badge. Complete uniforms can be purchased from our uniform shop during school hours. Contact the office for assistance.',
            author: 'Principal Davis',
            date: '2025-10-18',
            image: '',
            category: 'General',
            featured: false,
            likes: 8,
            views: 189,
            comments: []
        },
        {
            id: 4,
            type: 'achievement',
            title: 'Mathematics Olympiad Success',
            content: 'Congratulations to our Grade 6 students who participated in the regional Mathematics Olympiad! Three of our students placed in the top 10, bringing pride to our school. Special recognition goes to Sarah Johnson (2nd place), Michael Chen (7th place), and Emma Wilson (9th place).',
            author: 'Mrs. Brown',
            date: '2025-10-15',
            image: '',
            category: 'Academic',
            featured: true,
            likes: 42,
            views: 678,
            comments: [
                { author: 'Teacher Green', text: 'So proud of our students!', date: '2025-10-16' },
                { author: 'Parent Davis', text: 'Amazing achievement!', date: '2025-10-17' }
            ]
        },
        {
            id: 5,
            type: 'event',
            title: 'Parent-Teacher Conference',
            content: 'Our quarterly parent-teacher conferences are scheduled for November 2-3. Please contact the school office to book your appointment. This is a great opportunity to discuss your child\'s progress and academic development.',
            author: 'School Office',
            date: '2025-10-12',
            image: '',
            category: 'Parent',
            featured: false,
            likes: 12,
            views: 298,
            comments: []
        },
        {
            id: 6,
            type: 'news',
            title: 'Environmental School Garden Project',
            content: 'Our environmental committee has launched a new school garden project. Students from all grades will participate in planting vegetables and flowers. This hands-on learning experience promotes environmental awareness and teaches sustainable practices.',
            author: 'Ms. Green',
            date: '2025-10-10',
            image: '',
            category: 'Environment',
            featured: false,
            likes: 19,
            views: 345,
            comments: [
                { author: 'Grade 4 Student', text: 'Can\'t wait to plant flowers!', date: '2025-10-11' }
            ]
        }
    ],

    // Get posts by type
    getByType: function(type) {
        return this.posts.filter(post => post.type === type);
    },

    // Get featured posts
    getFeatured: function() {
        return this.posts.filter(post => post.featured);
    },

    // Get recent posts
    getRecent: function(limit = 5) {
        return this.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },

    // Get post by ID
    getById: function(id) {
        return this.posts.find(post => post.id === parseInt(id));
    },

    // Search posts
    search: function(query) {
        const searchTerm = query.toLowerCase();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm)
        );
    },

    // Add new post
    add: function(postData) {
        const newPost = {
            id: this.posts.length + 1,
            type: postData.type || 'news',
            title: postData.title,
            content: postData.content,
            author: postData.author,
            date: new Date().toISOString().split('T')[0],
            image: postData.image || '',
            category: postData.category || 'General',
            featured: postData.featured || false,
            likes: 0,
            views: 0,
            comments: []
        };
        this.posts.unshift(newPost);
        return newPost;
    }
};

/**
 * Post rendering and display functions
 */
const PostRenderer = {
    
    // Create HTML for a single post card
    createPostCard: function(post, isPreview = true) {
        const contentPreview = isPreview ? 
            post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '') : 
            post.content;

        const typeIcon = this.getTypeIcon(post.type);
        const formattedDate = this.formatDate(post.date);

        return `
            <article class="post-card ${post.featured ? 'featured' : ''}" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-type">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="type-text">${post.type.charAt(0).toUpperCase() + post.type.slice(1)}</span>
                    </div>
                    ${post.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                
                ${post.image ? `
                    <div class="post-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.style.display='none'">
                    </div>
                ` : ''}
                
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-author">By ${post.author}</span>
                        <span class="post-date">${formattedDate}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <p class="post-excerpt">${contentPreview}</p>
                    
                    <div class="post-stats">
                        <span class="stat">👀 ${post.views} views</span>
                        <span class="stat">👍 ${post.likes} likes</span>
                        <span class="stat">💬 ${post.comments.length} comments</span>
                    </div>
                    
                    <div class="post-actions">
                        <button class="post-btn like-btn" onclick="PostManager.toggleLike(${post.id})">
                            <span class="icon">👍</span>
                            <span class="text">Like</span>
                        </button>
                        <button class="post-btn comment-btn" onclick="PostManager.showPost(${post.id})">
                            <span class="icon">💬</span>
                            <span class="text">Comment</span>
                        </button>
                        ${isPreview ? `
                            <button class="post-btn read-more-btn" onclick="PostManager.showPost(${post.id})">
                                Read More
                            </button>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    },

    // Get icon for post type
    getTypeIcon: function(type) {
        const icons = {
            'news': '📰',
            'event': '📅',
            'announcement': '📢',
            'achievement': '🏆'
        };
        return icons[type] || '📝';
    },

    // Format date for display
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    },

    // Create loading skeleton
    createLoadingSkeleton: function(count = 3) {
        let skeletons = '';
        for (let i = 0; i < count; i++) {
            skeletons += `
                <div class="post-skeleton">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-actions"></div>
                    </div>
                </div>
            `;
        }
        return skeletons;
    },

    // Create empty state
    createEmptyState: function(message = 'No posts found') {
        return `
            <div class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>No Posts Available</h3>
                <p>${message}</p>
            </div>
        `;
    }
};

/**
 * Post management and interaction functions
 */
const PostManager = {
    currentPage: 1,
    postsPerPage: 6,
    isLoading: false,
    loadedPosts: [],

    // Initialize the post system
    init: function() {
        this.addPostStyles();
        this.setupEventListeners();
        this.loadInitialPosts();
        console.log('🚀 Dynamic post system initialized');
    },

    // Load initial posts with animation
    loadInitialPosts: function() {
        this.showLoading();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.loadHomepagePosts();
            this.hideLoading();
        }, 800);
    },

    // Show loading state
    showLoading: function() {
        this.isLoading = true;
        const containers = [
            'featuredPostsContainer',
            'recentPostsContainer', 
            'allPostsContainer',
            'postSearchResults'
        ];

        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = PostRenderer.createLoadingSkeleton();
            }
        });
    },

    // Hide loading state
    hideLoading: function() {
        this.isLoading = false;
    },

    // Load posts for homepage
    loadHomepagePosts: function() {
        // Load featured posts with carousel
        const featuredPosts = SchoolPosts.getFeatured();
        this.renderFeaturedCarousel(featuredPosts);

        // Load recent posts grid
        const recentPosts = SchoolPosts.getRecent(6);
        this.renderPostGrid(recentPosts, 'recentPostsContainer', 'Recent School Updates');
    },

    // Load posts by type (for specific pages)
    loadPostsByType: function(type, containerId) {
        this.showLoading();
        
        setTimeout(() => {
            const posts = SchoolPosts.getByType(type);
            const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Posts`;
            this.renderPostGrid(posts, containerId, title);
            this.hideLoading();
        }, 500);
    },

    // Load all posts with pagination
    loadAllPosts: function(containerId = 'allPostsContainer') {
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const allPosts = SchoolPosts.posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        const paginatedPosts = allPosts.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            this.loadedPosts = [];
        }
        
        this.loadedPosts = [...this.loadedPosts, ...paginatedPosts];
        this.renderPostGrid(this.loadedPosts, containerId, 'All School Posts', false);
        this.renderPagination(allPosts.length, containerId);
    },

    // Search functionality with real-time results
    searchPosts: function(query) {
        if (!query.trim()) {
            this.loadAllPosts('postSearchResults');
            return;
        }

        this.showLoading();
        
        // Simulate search delay
        setTimeout(() => {
            const results = SchoolPosts.search(query);
            this.renderPostGrid(results, 'postSearchResults', `Search Results for "${query}"`);
            this.updateSearchInfo(results.length, query);
            this.hideLoading();
        }, 300);
    },

    // Update search results info
    updateSearchInfo: function(count, query) {
        const infoElement = document.getElementById('searchResultsInfo');
        if (infoElement) {
            infoElement.innerHTML = `
                <div class="search-info">
                    Found <strong>${count}</strong> result${count !== 1 ? 's' : ''} for "<em>${query}</em>"
                </div>
            `;
        }
    },

    // Render post grid
    renderPostGrid: function(posts, containerId, title = '', showLoadMore = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = PostRenderer.createEmptyState();
            return;
        }

        const postsHTML = posts.map(post => PostRenderer.createPostCard(post)).join('');
        
        container.innerHTML = `
            ${title ? `<div class="posts-section-title">
                <h2>${title}</h2>
                <span class="post-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</span>
            </div>` : ''}
            <div class="posts-grid">
                ${postsHTML}
            </div>
            ${showLoadMore ? `
                <div class="load-more-container">
                    <button class="load-more-btn" onclick="PostManager.loadMorePosts()">
                        Load More Posts
                    </button>
                </div>
            ` : ''}
        `;

        // Animate posts in
        this.animatePostsIn(container);
    },

    // Render featured posts carousel
    renderFeaturedCarousel: function(posts) {
        const container = document.getElementById('featuredPostsContainer');
        if (!container || posts.length === 0) return;

        const carouselHTML = `
            <div class="featured-carousel">
                <div class="carousel-header">
                    <h2>⭐ Featured School Updates</h2>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev" onclick="PostManager.carouselPrev()">‹</button>
                        <button class="carousel-btn next" onclick="PostManager.carouselNext()">›</button>
                    </div>
                </div>
                <div class="carousel-container">
                    <div class="carousel-track" id="featuredTrack">
                        ${posts.map(post => `
                            <div class="carousel-slide">
                                ${PostRenderer.createPostCard(post)}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="carousel-indicators">
                    ${posts.map((_, index) => `
                        <button class="indicator ${index === 0 ? 'active' : ''}" 
                                onclick="PostManager.goToSlide(${index})"></button>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = carouselHTML;
        this.currentCarouselIndex = 0;
        this.maxCarouselIndex = posts.length - 1;
    },

    // Animate posts into view
    animatePostsIn: function(container) {
        const postCards = container.querySelectorAll('.post-card');
        postCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    // Show full post in modal
    showPost: function(postId) {
        const post = SchoolPosts.getById(postId);
        if (!post) return;

        // Increment view count
        post.views++;
        this.updatePostStats(postId);

        const modal = this.createPostModal(post);
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    },

    // Create post modal
    createPostModal: function(post) {
        const modal = document.createElement('div');
        modal.className = 'post-modal';
        modal.innerHTML = `
            <div class="post-modal-content">
                <div class="post-modal-header">
                    <div class="modal-title-section">
                        <h2>${post.title}</h2>
                        <div class="modal-meta">
                            <span class="post-type-badge ${post.type}">${PostRenderer.getTypeIcon(post.type)} ${post.type.toUpperCase()}</span>
                            <span>By ${post.author} • ${PostRenderer.formatDate(post.date)}</span>
                        </div>
                    </div>
                    <button class="post-modal-close" onclick="PostManager.closePostModal()">&times;</button>
                </div>
                <div class="post-modal-body">
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-modal-image" onerror="this.style.display='none'">` : ''}
                    <div class="post-full-content">
                        ${post.content}
                    </div>
                    <div class="post-interactions">
                        <button class="interaction-btn like-btn ${post.userLiked ? 'liked' : ''}" onclick="PostManager.toggleLike(${post.id})">
                            👍 <span id="likeCount-${post.id}">${post.likes}</span> Likes
                        </button>
                        <button class="interaction-btn view-btn">
                            👀 ${post.views} Views
                        </button>
                        <button class="interaction-btn share-btn" onclick="PostManager.sharePost(${post.id})">
                            📤 Share
                        </button>
                    </div>
                    <div class="post-comments-section">
                        <h4>Comments (${post.comments.length})</h4>
                        <div class="comments-list" id="commentsList-${post.id}">
                            ${this.renderComments(post.comments)}
                        </div>
                        <div class="add-comment">
                            <textarea placeholder="Add your comment..." id="newComment-${post.id}" maxlength="500"></textarea>
                            <div class="comment-actions">
                                <span class="char-count" id="charCount-${post.id}">0/500</span>
                                <button onclick="PostManager.addComment(${post.id})" class="add-comment-btn">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add character counter
        const textarea = modal.querySelector(`#newComment-${post.id}`);
        const charCount = modal.querySelector(`#charCount-${post.id}`);
        
        textarea.addEventListener('input', function() {
            charCount.textContent = `${this.value.length}/500`;
            charCount.style.color = this.value.length > 450 ? '#dc3545' : '#666';
        });

        return modal;
    },

    // Close post modal
    closePostModal: function() {
        const modal = document.querySelector('.post-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    },

    // Toggle like on post
    toggleLike: function(postId) {
        const post = SchoolPosts.getById(postId);
        if (!post) return;

        post.likes += post.userLiked ? -1 : 1;
        post.userLiked = !post.userLiked;
        
        this.updatePostStats(postId);
        this.updateLikeButton(postId, post.likes, post.userLiked);
    },

    // Update post statistics display
    updatePostStats: function(postId) {
        const post = SchoolPosts.getById(postId);
        if (!post) return;

        // Update in post cards
        const postCards = document.querySelectorAll(`[data-post-id="${postId}"]`);
        postCards.forEach(card => {
            const stats = card.querySelector('.post-stats');
            if (stats) {
                stats.innerHTML = `
                    <span class="stat">👀 ${post.views} views</span>
                    <span class="stat">👍 ${post.likes} likes</span>
                    <span class="stat">💬 ${post.comments.length} comments</span>
                `;
            }
        });

        // Update in modal
        const likeCountElement = document.getElementById(`likeCount-${postId}`);
        if (likeCountElement) {
            likeCountElement.textContent = post.likes;
        }
    },

    // Update like button appearance
    updateLikeButton: function(postId, likes, isLiked) {
        const likeButtons = document.querySelectorAll(`[data-post-id="${postId}"] .like-btn, .post-modal .like-btn`);
        likeButtons.forEach(btn => {
            btn.classList.toggle('liked', isLiked);
            if (btn.querySelector('.text')) {
                btn.querySelector('.text').textContent = isLiked ? 'Liked' : 'Like';
            }
        });
    },

    // Add comment to post
    addComment: function(postId) {
        const textarea = document.getElementById(`newComment-${postId}`);
        const commentText = textarea.value.trim();
        
        if (!commentText) {
            textarea.focus();
            return;
        }
        
        const post = SchoolPosts.getById(postId);
        if (!post) return;

        const newComment = {
            author: 'Anonymous User', // In real app, get from user session
            text: commentText,
            date: new Date().toISOString().split('T')[0]
        };
        
        post.comments.push(newComment);
        textarea.value = '';
        
        // Update character counter
        const charCount = document.getElementById(`charCount-${postId}`);
        if (charCount) charCount.textContent = '0/500';
        
        // Re-render comments
        const commentsList = document.getElementById(`commentsList-${postId}`);
        if (commentsList) {
            commentsList.innerHTML = this.renderComments(post.comments);
        }
        
        // Update comment count in modal header
        const modalHeader = document.querySelector('.post-comments-section h4');
        if (modalHeader) {
            modalHeader.textContent = `Comments (${post.comments.length})`;
        }
        
        this.updatePostStats(postId);
    },

    // Render comments HTML
    renderComments: function(comments) {
        if (comments.length === 0) {
            return '<div class="no-comments">No comments yet. Be the first to comment!</div>';
        }
        
        return comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${PostRenderer.formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `).join('');
    },

    // Share post
    sharePost: function(postId) {
        const post = SchoolPosts.getById(postId);
        if (!post) return;

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content.substring(0, 100) + '...',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback - copy to clipboard
            const shareText = `Check out this post from Pinetown Independent Primary School: "${post.title}" - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                // Final fallback - show share text
                prompt('Copy this link to share:', shareText);
            });
        }
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Carousel functionality
    currentCarouselIndex: 0,
    maxCarouselIndex: 0,

    carouselNext: function() {
        if (this.currentCarouselIndex < this.maxCarouselIndex) {
            this.currentCarouselIndex++;
        } else {
            this.currentCarouselIndex = 0;
        }
        this.updateCarousel();
    },

    carouselPrev: function() {
        if (this.currentCarouselIndex > 0) {
            this.currentCarouselIndex--;
        } else {
            this.currentCarouselIndex = this.maxCarouselIndex;
        }
        this.updateCarousel();
    },

    goToSlide: function(index) {
        this.currentCarouselIndex = index;
        this.updateCarousel();
    },

    updateCarousel: function() {
        const track = document.getElementById('featuredTrack');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (track) {
            const translateX = -this.currentCarouselIndex * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentCarouselIndex);
        });
    },

    // Pagination
    renderPagination: function(totalPosts, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        if (totalPages <= 1) return;

        const paginationHTML = `
            <div class="pagination">
                <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="PostManager.goToPage(${this.currentPage - 1})" 
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    ‹ Previous
                </button>
                
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                    <button class="page-btn ${page === this.currentPage ? 'active' : ''}" 
                            onclick="PostManager.goToPage(${page})">
                        ${page}
                    </button>
                `).join('')}
                
                <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="PostManager.goToPage(${this.currentPage + 1})"
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next ›
                </button>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', paginationHTML);
    },

    goToPage: function(page) {
        this.currentPage = page;
        this.loadAllPosts();
        // Scroll to top of posts
        document.getElementById('allPostsContainer').scrollIntoView({ behavior: 'smooth' });
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Auto-advance carousel every 8 seconds
        setInterval(() => {
            if (this.maxCarouselIndex > 0) {
                this.carouselNext();
            }
        }, 8000);

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('post-modal')) {
                this.closePostModal();
            }
        });

        // Escape key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePostModal();
            }
        });

        // Real-time search
        const searchInput = document.getElementById('postSearchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchPosts(e.target.value);
                }, 300);
            });
        }
    },

    // Add comprehensive styles for the post system
    addPostStyles: function() {
        if (document.getElementById('dynamicPostStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'dynamicPostStyles';
        styles.textContent = `
            /* === Dynamic Post System Styles === */
            .posts-section-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 3px solid #FFD700;
            }

            .posts-section-title h2 {
                color: #000080;
                margin: 0;
                font-size: 1.8rem;
            }

            .post-count {
                background: #000080;
                color: #FFD700;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
            }

            /* Post Grid Layout */
            .posts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 25px;
                margin: 20px 0;
            }

            /* Post Card Styling */
            .post-card {
                background: white;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: all 0.4s ease;
                border: 2px solid transparent;
                position: relative;
            }

            .post-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                border-color: #FFD700;
            }

            .post-card.featured {
                border-color: #FFD700;
                box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
            }

            .post-card.featured::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #FFD700, #FFA500);
            }

            /* Post Header */
            .post-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-bottom: 1px solid #dee2e6;
            }

            .post-type {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: bold;
                color: #000080;
                font-size: 0.9rem;
            }

            .type-icon {
                font-size: 1.2rem;
            }

            .featured-badge {
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000080;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Post Image */
            .post-image {
                width: 100%;
                height: 220px;
                overflow: hidden;
                position: relative;
            }

            .post-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s ease;
            }

            .post-card:hover .post-image img {
                transform: scale(1.1);
            }

            /* Post Content */
            .post-content {
                padding: 25px;
            }

            .post-title {
                margin: 0 0 15px 0;
                font-size: 1.4rem;
                color: #000080;
                line-height: 1.4;
                font-weight: 700;
                transition: color 0.3s ease;
            }

            .post-card:hover .post-title {
                color: #000066;
            }

            .post-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 15px;
                font-size: 0.85rem;
                color: #666;
            }

            .post-meta span {
                position: relative;
            }

            .post-meta span:not(:last-child)::after {
                content: '•';
                position: absolute;
                right: -10px;
                color: #ccc;
            }

            .post-excerpt {
                color: #444;
                line-height: 1.7;
                margin-bottom: 20px;
                font-size: 1rem;
            }

            .post-stats {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                padding: 12px 0;
                border-top: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
            }

            .stat {
                font-size: 0.85rem;
                color: #666;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            /* Post Actions */
            .post-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .post-btn {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
                font-weight: 500;
                text-decoration: none;
            }

            .post-btn:hover {
                background: #000080;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,128,0.3);
            }

            .post-btn.like-btn.liked {
                background: #28a745;
                color: white;
                border-color: #28a745;
            }

            .read-more-btn {
                background: #000080;
                color: #FFD700;
                border-color: #000080;
                font-weight: bold;
                margin-left: auto;
            }

            .read-more-btn:hover {
                background: #000066;
                transform: translateY(-2px) scale(1.05);
            }

            /* Featured Carousel */
            .featured-carousel {
                margin: 40px 0;
                background: white;
                border-radius: 20px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            .carousel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px;
                background: linear-gradient(135deg, #000080, #000066);
                color: #FFD700;
            }

            .carousel-header h2 {
                margin: 0;
                font-size: 1.6rem;
                font-weight: 700;
            }

            .carousel-controls {
                display: flex;
                gap: 12px;
            }

            .carousel-btn {
                background: #FFD700;
                color: #000080;
                border: none;
                width: 60px;
                height: 60px;
                min-width: 60px;
                min-height: 60px;
                max-width: 60px;
                max-height: 60px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.8rem;
                font-weight: bold;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-sizing: border-box;
            }

            .carousel-btn:hover {
                background: white;
                transform: scale(1.15);
                box-shadow: 0 4px 15px rgba(255,215,0,0.4);
            }

            .carousel-container {
                overflow: hidden;
                position: relative;
            }

            .carousel-track {
                display: flex;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .carousel-slide {
                min-width: 100%;
                padding: 25px;
                box-sizing: border-box;
            }

            .carousel-indicators {
                display: flex;
                justify-content: center;
                gap: 12px;
                padding: 25px;
                background: #f8f9fa;
            }

            .indicator {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: none;
                background: #dee2e6;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .indicator.active {
                background: #000080;
                transform: scale(1.3);
            }

            .indicator:hover {
                background: #000066;
                transform: scale(1.2);
            }

            /* Post Modal */
            .post-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(5px);
                opacity: 0;
                transition: opacity 0.3s ease;
                align-items: center;
                justify-content: center;
            }

            .post-modal.show {
                opacity: 1;
            }

            .post-modal-content {
                background: white;
                border-radius: 20px;
                width: 95%;
                max-width: 900px;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalSlideIn 0.4s ease-out;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            @keyframes modalSlideIn {
                from { 
                    transform: translateY(-50px) scale(0.9);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }

            .post-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 25px;
                background: linear-gradient(135deg, #000080, #000066);
                color: #FFD700;
                gap: 20px;
            }

            .modal-title-section h2 {
                margin: 0 0 10px 0;
                font-size: 1.8rem;
                font-weight: 700;
                line-height: 1.3;
            }

            .modal-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                align-items: center;
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .post-type-badge {
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                color: white;
            }

            .post-type-badge.news { background: #17a2b8; }
            .post-type-badge.event { background: #28a745; }
            .post-type-badge.announcement { background: #ffc107; color: #000; }
            .post-type-badge.achievement { background: #dc3545; }

            .post-modal-close {
                background: none;
                border: none;
                color: #FFD700;
                font-size: 2.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                line-height: 1;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .post-modal-close:hover {
                background: rgba(255,215,0,0.2);
                transform: scale(1.1);
            }

            .post-modal-body {
                padding: 30px;
            }

            .post-modal-image {
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                border-radius: 15px;
                margin-bottom: 25px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .post-full-content {
                font-size: 1.1rem;
                line-height: 1.8;
                margin-bottom: 30px;
                color: #333;
            }

            .post-interactions {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
                padding: 20px 0;
                border-top: 1px solid #e9ecef;
                border-bottom: 1px solid #e9ecef;
                flex-wrap: wrap;
            }

            .interaction-btn {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                font-size: 0.95rem;
            }

            .interaction-btn:hover {
                background: #000080;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,128,0.3);
            }

            .interaction-btn.like-btn.liked {
                background: #28a745;
                color: white;
                border-color: #28a745;
            }

            /* Comments Section */
            .post-comments-section h4 {
                color: #000080;
                margin-bottom: 20px;
                font-size: 1.3rem;
                border-bottom: 2px solid #FFD700;
                padding-bottom: 10px;
            }

            .comments-list {
                margin-bottom: 25px;
                max-height: 300px;
                overflow-y: auto;
            }

            .comment {
                background: #f8f9fa;
                padding: 18px;
                border-radius: 12px;
                margin-bottom: 15px;
                border-left: 4px solid #000080;
                transition: all 0.3s ease;
            }

            .comment:hover {
                background: #e9ecef;
                transform: translateX(5px);
            }

            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .comment-author {
                font-weight: bold;
                color: #000080;
                font-size: 0.95rem;
            }

            .comment-date {
                font-size: 0.8rem;
                color: #666;
            }

            .comment-text {
                line-height: 1.6;
                color: #333;
            }

            .no-comments {
                text-align: center;
                color: #666;
                font-style: italic;
                padding: 40px 20px;
                background: #f8f9fa;
                border-radius: 12px;
                border: 2px dashed #dee2e6;
            }

            .add-comment {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 15px;
                border: 1px solid #dee2e6;
            }

            .add-comment textarea {
                width: 100%;
                min-height: 100px;
                padding: 15px;
                border: 1px solid #dee2e6;
                border-radius: 12px;
                resize: vertical;
                font-family: inherit;
                font-size: 1rem;
                line-height: 1.5;
                margin-bottom: 15px;
                transition: border-color 0.3s ease;
            }

            .add-comment textarea:focus {
                outline: none;
                border-color: #000080;
                box-shadow: 0 0 0 3px rgba(0,0,128,0.1);
            }

            .comment-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .char-count {
                font-size: 0.85rem;
                color: #666;
            }

            .add-comment-btn {
                background: #000080;
                color: #FFD700;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }

            .add-comment-btn:hover {
                background: #000066;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,128,0.3);
            }

            /* Loading Skeleton */
            .post-skeleton {
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                animation: pulse 1.5s ease-in-out infinite alternate;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                100% { opacity: 0.7; }
            }

            .skeleton-header {
                height: 60px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }

            .skeleton-image {
                height: 220px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }

            .skeleton-content {
                padding: 25px;
            }

            .skeleton-title {
                height: 25px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
                border-radius: 4px;
                margin-bottom: 15px;
            }

            .skeleton-text {
                height: 16px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
                border-radius: 4px;
                margin-bottom: 10px;
            }

            .skeleton-text:last-of-type {
                width: 70%;
            }

            .skeleton-actions {
                height: 40px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
                border-radius: 25px;
                margin-top: 20px;
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            /* Empty State */
            .empty-state {
                text-align: center;
                padding: 60px 20px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                margin: 20px 0;
            }

            .empty-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                opacity: 0.7;
            }

            .empty-state h3 {
                color: #000080;
                margin-bottom: 10px;
                font-size: 1.5rem;
            }

            .empty-state p {
                color: #666;
                font-size: 1.1rem;
            }

            /* Search Info */
            .search-info {
                background: #e3f2fd;
                border: 1px solid #bbdefb;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                color: #1565c0;
                font-size: 1rem;
            }

            /* Pagination */
            .pagination {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin: 40px 0;
                flex-wrap: wrap;
            }

            .page-btn {
                background: white;
                border: 2px solid #dee2e6;
                color: #000080;
                padding: 12px 18px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                min-width: 45px;
            }

            .page-btn:hover:not(.disabled) {
                background: #000080;
                color: white;
                border-color: #000080;
                transform: translateY(-2px);
            }

            .page-btn.active {
                background: #000080;
                color: #FFD700;
                border-color: #000080;
            }

            .page-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Notification */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                font-weight: 600;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification.error {
                background: #dc3545;
            }

            .notification.warning {
                background: #ffc107;
                color: #000;
            }

            .notification.info {
                background: #17a2b8;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .posts-grid {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                
                .posts-section-title {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .carousel-header {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }
                
                .post-modal-content {
                    width: 98%;
                    margin: 1% auto;
                    max-height: 95vh;
                }
                
                .post-modal-header {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .modal-title-section {
                    width: 100%;
                }
                
                .post-interactions {
                    flex-direction: column;
                }
                
                .interaction-btn {
                    text-align: center;
                }
                
                .post-actions {
                    flex-direction: column;
                }
                
                .post-btn {
                    justify-content: center;
                }
                
                .pagination {
                    gap: 5px;
                }
                
                .page-btn {
                    padding: 10px 14px;
                    font-size: 0.9rem;
                }
            }

            @media (max-width: 480px) {
                .post-card {
                    margin: 0 -10px;
                }
                
                .post-content {
                    padding: 20px;
                }
                
                .post-title {
                    font-size: 1.2rem;
                }
                
                .post-modal-body {
                    padding: 20px;
                }
                
                .carousel-slide {
                    padding: 15px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
};

// Global search function
function searchSchoolPosts() {
    const searchInput = document.getElementById('postSearchInput');
    const query = searchInput ? searchInput.value : '';
    PostManager.searchPosts(query);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if any post containers exist before initializing
    const postContainers = [
        'featuredPostsContainer',
        'recentPostsContainer', 
        'allPostsContainer',
        'postSearchResults'
    ];
    
    const hasPostContainer = postContainers.some(id => document.getElementById(id));
    
    if (hasPostContainer) {
        PostManager.init();
    }
});

// Export for global use
window.PostSystem = {
    SchoolPosts,
    PostRenderer,
    PostManager,
    searchSchoolPosts
};
