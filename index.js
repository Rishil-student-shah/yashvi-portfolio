/* ============================================================
   YASHVI SHAH PORTFOLIO — JavaScript
   Features:
   - Navbar scroll effect
   - Mobile hamburger menu
   - Smooth scroll
   - Intersection Observer (scroll animations)
   - Work tabs system
   ============================================================ */

'use strict';

/* ─────────── Navbar Scroll Effect ─────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─────────── Hamburger / Mobile Menu ─────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when any link is tapped
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ─────────── Scroll Animation — Intersection Observer ─────────── */
const animatedEls = document.querySelectorAll(
  '.fade-up, .fade-left, .fade-right'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px',
});

animatedEls.forEach(el => observer.observe(el));


/* ─────────── Smooth Scroll for all anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ─────────── Keyboard Accessibility for Tabs ─────────── */
tabs.forEach((tab, i) => {
  tab.addEventListener('keydown', e => {
    let newIndex = i;
    if (e.key === 'ArrowRight') newIndex = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') newIndex = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') newIndex = 0;
    if (e.key === 'End') newIndex = tabs.length - 1;
    if (newIndex !== i) {
      e.preventDefault();
      tabs[newIndex].focus();
      tabs[newIndex].click();
    }
  });
});

/* ─────────── Active nav highlight on scroll ─────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--rose)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─────────── Console Easter Egg ─────────── */
console.log(
  '%c✦ Yashvi Shah Portfolio %c\nDesigned & built with ♥',
  'color:#810C0C; font-size:18px; font-weight:bold; font-family: serif;',
  'color:#D4537E; font-size:12px;'
);

/* ─────────── Contact Form — Async Formspree Submission ─────────── */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit-btn');
const submitText  = submitBtn && submitBtn.querySelector('.form-submit-text');
const submitLoader = submitBtn && submitBtn.querySelector('.form-submit-loader');
const successMsg  = document.getElementById('form-success-msg');
const errorMsg    = document.getElementById('form-error-msg');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic HTML5 validation
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // UI: loading state
    submitBtn.disabled = true;
    submitText.hidden  = true;
    submitLoader.hidden = false;
    successMsg.hidden  = true;
    errorMsg.hidden    = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Success
        contactForm.reset();
        successMsg.hidden = false;
      } else {
        const data = await response.json().catch(() => ({}));
        if (data.errors) {
          errorMsg.textContent = '⚠️ ' + data.errors.map(err => err.message).join(', ');
        }
        errorMsg.hidden = false;
      }
    } catch (_err) {
      errorMsg.hidden = false;
    } finally {
      // Restore button
      submitBtn.disabled  = false;
      submitText.hidden   = false;
      submitLoader.hidden = true;
    }
  });
}

/* ─────────── Instagram Lightbox Modal with Slider ─────────── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox && lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox && lightbox.querySelector('.lightbox-next');
const igPosts = Array.from(document.querySelectorAll('.ig-post'));

let currentPostIndex = 0;

if (lightbox && igPosts.length > 0) {
  // Helper to open lightbox and show specific post
  const showPost = (index) => {
    currentPostIndex = (index + igPosts.length) % igPosts.length;
    const postEl = igPosts[currentPostIndex];
    const imgEl = postEl.querySelector('img');
    
    if (imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
      lightboxCaption.textContent = imgEl.alt || `Post ${currentPostIndex + 1}`;
      
      // Update accessibility attributes
      lightbox.setAttribute('aria-hidden', 'false');
      lightboxClose.focus();
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
  };

  // Attach click listener to each post
  igPosts.forEach((post, index) => {
    post.addEventListener('click', () => {
      showPost(index);
    });
  });

  // Event handlers
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showPost(currentPostIndex - 1));
  lightboxNext.addEventListener('click', () => showPost(currentPostIndex + 1));

  // Close on clicking overlay background
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation (Esc to close, Left/Right arrows to change side)
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPost(currentPostIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showPost(currentPostIndex + 1);
      }
    }
  });
}

/* ─────────── Interactive Phone Mockup Video Player ─────────── */
const phoneVideo = document.getElementById('phoneVideo');
const phoneVideoDesc = document.getElementById('phoneVideoDesc');
const phoneLikes = document.getElementById('phoneLikes');
const phoneViews = document.getElementById('phoneViews');
const phoneMuteIndicator = document.getElementById('phoneMuteIndicator');
const audioDisc = document.querySelector('.phone-audio-disc');
const videoCards = document.querySelectorAll('.work-card.video-card');
const phoneScreen = document.querySelector('.phone-screen');

if (phoneVideo && videoCards.length > 0) {
  // Initialize video as muted so autoplay is allowed by the browser
  phoneVideo.muted = true;

  // Sync rotating audio disc animation with video play state
  phoneVideo.addEventListener('play', () => {
    if (audioDisc) audioDisc.classList.add('playing');
  });
  
  phoneVideo.addEventListener('pause', () => {
    if (audioDisc) audioDisc.classList.remove('playing');
  });

  // Helper to flash play, pause, or volume indicators on the screen
  const flashIndicator = (icon) => {
    if (phoneMuteIndicator) {
      phoneMuteIndicator.textContent = icon;
      phoneMuteIndicator.style.display = 'none';
      void phoneMuteIndicator.offsetWidth; // trigger reflow
      phoneMuteIndicator.style.display = 'flex';
      
      // Hide after animation finishes
      setTimeout(() => {
        phoneMuteIndicator.style.display = 'none';
      }, 700);
    }
  };

  // Click on the phone screen to toggle Mute/Unmute (sound on/off)
  if (phoneScreen) {
    phoneScreen.addEventListener('click', (e) => {
      // Ignore clicks on buttons/interactive elements on the right or bottom
      if (e.target.closest('.phone-reels-right') || e.target.closest('.phone-follow-btn')) {
        return;
      }

      phoneVideo.muted = !phoneVideo.muted;
      flashIndicator(phoneVideo.muted ? '🔇' : '🔊');
    });
  }

  videoCards.forEach(card => {
    const previewVideo = card.querySelector('video');

    // 1. Silent Preview Hover Autoplay
    card.addEventListener('mouseenter', () => {
      if (previewVideo) {
        previewVideo.play().catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      if (previewVideo) {
        previewVideo.pause();
        previewVideo.currentTime = 0;
      }
    });

    // 2. Click to load inside phone mockup
    card.addEventListener('click', () => {
      // Remove active class from all cards
      videoCards.forEach(c => c.classList.remove('active'));
      // Add active class to clicked card
      card.classList.add('active');

      const videoSrc = card.getAttribute('data-video');
      const likes = card.getAttribute('data-likes');
      const views = card.getAttribute('data-views');
      const desc = card.getAttribute('data-desc');

      if (videoSrc) {
        // Change phone video source and unmute it since the user interacted by clicking
        phoneVideo.src = videoSrc;
        phoneVideo.muted = false;
        phoneVideo.load();
        
        // Play the video with sound!
        phoneVideo.play().then(() => {
          flashIndicator('🔊');
        }).catch(() => {
          // If browser still blocks, fallback to muted autoplay
          phoneVideo.muted = true;
          phoneVideo.play().catch(() => {});
        });

        // Update stats and description
        if (phoneLikes) phoneLikes.textContent = likes || '0';
        if (phoneViews) phoneViews.textContent = views || '0';
        if (phoneVideoDesc) phoneVideoDesc.textContent = desc || '';
      }
    });
  });
}



