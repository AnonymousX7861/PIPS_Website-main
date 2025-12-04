// FAQ Accordion System for Pinetown Independent Primary School
// Handles expandable/collapsible FAQ sections

/**
 * Toggle FAQ accordion items
 * @param {HTMLElement} element - The clicked FAQ question element
 */
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Toggle current item
    if (isActive) {
        closeFAQ(element, answer);
    } else {
        openFAQ(element, answer);
    }
}

/**
 * Open a specific FAQ item
 * @param {HTMLElement} questionElement - The FAQ question element
 * @param {HTMLElement} answerElement - The FAQ answer div
 */
function openFAQ(questionElement, answerElement) {
    questionElement.classList.add('active');
    answerElement.classList.add('active');
    
    // Smooth scroll to bring the opened FAQ into view
    setTimeout(() => {
        questionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, 100);
}

/**
 * Close a specific FAQ item
 * @param {HTMLElement} questionElement - The FAQ question element
 * @param {HTMLElement} answerElement - The FAQ answer div
 */
function closeFAQ(questionElement, answerElement) {
    questionElement.classList.remove('active');
    answerElement.classList.remove('active');
}

/**
 * Close all FAQ items
 */
function closeAllFAQs() {
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allQuestions = document.querySelectorAll('.faq-question');
    
    allAnswers.forEach(answer => {
        answer.classList.remove('active');
    });
    
    allQuestions.forEach(question => {
        question.classList.remove('active');
    });
}

/**
 * Open all FAQ items
 */
function openAllFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            openFAQ(question, answer);
        }
    });
}

/**
 * Initialize FAQ accordion functionality
 */
function initializeFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Add click event listeners to all FAQ questions
    faqQuestions.forEach((question, index) => {
        // Remove any existing event listeners
        question.replaceWith(question.cloneNode(true));
        const newQuestion = document.querySelectorAll('.faq-question')[index];
        
        newQuestion.addEventListener('click', function() {
            toggleFAQ(this);
        });
        
        // Add keyboard accessibility
        newQuestion.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleFAQ(this);
            }
        });
        
        // Set ARIA attributes for accessibility
        newQuestion.setAttribute('aria-expanded', 'false');
        newQuestion.setAttribute('aria-controls', `faq-answer-${index}`);
        newQuestion.setAttribute('role', 'button');
        newQuestion.setAttribute('tabindex', '0');
        
        const answer = newQuestion.nextElementSibling;
        if (answer) {
            answer.setAttribute('id', `faq-answer-${index}`);
            answer.setAttribute('role', 'region');
            answer.setAttribute('aria-labelledby', `faq-question-${index}`);
        }
        
        newQuestion.setAttribute('id', `faq-question-${index}`);
    });
}

/**
 * Add expand/collapse all controls
 */
function addFAQControls() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer || document.querySelector('.faq-controls')) {
        return; // Controls already exist or no container found
    }
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'faq-controls';
    controlsDiv.style.cssText = `
        text-align: center;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    `;
    
    controlsDiv.innerHTML = `
        <button onclick="openAllFAQs()" class="faq-control-btn expand-btn" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            margin: 0 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        ">📂 Expand All</button>
        <button onclick="closeAllFAQs()" class="faq-control-btn collapse-btn" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            margin: 0 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        ">📁 Collapse All</button>
    `;
    
    faqContainer.parentNode.insertBefore(controlsDiv, faqContainer);
    
    // Add hover effects
    const buttons = controlsDiv.querySelectorAll('.faq-control-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

/**
 * Update ARIA attributes when FAQ state changes
 */
function updateARIAAttributes() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        const isExpanded = answer.classList.contains('active');
        question.setAttribute('aria-expanded', isExpanded.toString());
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all content is loaded
    setTimeout(() => {
        initializeFAQAccordion();
        addFAQControls();
    }, 100);
});

// Monitor for FAQ state changes to update ARIA attributes
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('faq-question')) {
        setTimeout(updateARIAAttributes, 50);
    }
});

// Export functions for global use
window.FAQAccordion = {
    toggleFAQ,
    openFAQ,
    closeFAQ,
    closeAllFAQs,
    openAllFAQs,
    initializeFAQAccordion
};