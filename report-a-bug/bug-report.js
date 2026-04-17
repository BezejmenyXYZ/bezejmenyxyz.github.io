// Bug Report Form Handler
class BugReportForm {
    constructor() {
        this.form = document.getElementById('bugReportForm');
        this.fileInput = document.getElementById('bugEvidence');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.filePreview = document.getElementById('filePreview');
        this.submitBtn = document.getElementById('submitBtn');
        this.submitStatus = document.getElementById('submitStatus');
        this.maxFileSize = 8 * 1024 * 1024; // 8MB
        this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        this.allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
        this.files = [];
        
        // API endpoint for secure bug report submission
        this.apiEndpoint = '/api/submit-bug-report.php';
        
        // Check if required elements exist
        if (!this.form) {
            console.error('Bug report form not found!');
            return;
        }
        
        this.initializeEvents();
        this.setupFileUpload();
        this.setupDateValidation();
        
        // Initialize evidence requirement on page load
        setTimeout(() => this.updateEvidenceRequirement(), 100);
    }

    initializeEvents() {
        if (!this.form) return;
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Severity level change handler
        const severitySelect = document.getElementById('bugSeverity');
        if (severitySelect) {
            severitySelect.addEventListener('change', () => this.updateEvidenceRequirement());
        }
    }

