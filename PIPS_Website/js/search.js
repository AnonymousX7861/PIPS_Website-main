/**
 * SEO-Optimized Search System for Pinetown Independent Primary School
 * Includes: Keyword Research, Title Tags, Image Optimization, URL Structure, 
 * Internal Linking, Mobile Friendliness, Backlinks, Sitemap, Page Speed, Security
 */

class SEOSearchManager {
    constructor() {
        this.searchData = this.initializeSearchData();
        this.seoKeywords = this.initializeSEOKeywords();
        this.urlStructure = this.initializeURLStructure();
        this.internalLinks = this.initializeInternalLinks();
        this.securityConfig = this.initializeSecurityConfig();
        this.initializeMobileOptimization();
        this.initializePageSpeedOptimization();
    }

    // 1. KEYWORD RESEARCH - Strategic keyword mapping for better search rankings
    initializeSEOKeywords() {
        return {
            primary: [
                'Pinetown Independent Primary School',
                'primary school Pinetown',
                'independent school KwaZulu-Natal',
                'private primary education',
                'quality education Pinetown'
            ],
            secondary: [
                'school admissions Pinetown',
                'primary school resources',
                'school uniform shop',
                'parent notices',
                'school events calendar',
                'grade 1-7 education',
                'academic programs',
                'school facilities'
            ],
            longtail: [
                'best private primary school in Pinetown',
                'independent primary school near me',
                'school with quality education in KwaZulu-Natal',
                'primary school admissions 2025',
                'affordable private school Pinetown',
                'small class sizes primary school',
                'excellent academic results Pinetown'
            ],
            local: [
                'Pinetown schools',
                'KwaZulu-Natal education',
                'Durban area schools',
                'Hill Street school',
                '3610 area schools'
            ]
        };
    }

    // 2. TITLE TAGS - Dynamic, SEO-optimized titles based on search context
    generateSEOTitle(searchTerm, category = '', results = 0) {
        const baseTitle = 'Pinetown Independent Primary School';
        
        if (!searchTerm) {
            return `${baseTitle} - Quality Education in Pinetown, KwaZulu-Natal`;
        }

        const categoryTitles = {
            resources: `Educational Resources - ${baseTitle}`,
            uniforms: `School Uniforms & Supplies - ${baseTitle}`,
            notices: `School Notices & Updates - ${baseTitle}`,
            events: `School Events & Calendar - ${baseTitle}`
        };

        if (category && categoryTitles[category]) {
            return `${searchTerm} | ${categoryTitles[category]} | ${results} Results`;
        }

        return `Search: ${searchTerm} | ${baseTitle} | ${results} Results Found`;
    }

    // 3. IMAGE OPTIMIZATION - Structured image data with SEO attributes
    optimizeSearchImages() {
        return {
            logo: {
                src: '_images/logo.jpg',
                alt: 'Pinetown Independent Primary School Logo - Quality Education Since Foundation',
                title: 'Pinetown Independent Primary School',
                width: 75,
                height: 45,
                loading: 'eager',
                fetchpriority: 'high'
            },
            searchIcon: {
                emoji: '🔍',
                alt: 'Search School Information',
                title: 'Search Pinetown Independent Primary School Resources'
            },
            categoryIcons: {
                resources: { emoji: '📚', alt: 'Educational Resources', title: 'School Learning Resources and Materials' },
                uniforms: { emoji: '👕', alt: 'School Uniforms', title: 'Official School Uniform and Supplies' },
                notices: { emoji: '📢', alt: 'School Notices', title: 'Important School Announcements and Updates' },
                events: { emoji: '📅', alt: 'School Events', title: 'School Calendar and Upcoming Events' }
            }
        };
    }

    // 4. URL STRUCTURE - SEO-friendly URL patterns
    initializeURLStructure() {
        return {
            base: window.location.origin,
            pages: {
                home: '/',
                about: '/about.html',
                admissions: '/admissions.html',
                resources: '/resources.html',
                uniforms: '/uniform_shop.html',
                notices: '/notice_board.html',
                contact: '/contact.html',
                gallery: '/gallery.html',
                enquiry: '/enquiry.html',
                volunteers: '/volunteer.html'
            },
            searchParams: {
                query: 'q',
                category: 'cat',
                grade: 'grade',
                type: 'type'
            }
        };
    }

