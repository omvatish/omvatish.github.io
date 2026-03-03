document.addEventListener('DOMContentLoaded', () => {

  /* ─── CURSOR ─────────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });
    const animateCursor = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  /* ─── NAV SCROLL ─────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ─── MOBILE NAV ─────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navClose = document.getElementById('nav-close');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    navLinks.classList.add('open');
    navToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  navToggle?.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  navClose?.addEventListener('click', closeMenu);
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ─── SCROLL REVEAL ──────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.07}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ─── GALLERY SCALE REVEAL ───────────────────────────── */
  const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scaleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-scale').forEach(el => scaleObserver.observe(el));

  /* ─── HERO REVEAL ON LOAD ────────────────────────────── */
  // Make hero visible immediately — don't rely on scroll observer for above-fold content
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => {
        el.style.transitionDelay = '0s';
        el.classList.add('visible');
      }, i * 130);
    });
  }, 100);

  /* ─── HERO NAME GLITCH ───────────────────────────────── */
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const glitchChars = '!@#$%^&*<>/\\[]{}|?~';
    heroName.addEventListener('mouseenter', () => {
      heroName.querySelectorAll('.accent-stroke').forEach(el => {
        let count = 0;
        const orig = el.textContent;
        const iv = setInterval(() => {
          if (count < 8) {
            el.textContent = orig.split('').map(c =>
              Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c
            ).join('');
            count++;
          } else {
            el.textContent = orig;
            clearInterval(iv);
          }
        }, 60);
      });
    });
  }

  /* ─── PARALLAX HERO GLOWS ────────────────────────────── */
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (glow1) glow1.style.transform = `translateY(${s * 0.3}px)`;
    if (glow2) glow2.style.transform = `translateY(${-s * 0.2}px)`;
  });

  /* ─── ACTIVE NAV HIGHLIGHTING ────────────────────────── */
  const navItems = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--text)';
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

});
