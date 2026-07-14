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

/* ─────────── Universal Media Lightbox ─────────── */

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const lightboxVideo = document.getElementById("lightbox-video");

const lightboxCaption = document.getElementById("lightbox-caption");

const lightboxClose = document.querySelector(".lightbox-close");

const lightboxPrev = document.querySelector(".lightbox-prev");

const lightboxNext = document.querySelector(".lightbox-next");

let lightboxGroup = [];
let currentLightboxIndex = 0;

function showLightboxItem(index){

    if(!lightboxGroup.length) return;

    currentLightboxIndex =
        (index + lightboxGroup.length) %
        lightboxGroup.length;

    const item = lightboxGroup[currentLightboxIndex];

    lightboxCaption.textContent = item.alt || "";

    if(item.type === "video"){

        lightboxImg.style.display="none";

        lightboxVideo.style.display="block";

        lightboxVideo.pause();

        lightboxVideo.src=item.src;

        lightboxVideo.load();

        lightboxVideo.play().catch(()=>{});

    }else{

        lightboxVideo.pause();

        lightboxVideo.removeAttribute("src");

        lightboxVideo.load();

        lightboxVideo.style.display="none";

        lightboxImg.style.display="block";

        lightboxImg.src=item.src;

        lightboxImg.alt=item.alt;

    }

    lightboxPrev.style.display =
        lightboxGroup.length>1 ? "flex":"none";

    lightboxNext.style.display =
        lightboxGroup.length>1 ? "flex":"none";

    lightbox.setAttribute("aria-hidden","false");

}

function openGallery(group,startIndex){

    lightboxGroup=group;

    showLightboxItem(startIndex);

}

function closeLightbox(){

    lightbox.setAttribute("aria-hidden","true");

    lightboxVideo.pause();

    lightboxVideo.removeAttribute("src");

    lightboxVideo.load();

}

lightboxClose.addEventListener("click",closeLightbox);

lightboxPrev.addEventListener("click",()=>{

    showLightboxItem(currentLightboxIndex-1);

});

lightboxNext.addEventListener("click",()=>{

    showLightboxItem(currentLightboxIndex+1);

});

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        closeLightbox();

    }

});

document.addEventListener("keydown",(e)=>{

    if(lightbox.getAttribute("aria-hidden")==="true") return;

    if(e.key==="Escape"){

        closeLightbox();

    }

    if(e.key==="ArrowLeft"){

        showLightboxItem(currentLightboxIndex-1);

    }

    if(e.key==="ArrowRight"){

        showLightboxItem(currentLightboxIndex+1);

    }

});


/* ---------- Instagram ---------- */

const igPosts=[

...document.querySelectorAll(".ig-post")

];

const instagramGallery=igPosts.map(post=>{

    const img=post.querySelector("img");

    return{

        type:"image",

        src:img.src,

        alt:img.alt

    };

});

igPosts.forEach((post,index)=>{

    post.addEventListener("click",()=>{

        openGallery(instagramGallery,index);

    });

});


/* ---------- BTS ---------- */

const btsTiles=[

...document.querySelectorAll(".skill-media-video")

];

const btsGallery=[

{
type:"video",
src:"images/BTS 1.mp4",
alt:"Behind the scenes 1"
},
{
type:"video",
src:"images/BTS 2.mp4",
alt:"Behind the scenes 2"
},
{
type:"video",
src:"images/BTS 3.mp4",
alt:"Behind the scenes 3"
}

];

btsTiles.forEach((tile,index)=>{

    tile.addEventListener("click",()=>{

        openGallery(btsGallery,index);

    });

});


/* ---------- SMM ---------- */

const smmImages=[

...document.querySelectorAll(".skill-media-post img")

];

const smmGallery=smmImages.map(img=>({

type:"image",

src:img.src,

alt:img.alt

}));

smmImages.forEach((img,index)=>{

    img.addEventListener("click",()=>{

        openGallery(smmGallery,index);

    });

});

/* ─────────── Interactive Phone Mockup Video Player ─────────── */
const phoneVideo = document.getElementById('phoneVideo');
const phoneVideoDesc = document.getElementById('phoneVideoDesc');
const phoneLikes = document.getElementById('phoneLikes');
const phoneViews = document.getElementById('phoneViews');
const phoneMuteIndicator = document.getElementById('phoneMuteIndicator');
const phonePauseOverlay = document.getElementById('phonePauseOverlay');
const audioDisc = document.querySelector('.phone-audio-disc');
const videoCards = document.querySelectorAll('.work-card.video-card');
const phoneScreen = document.querySelector('.phone-screen');

const generateThumbnail = (videoSrc, imgEl) => {
  if (!videoSrc || !imgEl) return;

  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imgEl.src = canvas.toDataURL('image/jpeg', 0.9);
  };

  video.addEventListener('loadeddata', () => {
    try {
      video.currentTime = 0.2;
    } catch (_error) {
      capture();
    }
  }, { once: true });

  video.addEventListener('seeked', () => {
    capture();
    video.removeAttribute('src');
    video.load();
  }, { once: true });
};

document.querySelectorAll('[data-thumb-src]').forEach((imgEl) => {
  const thumbSrc = imgEl.dataset.thumbSrc;

  if (thumbSrc) {
    generateThumbnail(thumbSrc, imgEl);
  }
});

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

  const setPausedOverlay = (isVisible) => {
    if (!phonePauseOverlay) return;
    phonePauseOverlay.classList.toggle('visible', isVisible);
    phonePauseOverlay.setAttribute('aria-hidden', String(!isVisible));
  };

  const playReel = async () => {
    try {
      await phoneVideo.play();
      setPausedOverlay(false);
      setIndicator('▶');
      return true;
    } catch (_error) {
      return false;
    }
  };

  const pauseReel = () => {
    phoneVideo.pause();
    setPausedOverlay(true);
    setIndicator('▶');
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
        setPausedOverlay(true);
      }, { once: true });

      if (phoneLikes) phoneLikes.textContent = likes || '0';
      if (phoneViews) phoneViews.textContent = views || '0';
      if (phoneVideoDesc) phoneVideoDesc.textContent = desc || '';
    }
  };

  // Start in paused mode so the first reel shows a paused frame.
  phoneVideo.muted = false;
  setPausedOverlay(true);

  if (phonePauseOverlay) {
    phonePauseOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (phoneVideo.paused) {
        playReel();
      } else {
        pauseReel();
      }
    });
  }

  phoneVideo.addEventListener('loadeddata', () => {
    phoneVideo.pause();
    setPausedOverlay(true);
  });

  // Sync rotating audio disc animation with video play state
  phoneVideo.addEventListener('play', () => {
    if (audioDisc) audioDisc.classList.add('playing');
    setPausedOverlay(false);
  });
  
  phoneVideo.addEventListener('pause', () => {
    if (audioDisc) audioDisc.classList.remove('playing');
    setPausedOverlay(true);
  });
  phoneVideo.pause();
  setPausedOverlay(true);

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
    // 2. Click to load inside phone mockup
    card.addEventListener('click', () => {
      loadReelFromCard(card);
    });
  });

  if (currentVideoCard) {
    loadReelFromCard(currentVideoCard);
  }
}



