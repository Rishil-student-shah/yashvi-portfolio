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

/* ─────────── Work Tabs ─────────── */
const tabs = document.querySelectorAll('.work-tab');
const panels = document.querySelectorAll('.work-panel');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    // Deactivate all
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('active'));

    // Activate clicked tab
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    panels[index].classList.add('active');

    // Re-trigger animations in the newly activated panel
    const newEls = panels[index].querySelectorAll('.fade-up, .fade-left, .fade-right');
    newEls.forEach(el => {
      el.classList.remove('visible');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('visible');
        });
      });
    });

    // Scroll the active panel into view so content isn't cut off
    requestAnimationFrame(() => {
      const panelTop = panels[index].getBoundingClientRect().top + window.scrollY;
      const offset   = navbar.offsetHeight + 24; // nav height + breathing room
      window.scrollTo({ top: panelTop - offset, behavior: 'smooth' });
    });
  });
});

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