    setupFileUpload() {
        if (!this.fileInput || !this.fileUploadArea) return;
        
        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        
        // Drag and drop
        this.fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.add('dragover');
        });
        
        this.fileUploadArea.addEventListener('dragleave', () => {
            this.fileUploadArea.classList.remove('dragover');
        });
        
        this.fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Click to browse
        this.fileUploadArea.addEventListener('click', (e) => {
            if (e.target !== this.fileInput) {
                this.fileInput.click();
            }
        });
    }

    setupDateValidation() {
        const dateInput = document.getElementById('firstOccurrence');
        if (!dateInput) return;

        // Set max date to current date/time
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Convert to local timezone
        const maxDate = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
        dateInput.setAttribute('max', maxDate);

        // Add validation on input change
        dateInput.addEventListener('input', () => {
            const selectedDate = new Date(dateInput.value);
            const currentDate = new Date();
            const minDate = new Date('2026-04-01T00:00:00');

            if (selectedDate > currentDate) {
                this.setFieldValidation(dateInput, false, 'Date cannot be in the future');
                return false;
            }

            if (selectedDate < minDate) {
                this.setFieldValidation(dateInput, false, 'Date must be after April 1, 2026');
                return false;
            }

            this.setFieldValidation(dateInput, true, '');
            return true;
        });

        // Also validate on blur
        dateInput.addEventListener('blur', () => {
            if (dateInput.value) {
                dateInput.dispatchEvent(new Event('input'));
            }
        });
    }

    handleFiles(fileList) {
        const newFiles = Array.from(fileList);
        
        for (const file of newFiles) {
            if (this.validateFile(file)) {
                this.files.push(file);
            }
        }
        
        this.updateFilePreview();
        
        // Re-validate evidence requirement after file addition
        this.validateEvidenceRequirement();
    }

    validateFile(file) {
        // Check file type
        const isValidType = [...this.allowedImageTypes, ...this.allowedVideoTypes].includes(file.type);
        if (!isValidType) {
            this.showError(`File "${file.name}" has an invalid type. Only images and videos are allowed.`);
            return false;
        }
        
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`File "${file.name}" is too large. Maximum size is 10MB.`);
            return false;
        }
        
        // Check for suspicious extensions (anti-zip bomb and malware protection)
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.zip', '.rar'];
        const fileName = file.name.toLowerCase();
        const hasSuspiciousExtension = suspiciousExtensions.some(ext => fileName.endsWith(ext));
        
        if (hasSuspiciousExtension) {
            this.showError(`File "${file.name}" has a suspicious extension and is not allowed.`);
            return false;
        }
        
        return true;
    }

    updateFilePreview() {
        if (!this.filePreview) return;
        
        this.filePreview.innerHTML = '';
        
        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-preview-item';
            
            const fileIcon = this.getFileIcon(file.type);
            const fileSize = this.formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <span>${fileIcon} ${file.name} (${fileSize})</span>
                <span class="remove-file" data-index="${index}">✕</span>
            `;
            
            // Add remove functionality
            fileItem.querySelector('.remove-file').addEventListener('click', () => {
                this.removeFile(index);
            });
            
            this.filePreview.appendChild(fileItem);
        });
    }

    getFileIcon(mimeType) {
        if (this.allowedImageTypes.includes(mimeType)) return '🖼️';
        if (this.allowedVideoTypes.includes(mimeType)) return '🎥';
        return '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.updateFilePreview();
        
        // Re-validate evidence requirement after file removal
        this.validateEvidenceRequirement();
    }
    
    updateEvidenceRequirement() {
        const severitySelect = document.getElementById('bugSeverity');
        const fileUploadSection = document.querySelector('.file-upload-group');
        const sectionTitle = document.querySelector('#evidenceTitle');
        
        if (!severitySelect || !fileUploadSection) return;
        
        const severity = severitySelect.value;
        let newTitle = 'Screenshots or Videos';
        let isRequired = false;
        
        // Update evidence requirement based on severity
        switch (severity) {
            case 'high':
            case 'critical':
                newTitle = 'Screenshots or Videos *';
                isRequired = true;
                this.setEvidenceNote('🔴 Evidence is required for high and critical severity bugs.', 'required');
                break;
            case 'medium':
                newTitle = 'Screenshots or Videos (Recommended)';
                this.setEvidenceNote('🟡 Evidence is recommended for medium severity bugs to help us understand the issue better.', 'recommended');
                break;
            default:
                this.setEvidenceNote('', 'optional');
                break;
        }
        
        // Update the label
        const label = fileUploadSection.querySelector('label');
        if (label) {
            label.textContent = newTitle;
        }
        
        // Store requirement for validation
        this.evidenceRequired = isRequired;
        
        // Validate current evidence state
        this.validateEvidenceRequirement();
    }
    
    setEvidenceNote(message, type) {
        const fileUploadGroup = document.querySelector('.file-upload-group');
        let noteElement = fileUploadGroup.querySelector('.evidence-note');
        
        if (noteElement) {
            noteElement.remove();
        }
        
        if (message) {
            noteElement = document.createElement('div');
            noteElement.className = `evidence-note ${type}`;
            noteElement.textContent = message;
            
            // Insert after the label
            const label = fileUploadGroup.querySelector('label');
            if (label) {
                label.insertAdjacentElement('afterend', noteElement);
            }
        }
    }
    
    validateEvidenceRequirement() {
        if (!this.evidenceRequired) return true;
        
        const fileUploadGroup = document.querySelector('.file-upload-group');
        const hasFiles = this.files.length > 0;
        
        if (this.evidenceRequired && !hasFiles) {
            this.setFieldValidation(this.fileInput, false, 'Evidence is required for high and critical severity bugs.');
            return false;
        } else if (hasFiles || !this.evidenceRequired) {
            this.clearFieldError(this.fileInput);
            return true;
        }
        
        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'minecraftNick':
                if (!value) {
                    errorMessage = 'Minecraft username is required';
                    isValid = false;
                } else if (value.length > 16) {
                    errorMessage = 'Minecraft username cannot exceed 16 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    errorMessage = 'Minecraft username can only contain letters, numbers, and underscores';
                    isValid = false;
                }
                break;

            case 'discordId':
                if (value && (!/^\d{17,19}$/.test(value))) {
                    errorMessage = 'Discord ID does not look right, it should be a numeric ID (17-19 digits)';
                    isValid = false;
                }
                break;

            case 'bugTitle':
                if (!value) {
                    errorMessage = 'Bug title is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Bug title must be at least 5 characters';
                    isValid = false;
                }
                break;

            case 'bugDescription':
                if (!value) {
                    errorMessage = 'Bug description is required';
                    isValid = false;
                } else if (value.length < 20) {
                    errorMessage = 'Bug description must be at least 20 characters';
                    isValid = false;
                }
                break;

            case 'reproductionSteps':
                if (!value) {
                    errorMessage = 'Reproduction steps are required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Please provide more detailed reproduction steps';
                    isValid = false;
                }
                break;

            case 'firstOccurrence':
                if (!value) {
                    errorMessage = 'Please specify when you first noticed this bug';
                    isValid = false;
                } else {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    const minDate = new Date('2026-04-01T00:00:00');
                    
                    if (selectedDate > currentDate) {
                        errorMessage = 'Date cannot be in the future';
                        isValid = false;
                    } else if (selectedDate < minDate) {
                        errorMessage = 'Date must be after April 1, 2026';
                        isValid = false;
                    }
                }
                break;
        }

        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    setFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        formGroup.classList.remove('error', 'success');
        
        if (!isValid && errorMessage) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        } else if (isValid && field.value.trim()) {
            formGroup.classList.add('success');
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        // Validate evidence requirement based on severity
        if (!this.validateEvidenceRequirement()) {
            allValid = false;
        }
        
        if (!allValid) {
            this.showError('Please fix the errors above before submitting.');
            return;
        }
        
        // Show loading state
        this.setSubmitLoading(true);
        
        try {
            const formData = this.collectFormData();
            await this.submitBugReport(formData);
            this.showSuccess('Bug report submitted successfully! Thank you for helping us improve the server.');
            this.form.reset();
            this.files = [];
            this.updateFilePreview();
        } catch (error) {
            console.error('Submission error:', error);
            
            // Generate email fallback
            const formData = this.collectFormData();
            this.generateEmailFallback(formData);
            
            this.showError('Failed to submit bug report. An email has been prepared for you to send manually. Please check your email client.');
        } finally {
            this.setSubmitLoading(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Collect form fields
        for (const [key, value] of formData.entries()) {
            if (key !== 'bugEvidence') { // Handle files separately
                data[key] = value;
            }
        }
        
        // Add files information
        data.files = this.files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        }));
        
        return data;
    }
    
    generateEmailFallback(data) {
        const subject = `Bug Report: ${data.bugTitle}`;
        const body = this.formatEmailBody(data);
        
        // Create mailto link
        const mailtoLink = `mailto:hello@bezejmeny.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Try to open email client
        try {
            window.open(mailtoLink);
        } catch (e) {
            // Fallback - show the email content in a modal or copy to clipboard
            this.showEmailFallbackModal(subject, body);
        }
    }
    
    formatEmailBody(data) {
        let body = `Bug Report Submission\n`;
        body += `========================\n\n`;
        
        // Player Information
        body += `PLAYER INFORMATION:\n`;
        body += `- Minecraft Username: ${data.minecraftNick}\n`;
        body += `- Discord ID: ${data.discordId || 'Not provided'}\n`;
        body += `- Beta Tester: ${data.betaTester ? 'Yes' : 'No'}\n\n`;
        
        // Bug Information
        body += `BUG INFORMATION:\n`;
        body += `- Title: ${data.bugTitle}\n`;
        body += `- Description: ${data.bugDescription}\n`;
        body += `- Severity: ${this.formatSeverityText(data.bugSeverity)}\n`;
        if (data.bugCategory) {
            body += `- Category: ${this.formatCategoryText(data.bugCategory)}\n`;
        }
        body += `\n`;
        
        // Reproduction Steps
        body += `HOW TO REPRODUCE:\n`;
        body += `${data.reproductionSteps}\n\n`;
        
        // Expected Behavior
        if (data.expectedBehavior) {
            body += `EXPECTED BEHAVIOR:\n`;
            body += `${data.expectedBehavior}\n\n`;
        }
        
        // Additional Information
        body += `ADDITIONAL INFORMATION:\n`;
        if (data.firstOccurrence) {
            const date = new Date(data.firstOccurrence);
            body += `- First Occurrence: ${date.toLocaleString()}\n`;
        }
        body += `- Frequency: ${this.formatFrequencyText(data.frequency)}\n`;
        
        if (data.additionalNotes) {
            body += `- Additional Notes: ${data.additionalNotes}\n`;
        }
        
        // File Attachments
        if (data.files && data.files.length > 0) {
            body += `\nATTACHED FILES:\n`;
            data.files.forEach(file => {
                body += `- ${file.name} (${this.formatFileSize(file.size)})\n`;
            });
            body += `\nNote: Files cannot be attached via email. Please upload them to a file sharing service and include the links in your reply.\n`;
        }
        
        // Professional email footer
        body += `\n`;
        body += `═══════════════════════════════════════════════════════════════════════════════\n`;
        body += `                          BEZEJMENY BUG REPORT SYSTEM\n`;
        body += `                             Minecraft Server Network\n`;
        body += `═══════════════════════════════════════════════════════════════════════════════\n`;
        body += `\n`;
        body += `📅 Submitted: ${new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        })} at ${new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })}\n`;
        body += `🌐 System: Automated Bug Reporting Portal\n`;
        body += `📧 Support: hello@bezejmeny.xyz\n`;
        body += `🔗 Website: https://bezejmeny.xyz\n`;
        
        return body;
    }
    
    formatSeverityText(severity) {
        const severityMap = {
            low: 'Low - Minor inconvenience',
            medium: 'Medium - Affects gameplay',
            high: 'High - Major functionality broken',
            critical: 'Critical - Server breaking'
        };
        return severityMap[severity] || severity;
    }
    
    formatCategoryText(category) {
        const categoryMap = {
            gameplay: 'Gameplay',
            chat: 'Chat System',
            commands: 'Commands',
            items: 'Items/Inventory',
            building: 'Building/Blocks',
            economy: 'Economy',
            permissions: 'Permissions',
            performance: 'Performance',
            other: 'Other'
        };
        return categoryMap[category] || category;
    }
    
    formatFrequencyText(frequency) {
        const frequencyMap = {
            once: 'Only happened once',
            sometimes: 'Sometimes (rarely)',
            often: 'Often (regularly)',
            always: 'Always (every time)'
        };
        return frequencyMap[frequency] || frequency;
    }
    
    showEmailFallbackModal(subject, body) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'email-fallback-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📧 Email Fallback</h3>
                    <button class="close-modal" onclick="this.closest('.email-fallback-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>The automatic submission failed. Here's your bug report formatted for email:</p>
                    <div class="email-preview">
                        <strong>To:</strong> hello@bezejmeny.xyz<br>
                        <strong>Subject:</strong> ${subject}<br><br>
                        <textarea readonly class="email-body">${body}</textarea>
                    </div>
                    <div class="modal-actions">
                        <button class="copy-btn" onclick="navigator.clipboard.writeText(this.dataset.content).then(() => { this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy to Clipboard', 2000); })" data-content="${body.replace(/"/g, '&quot;')}">Copy to Clipboard</button>
                        <button class="email-btn" onclick="window.open('mailto:hello@bezejmeny.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}'); this.closest('.email-fallback-modal').remove()">Open Email Client</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async submitBugReport(data) {
        // Create Discord embed
        const embed = {
            title: `🐛 Bug Report: ${data.bugTitle}`,
            color: 0xff4444, // Red color for bugs
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: '👤 Player Information',
                    value: this.formatPlayerInfo(data),
                    inline: false
                },
                {
                    name: '🐞 Bug Details',
                    value: this.formatBugDetails(data),
                    inline: false
                },
                {
                    name: '🔄 How to Reproduce',
                    value: this.escapeNewlines(data.reproductionSteps) || 'Not provided',
                    inline: false
                }
            ],
            footer: {
                text: 'Bezejmeny • BRS | bezejmeny.online/report-a-bug',
            }
        };
        
        // Add optional fields
        if (data.expectedBehavior) {
            embed.fields.push({
                name: '✅ Expected Behavior',
                value: this.escapeNewlines(data.expectedBehavior),
                inline: false
            });
        }
        
        if (data.additionalNotes) {
            embed.fields.push({
                name: '📝 Additional Notes',
                value: this.escapeNewlines(data.additionalNotes),
                inline: false
            });
        }
        
        if (data.firstOccurrence) {
            embed.fields.push({
                name: '⏰ First Occurrence',
                value: new Date(data.firstOccurrence).toLocaleString(),
                inline: true
            });
        }
        
        embed.fields.push({
            name: '📋 Frequency',
            value: this.formatFrequency(data.frequency),
            inline: true
        });
        
        // Prepare form data for multipart upload
        const formData = new FormData();
        
        // Add the embed as payload_json
        formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
        
        // Add files if any
        if (this.files && this.files.length > 0) {
            console.log(`🔧 DEBUG: Uploading ${this.files.length} files:`, this.files.map(f => `${f.name} (${f.size} bytes)`));
            this.files.forEach((file, index) => {
                formData.append(`file${index}`, file, file.name);
                console.log(`🔧 DEBUG: Added file${index}:`, file.name, file.type, file.size);
            });
        } else {
            console.log('🔧 DEBUG: No files to upload');
        }
        
        // Send to our secure API endpoint
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            body: formData // Don't set Content-Type, browser will handle multipart boundary
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Submission failed: ${errorData.error || response.status}`);
        }
        
        return await response.json();
    }

    formatPlayerInfo(data) {
        let info = `**Minecraft:** ${data.minecraftNick}`;
        if (data.discordId) {
            info += `\\n**Discord ID:** ${data.discordId}`;
        }
        info += `\\n**Beta Tester:** ${data.betaTester ? 'Yes ✅' : 'No ❌'}`;
        return info;
    }

    formatBugDetails(data) {
        let details = `**Description:** ${this.escapeNewlines(data.bugDescription)}`;
        details += `\\n**Severity:** ${this.formatSeverity(data.bugSeverity)}`;
        if (data.bugCategory) {
            details += `\\n**Category:** ${this.formatCategory(data.bugCategory)}`;
        }
        return details;
    }

    formatSeverity(severity) {
        const severityMap = {
            low: '🟢 Low',
            medium: '🟡 Medium',
            high: '🟠 High',
            critical: '🔴 Critical'
        };
        return severityMap[severity] || severity;
    }

    formatCategory(category) {
        const categoryMap = {
            gameplay: '🎮 Gameplay',
            chat: '💬 Chat System',
            commands: '⌨️ Commands',
            items: '🎒 Items/Inventory',
            building: '🏗️ Building/Blocks',
            economy: '💰 Economy',
            permissions: '🔒 Permissions',
            performance: '⚡ Performance',
            other: '🔧 Other'
        };
        return categoryMap[category] || category;
    }

    formatFrequency(frequency) {
        const frequencyMap = {
            once: 'Only happened once',
            sometimes: 'Sometimes (rarely)',
            often: 'Often (regularly)',
            always: 'Always (every time)'
        };
        return frequencyMap[frequency] || frequency;
    }

    escapeNewlines(text) {
        if (!text) return text;
        return text.replace(/\n/g, '\\n');
    }

    setSubmitLoading(loading) {
        if (!this.submitBtn) return;
        
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (!btnText || !btnLoading) return;
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showError(message) {
        if (!this.submitStatus) return;
        
        this.submitStatus.textContent = message;
        this.submitStatus.className = 'submit-status error';
        this.submitStatus.style.display = 'block';
        this.submitStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showSuccess(message) {
        if (!this.submitStatus) return;
        
        this.submitStatus.textContent = message;
        this.submitStatus.className = 'submit-status success';
        this.submitStatus.style.display = 'block';
        this.submitStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Initialize the form when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.bugReportForm = new BugReportForm();
});