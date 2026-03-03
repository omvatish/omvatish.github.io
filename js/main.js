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
  /* ─── GALLERY LIGHTBOX ───────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    if (!img && !video) return;

    // if it's a video, open it in lightbox too
    if (video) {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.92);
        backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
      `;
      const bigVideo = document.createElement('video');
      bigVideo.src = video.querySelector('source').src;
      bigVideo.autoplay = true;
      bigVideo.loop = true;
      bigVideo.muted = true;
      bigVideo.playsInline = true;
      bigVideo.controls = true;
      bigVideo.style.cssText = `
        max-width: 90vw;
        max-height: 85vh;
        border-radius: 12px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        transform: scale(0.95);
        transition: transform 0.3s ease;
      `;
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        position: fixed; top: 1.5rem; right: 1.5rem;
        width: 44px; height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white; font-size: 1.1rem;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
        z-index: 10000;
      `;
      closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(0,229,255,0.2)';
      closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(255,255,255,0.1)';
      const close = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      };
      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
      overlay.appendChild(bigVideo);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        bigVideo.style.transform = 'scale(1)';
      });
      return;
    }

    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      padding: 2rem;
    `;

    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.alt = img.alt;
    bigImg.style.cssText = `
      max-width: 90vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      transform: scale(0.95);
      transition: transform 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: fixed; top: 1.5rem; right: 1.5rem;
      width: 44px; height: 44px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
      z-index: 10000;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(0,229,255,0.2)';
    closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(255,255,255,0.1)';

    const close = () => {
      overlay.style.opacity = '0';
      bigImg.style.transform = 'scale(0.95)';
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    }, { once: true });

    overlay.appendChild(bigImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      bigImg.style.transform = 'scale(1)';
    });
  });
});

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
