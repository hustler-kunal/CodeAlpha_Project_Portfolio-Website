// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contact-form');

// Theme Toggle
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Mobile Menu
function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// Smooth Scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// Form Submission Handler
const successMessage = document.createElement('div');
successMessage.className = 'success-message';
successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>Message sent successfully!</span>
`;

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonContent = submitButton.innerHTML;
        submitButton.innerHTML = `
            <span>Sending...</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;
        submitButton.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                document.body.appendChild(successMessage);
                setTimeout(() => {
                    successMessage.classList.add('show');
                }, 100);

                // Reset form
                contactForm.reset();

                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(successMessage);
                    }, 300);
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            successMessage.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>Error sending message. Please try again.</span>
            `;
            document.body.appendChild(successMessage);
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 100);

            // Remove error message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 300);
            }, 3000);
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonContent;
            submitButton.disabled = false;
        }
    });
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', savedTheme === 'light');
    icon.classList.toggle('fa-sun', savedTheme === 'dark');
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
mobileMenu.addEventListener('click', toggleMenu);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    if (nav.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('#mobile-menu')) {
        toggleMenu();
    }
});

// Add active class to current section in navigation
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', () => {
    // Update active navigation
    updateActiveNav();
    
    // Add scrolled class to navbar
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize active navigation on page load
updateActiveNav();

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevButton = document.querySelector('.testimonial-prev');
const nextButton = document.querySelector('.testimonial-next');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;
const slideWidth = testimonialCards[0].offsetWidth;
const totalSlides = testimonialCards.length;

// Function to update slider position
function updateSlider() {
    testimonialsSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Event listeners for navigation buttons
prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
});

nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
});

// Event listeners for dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto slide every 5 seconds
let autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}, 5000);

// Pause auto slide on hover
testimonialsSlider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

// Resume auto slide when mouse leaves
testimonialsSlider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
}); 