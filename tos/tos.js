// ToS (Server Rules) JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Language switcher functionality
    const languageButtons = document.querySelectorAll('.lang-btn');
    const contents = document.querySelectorAll('.rules-content');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content sections
            contents.forEach(content => content.classList.add('hidden'));
            
            // Show target content
            const targetContent = document.getElementById(`content-${targetLang}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
});

// Smooth scrolling for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});