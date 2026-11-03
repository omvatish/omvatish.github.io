// Om Vatish — omvatish.ca (v2)
// Nav state, mobile menu, scroll reveal, active section highlighting.
// Everything is null-guarded so the same file works on every page.

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');

  // Nav background on scroll
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navClose = document.getElementById('nav-close');
  const closeMenu = () => {
    if (navLinks) navLinks.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
  };
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : navLinks.classList.add('open');
      navToggle.classList.toggle('active');
    });
  }
  if (navClose) navClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
    // Above-the-fold hero content shows immediately
    document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right')
      .forEach(el => el.classList.add('visible'));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Active nav link for the section in view (same-page anchors only)
  const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
  }
});
