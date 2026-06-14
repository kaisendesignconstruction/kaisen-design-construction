/* =========================================================
   Kaisen Design & Construction — interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. INTRO: logo centred → flies to the header ---------- */
  function runIntro() {
    const intro = $("#intro");
    const logo  = $("#introLogo");
    const mark  = $(".brand-mark");
    if (!intro || !logo || !mark) { document.body.classList.remove("intro-active"); if (intro) intro.classList.add("gone"); return; }

    if (prefersReduced) {
      intro.classList.add("gone");
      document.body.classList.remove("intro-active");
      return;
    }

    document.body.classList.add("intro-active");

    // Fly the centred logo to where the header logo sits (FLIP-style).
    const fly = () => {
      const t = mark.getBoundingClientRect();
      const l = logo.getBoundingClientRect();
      if (!t.width || !l.width) {       // header not measurable — bail gracefully
        intro.classList.add("gone");
        document.body.classList.remove("intro-active");
        return;
      }
      const dx = (t.left + t.width / 2) - (l.left + l.width / 2);
      const dy = (t.top + t.height / 2) - (l.top + l.height / 2);
      const scale = t.width / l.width;
      logo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    };

    setTimeout(fly, 850);                                   // hold centred, then move
    setTimeout(() => {                                      // reveal site + fade intro
      intro.classList.add("fade");
      document.body.classList.remove("intro-active");
    }, 1650);
    setTimeout(() => intro.classList.add("gone"), 2450);    // remove from flow
  }

  /* ---------- 2. Sticky header state ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Logo menu (drawer) ---------- */
  const menu = $("#menu");
  const menuOverlay = $("#menuOverlay");
  const brandBtn = $("#brandBtn");
  let overlayTimer = null;

  function openMenu() {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    if (brandBtn) brandBtn.setAttribute("aria-expanded", "true");
    clearTimeout(overlayTimer);
    menuOverlay.hidden = false;
    requestAnimationFrame(() => menuOverlay.classList.add("show"));
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (!menu.classList.contains("open")) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    if (brandBtn) brandBtn.setAttribute("aria-expanded", "false");
    menuOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => { menuOverlay.hidden = true; }, 360);
  }

  if (brandBtn) brandBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.contains("open") ? closeMenu() : openMenu();
  });
  $("#menuClose").addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);
  $$("[data-menu]", menu).forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- 4. Project filtering ---------- */
  const filters = $$(".filter");
  const cards = $$(".card");
  const emptyMsg = $("#gridEmpty");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const show = cat === "all" || card.dataset.category === cat;
        card.classList.toggle("hide", !show);
        if (show) visible++;
      });
      if (emptyMsg) emptyMsg.hidden = visible > 0;
    });
  });

  /* ---------- 5. Scroll reveal ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); obs.unobserve(entry.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 6. Count-up stats ---------- */
  const stats = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + (p === 1 ? "+" : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (stats.length && "IntersectionObserver" in window) {
    const statIO = new IntersectionObserver(
      (entries, obs) => entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      }),
      { threshold: 0.6 }
    );
    stats.forEach((el) => statIO.observe(el));
  } else {
    stats.forEach((el) => (el.textContent = el.dataset.count + "+"));
  }

  /* ---------- 7. Contact form (demo handler) ---------- */
  const form = $("#contactForm");
  const note = $("#formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !message) {
        note.textContent = "Please fill in your name, a valid email and a short message.";
        note.className = "form-note err";
        return;
      }
      note.textContent = `Thanks, ${name.split(" ")[0]}! Your enquiry is ready to send — connect a form backend to deliver it.`;
      note.className = "form-note ok";
      form.reset();
    });
  }

  /* ---------- 8. Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 9. Go ---------- */
  if (document.readyState !== "loading") runIntro();
  else window.addEventListener("DOMContentLoaded", runIntro);
})();
