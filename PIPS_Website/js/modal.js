// Modal System for Pinetown Independent Primary School
// Handles image gallery modals and notification pop-ups

// Notice Board Data
const noticeData = {
    events: [
        "Parent-Teacher Conference - March 15, 2025",
        "School Sports Day - March 22, 2025", 
        "Grade 7 Graduation Ceremony - December 5, 2025",
        "School Open Day - April 10, 2025"
    ],
    news: [
        "New library books have arrived and are available for borrowing",
        "School garden project wins district environmental award",
        "Grade 6 students participate in mathematics olympiad",
        "School choir performs at community festival"
    ],
    reminders: [
        "School fees for Term 2 are due by March 31, 2025",
        "Please ensure students wear proper school uniform daily",
        "Parent permission slips for field trips must be submitted by Friday",
        "After-school activities resume next Monday"
    ]
};

// Note: Gallery image modal functions are now handled by lightbox.js
// This section focuses only on notification modals

// Notification Modal Functions
function createNotificationModal() {
    // Check if modal already exists
    if (document.getElementById('notificationModal')) {
        return;
    }

    const modalHTML = `
        <div id="notificationModal" class="notification-modal">
            <div class="notification-content">
                <div class="notification-header">
                    <h3 id="notificationTitle">School Updates</h3>
                    <button class="notification-close" onclick="closeNotificationModal()">&times;</button>
                </div>
                <div class="notification-body" id="notificationBody">
                    <!-- Content will be inserted here -->
                </div>
                <div class="notification-footer">
                    <button class="notification-btn primary" onclick="viewFullNoticeBoard()">View Notice Board</button>
                    <button class="notification-btn secondary" onclick="closeNotificationModal()">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addNotificationStyles();
}

function addNotificationStyles() {
    if (document.getElementById('notificationStyles')) {
        return;
    }

    const styles = `
        <style id="notificationStyles">
            .notification-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                animation: notificationFadeIn 0.3s ease;
            }

            .notification-content {
                position: relative;
                background-color: #ffffff;
                margin: 5% auto;
                padding: 0;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                animation: notificationSlideIn 0.3s ease;
            }

            .notification-header {
                background: linear-gradient(135deg, #000080, #0000a0);
                color: #FFD700;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .notification-header h3 {
                margin: 0;
                font-size: 1.4rem;
                font-weight: bold;
            }

            .notification-close {
                background: none;
                border: none;
                color: #FFD700;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s ease;
            }

            .notification-close:hover {
                background-color: rgba(255, 215, 0, 0.2);
            }

            .notification-body {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
            }

            .notification-section {
                margin-bottom: 20px;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #000080;
            }

            .notification-section:last-child {
                margin-bottom: 0;
            }

            .notification-section.events {
                background-color: #e8f4f8;
                border-left-color: #000080;
            }

            .notification-section.news {
                background-color: #f0f8e8;
                border-left-color: #28a745;
            }

            .notification-section.reminders {
                background-color: #fff3cd;
                border-left-color: #ffc107;
            }

            .notification-section h4 {
                margin: 0 0 10px 0;
                color: #000080;
                font-size: 1.1rem;
                font-weight: bold;
            }

            .notification-section ul {
                margin: 0;
                padding-left: 18px;
            }

            .notification-section li {
                margin-bottom: 8px;
                line-height: 1.4;
                color: #333;
            }

            .notification-footer {
                padding: 20px;
                background-color: #f8f9fa;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .notification-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                font-size: 14px;
            }

            .notification-btn.primary {
                background-color: #000080;
                color: #FFD700;
            }

            .notification-btn.primary:hover {
                background-color: #000066;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 128, 0.3);
            }

            .notification-btn.secondary {
                background-color: #6c757d;
                color: white;
            }

            .notification-btn.secondary:hover {
                background-color: #545b62;
                transform: translateY(-2px);
            }

            @keyframes notificationFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes notificationSlideIn {
                from { 
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .notification-content {
                    margin: 10% auto;
                    width: 95%;
                }
                
                .notification-footer {
                    flex-direction: column;
                }
                
                .notification-btn {
                    width: 100%;
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

function showNotification(type = 'all') {
    createNotificationModal();
    
    const modal = document.getElementById('notificationModal');
    const title = document.getElementById('notificationTitle');
    const body = document.getElementById('notificationBody');
    
    let content = '';
    let titleText = 'School Updates';
    
    if (type === 'all' || type === 'events') {
        titleText = type === 'events' ? 'Upcoming Events' : 'School Updates';
        content += `
            <div class="notification-section events">
                <h4>📅 Upcoming Events</h4>
                <ul>
                    ${noticeData.events.map(event => `<li>${event}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (type === 'all' || type === 'news') {
        titleText = type === 'news' ? 'Latest News' : titleText;
        content += `
            <div class="notification-section news">
                <h4>📰 Latest News</h4>
                <ul>
                    ${noticeData.news.map(news => `<li>${news}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (type === 'all' || type === 'reminders') {
        titleText = type === 'reminders' ? 'Important Reminders' : titleText;
        content += `
            <div class="notification-section reminders">
                <h4>⚠️ Important Reminders</h4>
                <ul>
                    ${noticeData.reminders.map(reminder => `<li>${reminder}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    title.textContent = titleText;
    body.innerHTML = content;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function viewFullNoticeBoard() {
    closeNotificationModal();
    window.location.href = 'notice_board.html';
}

// Auto-show notifications on page load (optional)
function initializeNotifications() {
    // Show notifications after 3 seconds on page load
    setTimeout(() => {
        // Only show on homepage and selected pages
        const currentPage = window.location.pathname.toLowerCase();
        if (currentPage.includes('index.html') || currentPage.endsWith('/') || currentPage === '') {
            showNotification('all');
        }
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Notification modal event listeners
    window.onclick = function(event) {
        const notificationModal = document.getElementById('notificationModal');
        
        if (event.target === notificationModal) {
            closeNotificationModal();
        }
    };

    // Keyboard event listeners
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeNotificationModal();
        }
    });

    // Initialize notifications
    initializeNotifications();
});

// Utility Functions
function getRandomNotification() {
    const types = ['events', 'news', 'reminders'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return randomType;
}

function scheduleRandomNotification() {
    // Show random notification every 5 minutes
    setInterval(() => {
        const randomType = getRandomNotification();
        showNotification(randomType);
    }, 300000); // 5 minutes
}

// Public API - Note: Image modal functions now handled by lightbox.js
window.ModalSystem = {
    showNotification,
    closeNotificationModal,
    viewFullNoticeBoard
};
