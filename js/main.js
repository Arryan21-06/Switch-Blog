/**
 * main.js — Scroll reveal, parallax, sticky nav, copy-code, scroll-spy
 * Daybreak: Standup Zero for Switch
 * Plain vanilla JS — no framework, no build step.
 */

"use strict";

/* ══════════════════════════════════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════════════════════════════ */

/** Check if the user prefers reduced motion */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/** Clamp a number between min and max */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Debounce (trailing) */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ══════════════════════════════════════════════════════════════════════ */
function initScrollProgressBar() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) {
      bar.style.width = "0%";
      return;
    }
    const pct = clamp((window.scrollY / total) * 100, 0, 100);
    bar.style.width = `${pct}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/* ══════════════════════════════════════════════════════════════════════════
   STICKY NAV — adds .is-scrolled class after 60px
   ══════════════════════════════════════════════════════════════════════ */
function initStickyNav() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const SCROLL_THRESHOLD = 60;

  function update() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update(); // run once on load
}

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE NAV TOGGLE
   ══════════════════════════════════════════════════════════════════════ */
function initMobileNav() {
  const toggle = document.querySelector(".site-nav__toggle");
  const links = document.querySelector(".site-nav__links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close on link click
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL-SPY — highlights active nav link based on current section
   ══════════════════════════════════════════════════════════════════════ */
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".site-nav__links a[href^='#']");
  if (!navLinks.length) return;

  const sectionIds = Array.from(navLinks).map((a) =>
    a.getAttribute("href").slice(1)
  );

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const NAV_HEIGHT =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
    ) || 56;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    {
      rootMargin: `-${NAV_HEIGHT}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL — fades + slides elements in as they enter the viewport
   ══════════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    // Skip animation — just show immediately
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   PARALLAX — light scroll-driven translate on images and stagger headings
   Uses requestAnimationFrame for performance.
   ══════════════════════════════════════════════════════════════════════ */
function initParallax() {
  if (prefersReducedMotion) return;

  // Collect parallax targets
  const tiltFrames = document.querySelectorAll(".tilt-frame[data-parallax-speed]");
  const staggerHeadings = document.querySelectorAll(".stagger-heading[data-parallax]");

  if (!tiltFrames.length && !staggerHeadings.length) return;

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;

    // Images
    tiltFrames.forEach((el) => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Only apply when in viewport neighbourhood
      if (rect.bottom < -viewH || rect.top > viewH * 2) return;

      const offset = clamp((scrollY - el.offsetTop + viewH * 0.5) * speed, -60, 60);
      el.style.setProperty("--parallax-y", `${offset}px`);
      // Apply as additional transform (preserve tilt)
      el.style.transform = `rotate(var(--tilt)) translateY(${offset}px)`;
    });

    // Stagger headings
    staggerHeadings.forEach((el) => {
      const line1 = el.querySelector(".stagger-line-1");
      const line2 = el.querySelector(".stagger-line-2");
      if (!line1 || !line2) return;

      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < -viewH || rect.top > viewH * 2) return;

      const base = (rect.top - viewH * 0.5);
      const offset1 = clamp(base * 0.08, -40, 40);
      const offset2 = clamp(base * 0.14, -60, 60);

      line1.style.transform = `translateY(${offset1}px)`;
      line2.style.transform = `translateY(${offset2}px)`;
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  applyParallax(); // initial call
}

/* ══════════════════════════════════════════════════════════════════════════
   COPY-CODE BLOCKS — copies <pre><code> content to clipboard
   ══════════════════════════════════════════════════════════════════════ */
function initCopyCode() {
  document.querySelectorAll(".code-block__copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const block = btn.closest(".code-block");
      if (!block) return;

      const code = block.querySelector("code");
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.innerText.trim());
        btn.textContent = "Copied ✓";
        btn.classList.add("is-copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("is-copied");
        }, 2000);
      } catch {
        btn.textContent = "Failed";
        setTimeout(() => (btn.textContent = "Copy"), 2000);
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SMOOTH HASH SCROLL — accounts for sticky nav height
   ══════════════════════════════════════════════════════════════════════ */
function initSmoothHashScroll() {
  document.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const targetId = a.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const NAV_HEIGHT =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height"
          )
        ) || 56;

      const top =
        target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;

      window.scrollTo({ top, behavior: "smooth" });

      // Update URL without jumping
      history.pushState(null, "", `#${targetId}`);
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgressBar();
  initStickyNav();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initParallax();
  initCopyCode();
  initSmoothHashScroll();

  console.log(
    "%c🌅 Daybreak — Standup Zero for Switch",
    "color: #f2a65a; font-weight: bold; font-size: 14px;"
  );
});
