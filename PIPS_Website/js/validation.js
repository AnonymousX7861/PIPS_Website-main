/**
 * Comprehensive Form Validation and Data Management System
 * Pinetown Independent Primary School Website
 * Handles all forms with validation, error handling, and data persistence
 */

class FormValidationManager {
    constructor() {
        this.forms = new Map();
        this.validationRules = this.initializeValidationRules();
        this.errorMessages = this.initializeErrorMessages();
        this.dataStorage = this.initializeDataStorage();
        this.initializeFormHandlers();
        this.setupGlobalValidation();
    }

    // Initialize validation rules for different input types
    initializeValidationRules() {
        return {
            required: {
                test: (value) => value && value.trim().length > 0,
                message: 'This field is required'
            },
            email: {
                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            },
            phone: {
                test: (value) => /^[0-9+\-\s()]+$/.test(value) && value.replace(/[^0-9]/g, '').length >= 10,
                message: 'Please enter a valid phone number (at least 10 digits)'
            },
            date: {
                test: (value) => {
                    const date = new Date(value);
                    return date instanceof Date && !isNaN(date) && date < new Date();
                },
                message: 'Please enter a valid date in the past'
            },
            minLength: (min) => ({
                test: (value) => value && value.trim().length >= min,
                message: `This field must be at least ${min} characters long`
            }),
            maxLength: (max) => ({
                test: (value) => !value || value.length <= max,
                message: `This field must not exceed ${max} characters`
            }),
            name: {
                test: (value) => /^[a-zA-Z\s\-'\.]+$/.test(value) && value.trim().length >= 2,
                message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
            },
            noSpecialChars: {
                test: (value) => /^[a-zA-Z0-9\s\-_\.]+$/.test(value),
                message: 'Special characters are not allowed except hyphens, underscores, and periods'
            },
            grade: {
                test: (value) => /^grade-[r1-7]$/.test(value),
                message: 'Please select a valid grade level'
            },
            textArea: {
                test: (value) => !value || (value.trim().length >= 10 && value.trim().length <= 1000),
                message: 'Text must be between 10 and 1000 characters'
            }
        };
    }

    // Initialize custom error messages for specific fields
    initializeErrorMessages() {
        return {
            fullName: {
                required: 'Student\'s full name is required',
                name: 'Please enter a valid student name'
            },
            parentName: {
                required: 'Parent or guardian name is required',
                name: 'Please enter a valid parent/guardian name'
            },
            email: {
                required: 'Email address is required',
                email: 'Please enter a valid email address (e.g., parent@example.com)'
            },
            contactNumber: {
                required: 'Contact number is required',
                phone: 'Please enter a valid South African phone number'
            },
            dob: {
                required: 'Date of birth is required',
                date: 'Please enter a valid birth date'
            },
            gradeApplying: {
                required: 'Please select the grade your child is applying for',
                grade: 'Please select a valid grade level'
            },
            name: {
                required: 'Your name is required',
                name: 'Please enter your full name'
            },
            phone: {
                phone: 'Please enter a valid phone number'
            },
            subject: {
                required: 'Please select an enquiry topic'
            },
            message: {
                required: 'Please enter your message or enquiry',
                textArea: 'Message must be between 10 and 1000 characters'
            },
            additionalInfo: {
                textArea: 'Additional information should be between 10 and 1000 characters if provided'
            },
            vol_name: {
                required: 'Your name is required to volunteer',
                name: 'Please enter your full name'
            },
            vol_email: {
                required: 'Email address is required',
                email: 'Please enter a valid email address'
            },
            vol_phone: {
                required: 'Phone number is required',
                phone: 'Please enter a valid phone number'
            },
            vol_interest: {
                required: 'Please select an area of interest'
            },
            sponsor_company: {
                required: 'Company name is required',
                name: 'Please enter a valid company name'
            },
            sponsor_contact: {
                required: 'Contact person name is required',
                name: 'Please enter the contact person\'s name'
            },
            sponsor_email: {
                required: 'Email address is required',
                email: 'Please enter a valid email address'
            },
            sponsor_phone: {
                required: 'Phone number is required',
                phone: 'Please enter a valid phone number'
            },
            sponsorship_type: {
                required: 'Please select a type of sponsorship'
            }
        };
    }

    // Initialize data storage system
    initializeDataStorage() {
        return {
            admissions: JSON.parse(localStorage.getItem('admissionApplications') || '[]'),
            enquiries: JSON.parse(localStorage.getItem('contactEnquiries') || '[]'),
            volunteers: JSON.parse(localStorage.getItem('volunteerApplications') || '[]'),
            sponsors: JSON.parse(localStorage.getItem('sponsorApplications') || '[]'),
            validationLogs: JSON.parse(localStorage.getItem('validationLogs') || '[]')
        };
    }

    // Set up global form validation
    setupGlobalValidation() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeForms();
            this.setupRealTimeValidation();
            this.setupFormSubmissionHandlers();
            this.setupErrorDisplaySystem();
        });
    }

    // Initialize all forms on the page
    initializeForms() {
        // Admissions form
        const admissionForm = document.querySelector('form[action="submit_admission.html"]');
        if (admissionForm) {
            this.setupAdmissionForm(admissionForm);
        }

        // Contact/Enquiry form
        const enquiryForm = document.querySelector('form[style*="max-width: 600px"]');
        if (enquiryForm && !admissionForm) { // Ensure it's the enquiry form, not admission
            this.setupEnquiryForm(enquiryForm);
        }

        // Volunteer form
        const volunteerForm = document.querySelector('#volunteer-form');
        if (volunteerForm) {
            this.setupVolunteerForm(volunteerForm);
        }

        // Sponsor form
        const sponsorForm = document.querySelector('#sponsor-form');
        if (sponsorForm) {
            this.setupSponsorForm(sponsorForm);
        }

        // Search forms (already handled by search.js, but we'll add validation)
        this.setupSearchValidation();
    }

    // Setup admission form validation
    setupAdmissionForm(form) {
        const formConfig = {
            name: 'admission',
            fields: {
                fullName: ['required', 'name', 'minLength:2', 'maxLength:100'],
                dob: ['required', 'date'],
                previousSchool: ['maxLength:200', 'noSpecialChars'],
                parentName: ['required', 'name', 'minLength:2', 'maxLength:100'],
                contactNumber: ['required', 'phone'],
                email: ['required', 'email'],
                gradeApplying: ['required', 'grade'],
                additionalInfo: ['textArea']
            },
            submitHandler: (data) => this.handleAdmissionSubmission(data),
            successMessage: 'Application submitted successfully! We will contact you within 2 business days.',
            errorMessage: 'Please correct the errors below and try again.'
        };

        this.forms.set('admission', formConfig);
        this.attachFormValidation(form, formConfig);
    }

    // Setup enquiry form validation
    setupEnquiryForm(form) {
        const formConfig = {
            name: 'enquiry',
            fields: {
                name: ['required', 'name', 'minLength:2', 'maxLength:100'],
                email: ['required', 'email'],
                phone: ['phone'],
                subject: ['required'],
                message: ['required', 'textArea']
            },
            submitHandler: (data) => this.handleEnquirySubmission(data),
            successMessage: 'Your enquiry has been sent successfully! We will respond within 24 hours.',
            errorMessage: 'Please correct the errors below and try again.'
        };

        this.forms.set('enquiry', formConfig);
        this.attachFormValidation(form, formConfig);
    }

    // Setup volunteer form validation
    setupVolunteerForm(form) {
        const formConfig = {
            name: 'volunteer',
            fields: {
                vol_name: ['required', 'name', 'minLength:2', 'maxLength:100'],
                vol_email: ['required', 'email'],
                vol_phone: ['required', 'phone'],
                vol_interest: ['required']
            },
            submitHandler: (data) => this.handleVolunteerSubmission(data),
            successMessage: 'Thank you for volunteering! We will contact you soon with more information.',
            errorMessage: 'Please correct the errors below and try again.'
        };

        this.forms.set('volunteer', formConfig);
        this.attachFormValidation(form, formConfig);
    }

    // Setup sponsor form validation
    setupSponsorForm(form) {
        const formConfig = {
            name: 'sponsor',
            fields: {
                sponsor_company: ['required', 'name', 'minLength:2', 'maxLength:200'],
                sponsor_contact: ['required', 'name', 'minLength:2', 'maxLength:100'],
                sponsor_email: ['required', 'email'],
                sponsor_phone: ['required', 'phone'],
                sponsorship_type: ['required']
            },
            submitHandler: (data) => this.handleSponsorSubmission(data),
            successMessage: 'Thank you for your interest in sponsoring! We will contact you to discuss partnership opportunities.',
            errorMessage: 'Please correct the errors below and try again.'
        };

        this.forms.set('sponsor', formConfig);
        this.attachFormValidation(form, formConfig);
    }

    // Setup search validation (lightweight)
    setupSearchValidation() {
        const searchInputs = document.querySelectorAll('#schoolSearch, input[type="text"][placeholder*="search" i]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateSearchInput(e.target);
            });
        });
    }

    // Attach validation to a form
    attachFormValidation(form, config) {
        if (!form) return;

        // Prevent default submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form, config);
        });

        // Add real-time validation to each field
        Object.keys(config.fields).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                this.setupFieldValidation(field, fieldName, config.fields[fieldName]);
            }
        });

        // Add form styling
        this.addFormStyling(form);
    }

    // Setup field validation
    setupFieldValidation(field, fieldName, rules) {
        // Create error display element
        const errorElement = this.createErrorElement(fieldName);
        field.parentNode.appendChild(errorElement);

        // Add validation events
        field.addEventListener('blur', () => {
            this.validateField(field, fieldName, rules);
        });

        field.addEventListener('input', () => {
            // Clear errors on input for better UX
            this.clearFieldError(fieldName);
            
            // Add visual feedback
            field.style.borderColor = '#28a745';
            field.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
        });

        field.addEventListener('focus', () => {
            field.style.borderColor = '#FFD700';
            field.style.boxShadow = '0 0 0 0.2rem rgba(255, 215, 0, 0.25)';
        });
    }

    // Validate individual field
    validateField(field, fieldName, rules) {
        const value = field.value;
        const errors = [];

        rules.forEach(rule => {
            let ruleObj;
            let ruleParams = null;

            // Parse rule (e.g., "minLength:5")
            if (rule.includes(':')) {
                const [ruleName, params] = rule.split(':');
                ruleParams = params;
                ruleObj = this.validationRules[ruleName](parseInt(params));
            } else {
                ruleObj = this.validationRules[rule];
            }

            if (ruleObj && !ruleObj.test(value)) {
                // Use custom error message if available
                const customMessage = this.errorMessages[fieldName] && this.errorMessages[fieldName][rule];
                errors.push(customMessage || ruleObj.message);
            }
        });

        if (errors.length > 0) {
            this.showFieldError(fieldName, errors[0], field);
            return false;
        } else {
            this.clearFieldError(fieldName);
            this.showFieldSuccess(field);
            return true;
        }
    }

    // Create error display element
    createErrorElement(fieldName) {
        const errorDiv = document.createElement('div');
        errorDiv.id = `error-${fieldName}`;
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
            font-weight: 500;
        `;
        return errorDiv;
    }

    // Show field error
    showFieldError(fieldName, message, field) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Style the field
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');

        // Add shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    // Clear field error
    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`error-${fieldName}`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Show field success
    showFieldSuccess(field) {
        field.style.borderColor = '#28a745';
        field.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
    }

    // Handle form submission
    handleFormSubmission(form, config) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add timestamp
        data.submittedAt = new Date().toISOString();
        data.formType = config.name;

        // Validate all fields
        let isValid = true;
        const validationResults = {};

        Object.keys(config.fields).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                const fieldValid = this.validateField(field, fieldName, config.fields[fieldName]);
                validationResults[fieldName] = fieldValid;
                if (!fieldValid) isValid = false;
            }
        });

        // Log validation attempt
        this.logValidationAttempt(config.name, data, validationResults, isValid);

        if (isValid) {
            // Show loading state
            this.showLoadingState(form);

            try {
                // Handle submission
                config.submitHandler(data);
                this.showSuccessMessage(form, config.successMessage);
                this.resetForm(form);
            } catch (error) {
                this.showErrorMessage(form, 'An error occurred while submitting the form. Please try again.');
                console.error('Form submission error:', error);
            } finally {
                this.hideLoadingState(form);
            }
        } else {
            this.showErrorMessage(form, config.errorMessage);
            // Focus on first invalid field
            const firstInvalidField = form.querySelector('.is-invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    }

    // Handle admission submission
    handleAdmissionSubmission(data) {
        // Add unique ID
        data.id = 'ADM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        data.status = 'pending';
        data.reviewDate = null;

        // Save to storage
        this.dataStorage.admissions.push(data);
        localStorage.setItem('admissionApplications', JSON.stringify(this.dataStorage.admissions));

        // Send notification email (would be implemented with backend)
        this.sendNotificationEmail('admission', data);

        console.log('Admission application saved:', data);
    }

    // Handle enquiry submission
    handleEnquirySubmission(data) {
        // Add unique ID
        data.id = 'ENQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        data.status = 'new';
        data.responseDate = null;

        // Save to storage
        this.dataStorage.enquiries.push(data);
        localStorage.setItem('contactEnquiries', JSON.stringify(this.dataStorage.enquiries));

        // Send notification email (would be implemented with backend)
        this.sendNotificationEmail('enquiry', data);

        console.log('Enquiry saved:', data);
    }

    // Handle volunteer submission
    handleVolunteerSubmission(data) {
        // Add unique ID
        data.id = 'VOL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        data.status = 'new';
        data.applicationDate = new Date().toISOString();

        // Save to storage
        this.dataStorage.volunteers.push(data);
        localStorage.setItem('volunteerApplications', JSON.stringify(this.dataStorage.volunteers));

        // Send notification email (would be implemented with backend)
        this.sendNotificationEmail('volunteer', data);

        console.log('Volunteer application saved:', data);
    }

    // Handle sponsor submission
    handleSponsorSubmission(data) {
        // Add unique ID
        data.id = 'SPO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        data.status = 'new';
        data.applicationDate = new Date().toISOString();

        // Save to storage
        this.dataStorage.sponsors.push(data);
        localStorage.setItem('sponsorApplications', JSON.stringify(this.dataStorage.sponsors));

        // Send notification email (would be implemented with backend)
        this.sendNotificationEmail('sponsor', data);

        console.log('Sponsor application saved:', data);
    }

    // Validate search input
    validateSearchInput(input) {
        const value = input.value;
        
        // Basic search validation
        if (value.length > 100) {
            input.value = value.substring(0, 100);
            this.showToast('Search term too long. Maximum 100 characters.', 'warning');
        }

        // Remove dangerous characters
        const sanitized = value.replace(/[<>'"]/g, '');
        if (sanitized !== value) {
            input.value = sanitized;
            this.showToast('Special characters removed for security.', 'info');
        }
    }

    // Show loading state
    showLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            const originalText = submitButton.textContent || submitButton.value;
            submitButton.dataset.originalText = originalText;
            
            if (submitButton.textContent !== undefined) {
                submitButton.textContent = '⏳ Submitting...';
            } else {
                submitButton.value = '⏳ Submitting...';
            }
        }
    }

    // Hide loading state
    hideLoadingState(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            const originalText = submitButton.dataset.originalText;
            
            if (submitButton.textContent !== undefined) {
                submitButton.textContent = originalText;
            } else {
                submitButton.value = originalText;
            }
        }
    }

    // Show success message
    showSuccessMessage(form, message) {
        this.showFormMessage(form, message, 'success');
    }

    // Show error message
    showErrorMessage(form, message) {
        this.showFormMessage(form, message, 'error');
    }

    // Show form message
    showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <div style="
                padding: 15px 20px;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: 500;
                border: 2px solid;
                ${type === 'success' ? `
                    background-color: #d4edda;
                    color: #155724;
                    border-color: #c3e6cb;
                ` : `
                    background-color: #f8d7da;
                    color: #721c24;
                    border-color: #f5c6cb;
                `}
            ">
                ${type === 'success' ? '✅' : '❌'} ${message}
            </div>
        `;

        // Insert at top of form
        form.insertBefore(messageDiv, form.firstChild);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 10000);

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form
    resetForm(form) {
        form.reset();
        
        // Clear all error states
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            field.style.borderColor = '';
            field.style.boxShadow = '';
        });

        // Clear all error messages
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Log validation attempt
    logValidationAttempt(formType, data, validationResults, isValid) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            formType,
            isValid,
            validationResults,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.dataStorage.validationLogs.push(logEntry);
        
        // Keep only last 100 logs
        if (this.dataStorage.validationLogs.length > 100) {
            this.dataStorage.validationLogs = this.dataStorage.validationLogs.slice(-100);
        }

        localStorage.setItem('validationLogs', JSON.stringify(this.dataStorage.validationLogs));
    }

    // Send notification email (placeholder for backend integration)
    sendNotificationEmail(type, data) {
        // This would integrate with a backend service
        console.log(`Email notification sent for ${type}:`, {
            to: 'pinetownindependentprimary@gmail.com',
            subject: type === 'admission' ? 'New Admission Application' : 'New Website Enquiry',
            data: data
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.validation-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'validation-toast';
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                ${type === 'success' ? 'background: #28a745; color: white;' : ''}
                ${type === 'warning' ? 'background: #ffc107; color: #000;' : ''}
                ${type === 'error' ? 'background: #dc3545; color: white;' : ''}
                ${type === 'info' ? 'background: #17a2b8; color: white;' : ''}
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Add form styling
    addFormStyling(form) {
        // Add CSS for animations and enhanced styling
        if (!document.querySelector('#validation-styles')) {
            const styles = document.createElement('style');
            styles.id = 'validation-styles';
            styles.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                .form-field-wrapper {
                    position: relative;
                    margin-bottom: 1rem;
                }
                
                .is-valid {
                    border-color: #28a745 !important;
                    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
                }
                
                .is-invalid {
                    border-color: #dc3545 !important;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
                }
                
                .field-error {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .form-message {
                    animation: slideDown 0.3s ease-in-out;
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Setup real-time validation for all inputs
    setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                // Add basic input feedback
                e.target.style.transition = 'all 0.3s ease';
            }
        });
    }

    // Setup error display system
    setupErrorDisplaySystem() {
        // Global error handler for uncaught errors
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            this.showToast('An unexpected error occurred. Please refresh the page.', 'error');
        });

        // Handle form validation errors
        document.addEventListener('invalid', (e) => {
            e.preventDefault();
            const field = e.target;
            const fieldName = field.name || field.id;
            
            if (fieldName) {
                this.showFieldError(fieldName, 'Please fill in this field correctly.', field);
            }
        }, true);
    }

    // Initialize form handlers
    initializeFormHandlers() {
        // Form auto-save functionality
        this.setupAutoSave();
        
        // Form data recovery
        this.setupDataRecovery();
        
        // Form analytics
        this.setupFormAnalytics();
    }

    // Setup auto-save functionality
    setupAutoSave() {
        let autoSaveTimeout;
        
        document.addEventListener('input', (e) => {
            if (e.target.closest('form')) {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(() => {
                    this.autoSaveFormData(e.target.closest('form'));
                }, 2000);
            }
        });
    }

    // Auto-save form data
    autoSaveFormData(form) {
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formId = form.action || form.id || 'default';
        
        localStorage.setItem(`autoSave-${formId}`, JSON.stringify({
            data,
            timestamp: new Date().toISOString()
        }));
    }

    // Setup data recovery
    setupDataRecovery() {
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                this.recoverFormData(form);
            });
        });
    }

    // Recover form data
    recoverFormData(form) {
        const formId = form.action || form.id || 'default';
        const savedData = localStorage.getItem(`autoSave-${formId}`);
        
        if (savedData) {
            try {
                const { data, timestamp } = JSON.parse(savedData);
                const saveTime = new Date(timestamp);
                const now = new Date();
                
                // Only recover data from last 24 hours
                if (now - saveTime < 24 * 60 * 60 * 1000) {
                    Object.keys(data).forEach(fieldName => {
                        const field = form.querySelector(`[name="${fieldName}"]`);
                        if (field && field.value === '') {
                            field.value = data[fieldName];
                            
                            // Show recovery notification
                            this.showToast('Previous form data recovered', 'info');
                        }
                    });
                }
            } catch (error) {
                console.error('Error recovering form data:', error);
            }
        }
    }

    // Setup form analytics
    setupFormAnalytics() {
        this.formAnalytics = {
            interactions: [],
            submissions: [],
            errors: []
        };
        
        // Track form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackFormInteraction('focus', e.target);
            }
        }, true);
        
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackFormInteraction('blur', e.target);
            }
        }, true);
    }

    // Track form interaction
    trackFormInteraction(type, field) {
        this.formAnalytics.interactions.push({
            type,
            fieldName: field.name || field.id,
            fieldType: field.type,
            timestamp: new Date().toISOString(),
            formType: field.closest('form')?.action || 'unknown'
        });
    }

    // Get form statistics
    getFormStatistics() {
        return {
            admissions: {
                total: this.dataStorage.admissions.length,
                pending: this.dataStorage.admissions.filter(app => app.status === 'pending').length,
                lastSubmission: this.dataStorage.admissions[this.dataStorage.admissions.length - 1]?.submittedAt
            },
            enquiries: {
                total: this.dataStorage.enquiries.length,
                new: this.dataStorage.enquiries.filter(enq => enq.status === 'new').length,
                lastSubmission: this.dataStorage.enquiries[this.dataStorage.enquiries.length - 1]?.submittedAt
            },
            validation: {
                totalAttempts: this.dataStorage.validationLogs.length,
                successRate: this.dataStorage.validationLogs.filter(log => log.isValid).length / this.dataStorage.validationLogs.length * 100
            }
        };
    }

    // Export data for backup
    exportData() {
        const exportData = {
            admissions: this.dataStorage.admissions,
            enquiries: this.dataStorage.enquiries,
            volunteers: this.dataStorage.volunteers,
            sponsors: this.dataStorage.sponsors,
            validationLogs: this.dataStorage.validationLogs,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pinetown-school-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the validation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.formValidationManager = new FormValidationManager();
    
    // Add global functions for external access
    window.validateForm = function(formElement) {
        return window.formValidationManager.handleFormSubmission(formElement);
    };
    
    window.getFormStats = function() {
        return window.formValidationManager.getFormStatistics();
    };
    
    window.exportFormData = function() {
        return window.formValidationManager.exportData();
    };
    
    console.log('Form Validation System Initialized');
    console.log('Features: Real-time validation, Error handling, Data persistence, Auto-save, Data recovery');
});