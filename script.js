// ===================================
// MOBILE NAVIGATION
// ===================================

const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('header nav');
const body = document.body;

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

// Toggle mobile menu
function toggleNav() {
    navToggle.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('nav-open');
}

// Close mobile menu
function closeNav() {
    navToggle.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('nav-open');
}

// Event listeners
navToggle.addEventListener('click', toggleNav);
overlay.addEventListener('click', closeNav);

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link a');
navLinks.forEach(link => {
    link.addEventListener('click', closeNav);
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeNav();
    }
});

// Close on window resize to desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 768) {
            closeNav();
        }
    }, 250);
});

// ===================================
// DARK MODE TOGGLE
// ===================================

const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

console.log('Navigation initialized');

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.15 // Triggers when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Stop observing after it reveals once
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  // Apply to all elements with the 'reveal' class
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const typeTarget = document.getElementById("typewriter");
  
  // Guard clause: if the element doesn't exist on this page, stop the script
  if (!typeTarget) return;

  const words = JSON.parse(typeTarget.getAttribute("data-words"));
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 150;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove a character
      typeTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // Deleting is usually faster
    } else {
      // Add a character
      typeTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150;
    }

    // Logic for switching states
    if (!isDeleting && charIndex === currentWord.length) {
      // Word is finished typing, pause at the end
      isDeleting = true;
      typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      // Word is deleted, move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  // Start the loop
  type();
});