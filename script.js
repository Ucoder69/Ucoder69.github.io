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
    // 1. Setup the Options
    const observerOptions = {
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    // 2. Define the Observer Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add("active");
                
                // CRITICAL: Stop watching this element to save CPU/Memory
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 3. Tell the observer WHICH elements to watch
    const revealElements = document.querySelectorAll(".reveal");
    
    revealElements.forEach((el) => {
        observer.observe(el);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const typeTarget = document.getElementById("typewriter");
  if (!typeTarget) return;

  const words = JSON.parse(typeTarget.getAttribute("data-words"));
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 250;
  let isPaused = true; // New state to track visibility

  function type() {
    // If the element is off-screen, stop the loop
    if (isPaused) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typeTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typeTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 250;
    }

    setTimeout(type, typeSpeed);
  }
    document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPaused = true;
    } else {
      isPaused = false;
      type();
    }
  });
  // --- INTERSECTION OBSERVER LOGIC ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element came into view, unpause and start typing
        isPaused = false;
        type();
      } else {
        // Element went off-screen, pause the loop
        isPaused = true;
      }
    });
  }, { threshold: 0.1 }); // Triggers if even 10% is visible

  observer.observe(typeTarget);
});

window.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector("#loader");
    const body = document.body;

    // This timer starts ONLY after the entire page (images/fonts) is loaded
    setTimeout(() => {
        // 1. Start the fade-out animation for the loader
        loader.classList.add("loader-hidden");

        // 2. Unlock the scrollbar
        body.classList.add("loaded");

        // 3. Clean up the DOM after the fade-out is done
        loader.addEventListener("transitionend", () => {
            loader.remove();
        });
    }, 200); // This is your 200ms forced wait
});

document.addEventListener("DOMContentLoaded", () => {
  const scrollbar = document.getElementById("custom-scrollbar");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  
  let scrollTimeout;
  let ticking = false; // Acts as a lock to prevent over-firing

  const updateScrollbar = () => {
    // ==========================================
    // PHASE 1: READ (Gather all measurements first)
    // ==========================================
    const viewportHeight = window.innerHeight;
    const totalContentHeight = document.documentElement.scrollHeight;
    const scrollAmount = window.scrollY;
    
    const headerHeight = header ? header.offsetHeight : 0;
    
    const rect = footer ? footer.getBoundingClientRect() : null;
    const footerVisibleHeight = (rect && rect.top < viewportHeight) 
        ? viewportHeight - rect.top 
        : 0;

    // ==========================================
    // PHASE 2: MATH (Calculate everything offline)
    // ==========================================
    const availableTrackHeight = viewportHeight - headerHeight - footerVisibleHeight;
    const scrollRatio = viewportHeight / totalContentHeight;
    
    // Calculate Handle Height
    const handleHeight = Math.max(availableTrackHeight * scrollRatio, 40);
    
    // Calculate Scroll Percentage (with safeguard against division by zero)
    const maxScrollableAmount = totalContentHeight - viewportHeight;
    const amountScrolledPercent = maxScrollableAmount > 0 
        ? Math.min(scrollAmount / maxScrollableAmount, 1) 
        : 0;

    // Calculate final position
    const travelDistance = availableTrackHeight - handleHeight;
    const finalPosition = amountScrolledPercent * travelDistance;

    // ==========================================
    // PHASE 3: WRITE (Apply all CSS changes at once)
    // ==========================================
    scrollbar.style.top = `${headerHeight}px`;
    scrollbar.style.height = `${handleHeight}px`;
    scrollbar.style.transform = `translate3d(0, ${finalPosition}px, 0)`; // GPU accelerated

    // Visibility Logic
    scrollbar.classList.add("visible");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollbar.classList.remove("visible");
    }, 1200);

    // Unlock the frame for the next scroll tick
    ticking = false; 
  };

  // The Performance Engine
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollbar);
      ticking = true;
    }
  };

  // Listeners
  // { passive: true } tells the browser this script won't block the user's scrolling
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  
  // Run on start
  requestTick();
  
  // Run once more slightly later to catch any images/fonts that just finished loading
  setTimeout(requestTick, 500);
});

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video");
    
    // GUARD CLAUSE: If the video element isn't on this specific page, exit the function
    if (!video) return;

    const isDataSaver = navigator.connection && navigator.connection.saveData;
    const isMobile = window.innerWidth < 768;

    if (!isMobile && !isDataSaver) {
        const videoSrc = "./video/web-bg-video.mp4";
        
        // Inject the source
        video.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
        video.load(); 
    } else {
        console.log("Mobile/Data Saver: Keeping poster image.");
    }
});