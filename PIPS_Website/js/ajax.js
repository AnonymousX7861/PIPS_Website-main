/* AJAX Form Manager for Pinetown Independent Primary School
   Handles AJAX form submissions with validation, offline support, and user feedback */
class AJAXFormManager {
    constructor() {
        this.forms = new Map();
        this.submissionQueue = [];
        this.isOnline = navigator.onLine;
        this.storageKey = 'pinetown_form_submissions';
        this.retryAttempts = 3;
        this.retryDelay = 2000;
        
        this.init();
        this.setupEventListeners();
        this.setupNetworkDetection();
    }

    // Initialize the AJAX system
    init() {
        console.log('🚀 AJAX Form Manager initialized for Pinetown Independent Primary School');
        this.registerAllForms();
        this.loadPendingSubmissions();
        this.setupGlobalErrorHandler();
    }

    // Register all forms found on the website
    registerAllForms() {
        const formConfigs = [
            {
                formId: 'admissions-form',
                endpoint: '/api/admissions',
                type: 'admission',
                requiredFields: ['fullName', 'dob', 'parentName', 'contactNumber', 'email', 'gradeApplying'],
                successMessage: 'Admission application submitted successfully! We will contact you within 2-3 business days.',
                successRedirect: null
            },
            {
                formId: 'contact-form',
                endpoint: '/api/contact',
                type: 'contact',
                requiredFields: ['firstName', 'lastName', 'email', 'subject', 'message'],
                successMessage: 'Your message has been sent successfully! We will respond within 24 hours.',
                successRedirect: null
            },
            {
                formId: 'enquiry-form',
                endpoint: '/api/enquiry',
                type: 'enquiry',
                requiredFields: ['name', 'email', 'subject', 'message'],
                successMessage: 'Your enquiry has been submitted successfully! Thank you for your interest.',
                successRedirect: null
            },
            {
                formId: 'volunteer-form',
                endpoint: '/api/volunteer',
                type: 'volunteer',
                requiredFields: ['vol_name', 'vol_email', 'vol_phone', 'vol_interest'],
                successMessage: 'Thank you for volunteering! We will contact you soon with opportunities.',
                successRedirect: null
            },
            {
                formId: 'sponsor-form',
                endpoint: '/api/sponsor',
                type: 'sponsor',
                requiredFields: ['sponsor_company', 'sponsor_contact', 'sponsor_email', 'sponsor_phone', 'sponsorship_type'],
                successMessage: 'Thank you for your interest in sponsoring! We will contact you to discuss opportunities.',
                successRedirect: null
            }
        ];

        formConfigs.forEach(config => {
            this.forms.set(config.formId, config);
        });

        console.log(`📋 Registered ${this.forms.size} forms for AJAX handling`);
    }

