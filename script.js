/* =========================================================
   Ilya Ternovskiy · Resume — script.js
   Effects:
     · Animated grid background (canvas + parallax to mouse)
     · Custom cursor with hover state
     · Magnetic hover on buttons/socials
     · Scroll-reveal (IntersectionObserver)
     · Typed role headline
     · Card tilt on mouse move (3D)
     · Floating glow parallax
     · Form validation + status feedback
   ========================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- 1. Animated grid background (canvas) ---------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = 1;
    let mouseX = 0, mouseY = 0;
    let targetOffsetX = 0, targetOffsetY = 0;
    let offsetX = 0, offsetY = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetOffsetX = (mouseX / width - 0.5) * 30;
      targetOffsetY = (mouseY / height - 0.5) * 30;
    });

    const SPACING = 60;
    const DOT_RADIUS = 1.2;

    function draw(time) {
      // smooth parallax
      offsetX += (targetOffsetX - offsetX) * 0.05;
      offsetY += (targetOffsetY - offsetY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // grid dots with subtle wave
      const wave = Math.sin(time * 0.0006) * 8;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      for (let x = -SPACING; x < width + SPACING; x += SPACING) {
        for (let y = -SPACING; y < height + SPACING; y += SPACING) {
          const px = x + offsetX + Math.sin((y + time * 0.0003) * 0.01) * wave * 0.3;
          const py = y + offsetY + Math.cos((x + time * 0.0003) * 0.01) * wave * 0.3;

          // distance to mouse for emphasis
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const emphasis = Math.max(0, 1 - dist / 250);

          const r = DOT_RADIUS + emphasis * 1.8;
          const alpha = 0.18 + emphasis * 0.5;

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${emphasis > 0.1 ? '124, 92, 255' : '255, 255, 255'}, ${alpha})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    if (!isTouch) requestAnimationFrame(draw);
  }

  /* ---------- 2. Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && !isTouch) {
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function animateCursor() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // hover state for interactive elements
    const hoverables = document.querySelectorAll('a, button, [data-magnetic], input, textarea');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ---------- 3. Magnetic hover effect ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach((el) => {
      const strength = 0.35;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 4. Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 5. Typed role headline ---------- */
  const typedEl = document.querySelector('.typed');
  if (typedEl) {
    const phrases = JSON.parse(typedEl.dataset.typed || '[]');
    if (phrases.length && !prefersReducedMotion) {
      let pi = 0, ci = 0, deleting = false;

      function type() {
        const current = phrases[pi];
        if (deleting) {
          typedEl.textContent = current.substring(0, ci - 1);
          ci--;
        } else {
          typedEl.textContent = current.substring(0, ci + 1);
          ci++;
        }

        let delay = deleting ? 35 : 70;

        if (!deleting && ci === current.length) {
          delay = 1800;
          deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          delay = 400;
        }

        setTimeout(type, delay);
      }
      setTimeout(type, 600);
    } else if (phrases.length) {
      typedEl.textContent = phrases[0];
    }
  }

  /* ---------- 6. Card 3D tilt (subtle) ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const tiltEls = document.querySelectorAll('.card.glass, .work-card');
    tiltEls.forEach((el) => {
      el.style.transition = 'transform 0.4s var(--ease-out), border-color 0.4s var(--ease-out)';
      el.style.transformStyle = 'preserve-3d';

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 7. Floating glow parallax on scroll ---------- */
  if (!prefersReducedMotion) {
    const glows = document.querySelectorAll('.bg-glow');
    let ticking = false;

    function updateGlows() {
      const scrollY = window.scrollY;
      glows.forEach((g, i) => {
        const speed = (i + 1) * 0.15;
        g.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateGlows);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- 8. Form: real submit to Formspree ---------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (form && statusEl) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
    const originalLabel = submitLabel ? submitLabel.textContent : '';

    function setStatus(text, type) {
      statusEl.classList.remove('is-success', 'is-error');
      if (type) statusEl.classList.add(type);
      statusEl.textContent = text;
    }

    function setLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.setAttribute('aria-busy', String(isLoading));
      if (submitLabel) {
        submitLabel.textContent = isLoading ? 'Отправляю…' : originalLabel;
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();
      const honeypot = form.querySelector('[name="_gotcha"]')?.value || '';

      // Honeypot: бот заполнил скрытое поле — тихо "успешно" и выходим
      if (honeypot) {
        setStatus('✓ Отправлено!', 'is-success');
        form.reset();
        return;
      }

      // Client-side validation
      if (!name || !email || !message) {
        setStatus('Заполни все поля, пожалуйста.', 'is-error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('Email выглядит некорректно.', 'is-error');
        return;
      }

      // Endpoint must be set in HTML (search for FORMSPREE_ENDPOINT)
      const endpoint = (form.action || '').replace(/\/+$/, '');
      if (!endpoint || endpoint.includes('FORMSPREE_ENDPOINT')) {
        setStatus('Форма ещё не подключена (см. README.md).', 'is-error');
        console.warn('[contact-form] Replace FORMSPREE_ENDPOINT in index.html with your Formspree form ID. See README.md.');
        return;
      }

      setStatus('');
      setLoading(true);

      try {
        const data = new FormData(form);
        const res  = await fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          setStatus('✓ Отправлено! Я свяжусь с тобой в ближайшее время.', 'is-success');
          form.reset();
        } else {
          // Formspree returns JSON { errors: [...] } on validation failure
          let msg = 'Не удалось отправить. Попробуй позже.';
          try {
            const body = await res.json();
            if (body && Array.isArray(body.errors) && body.errors[0]?.message) {
              msg = body.errors[0].message;
            }
          } catch (_) { /* ignore */ }
          setStatus(msg, 'is-error');
        }
      } catch (err) {
        setStatus('Нет связи с сервером. Проверь интернет и попробуй ещё раз.', 'is-error');
        console.error('[contact-form]', err);
      } finally {
        setLoading(false);
      }
    });
  }

  /* ---------- 9. Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
