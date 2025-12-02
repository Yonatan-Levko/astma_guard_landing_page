// Language management
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML dir attribute
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Update all elements with data-lang attributes
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-he]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-lang-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Handle placeholders
                if (element.hasAttribute('data-placeholder-en') || element.hasAttribute('data-placeholder-he')) {
                    element.placeholder = element.getAttribute(`data-placeholder-${lang}`) || '';
                }
            } else if (element.tagName === 'OPTION') {
                // Handle option text
                element.textContent = text;
            } else {
                // Handle regular text content
                element.textContent = text;
            }
        }
    });
    
    // Update labels - preserve required asterisk
    const labels = document.querySelectorAll('label[data-lang-en], label[data-lang-he]');
    labels.forEach(label => {
        const labelText = label.getAttribute(`data-lang-${lang}`);
        if (labelText) {
            const requiredSpan = label.querySelector('.required');
            if (requiredSpan) {
                label.innerHTML = labelText + ' ' + requiredSpan.outerHTML;
            } else {
                label.textContent = labelText;
            }
        }
    });
    
    // Update select options
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        const options = select.querySelectorAll('option[data-lang-en], option[data-lang-he]');
        options.forEach(option => {
            const text = option.getAttribute(`data-lang-${lang}`);
            if (text) {
                option.textContent = text;
            }
        });
    });
    
    // Update textarea placeholders
    const textareas = document.querySelectorAll('textarea[data-placeholder-en], textarea[data-placeholder-he]');
    textareas.forEach(textarea => {
        const placeholder = textarea.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            textarea.placeholder = placeholder;
        }
    });
    
    // Update active language button
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language from localStorage or default to English
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
    
    // Initialize textarea placeholder
    const textarea = document.getElementById('asthma-info');
    if (textarea) {
        textarea.placeholder = textarea.getAttribute(`data-placeholder-${savedLang}`) || '';
    }
    
    // Language toggle buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    // Handle smooth scrolling for all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') {
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for sticky navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Form submission handling
    const betaForm = document.getElementById('beta-form');
    const formSuccess = document.getElementById('form-success');
    
    if (betaForm) {
        betaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(betaForm);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Log to console
            console.log('Form submitted with data:', data);
            
            // Show success message
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Reset form
            betaForm.reset();
            
            // Update form placeholders after reset
            const textarea = document.getElementById('asthma-info');
            if (textarea) {
                textarea.placeholder = textarea.getAttribute(`data-placeholder-${currentLang}`) || '';
            }
            
            // Hide success message after 10 seconds (optional)
            setTimeout(function() {
                formSuccess.style.display = 'none';
            }, 10000);
        });
    }
});

