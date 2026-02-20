class CountdownTimer {
    constructor() {
        // Target date: February 24, 2026 at 19:00 Europe/Prague
        this.targetDate = new Date('2026-02-24T19:00:00+01:00'); // CET is UTC+1
        
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            countdown: document.getElementById('countdown'),
            unlockMessage: document.getElementById('unlock-message'),
            expiredSection: document.getElementById('expired-section'),
            refreshCounter: document.getElementById('refresh-counter'),
            refreshProgress: document.getElementById('refresh-progress')
        };
        
        this.isExpired = false;
        this.refreshInterval = null;
        this.refreshSeconds = 100;
        
        this.init();
    }
    
    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        const now = new Date();
        const timeDiff = this.targetDate.getTime() - now.getTime();
        
        if (timeDiff <= 0) {
            if (!this.isExpired) {
                this.showExpiredMessage();
                this.isExpired = true;
            }
            return;
        }
        
        const timeLeft = this.calculateTimeLeft(timeDiff);
        this.updateDisplay(timeLeft);
    }
    
    calculateTimeLeft(timeDiff) {
        return {
            days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeDiff % (1000 * 60)) / 1000)
        };
    }
    
    updateDisplay(timeLeft) {
        this.elements.days.textContent = this.padZero(timeLeft.days);
        this.elements.hours.textContent = this.padZero(timeLeft.hours);
        this.elements.minutes.textContent = this.padZero(timeLeft.minutes);
        this.elements.seconds.textContent = this.padZero(timeLeft.seconds);
        
        // Add pulse effect to seconds
        this.elements.seconds.style.animation = 'none';
        setTimeout(() => {
            this.elements.seconds.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
    
    showExpiredMessage() {
        this.elements.countdown.style.display = 'none';
        this.elements.unlockMessage.style.display = 'none';
        this.elements.expiredSection.classList.remove('hidden');
        
        document.querySelector('.features-preview').style.display = 'none';
        
        this.startAutoRefresh();
    }
    
    startAutoRefresh() {
        let secondsLeft = this.refreshSeconds;
        
        const updateRefreshCounter = () => {
            this.elements.refreshCounter.textContent = secondsLeft;
            secondsLeft--;
            
            if (secondsLeft < 0) {
                location.reload();
            }
        };
        
        updateRefreshCounter();
        this.refreshInterval = setInterval(updateRefreshCounter, 1000);
        
        // Start progress bar animation
        this.elements.refreshProgress.style.animation = `refreshProgress ${this.refreshSeconds}s linear forwards`;
    }
    
    padZero(num) {
        return num.toString().padStart(2, '0');
    }
}

// Additional CSS animations for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Enhanced particle animation
class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.background-animation');
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.addParticle();
            }, i * 800);
        }
        
        // Continuously add new particles
        setInterval(() => {
            this.addParticle();
        }, 3000);
    }
    
    addParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        // Random colors (Minecraft-like)
        const colors = ['#00ff88', '#00cc66', '#ff6b35', '#f7931e', '#42a5f5'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
        
        this.container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CountdownTimer();
    new ParticleSystem();
    
    // Add some interactive effects
    document.querySelectorAll('.time-unit').forEach(unit => {
        unit.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6), inset 0 0 30px rgba(0, 255, 136, 0.2)';
        });
        
        unit.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)';
        });
    });
    
    // Add click effect to features
    document.querySelectorAll('.feature').forEach(feature => {
        feature.addEventListener('click', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
});

// Handle visibility change to pause/resume animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Console easter egg
console.log(`
🎮 MINECRAFT SERVER COUNTDOWN
==============================
Target: Feb 24, 2026 19:00 CET
Something epic is coming...

⚡ Pro tip: Press F12 to see this message!
🔥 Ready to build something amazing?
`);

// Prevent right-click context menu (optional security)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // F5 or Ctrl+R to refresh
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        location.reload();
    }
    
    // Easter egg: Press 'M' for Minecraft sound effect simulation
    if (e.key.toLowerCase() === 'm') {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
});

// Add shake animation for easter egg
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);