    // Generate SEO-friendly search URLs
    generateSearchURL(searchTerm, category = '', grade = '') {
        const params = new URLSearchParams();
        if (searchTerm) params.set(this.urlStructure.searchParams.query, searchTerm);
        if (category) params.set(this.urlStructure.searchParams.category, category);
        if (grade) params.set(this.urlStructure.searchParams.grade, grade);
        
        const queryString = params.toString();
        return queryString ? `${this.urlStructure.base}${this.urlStructure.pages.home}?${queryString}` : this.urlStructure.base;
    }

    // 5. INTERNAL LINKING - Strategic internal link structure
    initializeInternalLinks() {
        return {
            navigationLinks: [
                { text: 'Home', url: 'index.html', title: 'Pinetown Independent Primary School Home Page' },
                { text: 'About Us', url: 'about.html', title: 'About Pinetown Independent Primary School - Vision & Mission' },
                { text: 'Admissions', url: 'admissions.html', title: 'School Admissions - Enroll Your Child Today' },
                { text: 'Resources', url: 'resources.html', title: 'Educational Resources and Learning Materials' },
                { text: 'Uniform Shop', url: 'uniform_shop.html', title: 'Official School Uniform and Supplies Store' },
                { text: 'Notice Board', url: 'notice_board.html', title: 'School Notices, Announcements and Updates' },
                { text: 'Contact', url: 'contact.html', title: 'Contact Pinetown Independent Primary School' },
                { text: 'Gallery', url: 'gallery.html', title: 'School Photo Gallery - Campus and Events' },
                { text: 'Enquiries', url: 'enquiry.html', title: 'Make an Enquiry - Get Information About Our School' },
                { text: 'Volunteers', url: 'volunteer.html', title: 'Volunteer Opportunities and School Sponsorship' }
            ],
            relatedContent: {
                resources: ['admissions.html', 'about.html', 'contact.html'],
                uniforms: ['admissions.html', 'resources.html', 'notice_board.html'],
                notices: ['gallery.html', 'resources.html', 'volunteer.html'],
                events: ['gallery.html', 'notice_board.html', 'contact.html']
            },
            breadcrumbs: {
                separator: ' > ',
                home: 'Home',
                search: 'Search Results'
            }
        };
    }

    // Generate breadcrumb navigation
    generateBreadcrumbs(currentPage = 'search', searchTerm = '') {
        const breadcrumbs = [
            { text: this.internalLinks.breadcrumbs.home, url: 'index.html' }
        ];

        if (currentPage === 'search' && searchTerm) {
            breadcrumbs.push({ 
                text: `Search: ${searchTerm}`, 
                url: this.generateSearchURL(searchTerm),
                current: true 
            });
        }

        return breadcrumbs;
    }

    // 6. MOBILE FRIENDLINESS - Responsive design optimization
    initializeMobileOptimization() {
        // Add viewport meta tag if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Mobile-specific styles for search
        const mobileStyles = `
            @media (max-width: 768px) {
                .search-container {
                    padding: 15px !important;
                    margin: 10px 0 !important;
                }
                .search-input {
                    font-size: 16px !important; /* Prevents zoom on iOS */
                    padding: 18px 70px 18px 20px !important;
                }
                .search-categories {
                    gap: 8px !important;
                }
                .search-button {
                    padding: 10px 15px !important;
                    font-size: 1rem !important;
                }
                .search-results {
                    padding: 15px !important;
                    margin-top: 15px !important;
                }
                .quick-links {
                    flex-direction: column !important;
                    gap: 10px !important;
                }
            }
            @media (max-width: 480px) {
                .search-categories {
                    flex-direction: column !important;
                    align-items: center !important;
                }
                .search-category-btn {
                    width: 90% !important;
                    max-width: 200px !important;
                }
            }
        `;

        // Add mobile styles to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
    }

