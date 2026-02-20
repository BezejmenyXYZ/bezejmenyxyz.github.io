# Minecraft Server Countdown Website

A modern countdown website for an upcoming Minecraft server launch, featuring:

## Features

- **Live Countdown Timer**: Counts down to February 24, 2026 at 19:00 CET (Europe/Prague timezone)
- **Modern Design**: Minecraft-inspired styling with modern web aesthetics
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and particle system
- **Auto-Refresh**: When countdown expires, page automatically refreshes every 301 seconds
- **404 Handling**: All missing pages redirect back to the main countdown page
- **Progressive Enhancement**: Gracefully degrades without JavaScript

## What Happens After Countdown?

When the countdown reaches zero, the page displays:
- "Anytime now..." message
- Apology for potential delays
- Auto-refresh countdown (301 seconds)
- Suggestion to keep checking back

## Files Structure

```
├── index.html          # Main countdown page
├── style.css           # Modern styling with animations
├── script.js           # Countdown logic and interactions
├── 404.html           # 404 redirect page
└── README.md          # This file
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Local Development

Simply open `index.html` in your browser or serve the files with any static web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with serve package)
npx serve .

# Using PHP
php -S localhost:8000
```

## GitHub Pages Deployment

This site is ready for GitHub Pages deployment. Simply push to your repository and enable GitHub Pages in settings.

## Customization

To change the countdown target date, edit the `targetDate` in `script.js`:

```javascript
this.targetDate = new Date('2026-02-24T19:00:00+01:00'); // Your target date
```

---

🎮 **Ready to launch something epic!** 🚀