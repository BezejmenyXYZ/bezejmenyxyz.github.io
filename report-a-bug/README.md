# Bug Report System Setup

## Overview
The bug report system allows players to submit detailed bug reports that are automatically sent to a Discord channel via webhooks. The system includes comprehensive validation and security features.

## Features
- ✅ Player identification (Minecraft nickname, Discord ID)
- ✅ Beta tester identification checkbox
- ✅ Structured bug information (title, description, severity, category)
- ✅ Reproduction steps and expected behavior
- ✅ File attachments (images/videos only, max 10MB)
- ✅ Security protection against malicious files
- ✅ Visual feedback and validation
- ✅ Discord embed integration

## Setup Instructions

### 1. Configure Discord Webhook
1. Go to your Discord server settings
2. Navigate to Integrations > Webhooks
3. Create a new webhook for your bug reports channel
4. Copy the webhook URL

### 2. Set Webhook URL
Open `report-a-bug/bug-report.js` and find this line:
```javascript
// TODO: Set the Discord webhook URL here
// window.bugReportForm.setWebhookUrl('YOUR_DISCORD_WEBHOOK_URL');
```

Replace it with:
```javascript
window.bugReportForm.setWebhookUrl('YOUR_ACTUAL_WEBHOOK_URL');
```

Or use the browser console to set it dynamically:
```javascript
configureWebhook('YOUR_WEBHOOK_URL');
```

## Security Features
- File type validation (only images and videos allowed)
- File size limits (10MB maximum)
- Malicious extension blocking
- XSS protection through proper escaping
- Input validation and sanitization

## File Types Allowed
- **Images:** JPG, PNG, GIF, WebP
- **Videos:** MP4, MOV, AVI, QuickTime

## Discord Embed Format
The system sends rich embeds to Discord containing:
- Bug title and description
- Player information (Minecraft nickname, Discord ID, Beta status)
- Bug details (severity, category)
- Reproduction steps
- Additional information (occurrence time, frequency, notes)
- File attachment information

## Admin Notes
- Monitor the webhook URL and keep it secure
- Regularly check file uploads for any issues
- The system will show file information in Discord but actual files need separate handling
- Consider implementing file upload to Discord attachments for complete functionality

## Browser Compatibility
- Modern Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled
- File drag & drop support
- HTML5 form validation