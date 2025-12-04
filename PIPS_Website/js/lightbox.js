// Lightbox System for Gallery Images
// Enhanced image viewing with navigation and additional features

/**
 * Enhanced Lightbox functionality for the gallery
 * Provides image navigation, zoom, and advanced controls
 */

let currentImageIndex = 0;
let galleryImages = [];

/**
 * Initialize the lightbox system
 */
function initializeLightbox() {
    // Collect all gallery images
    collectGalleryImages();
    
    // Add lightbox-specific event listeners
    addLightboxEventListeners();
    
    // Create enhanced lightbox HTML if it doesn't exist
    createLightboxHTML();
}

/**
 * Collect all gallery images for navigation
 */
function collectGalleryImages() {
    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
}

/**
 * Create enhanced lightbox HTML structure
 */
function createLightboxHTML() {
    if (document.getElementById('lightboxModal')) {
        return; // Already exists
    }
    
    const lightboxHTML = `
        <div id="lightboxModal" class="lightbox-modal">
            <div class="lightbox-content">
                <div class="lightbox-header">
                    <span class="lightbox-counter" id="lightboxCounter">1 / 18</span>
                    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                </div>
                
                <div class="lightbox-image-container">
                    <button class="lightbox-nav lightbox-prev" onclick="previousImage()">&#8249;</button>
                    <img class="lightbox-image" id="lightboxImage" src="" alt="">
                    <button class="lightbox-nav lightbox-next" onclick="nextImage()">&#8250;</button>
                </div>
                
                <div class="lightbox-footer">
                    <div class="lightbox-title" id="lightboxTitle"></div>
                    <div class="lightbox-controls">
                        <button class="lightbox-btn zoom-btn" onclick="toggleZoom()">🔍 Zoom</button>
                        <button class="lightbox-btn fullscreen-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
                        <a id="lightboxDownload" class="lightbox-btn download-btn" href="" download="">
                            📥 Download
                        </a>
                        <button class="lightbox-btn slideshow-btn" onclick="toggleSlideshow()">▶️ Slideshow</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    addLightboxStyles();
}

/**
 * Add lightbox-specific styles
 */
function addLightboxStyles() {
    if (document.getElementById('lightboxStyles')) {
        return;
    }
    
    const styles = `
        <style id="lightboxStyles">
            .lightbox-modal {
                display: none;
                position: fixed;
                z-index: 10001;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.95);
                animation: fadeIn 0.3s ease;
            }
            
            .lightbox-content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .lightbox-header {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10002;
            }
            
            .lightbox-counter {
                color: #FFD700;
                font-size: 18px;
                font-weight: bold;
                background: rgba(0, 0, 0, 0.7);
                padding: 8px 15px;
                border-radius: 20px;
            }
            
            .lightbox-close {
                background: #ff4444;
                color: white;
                border: none;
                font-size: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .lightbox-close:hover {
                background: #cc0000;
                transform: scale(1.1);
            }
            
            .lightbox-image-container {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                padding: 80px 100px;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                transition: transform 0.3s ease;
            }
            
            .lightbox-image.zoomed {
                transform: scale(1.5);
                cursor: grab;
            }
            
            .lightbox-image.zoomed:active {
                cursor: grabbing;
            }
            
            .lightbox-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 128, 0.8);
                color: #FFD700;
                border: none;
                font-size: 40px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .lightbox-nav:hover {
                background: rgba(0, 0, 128, 1);
                transform: translateY(-50%) scale(1.1);
            }
            
            .lightbox-prev {
                left: 20px;
            }
            
            .lightbox-next {
                right: 20px;
            }
            
            .lightbox-footer {
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                text-align: center;
            }
            
            .lightbox-title {
                color: #FFD700;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 20px;
                display: inline-block;
            }
            
            .lightbox-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .lightbox-btn {
                background: #000080;
                color: #FFD700;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            }
            
            .lightbox-btn:hover {
                background: #000066;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
            }
            
            .slideshow-active {
                background: #28a745 !important;
            }
            
            @media (max-width: 768px) {
                .lightbox-image-container {
                    padding: 60px 20px;
                }
                
                .lightbox-nav {
                    width: 50px;
                    height: 50px;
                    font-size: 30px;
                }
                
                .lightbox-controls {
                    flex-direction: column;
                    align-items: center;
                }
                
                .lightbox-btn {
                    width: 200px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

/**
 * Open lightbox with specific image
 * @param {HTMLElement} imageElement - The clicked image element
 */
function openLightbox(imageElement) {
    collectGalleryImages();
    currentImageIndex = galleryImages.indexOf(imageElement);
    
    const lightbox = document.getElementById('lightboxModal');
    updateLightboxContent();
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

/**
 * Close the lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    stopSlideshow();
}

/**
 * Navigate to previous image
 */
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Navigate to next image
 */
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Update lightbox content with current image
 */
function updateLightboxContent() {
    const currentImage = galleryImages[currentImageIndex];
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxDownload = document.getElementById('lightboxDownload');
    
    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt;
    lightboxTitle.textContent = currentImage.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    
    // Set download link
    const imageName = currentImage.src.split('/').pop();
    lightboxDownload.href = currentImage.src;
    lightboxDownload.download = imageName;
}

/**
 * Toggle zoom functionality
 */
function toggleZoom() {
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.classList.toggle('zoomed');
    
    if (lightboxImage.classList.contains('zoomed')) {
        addImageDragging(lightboxImage);
    } else {
        removeImageDragging(lightboxImage);
    }
}

/**
 * Add drag functionality to zoomed image
 */
function addImageDragging(image) {
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    image.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - image.offsetLeft;
        startY = e.pageY - image.offsetTop;
        scrollLeft = image.style.transform || '';
        scrollTop = image.style.transform || '';
    });
    
    image.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - image.offsetLeft;
        const y = e.pageY - image.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        image.style.transform = `scale(1.5) translate(${walkX}px, ${walkY}px)`;
    });
    
    image.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

/**
 * Remove drag functionality
 */
function removeImageDragging(image) {
    image.style.transform = 'scale(1)';
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    const lightbox = document.getElementById('lightboxModal');
    
    if (!document.fullscreenElement) {
        lightbox.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Slideshow functionality
 */
let slideshowInterval;
let isSlideshow = false;

function toggleSlideshow() {
    const slideshowBtn = document.querySelector('.slideshow-btn');
    
    if (isSlideshow) {
        stopSlideshow();
        slideshowBtn.textContent = '▶️ Slideshow';
        slideshowBtn.classList.remove('slideshow-active');
    } else {
        startSlideshow();
        slideshowBtn.textContent = '⏸️ Stop';
        slideshowBtn.classList.add('slideshow-active');
    }
}

function startSlideshow() {
    isSlideshow = true;
    slideshowInterval = setInterval(() => {
        nextImage();
    }, 3000); // Change image every 3 seconds
}

function stopSlideshow() {
    isSlideshow = false;
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
}

/**
 * Add lightbox event listeners
 */
function addLightboxEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightboxModal');
        if (lightbox && lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case ' ':
                    e.preventDefault();
                    toggleSlideshow();
                    break;
            }
        }
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        const lightbox = document.getElementById('lightboxModal');
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

/**
 * Override the existing openModal function to use lightbox
 */
function enhanceGalleryImages() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach((img, index) => {
        // Remove existing onclick handlers
        img.removeAttribute('onclick');
        
        // Add error handling
        img.addEventListener('error', function() {
            console.log(`Failed to load image: ${this.src}`);
            this.style.display = 'none';
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: #f0f0f0;
                border: 2px dashed #ccc;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
                text-align: center;
            `;
            placeholder.innerHTML = `<div>Image not available<br><small>${this.alt}</small></div>`;
            this.parentNode.appendChild(placeholder);
        });
        
        // Add loading success handler
        img.addEventListener('load', function() {
            console.log(`Successfully loaded: ${this.src}`);
        });
        
        // Add new lightbox functionality
        img.addEventListener('click', function() {
            openLightbox(this);
        });
        
        // Add hover effects
        img.style.cursor = 'pointer';
        img.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeLightbox();
        enhanceGalleryImages();
    }, 500);
});

// Export functions for global use
window.Lightbox = {
    openLightbox,
    closeLightbox,
    nextImage,
    previousImage,
    toggleZoom,
    toggleFullscreen,
    toggleSlideshow
};