    // 7. PAGE SPEED OPTIMIZATION
    initializePageSpeedOptimization() {
        // Debounce search function to reduce API calls
        this.debouncedSearch = this.debounce(this.performSearch.bind(this), 300);
        
        // Lazy load search results
        this.lazyLoadResults = true;
        this.resultsBatchSize = 10;
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize images
        this.optimizeImages();
    }

    // Debounce utility for search performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/style.css', as: 'style' },
            { href: '_images/logo.jpg', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Image optimization
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) img.loading = 'lazy';
            if (!img.decoding) img.decoding = 'async';
        });
    }

    // 8. SECURITY CONFIGURATION
    initializeSecurityConfig() {
        return {
            inputSanitization: {
                allowedChars: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
                maxLength: 100,
                preventXSS: true
            },
            contentSecurityPolicy: {
                'default-src': "'self'",
                'script-src': "'self' 'unsafe-inline'",
                'style-src': "'self' 'unsafe-inline'",
                'img-src': "'self' data: https:",
                'connect-src': "'self'"
            },
            rateLimiting: {
                maxRequestsPerMinute: 30,
                blockDuration: 60000 // 1 minute
            }
        };
    }

    // Sanitize search input for security
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';
        
        // Remove potentially dangerous characters
        let sanitized = input.trim();
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/[<>]/g, '');
        sanitized = sanitized.substring(0, this.securityConfig.inputSanitization.maxLength);
        
        // Only allow safe characters
        if (!this.securityConfig.inputSanitization.allowedChars.test(sanitized)) {
            sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.,!?()]/g, '');
        }
        
        return sanitized;
    }

    // 9. SITEMAP GENERATION
    generateSitemap() {
        const sitemap = {
            urls: [
                {
                    loc: this.urlStructure.base + '/',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'daily',
                    priority: '1.0'
                },
                {
                    loc: this.urlStructure.base + '/about.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.9'
                },
                {
                    loc: this.urlStructure.base + '/admissions.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.9'
                },
                {
                    loc: this.urlStructure.base + '/resources.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.8'
                },
                {
                    loc: this.urlStructure.base + '/uniform_shop.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.7'
                },
                {
                    loc: this.urlStructure.base + '/notice_board.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'daily',
                    priority: '0.8'
                },
                {
                    loc: this.urlStructure.base + '/contact.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.8'
                },
                {
                    loc: this.urlStructure.base + '/gallery.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.6'
                },
                {
                    loc: this.urlStructure.base + '/enquiry.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.7'
                },
                {
                    loc: this.urlStructure.base + '/volunteer.html',
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'monthly',
                    priority: '0.6'
                }
            ]
        };

        return sitemap;
    }

    // 10. ROBOTS.TXT CONFIGURATION
    generateRobotsTxt() {
        return `# Robots.txt for Pinetown Independent Primary School
# Generated by SEO-Optimized Search System

User-agent: *
Allow: /

# Main pages
Allow: /index.html
Allow: /about.html
Allow: /admissions.html
Allow: /resources.html
Allow: /uniform_shop.html
Allow: /notice_board.html
Allow: /contact.html
Allow: /gallery.html
Allow: /enquiry.html
Allow: /volunteer.html

# Static resources
Allow: /css/
Allow: /_images/
Allow: /js/

# Search functionality
Allow: /?q=*
Allow: /?cat=*
Allow: /?grade=*

# Disallow sensitive areas
Disallow: /admin/
Disallow: /private/
Disallow: /tmp/
Disallow: /.git/

# Sitemap location
Sitemap: ${this.urlStructure.base}/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Specific instructions for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2`;
    }

    // SEARCH DATA INITIALIZATION
    initializeSearchData() {
        return {
            resources: {
                'grade-1': [
                    'Reading books', 'Math workbooks', 'Art supplies', 
                    'Learning games', 'Phonics materials', 'Coloring books',
                    'Number charts', 'Alphabet posters', 'Educational toys'
                ],
                'grade-2': [
                    'Chapter books', 'Addition/subtraction worksheets', 'Science kits',
                    'Writing journals', 'Spelling lists', 'Math manipulatives',
                    'Story books', 'Handwriting practice', 'Educational apps'
                ],
                'grade-3': [
                    'Multiplication tables', 'Geography maps', 'History books',
                    'Science experiments', 'Creative writing guides', 'Atlas books',
                    'Math games', 'Research projects', 'Educational videos'
                ],
                'grade-4': [
                    'Research projects', 'Calculator usage', 'Social studies books',
                    'Literature novels', 'STEM activities', 'Dictionary',
                    'Encyclopedia', 'Math textbooks', 'Science equipment'
                ],
                'grade-5': [
                    'Advanced math concepts', 'Science fair projects', 'Essay writing guides',
                    'Computer skills', 'Library research', 'Presentation tools',
                    'Advanced readers', 'Study guides', 'Online resources'
                ],
                'grade-6': [
                    'Pre-algebra books', 'Biology basics', 'World history',
                    'Critical thinking exercises', 'Public speaking', 'Research methods',
                    'Advanced science', 'Literature analysis', 'Technology tools'
                ],
                'grade-7': [
                    'Algebra preparation', 'Advanced sciences', 'High school prep',
                    'Leadership skills', 'Career exploration', 'University prep',
                    'Advanced mathematics', 'Scientific research', 'Academic excellence'
                ]
            },
            uniforms: {
                'grade-1': [
                    'School shirt (size 6-8)', 'School shorts/skirt', 'School hat',
                    'Black school shoes', 'Navy socks', 'School bag', 'Name tags'
                ],
                'grade-2': [
                    'School shirt (size 8-10)', 'School shorts/skirt', 'School hat',
                    'Black school shoes', 'Navy socks', 'School bag', 'PE kit'
                ],
                'grade-3': [
                    'School shirt (size 10-12)', 'School shorts/skirt', 'School blazer',
                    'Black school shoes', 'Navy socks', 'School tie', 'Winter jersey'
                ],
                'grade-4': [
                    'School shirt (size 12-14)', 'School shorts/skirt', 'School blazer',
                    'Black school shoes', 'School tie', 'Sports uniform', 'School badge'
                ],
                'grade-5': [
                    'School shirt (size 14-16)', 'School trousers/skirt', 'School blazer',
                    'Black school shoes', 'School tie', 'Formal uniform', 'House colors'
                ],
                'grade-6': [
                    'School shirt (size 16-18)', 'School trousers/skirt', 'School blazer',
                    'Black school shoes', 'School tie', 'Prefect badge', 'Leadership tie'
                ],
                'grade-7': [
                    'School shirt (size 18-20)', 'School trousers/skirt', 'School blazer',
                    'Black school shoes', 'School tie', 'Head boy/girl badge', 'Graduation gown'
                ]
            },
            notices: {
                'grade-1': [
                    'Parent-teacher meetings', 'Show and tell days', 'Field trip permissions',
                    'Reading assessment', 'Art exhibition', 'Swimming lessons', 'Health checks'
                ],
                'grade-2': [
                    'Spelling bee competition', 'Math games day', 'Library visits',
                    'Health checkups', 'Sports day participation', 'Music lessons', 'Book fair'
                ],
                'grade-3': [
                    'Science project due dates', 'Swimming lessons', 'Music recital',
                    'Book fair', 'Academic assessments', 'Environmental day', 'Cultural events'
                ],
                'grade-4': [
                    'History project presentations', 'Computer lab schedule', 'Inter-school competitions',
                    'Career day', 'Exam timetables', 'Science fair', 'Drama productions'
                ],
                'grade-5': [
                    'Leadership opportunities', 'Science fair registration', 'High school preparation',
                    'Study groups', 'Achievement awards', 'Debate competitions', 'Academic excellence'
                ],
                'grade-6': [
                    'Prefect nominations', 'Advanced courses', 'University visits',
                    'Scholarship information', 'Graduation preparation', 'Leadership training', 'Awards ceremony'
                ],
                'grade-7': [
                    'High school applications', 'Final examinations', 'Graduation ceremony',
                    'Award nominations', 'Farewell events', 'Alumni network', 'Future planning'
                ]
            },
            events: {
                'grade-1': [
                    'Welcome party', 'Learning celebration', 'Family fun day',
                    'Art showcase', 'Reading festival', 'Teddy bear picnic', 'Christmas concert'
                ],
                'grade-2': [
                    'Math carnival', 'Science discovery day', 'Cultural day',
                    'Sports activities', 'Music concert', 'Spring festival', 'Heritage day'
                ],
                'grade-3': [
                    'Environmental day', 'Heritage celebration', 'Talent show',
                    'Academic fair', 'Community service', 'Winter festival', 'Art exhibition'
                ],
                'grade-4': [
                    'Leadership workshop', 'Technology expo', 'Drama performance',
                    'Inter-house competitions', 'Career exploration', 'Science olympiad', 'Music festival'
                ],
                'grade-5': [
                    'Innovation fair', 'Public speaking contest', 'Academic olympics',
                    'Community projects', 'Achievement ceremony', 'Debate tournament', 'Awards evening'
                ],
                'grade-6': [
                    'Model UN simulation', 'Science symposium', 'Literary festival',
                    'Entrepreneurship day', 'Awards evening', 'Leadership summit', 'Academic conference'
                ],
                'grade-7': [
                    'Graduation gala', 'Final showcase', 'Alumni networking',
                    'Scholarship ceremony', 'Farewell celebration', 'Valedictory service', 'Future leaders forum'
                ]
            }
        };
    }

    // ENHANCED SEARCH FUNCTIONALITY WITH SEO
    performSearch(searchTerm, category = '', grade = '') {
        // Sanitize input for security
        searchTerm = this.sanitizeInput(searchTerm);
        
        if (!searchTerm.trim()) {
            this.displayError('Please enter a search term.');
            return;
        }

        // Update page title for SEO
        const results = this.getSearchResults(searchTerm, category, grade);
        document.title = this.generateSEOTitle(searchTerm, category, results.length);

        // Update URL for SEO
        const newUrl = this.generateSearchURL(searchTerm, category, grade);
        history.pushState({ searchTerm, category, grade }, '', newUrl);

        // Display results with SEO enhancements
        this.displaySearchResults(results, searchTerm, category, grade);

        // Track search for analytics (SEO insights)
        this.trackSearch(searchTerm, category, grade, results.length);
    }

    // Get search results with keyword matching
    getSearchResults(searchTerm, category, grade) {
        const results = [];
        const searchCategories = category ? [category] : ['resources', 'uniforms', 'notices', 'events'];
        const searchLower = searchTerm.toLowerCase();

        searchCategories.forEach(cat => {
            if (grade && this.searchData[cat][grade]) {
                this.searchData[cat][grade].forEach(item => {
                    if (item.toLowerCase().includes(searchLower)) {
                        results.push({
                            category: cat,
                            grade: grade.replace('grade-', 'Grade '),
                            item: item,
                            relevanceScore: this.calculateRelevanceScore(item, searchTerm)
                        });
                    }
                });
            } else {
                Object.keys(this.searchData[cat]).forEach(gradeKey => {
                    this.searchData[cat][gradeKey].forEach(item => {
                        if (item.toLowerCase().includes(searchLower)) {
                            results.push({
                                category: cat,
                                grade: gradeKey.replace('grade-', 'Grade '),
                                item: item,
                                relevanceScore: this.calculateRelevanceScore(item, searchTerm)
                            });
                        }
                    });
                });
            }
        });

        // Sort by relevance score for better SEO
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Calculate relevance score for search ranking
    calculateRelevanceScore(item, searchTerm) {
        const itemLower = item.toLowerCase();
        const termLower = searchTerm.toLowerCase();
        
        let score = 0;
        
        // Exact match gets highest score
        if (itemLower === termLower) score += 100;
        
        // Starts with search term
        if (itemLower.startsWith(termLower)) score += 50;
        
        // Contains search term
        if (itemLower.includes(termLower)) score += 25;
        
        // Word boundary matches
        const words = termLower.split(' ');
        words.forEach(word => {
            if (itemLower.includes(word)) score += 10;
        });
        
        return score;
    }

    // Display search results with SEO enhancements
    displaySearchResults(results, searchTerm, category, grade) {
        const resultsContainer = document.getElementById('searchResults');
        const resultsList = document.getElementById('resultsList');
        
        if (!resultsContainer || !resultsList) return;

        // Add structured data for search results
        this.addSearchResultsStructuredData(results, searchTerm);

        // Generate breadcrumbs
        const breadcrumbs = this.generateBreadcrumbs('search', searchTerm);
        
        let html = this.generateBreadcrumbsHTML(breadcrumbs);

        if (results.length === 0) {
            html += `<div class="no-results">
                <h3>No results found for "${searchTerm}"</h3>
                <p>Try different keywords or browse our pages:</p>
                ${this.generateSuggestedLinks()}
            </div>`;
        } else {
            html += `<div class="search-summary">
                <h3>Found ${results.length} result(s) for "${searchTerm}"</h3>
                ${this.generateFilterSummary(category, grade)}
            </div>`;
            
            html += this.generateResultsHTML(results);
            html += this.generateRelatedLinks(category);
        }

        resultsList.innerHTML = html;
        resultsContainer.style.display = 'block';

        // Add click tracking for internal links
        this.addLinkTracking();
    }

    // Generate breadcrumbs HTML
    generateBreadcrumbsHTML(breadcrumbs) {
        const separator = this.internalLinks.breadcrumbs.separator;
        return `<nav class="breadcrumbs" aria-label="Breadcrumb">
            ${breadcrumbs.map((crumb, index) => {
                if (crumb.current) {
                    return `<span class="current">${crumb.text}</span>`;
                }
                return `<a href="${crumb.url}" title="${crumb.text}">${crumb.text}</a>`;
            }).join(separator)}
        </nav>`;
    }

    // Generate suggested links for no results
    generateSuggestedLinks() {
        const suggestions = this.internalLinks.navigationLinks.slice(0, 6);
        return `<div class="suggested-links">
            ${suggestions.map(link => 
                `<a href="${link.url}" title="${link.title}" class="suggested-link">${link.text}</a>`
            ).join('')}
        </div>`;
    }

    // Generate filter summary
    generateFilterSummary(category, grade) {
        let summary = '';
        if (category) summary += ` in ${category}`;
        if (grade) summary += ` for ${grade.replace('grade-', 'Grade ')}`;
        return summary ? `<p class="filter-summary">Filtered${summary}</p>` : '';
    }

    // Generate results HTML with internal linking
    generateResultsHTML(results) {
        const grouped = this.groupResultsByCategory(results);
        const imageData = this.optimizeSearchImages();
        
        let html = '<div class="search-results-grid">';
        
        Object.keys(grouped).forEach(category => {
            const categoryIcon = imageData.categoryIcons[category];
            html += `<div class="category-section">
                <h4 class="category-title">
                    <span class="category-icon" title="${categoryIcon.title}">${categoryIcon.emoji}</span>
                    <a href="${this.urlStructure.pages[category] || '#'}" title="${categoryIcon.title}">
                        ${category.charAt(0).toUpperCase() + category.slice(1)}
                    </a>
                </h4>`;
            
            Object.keys(grouped[category]).forEach(grade => {
                html += `<div class="grade-section">
                    <h5 class="grade-title">${grade}</h5>
                    <ul class="results-list">`;
                
                grouped[category][grade].forEach(item => {
                    html += `<li class="result-item">
                        <span class="result-text">${this.highlightSearchTerm(item.item, searchTerm)}</span>
                        <span class="relevance-score" title="Relevance: ${item.relevanceScore}%">
                            ${this.getRelevanceStars(item.relevanceScore)}
                        </span>
                    </li>`;
                });
                
                html += '</ul></div>';
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }

    // Group results by category for better organization
    groupResultsByCategory(results) {
        const grouped = {};
        results.forEach(result => {
            if (!grouped[result.category]) grouped[result.category] = {};
            if (!grouped[result.category][result.grade]) grouped[result.category][result.grade] = [];
            grouped[result.category][result.grade].push(result);
        });
        return grouped;
    }

    // Highlight search terms in results
    highlightSearchTerm(text, searchTerm) {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Generate relevance stars
    getRelevanceStars(score) {
        const stars = Math.min(5, Math.floor(score / 20));
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    // Generate related links for internal linking
    generateRelatedLinks(category) {
        if (!category || !this.internalLinks.relatedContent[category]) return '';
        
        const relatedPages = this.internalLinks.relatedContent[category];
        const links = relatedPages.map(page => {
            const linkData = this.internalLinks.navigationLinks.find(nav => nav.url === page);
            return linkData ? `<a href="${linkData.url}" title="${linkData.title}" class="related-link">${linkData.text}</a>` : '';
        }).filter(link => link).join('');
        
        return `<div class="related-links">
            <h4>Related Pages</h4>
            <div class="related-links-grid">${links}</div>
        </div>`;
    }

    // Add structured data for search results
    addSearchResultsStructuredData(results, searchTerm) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "name": `Search Results for ${searchTerm}`,
            "description": `Search results for ${searchTerm} at Pinetown Independent Primary School`,
            "url": window.location.href,
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": results.length,
                "itemListElement": results.slice(0, 10).map((result, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": result.item,
                    "description": `${result.category} for ${result.grade}`,
                    "url": this.urlStructure.pages[result.category] || window.location.href
                }))
            }
        };

        // Remove existing structured data
        const existingData = document.querySelector('script[type="application/ld+json"]');
        if (existingData) existingData.remove();

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Track search for analytics and SEO insights
    trackSearch(searchTerm, category, grade, resultCount) {
        // This would integrate with Google Analytics, Search Console, etc.
        const searchData = {
            searchTerm,
            category,
            grade,
            resultCount,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store in localStorage for SEO analysis
        const searches = JSON.parse(localStorage.getItem('searchAnalytics') || '[]');
        searches.push(searchData);
        
        // Keep only last 100 searches
        if (searches.length > 100) searches.shift();
        
        localStorage.setItem('searchAnalytics', JSON.stringify(searches));

        // Send to analytics (would be implemented with actual analytics service)
        console.log('Search tracked:', searchData);
    }

    // Add click tracking for internal links
    addLinkTracking() {
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                const linkData = {
                    href: link.href,
                    text: link.textContent,
                    timestamp: new Date().toISOString(),
                    source: 'search-results'
                };
                
                // Track internal link clicks
                console.log('Link clicked:', linkData);
            });
        });
    }

    // Display error messages
    displayError(message) {
        const resultsList = document.getElementById('resultsList');
        if (resultsList) {
            resultsList.innerHTML = `<div class="error-message">
                <p style="color: #dc3545; font-size: 1.1rem;">${message}</p>
            </div>`;
            document.getElementById('searchResults').style.display = 'block';
        }
    }

    // Initialize SEO features on page load
    initializeSEO() {
        // Add meta tags
        this.addSEOMetaTags();
        
        // Add Open Graph tags
        this.addOpenGraphTags();
        
        // Add Twitter Card tags
        this.addTwitterCardTags();
        
        // Add canonical URL
        this.addCanonicalURL();
        
        // Initialize search from URL parameters
        this.initializeFromURL();
    }

    // Add SEO meta tags
    addSEOMetaTags() {
        const metaTags = [
            { name: 'description', content: 'Search Pinetown Independent Primary School for resources, uniforms, notices, and events. Quality education in Pinetown, KwaZulu-Natal.' },
            { name: 'keywords', content: this.seoKeywords.primary.concat(this.seoKeywords.secondary).join(', ') },
            { name: 'author', content: 'Pinetown Independent Primary School' },
            { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
            { name: 'googlebot', content: 'index, follow' },
            { name: 'bingbot', content: 'index, follow' },
            { name: 'language', content: 'English' },
            { name: 'geo.region', content: 'ZA-KZN' },
            { name: 'geo.placename', content: 'Pinetown, KwaZulu-Natal, South Africa' },
            { name: 'geo.position', content: '-29.816141;30.857285' },
            { name: 'ICBM', content: '-29.816141, 30.857285' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Add Open Graph tags
    addOpenGraphTags() {
        const ogTags = [
            { property: 'og:title', content: 'Search - Pinetown Independent Primary School' },
            { property: 'og:description', content: 'Find school resources, uniforms, notices, and events at Pinetown Independent Primary School.' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: window.location.href },
            { property: 'og:image', content: `${this.urlStructure.base}/_images/logo.jpg` },
            { property: 'og:site_name', content: 'Pinetown Independent Primary School' },
            { property: 'og:locale', content: 'en_ZA' }
        ];

        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Add Twitter Card tags
    addTwitterCardTags() {
        const twitterTags = [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'Search - Pinetown Independent Primary School' },
            { name: 'twitter:description', content: 'Find school resources, uniforms, notices, and events.' },
            { name: 'twitter:image', content: `${this.urlStructure.base}/_images/logo.jpg` }
        ];

        twitterTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Add canonical URL
    addCanonicalURL() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('?')[0]; // Remove query parameters
            document.head.appendChild(canonical);
        }
    }

    // Initialize search from URL parameters
    initializeFromURL() {
        const params = new URLSearchParams(window.location.search);
        const searchTerm = params.get(this.urlStructure.searchParams.query);
        const category = params.get(this.urlStructure.searchParams.category);
        const grade = params.get(this.urlStructure.searchParams.grade);

        if (searchTerm) {
            const searchInput = document.getElementById('schoolSearch');
            const gradeSelect = document.getElementById('gradeSelect');
            
            if (searchInput) searchInput.value = searchTerm;
            if (gradeSelect && grade) gradeSelect.value = grade;
            
            // Perform search automatically
            this.performSearch(searchTerm, category, grade);
        }
    }
}

// Initialize SEO Search Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.seoSearchManager = new SEOSearchManager();
    
    // Initialize SEO features
    window.seoSearchManager.initializeSEO();
    
    // Override global search functions to use SEO manager
    window.performSearch = function() {
        const searchTerm = document.getElementById('schoolSearch')?.value || '';
        const grade = document.getElementById('gradeSelect')?.value || '';
        window.seoSearchManager.performSearch(searchTerm, window.currentFilter || '', grade);
    };
    
    window.filterSearch = function(category) {
        window.currentFilter = category;
        const searchInput = document.getElementById('schoolSearch');
        if (searchInput) {
            searchInput.placeholder = `Search for ${category}...`;
        }
        
        // Update button styles
        document.querySelectorAll('[onclick^="filterSearch"]').forEach(btn => {
            btn.style.opacity = '0.7';
            btn.style.transform = 'scale(0.95)';
        });
        
        event.target.style.opacity = '1';
        event.target.style.transform = 'scale(1.05)';
        
        if (searchInput && searchInput.value) {
            window.seoSearchManager.performSearch(searchInput.value, category, 
                document.getElementById('gradeSelect')?.value || '');
        }
    };
    
    window.clearSearch = function() {
        window.currentFilter = '';
        const searchInput = document.getElementById('schoolSearch');
        const gradeSelect = document.getElementById('gradeSelect');
        
        if (searchInput) {
            searchInput.value = '';
            searchInput.placeholder = 'Search for resources, uniforms, notices, events...';
        }
        if (gradeSelect) gradeSelect.value = '';
        
        document.getElementById('searchResults').style.display = 'none';
        
        // Reset button styles
        document.querySelectorAll('[onclick^="filterSearch"]').forEach(btn => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        });
        
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
        
        // Reset page title
        document.title = 'Pinetown Independent Primary School - Quality Education in Pinetown, KwaZulu-Natal';
    };
    
    console.log('SEO-Optimized Search System Initialized');
    console.log('Features: Keyword Research, Title Tags, Image Optimization, URL Structure, Internal Linking, Mobile Friendliness, Page Speed, Security, Sitemap, Robots.txt');
});