# Bezejmeny Community Hub

Epic Minecraft server community

## 🌐 Architecture 

**Two-Domain Setup:**
- **bezejmeny.xyz** (GitHub Pages) → Static frontend content
- **bezejmeny.online** (PHP Hosting) → Dynamic backend applications
Since it was cheaper for us for first year

## ✨ Features

- **Modern Community Hub**: Gaming-focused design with particle animations
- **Dual-Domain Routing**: Automatic redirects between static and dynamic content
- **Registration System**: Discord OAuth integration for closed beta access
- **Admin Panel**: User management and server administration  
- **Founders Portal**: Special access for community founders
- **Responsive Design**: Works perfectly on all devices
- **Custom Favicon**: Branded logo in browser tabs
- **SEO Optimized**: Jekyll-powered with proper meta tags

## 📁 Project Structure

```
├── Frontend (GitHub Pages - bezejmeny.xyz)
│   ├── index.html          # Main community hub page
│   ├── style.css           # Modern gaming aesthetics  
│   ├── script.js           # Interactive animations
│   ├── 404.html           # Custom error handling
│   ├── tos/               # Terms of Service
│   ├── media/             # Logos and assets
│   ├── r/                 # Redirect links
│   └── _config.yml        # Jekyll configuration
│
├── Backend (PHP Hosting - bezejmeny.online) 
│   ├── register/          # Beta registration system
│   ├── admin/             # Administrative panel
│   ├── founders/          # Founders portal
│   ├── api/               # API endpoints
│   └── includes/          # Shared PHP libraries
```

## ⚙️ Domain Routing

**User Experience:**
- PHP applications stay on .online, static content stays on .xyz

## 🛡️ Security

- **Environment Separation**: Static and dynamic content isolated
- **Protected Credentials**: Database configs excluded from GitHub
- **Jekyll Exclusions**: PHP files never exposed on GitHub Pages
- **SSL Certificates**: Proper HTTPS configuration

## 🎮 Navigation

- **HOME**: Main community hub (bezejmeny.xyz)
- **TOS**: Terms of Service (bezejmeny.xyz/tos)  
- **REGISTER**: Beta registration (bezejmeny.online/register)
- **ADMIN**: Administrative panel (bezejmeny.online/admin)
- **FOUNDERS**: Founders portal (bezejmeny.online/founders)

## 🔧 Technologies

- **Frontend**: HTML5, CSS3, JavaScript, Jekyll
- **Backend**: PHP, MySQL, Discord OAuth
- **Hosting**: GitHub Pages + Traditional PHP hosting
- **Domain Management**: Custom DNS routing

## 🌟 Ready for Epic Gaming Adventures!

Professional dual-domain setup ready to serve thousands of community members with seamless static and dynamic content delivery.