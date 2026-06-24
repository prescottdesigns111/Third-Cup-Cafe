/* ── Nav scroll state ────────────────────────────────────── */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── IntersectionObserver scroll reveals ─────────────────── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Hero 3-D mouse tilt ─────────────────────────────────── */
(function () {
  const hero  = document.querySelector('.hero');
  const scene = document.querySelector('.hero-scene');
  if (!hero || !scene) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 600) return;

  let cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, raf = null;
  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    cur.x = lerp(cur.x, tgt.x, .07);
    cur.y = lerp(cur.y, tgt.y, .07);
    scene.style.transform = `rotateX(${cur.y}deg) rotateY(${cur.x}deg)`;
    raf = requestAnimationFrame(tick);
  };

  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    tgt.x =  ((e.clientX - left) / width  - .5) * 8;
    tgt.y = -((e.clientY - top)  / height - .5) * 6;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  hero.addEventListener('mouseleave', () => { tgt = { x: 0, y: 0 }; });
})();

/* ── Feature image 3-D scroll parallax tilt ─────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wraps = document.querySelectorAll('.feat-img-wrap');
  if (!wraps.length) return;

  const update = () => {
    wraps.forEach(wrap => {
      const { top, height } = wrap.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - top - height / 2) / (window.innerHeight / 2);
      const clamp    = Math.max(-1, Math.min(1, progress));
      wrap.querySelector('img').style.transform =
        `scale(1.03) translateY(${clamp * -12}px)`;
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Menu page: active subnav on scroll ──────────────────── */
(function () {
  const subnav = document.querySelector('.menu-subnav');
  if (!subnav) return;
  const links    = subnav.querySelectorAll('a');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  const activate = () => {
    let current = sections[0];
    sections.forEach(s => { if (s && s.getBoundingClientRect().top <= 140) current = s; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current?.id));
  };

  window.addEventListener('scroll', activate, { passive: true });
  activate();
})();

/* ── Menu card 3-D tilt on mousemove ────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const nx = (e.clientX - left) / width  - .5;
      const ny = (e.clientY - top)  / height - .5;
      card.style.transform = `translateY(-6px) rotateY(${nx * -10}deg) rotateX(${ny * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
