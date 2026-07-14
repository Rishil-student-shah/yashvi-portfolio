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
  let currentVideoCard = document.querySelector('.work-card.video-card.active') || videoCards[0];

  const setIndicator = (icon) => {
    if (!phoneMuteIndicator) return;
    phoneMuteIndicator.textContent = icon;
    phoneMuteIndicator.style.display = 'none';
    void phoneMuteIndicator.offsetWidth;
    phoneMuteIndicator.style.display = 'flex';

    window.clearTimeout(setIndicator.hideTimer);
    setIndicator.hideTimer = window.setTimeout(() => {
      phoneMuteIndicator.style.display = 'none';
    }, 700);
  };

  const playReel = async () => {
    try {
      await phoneVideo.play();
      setIndicator('▶');
      return true;
    } catch (_error) {
      return false;
    }
  };

  const pauseReel = () => {
    phoneVideo.pause();
    setIndicator('⏸');
  };

  const loadReelFromCard = (card) => {
    if (!card) return;

    videoCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    currentVideoCard = card;

    const videoSrc = card.getAttribute('data-video');
    const likes = card.getAttribute('data-likes');
    const views = card.getAttribute('data-views');
    const desc = card.getAttribute('data-desc');

    if (videoSrc) {
      phoneVideo.pause();
      phoneVideo.src = videoSrc;
      phoneVideo.load();
      phoneVideo.addEventListener('loadedmetadata', () => {
        phoneVideo.currentTime = 0;
        phoneVideo.pause();
      }, { once: true });

      if (phoneLikes) phoneLikes.textContent = likes || '0';
      if (phoneViews) phoneViews.textContent = views || '0';
      if (phoneVideoDesc) phoneVideoDesc.textContent = desc || '';
    }
  };

  // Start in paused mode so the first reel shows a paused frame.
  phoneVideo.muted = false;

  phoneVideo.addEventListener('loadeddata', () => {
    phoneVideo.pause();
  });

  // Sync rotating audio disc animation with video play state
  phoneVideo.addEventListener('play', () => {
    if (audioDisc) audioDisc.classList.add('playing');
  });
  
  phoneVideo.addEventListener('pause', () => {
    if (audioDisc) audioDisc.classList.remove('playing');
  });
  phoneVideo.pause();

  // Click on the phone screen toggles play/pause only. Audio is controlled separately.
  if (phoneScreen) {
    phoneScreen.addEventListener('click', (e) => {
      // Ignore clicks on interactive elements that should not toggle playback.
      if (e.target.closest('.phone-reels-right') || e.target.closest('.phone-follow-btn')) {
        return;
      }

      if (phoneVideo.paused) {
        playReel({ forceSound: false });
      } else {
        pauseReel();
      }
    });
  }

  // Interactivity for phone mockup action buttons (Like & Share)
  const phoneLikeBtn = document.querySelector('.phone-reels-right [aria-label="Like post"]');
  const phoneShareBtn = document.querySelector('.phone-reels-right [aria-label="Share"]');

  if (phoneLikeBtn) {
    phoneLikeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from bubbling up to phoneScreen
      const heartSvg = phoneLikeBtn.querySelector('svg');
      const likesText = document.getElementById('phoneLikes');
      if (!likesText) return;

      const isCurrentlyLiked = phoneLikeBtn.classList.toggle('liked');
      if (isCurrentlyLiked) {
        heartSvg.setAttribute('fill', '#ff3040');
        phoneLikeBtn.style.transform = 'scale(1.25)';
        setTimeout(() => { phoneLikeBtn.style.transform = ''; }, 150);
        
        if (likesText.textContent === '19.5K') likesText.textContent = '19.6K';
        else if (likesText.textContent === '8.4K') likesText.textContent = '8.5K';
        else if (likesText.textContent === '12.1K') likesText.textContent = '12.2K';
      } else {
        heartSvg.setAttribute('fill', '#ffffff');
        phoneLikeBtn.style.transform = 'scale(0.85)';
        setTimeout(() => { phoneLikeBtn.style.transform = ''; }, 150);

        if (likesText.textContent === '19.6K') likesText.textContent = '19.5K';
        else if (likesText.textContent === '8.5K') likesText.textContent = '8.4K';
        else if (likesText.textContent === '12.2K') likesText.textContent = '12.1K';
      }
    });
  }

  if (phoneShareBtn) {
    phoneShareBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from bubbling up to phoneScreen
      
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIndicator('🔗 Link Copied!');
      }).catch(() => {
        setIndicator('📋 Copied!');
      });
      
      phoneShareBtn.style.transform = 'scale(1.2)';
      setTimeout(() => { phoneShareBtn.style.transform = ''; }, 150);
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
      loadReelFromCard(card);
    });
  });

  if (currentVideoCard) {
    loadReelFromCard(currentVideoCard);
  }
}



