class CountdownTimer {
  constructor() {
    // Initialize target date as null first
    this.targetDate = null;

    this.elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
      countdown: document.getElementById("countdown"),
      unlockMessage: document.getElementById("unlock-message"),
      expiredSection: document.getElementById("expired-section"),
      refreshCounter: document.getElementById("refresh-counter"),
      refreshProgress: document.getElementById("refresh-progress"),
      targetDateDisplay: document.querySelector(".CountdownTimer-targetDate"),
    };

    this.isExpired = false;
    this.refreshInterval = null;
    this.refreshSeconds = 100;

    // Set target date: July 1, 2026 at 12:00 CET/CEST (automatically handled)
    // Note: year, month (1-12), day, hour (24h), minute
    this.setTargetDate(2026, 7, 1, 12, 0);

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
      seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
    };
  }

  updateDisplay(timeLeft) {
    this.elements.days.textContent = this.padZero(timeLeft.days);
    this.elements.hours.textContent = this.padZero(timeLeft.hours);
    this.elements.minutes.textContent = this.padZero(timeLeft.minutes);
    this.elements.seconds.textContent = this.padZero(timeLeft.seconds);

    // Add pulse effect to seconds
    this.elements.seconds.style.animation = "none";
    setTimeout(() => {
      this.elements.seconds.style.animation = "pulse 0.5s ease-in-out";
    }, 10);
  }

  showExpiredMessage() {
    this.elements.countdown.style.display = "none";
    this.elements.unlockMessage.style.display = "none";
    this.elements.expiredSection.classList.remove("hidden");

    document.querySelector(".features-preview").style.display = "none";

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
    return num.toString().padStart(2, "0");
  }

  updateTargetDateDisplay() {
    if (this.elements.targetDateDisplay) {
      // Create a date formatter for Central European timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
        timeZone: 'Europe/Warsaw'
      });
      
      // Get the formatted date without timezone name
      const formattedDate = formatter.format(this.targetDate)
        .replace(/,\s*2026/, ', 2026');
      
      // Determine if DST is active for the target date to show CET or CEST
      const isDST = this.isDSTActive(this.targetDate);
      const timezoneName = isDST ? 'CEST' : 'CET';
      
      this.elements.targetDateDisplay.textContent = `${formattedDate} ${timezoneName}`;
    }
  }

  // Helper method to create timezone-aware dates
  // Usage: setTargetDate(2026, 3, 22, 22, 0) for March 22, 2026 at 22:00 CET/CEST
  setTargetDate(year, month, day, hour, minute) {
    // Create date string in ISO format for Central European timezone
    // The browser will automatically handle CET/CEST based on the date
    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    
    // Check if the date falls in DST period (CEST) or standard time (CET)
    const tempDate = new Date(dateString);
    const isDST = this.isDSTActive(tempDate);
    const offset = isDST ? '+02:00' : '+01:00';
    
    this.targetDate = new Date(dateString + offset);
    this.updateTargetDateDisplay();
  }

  // Check if Daylight Saving Time is active for Central European timezone
  isDSTActive(date) {
    const year = date.getFullYear();
    
    // DST in Central Europe: last Sunday in March to last Sunday in October
    const march = new Date(year, 2, 31); // March 31st
    const lastSundayMarch = new Date(march.getTime() - (march.getDay() * 24 * 60 * 60 * 1000));
    
    const october = new Date(year, 9, 31); // October 31st  
    const lastSundayOctober = new Date(october.getTime() - (october.getDay() * 24 * 60 * 60 * 1000));
    
    return date >= lastSundayMarch && date < lastSundayOctober;
  }
}

// Additional CSS animations for pulse effect
const style = document.createElement("style");
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
    this.container = document.querySelector(".background-animation");
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
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random properties
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 4 + Math.random() * 4 + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";

    // Random colors (Minecraft-like)
    const colors = ["#00ff88", "#00cc66", "#ff6b35", "#f7931e", "#42a5f5"];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
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

// Navbar Dropdown Functionality
class NavbarDropdown {
  constructor() {
    this.dropdown = document.querySelector('.navbar-dropdown');
    this.toggle = document.querySelector('.navbar-dropdown-toggle');
    this.menu = document.querySelector('.navbar-dropdown-menu');
    
    if (this.dropdown && this.toggle && this.menu) {
      this.init();
    }
  }

  init() {
    // Toggle dropdown on button click
    this.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    this.dropdown.classList.toggle('active');
  }

  closeDropdown() {
    this.dropdown.classList.remove('active');
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize CountdownTimer if countdown elements exist
  if (document.getElementById("countdown")) {
    new CountdownTimer();
  }
  
  // Only initialize ParticleSystem if background animation container exists
  if (document.querySelector(".background-animation")) {
    new ParticleSystem();
  }
  
  // Always initialize NavbarDropdown as it's used on all pages
  new NavbarDropdown();

  // Add some interactive effects for countdown elements if they exist
  const timeUnits = document.querySelectorAll(".time-unit");
  if (timeUnits.length > 0) {
    timeUnits.forEach((unit) => {
      unit.addEventListener("mouseenter", function () {
        this.style.boxShadow =
          "0 0 30px rgba(0, 255, 136, 0.6), inset 0 0 30px rgba(0, 255, 136, 0.2)";
      });

      unit.addEventListener("mouseleave", function () {
        this.style.boxShadow =
          "0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)";
      });
    });
  }

  // Add click effect to features if they exist
  const features = document.querySelectorAll(".feature");
  if (features.length > 0) {
    features.forEach((feature) => {
      feature.addEventListener("click", function () {
        this.style.animation = "pulse 0.6s ease-in-out";
        setTimeout(() => {
          this.style.animation = "";
        }, 600);
      });
    });
  }
});

// Handle visibility change to pause/resume animations
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.body.style.animationPlayState = "paused";
  } else {
    document.body.style.animationPlayState = "running";
  }
});

// Prevent right-click context menu (optional security)
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // F5 or Ctrl+R to refresh
  if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
    e.preventDefault();
    location.reload();
  }

  // Easter egg: Press 'M' for Minecraft sound effect simulation
  if (e.key && e.key.toLowerCase() === "m") {
    document.body.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 500);
  }
});

// Add shake animation for easter egg
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);