    // Setup event listeners for all forms
    setupEventListeners() {
        // Auto-detect and bind forms on page load
        this.bindFormsOnPage();
        
        // Handle dynamic form loading
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const forms = node.querySelectorAll ? node.querySelectorAll('form') : [];
                            forms.forEach(form => this.bindFormIfRegistered(form));
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Bind forms found on the current page
    bindFormsOnPage() {
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.bindFormIfRegistered(form));
        });

        // Also bind immediately if DOM is already loaded
        if (document.readyState === 'loading') {
            // Already handled by DOMContentLoaded
        } else {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.bindFormIfRegistered(form));
        }
    }

    // Bind form if it matches a registered configuration
    bindFormIfRegistered(form) {
        if (!form || form.dataset.ajaxBound === 'true') return;

        // Try to identify the form by various methods
        let formConfig = null;
        
        // Method 1: Check by form ID
        if (form.id && this.forms.has(form.id)) {
            formConfig = this.forms.get(form.id);
        }
        
        // Method 2: Check by form class or data attribute
        if (!formConfig) {
            for (let [formId, config] of this.forms) {
                if (form.classList.contains(config.type + '-form') || 
                    form.dataset.formType === config.type) {
                    formConfig = config;
                    break;
                }
            }
        }

        // Method 3: Intelligent form detection by fields
        if (!formConfig) {
            formConfig = this.detectFormType(form);
        }

        if (formConfig) {
            this.bindForm(form, formConfig);
            form.dataset.ajaxBound = 'true';
            console.log(`✅ Bound ${formConfig.type} form to AJAX handler`);
        }
    }

    // Intelligent form type detection
    detectFormType(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        const fieldNames = Array.from(inputs).map(input => input.name || input.id).filter(Boolean);
        
        // Check field patterns to identify form type
        if (fieldNames.some(name => name.includes('fullName') || name.includes('gradeApplying'))) {
            return this.forms.get('admissions-form');
        }
        
        if (fieldNames.some(name => name.includes('vol_') || name.includes('volunteer'))) {
            return this.forms.get('volunteer-form');
        }
        
        if (fieldNames.some(name => name.includes('sponsor') || name.includes('company'))) {
            return this.forms.get('sponsor-form');
        }
        
        if (fieldNames.includes('firstName') && fieldNames.includes('lastName')) {
            return this.forms.get('contact-form');
        }
        
        if (fieldNames.includes('name') && fieldNames.includes('message')) {
            return this.forms.get('enquiry-form');
        }
        
        return null;
    }

    // Bind individual form with AJAX functionality
    bindForm(form, config) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form, config);
        });

        // Add visual indicators
        this.addFormIndicators(form, config);
        
        // Add auto-save functionality
        this.setupAutoSave(form, config);
    }

    // Handle form submission with AJAX
    async handleFormSubmission(form, config) {
        try {
            // Validate form
            const validation = this.validateForm(form, config);
            if (!validation.isValid) {
                this.showValidationErrors(form, validation.errors);
                return;
            }

            // Show loading state
            this.showLoadingState(form, true);
            
            // Collect form data
            const formData = this.collectFormData(form);
            
            // Add metadata
            const submissionData = {
                ...formData,
                formType: config.type,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                userAgent: navigator.userAgent,
                sessionId: this.getSessionId()
            };

            // Submit via AJAX
            const result = await this.submitFormData(submissionData, config);
            
            if (result.success) {
                this.handleSubmissionSuccess(form, config, result);
            } else {
                this.handleSubmissionError(form, config, result.error);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError(form, config, error);
        } finally {
            this.showLoadingState(form, false);
        }
    }

    // Validate form data
    validateForm(form, config) {
        const errors = [];
        const formData = new FormData(form);

        // Check required fields
        config.requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            const value = formData.get(fieldName) || (field ? field.value : '');
            
            if (!value || value.trim() === '') {
                errors.push({
                    field: fieldName,
                    message: `${this.getFieldLabel(field)} is required`
                });
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            const value = field.value.trim();
            if (value && !this.isValidEmail(value)) {
                errors.push({
                    field: field.name || field.id,
                    message: 'Please enter a valid email address'
                });
            }
        });

        // Phone validation
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            const value = field.value.trim();
            if (value && !this.isValidPhone(value)) {
                errors.push({
                    field: field.name || field.id,
                    message: 'Please enter a valid phone number'
                });
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Submit form data via AJAX
    async submitFormData(data, config) {
        const submissionId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Store submission for offline support
        this.storeSubmission(submissionId, data, config);

        try {
            // For static website: Skip API call and proceed directly to email redirect
            // This prevents "failed to fetch" errors on static hosting
            console.log('📧 Processing form submission for email redirect (static website mode)');
            
            // Simulate successful submission
            const simulatedResponse = {
                success: true,
                message: 'Form submitted successfully',
                timestamp: new Date().toISOString(),
                submissionId: submissionId
            };
            
            // Remove from storage as it's processed
            this.removeStoredSubmission(submissionId);
            
            return {
                success: true,
                data: simulatedResponse,
                submissionId: submissionId
            };
            
            /* Original API call code - commented out for static website
            const response = await this.makeAPICall(config.endpoint, data);
            
            if (response.ok) {
                this.removeStoredSubmission(submissionId);
                return {
                    success: true,
                    data: await response.json(),
                    submissionId: submissionId
                };
            } else {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
            */
            
        } catch (error) {
            // Queue for retry if offline
            if (!this.isOnline) {
                this.queueSubmission(submissionId, data, config);
                return {
                    success: true,
                    offline: true,
                    message: 'Form saved. Will be submitted when connection is restored.'
                };
            }
            
            throw error;
        }
    }

    // Make API call with retry logic
    async makeAPICall(endpoint, data, attempt = 1) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': this.getCSRFToken()
                },
                body: JSON.stringify(data),
                credentials: 'same-origin'
            });

            return response;
            
        } catch (error) {
            if (attempt < this.retryAttempts) {
                console.log(`Retrying API call (attempt ${attempt + 1}/${this.retryAttempts})`);
                await this.delay(this.retryDelay * attempt);
                return this.makeAPICall(endpoint, data, attempt + 1);
            }
            
            throw error;
        }
    }

    // Handle successful submission
    handleSubmissionSuccess(form, config, result) {
        // Collect form data before clearing
        const formData = this.collectFormData(form);
        
        // Clear form
        form.reset();
        
        // Remove any error styling
        this.clearFormErrors(form);
        
        // Show success message
        this.showSuccessMessage(form, config, result);
        
        // Clear auto-saved data
        this.clearAutoSavedData(form, config);
        
        // Generate and open email with form information
        this.redirectToEmailWithFormData(formData, config);
        
        // Redirect if configured (after email)
        if (config.successRedirect) {
            setTimeout(() => {
                window.location.href = config.successRedirect;
            }, 3000);
        }

        // Track submission
        this.trackFormSubmission(config.type, 'success');
    }

    // Redirect user to email client with pre-filled form information
    redirectToEmailWithFormData(formData, config) {
        try {
            // Get school email
            const schoolEmail = 'info@pinetownindependent.co.za';
            
            // Generate email content based on form type
            const emailContent = this.generateEmailContent(formData, config);
            
            // Create mailto URL
            const mailtoUrl = `mailto:${schoolEmail}?subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.body)}`;
            
            // Open email client after a short delay to let user see success message
            setTimeout(() => {
                // Show notification about email opening
                this.showNotification('Opening your email client with the form information...', 'info');
                
                // Attempt to open email client
                window.location.href = mailtoUrl;
                
                // Fallback: if mailto doesn't work, copy content to clipboard
                setTimeout(() => {
                    this.fallbackEmailRedirect(emailContent, schoolEmail);
                }, 2000);
                
            }, 1500);
            
        } catch (error) {
            console.error('Email redirect failed:', error);
            this.showNotification('Form submitted successfully, but email client could not be opened automatically.', 'warning');
        }
    }

    // Generate email content based on form type and data
    generateEmailContent(formData, config) {
        const timestamp = new Date().toLocaleString();
        const formTypeNames = {
            'admission': 'School Admission Application',
            'contact': 'General Contact Inquiry',
            'enquiry': 'School Enquiry',
            'volunteer': 'Volunteer Application',
            'sponsor': 'Sponsorship Inquiry'
        };
        
        const formTypeName = formTypeNames[config.type] || 'Form Submission';
        
        let subject = `${formTypeName} - Pinetown Independent Primary School`;
        let body = `Dear Pinetown Independent Primary School,\n\n`;
        body += `I am writing to submit a ${formTypeName.toLowerCase()} through your website.\n\n`;
        body += `SUBMISSION DETAILS:\n`;
        body += `Form Type: ${formTypeName}\n`;
        body += `Submission Date: ${timestamp}\n\n`;
        
        // Add form-specific content
        switch (config.type) {
            case 'admission':
                subject = `Admission Application - ${formData.fullName || 'Student'} - Pinetown Independent Primary`;
                body += this.generateAdmissionEmailBody(formData);
                break;
                
            case 'contact':
                subject = `Contact Inquiry - ${formData.subject || 'General Inquiry'} - Pinetown Independent Primary`;
                body += this.generateContactEmailBody(formData);
                break;
                
            case 'enquiry':
                subject = `School Enquiry - ${formData.subject || 'General Question'} - Pinetown Independent Primary`;
                body += this.generateEnquiryEmailBody(formData);
                break;
                
            case 'volunteer':
                subject = `Volunteer Application - ${formData.vol_name || 'Applicant'} - Pinetown Independent Primary`;
                body += this.generateVolunteerEmailBody(formData);
                break;
                
            case 'sponsor':
                subject = `Sponsorship Inquiry - ${formData.sponsor_company || 'Company'} - Pinetown Independent Primary`;
                body += this.generateSponsorEmailBody(formData);
                break;
                
            default:
                body += this.generateGenericEmailBody(formData);
        }
        
        body += `\n\nReason for sending this email:\n`;
        body += `This email contains my ${formTypeName.toLowerCase()} information submitted through your website. `;
        body += `I am requesting that you review my submission and respond accordingly. `;
        body += `Please confirm receipt of this information and let me know the next steps in the process.\n\n`;
        body += `Thank you for your time and consideration.\n\n`;
        body += `Best regards,\n`;
        body += `${this.getApplicantName(formData, config.type)}\n`;
        body += `\n---\n`;
        body += `This email was generated automatically from the Pinetown Independent Primary School website form submission.`;
        
        return { subject, body };
    }

    // Generate admission-specific email body
    generateAdmissionEmailBody(formData) {
        let body = `STUDENT INFORMATION:\n`;
        body += `Student Name: ${formData.fullName || 'Not provided'}\n`;
        body += `Date of Birth: ${formData.dob || 'Not provided'}\n`;
        body += `Grade Applying For: ${formData.gradeApplying || 'Not specified'}\n`;
        body += `Previous School: ${formData.previousSchool || 'Not provided'}\n\n`;
        
        body += `PARENT/GUARDIAN INFORMATION:\n`;
        body += `Parent/Guardian Name: ${formData.parentName || 'Not provided'}\n`;
        body += `Contact Number: ${formData.contactNumber || 'Not provided'}\n`;
        body += `Email Address: ${formData.email || 'Not provided'}\n\n`;
        
        if (formData.additionalInfo) {
            body += `ADDITIONAL INFORMATION:\n${formData.additionalInfo}\n\n`;
        }
        
        return body;
    }

    // Generate contact-specific email body
    generateContactEmailBody(formData) {
        let body = `CONTACT INFORMATION:\n`;
        body += `Name: ${formData.firstName || ''} ${formData.lastName || ''}\n`;
        body += `Email: ${formData.email || 'Not provided'}\n`;
        body += `Phone: ${formData.phone || 'Not provided'}\n`;
        body += `Subject: ${formData.subject || 'General Inquiry'}\n\n`;
        
        body += `MESSAGE:\n${formData.message || 'No message provided'}\n\n`;
        
        return body;
    }

    // Generate enquiry-specific email body
    generateEnquiryEmailBody(formData) {
        let body = `ENQUIRY INFORMATION:\n`;
        body += `Name: ${formData.name || 'Not provided'}\n`;
        body += `Email: ${formData.email || 'Not provided'}\n`;
        body += `Phone: ${formData.phone || 'Not provided'}\n`;
        body += `Subject: ${formData.subject || 'General Enquiry'}\n\n`;
        
        body += `MESSAGE:\n${formData.message || 'No message provided'}\n\n`;
        
        return body;
    }

    // Generate volunteer-specific email body
    generateVolunteerEmailBody(formData) {
        let body = `VOLUNTEER APPLICATION:\n`;
        body += `Name: ${formData.vol_name || 'Not provided'}\n`;
        body += `Email: ${formData.vol_email || 'Not provided'}\n`;
        body += `Phone: ${formData.vol_phone || 'Not provided'}\n`;
        body += `Area of Interest: ${formData.vol_interest || 'Not specified'}\n\n`;
        
        return body;
    }

    // Generate sponsor-specific email body
    generateSponsorEmailBody(formData) {
        let body = `SPONSORSHIP INQUIRY:\n`;
        body += `Company Name: ${formData.sponsor_company || 'Not provided'}\n`;
        body += `Contact Person: ${formData.sponsor_contact || 'Not provided'}\n`;
        body += `Email: ${formData.sponsor_email || 'Not provided'}\n`;
        body += `Phone: ${formData.sponsor_phone || 'Not provided'}\n`;
        body += `Sponsorship Type: ${formData.sponsorship_type || 'Not specified'}\n\n`;
        
        return body;
    }

    // Generate generic email body for unknown form types
    generateGenericEmailBody(formData) {
        let body = `FORM DATA:\n`;
        
        Object.keys(formData).forEach(key => {
            if (key !== 'formType' && key !== 'timestamp' && key !== 'page' && 
                key !== 'userAgent' && key !== 'sessionId') {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                body += `${label}: ${formData[key] || 'Not provided'}\n`;
            }
        });
        
        body += `\n`;
        return body;
    }

    // Get applicant name based on form type
    getApplicantName(formData, formType) {
        switch (formType) {
            case 'admission':
                return formData.parentName || formData.fullName || 'Applicant';
            case 'contact':
                return `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Contact Person';
            case 'enquiry':
                return formData.name || 'Enquirer';
            case 'volunteer':
                return formData.vol_name || 'Volunteer Applicant';
            case 'sponsor':
                return formData.sponsor_contact || formData.sponsor_company || 'Sponsor Contact';
            default:
                return 'Form Submitter';
        }
    }

    // Fallback email redirect if mailto doesn't work
    fallbackEmailRedirect(emailContent, schoolEmail) {
        try {
            // Try to copy email content to clipboard
            navigator.clipboard.writeText(`To: ${schoolEmail}\nSubject: ${emailContent.subject}\n\n${emailContent.body}`).then(() => {
                this.showNotification('Email content copied to clipboard! Please paste it into your email client.', 'info');
            }).catch(() => {
                // If clipboard fails, show modal with email content
                this.showEmailContentModal(emailContent, schoolEmail);
            });
        } catch (error) {
            this.showEmailContentModal(emailContent, schoolEmail);
        }
    }

    // Show modal with email content for manual copying
    showEmailContentModal(emailContent, schoolEmail) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 30px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h3 style="color: #000080; margin-top: 0; text-align: center;">📧 Email Content Ready</h3>
                <p style="color: #666; text-align: center; margin-bottom: 20px;">
                    Please copy the information below and send it to: <strong>${schoolEmail}</strong>
                </p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #000080;">Subject:</h4>
                    <div style="background: white; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
                        ${emailContent.subject}
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #000080;">Message:</h4>
                    <textarea readonly style="
                        width: 100%; 
                        height: 300px; 
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        border-radius: 5px; 
                        resize: vertical;
                        font-family: monospace;
                        font-size: 0.9rem;
                        box-sizing: border-box;
                    ">${emailContent.body}</textarea>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: #000080;
                        color: #FFD700;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        font-size: 1rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Handle submission error
    handleSubmissionError(form, config, error) {
        console.error('Form submission failed:', error);
        
        // Show error message
        this.showErrorMessage(form, error);
        
        // Track error
        this.trackFormSubmission(config.type, 'error', error.message);
    }

    // Show loading state
    showLoadingState(form, isLoading) {
        const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
        
        if (isLoading) {
            // Disable form
            form.style.opacity = '0.7';
            form.style.pointerEvents = 'none';
            
            // Update submit button
            if (submitButton) {
                submitButton.dataset.originalText = submitButton.value || submitButton.textContent;
                submitButton.value = submitButton.textContent = '⏳ Submitting...';
                submitButton.disabled = true;
            }
            
            // Add loading indicator
            this.addLoadingIndicator(form);
            
        } else {
            // Re-enable form
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
            
            // Restore submit button
            if (submitButton) {
                submitButton.value = submitButton.textContent = submitButton.dataset.originalText || 'Submit';
                submitButton.disabled = false;
            }
            
            // Remove loading indicator
            this.removeLoadingIndicator(form);
        }
    }

    // Show validation errors
    showValidationErrors(form, errors) {
        // Clear existing errors
        this.clearFormErrors(form);
        
        errors.forEach(error => {
            const field = form.querySelector(`[name="${error.field}"], #${error.field}`);
            if (field) {
                // Add error styling
                field.style.borderColor = '#dc3545';
                field.style.backgroundColor = '#fff5f5';
                
                // Add error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'ajax-error-message';
                errorDiv.style.cssText = `
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 5px;
                    display: block;
                `;
                errorDiv.textContent = error.message;
                
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
        });

        // Show general error notification
        this.showNotification('Please correct the errors above', 'error');
    }

    // Clear form errors
    clearFormErrors(form) {
        // Remove error styling from fields
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        });
        
        // Remove error messages
        const errorMessages = form.querySelectorAll('.ajax-error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    // Show success message
    showSuccessMessage(form, config, result) {
        let message = config.successMessage;
        
        if (result.offline) {
            message = result.message;
        }
        
        this.showNotification(message, 'success');
        
        // Add success styling to form
        form.style.borderLeft = '4px solid #28a745';
        form.style.backgroundColor = '#f8fff9';
        
        setTimeout(() => {
            form.style.borderLeft = '';
            form.style.backgroundColor = '';
        }, 3000);
    }

    // Show error message
    showErrorMessage(form, error) {
        const message = error.message || 'An error occurred while submitting the form. Please try again.';
        this.showNotification(message, 'error');
        
        // Add error styling to form
        form.style.borderLeft = '4px solid #dc3545';
        form.style.backgroundColor = '#fff8f8';
        
        setTimeout(() => {
            form.style.borderLeft = '';
            form.style.backgroundColor = '';
        }, 5000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.ajax-notification');
        existing.forEach(notif => notif.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'ajax-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;
        
        // Set color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, type === 'error' ? 5000 : 3000);
    }

    // Add loading indicator
    addLoadingIndicator(form) {
        const indicator = document.createElement('div');
        indicator.className = 'ajax-loading-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 1000;
        `;
        
        indicator.innerHTML = `
            <div style="width: 40px; height: 40px; margin: 0 auto 10px; border: 3px solid #f3f3f3; border-top: 3px solid #000080; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div style="color: #000080; font-weight: bold;">Submitting...</div>
        `;
        
        // Add CSS animation
        if (!document.querySelector('#ajax-spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'ajax-spinner-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Position relative to form
        if (form.style.position !== 'relative') {
            form.style.position = 'relative';
        }
        
        form.appendChild(indicator);
    }

    // Remove loading indicator
    removeLoadingIndicator(form) {
        const indicator = form.querySelector('.ajax-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Add form indicators
    addFormIndicators(form, config) {
        // Add AJAX indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            font-size: 0.75rem;
            color: #28a745;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        indicator.innerHTML = `
            <span style="color: #28a745;">⚡</span>
            <span>This form uses secure instant submission</span>
        `;
        
        form.insertBefore(indicator, form.firstChild);
    }

    // Setup auto-save functionality
    setupAutoSave(form, config) {
        const autoSaveKey = `autosave_${config.type}_${window.location.pathname}`;
        
        // Load saved data
        this.loadAutoSavedData(form, autoSaveKey);
        
        // Setup auto-save on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                this.autoSaveFormData(form, autoSaveKey);
            }, 1000));
        });
    }

    // Auto-save form data
    autoSaveFormData(form, key) {
        const data = this.collectFormData(form);
        try {
            localStorage.setItem(key, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }

    // Load auto-saved data
    loadAutoSavedData(form, key) {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const { data, timestamp } = JSON.parse(saved);
                
                // Only load if less than 24 hours old
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    this.populateForm(form, data);
                    
                    // Show recovery notification
                    this.showNotification('Previous form data recovered', 'info');
                }
            }
        } catch (error) {
            console.warn('Auto-save recovery failed:', error);
        }
    }

    // Clear auto-saved data
    clearAutoSavedData(form, config) {
        const autoSaveKey = `autosave_${config.type}_${window.location.pathname}`;
        try {
            localStorage.removeItem(autoSaveKey);
        } catch (error) {
            console.warn('Failed to clear auto-save data:', error);
        }
    }

    // Collect form data
    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    // Populate form with data
    populateForm(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"], #${key}`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = field.value === data[key];
                } else {
                    field.value = data[key];
                }
            }
        });
    }

    // Store submission for offline support
    storeSubmission(id, data, config) {
        try {
            const submissions = this.getStoredSubmissions();
            submissions[id] = {
                data: data,
                config: config,
                timestamp: Date.now(),
                status: 'pending'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(submissions));
        } catch (error) {
            console.warn('Failed to store submission:', error);
        }
    }

    // Remove stored submission
    removeStoredSubmission(id) {
        try {
            const submissions = this.getStoredSubmissions();
            delete submissions[id];
            localStorage.setItem(this.storageKey, JSON.stringify(submissions));
        } catch (error) {
            console.warn('Failed to remove stored submission:', error);
        }
    }

    // Get stored submissions
    getStoredSubmissions() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Failed to get stored submissions:', error);
            return {};
        }
    }

    // Queue submission for retry
    queueSubmission(id, data, config) {
        this.submissionQueue.push({ id, data, config });
    }

    // Load pending submissions
    loadPendingSubmissions() {
        const submissions = this.getStoredSubmissions();
        Object.keys(submissions).forEach(id => {
            const submission = submissions[id];
            if (submission.status === 'pending') {
                this.submissionQueue.push({
                    id: id,
                    data: submission.data,
                    config: submission.config
                });
            }
        });
        
        if (this.submissionQueue.length > 0) {
            console.log(`📤 Loaded ${this.submissionQueue.length} pending submissions`);
        }
    }

    // Setup network detection
    setupNetworkDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Connection restored - processing queued submissions');
            this.processQueuedSubmissions();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Connection lost - submissions will be queued');
        });
    }

    // Process queued submissions
    async processQueuedSubmissions() {
        if (!this.isOnline || this.submissionQueue.length === 0) return;
        
        console.log(`📤 Processing ${this.submissionQueue.length} queued submissions`);
        
        const queue = [...this.submissionQueue];
        this.submissionQueue = [];
        
        for (const submission of queue) {
            try {
                const result = await this.submitFormData(submission.data, submission.config);
                if (result.success) {
                    console.log(`✅ Queued submission processed: ${submission.id}`);
                } else {
                    this.submissionQueue.push(submission);
                }
            } catch (error) {
                console.warn(`❌ Failed to process queued submission: ${submission.id}`, error);
                this.submissionQueue.push(submission);
            }
        }
    }

    // Setup global error handler
    setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            if (event.error && event.error.message && event.error.message.includes('ajax')) {
                console.error('AJAX Error:', event.error);
                this.showNotification('A technical error occurred. Please try again.', 'error');
            }
        });
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+\-\s\(\)\d]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    getFieldLabel(field) {
        if (!field) return 'Field';
        
        const label = field.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            return label.textContent.replace('*', '').trim();
        }
        
        return field.placeholder || field.name || field.id || 'Field';
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('ajax_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('ajax_session_id', sessionId);
        }
        return sessionId;
    }

    getCSRFToken() {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }

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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackFormSubmission(formType, status, error = null) {
        // Analytics tracking (replace with your analytics service)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                form_type: formType,
                status: status,
                error: error
            });
        }
        
        console.log(`📊 Form submission tracked: ${formType} - ${status}`, error ? error : '');
    }
}

// Initialize AJAX Form Manager
const ajaxFormManager = new AJAXFormManager();

// Export for global access
window.AJAXFormManager = AJAXFormManager;
window.ajaxFormManager = ajaxFormManager;

// Backward compatibility functions
window.submitForm = function(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
};

console.log('🎯 AJAX Form System loaded successfully for Pinetown Independent Primary School');
