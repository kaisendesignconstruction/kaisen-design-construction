/* =========================================================
   Kaisen — projects list + full detail page (big.dk-style)
   List: monogram + name + location + image.
   Detail: meta + hero, galleries, pull-quote, map + credits.
   ========================================================= */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const list = $("#projList");
  const overlay = $("#pdOverlay");
  if (!list) return;

  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));

  /* monogram glyphs — white mark on a black square */
  const GLYPHS = {
    plus:  '<svg viewBox="0 0 40 40"><path d="M18 8h4v24h-4z M8 18h24v4H8z" fill="#fff"/></svg>',
    peak:  '<svg viewBox="0 0 40 40"><path d="M8 30L20 10l12 20H8z" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    ring:  '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    bars:  '<svg viewBox="0 0 40 40"><path d="M10 26h4v8h-4z M18 18h4v16h-4z M26 10h4v24h-4z" fill="#fff"/></svg>',
    wave:  '<svg viewBox="0 0 40 40"><path d="M7 24c4-8 8-8 13 0s9 8 13 0" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    frame: '<svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    slash: '<svg viewBox="0 0 40 40"><path d="M11 30L30 10" stroke="#fff" stroke-width="2.6"/><path d="M11 18L23 30" stroke="#fff" stroke-width="2.6"/></svg>',
    tri:   '<svg viewBox="0 0 40 40"><path d="M10 12h20M10 12l10 18L30 12" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    grid:  '<svg viewBox="0 0 40 40"><path d="M14 9v22M26 9v22M9 14h22M9 26h22" stroke="#fff" stroke-width="2"/></svg>',
    arc:   '<svg viewBox="0 0 40 40"><path d="M9 31a11 11 0 0122 0" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M9 31h22" stroke="#fff" stroke-width="2.4"/></svg>',
    split: '<svg viewBox="0 0 40 40"><rect x="9" y="11" width="9" height="18" fill="#fff"/><rect x="22" y="11" width="9" height="18" fill="none" stroke="#fff" stroke-width="2.4"/></svg>',
    dot:   '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="6" fill="#fff"/><circle cx="20" cy="20" r="12" fill="none" stroke="#fff" stroke-width="2"/></svg>'
  };
  const glyph = (k) => GLYPHS[k] || GLYPHS.frame;

  /* shared gallery pool (extra interior/detail shots) */
  const POOL = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80"
  ];
  const poolFor = (i) => [POOL[i % POOL.length], POOL[(i + 2) % POOL.length], POOL[(i + 4) % POOL.length]];

  /* shared project credits (sample team — edit freely) */
  const CREDITS = {
    partner: ["Aarav Mehta", "Lena Fischer"],
    lead: "Sofia Almeida",
    manager: "Daniel Okoro",
    team: ["Mateo Rossi", "Yuki Tanaka", "Priya Nair", "Chloé Dubois", "Noah Schmidt", "Amara Okafor",
           "Ravi Kapoor", "Elena Petrova", "Hiro Sato", "Lucas Silva", "Ingrid Johansen", "Omar Haddad"],
    engineers: ["Marco Bianchi", "Nadia Haq", "Felix Wagner", "Mei Lin", "Pavel Novak", "Grace Adeyemi"]
  };

  const PROJECTS = [
    { slug: "ridgeline-house", name: "Ridgeline House", location: "Aspen, United States", category: "residential", glyph: "peak", coords: [39.19, -106.82],
      year: "2023", client: "Private Client", typology: "Residential", size: "540 / 5,800", status: "Completed",
      cover: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"],
      description: ["Set along a mountain ridge, Ridgeline House folds a family home into the slope so every room opens to the valley while the roof reads as a continuation of the terrain.","A low-carbon timber frame, deep eaves and triple glazing keep the house comfortable through alpine winters with minimal energy — performance and warmth as one design problem."] },
    { slug: "courtyard-villa", name: "Courtyard Villa", location: "Dubai, United Arab Emirates", category: "residential", glyph: "frame", coords: [25.20, 55.27],
      year: "2022", client: "Private Client", typology: "Residential", size: "1,100 / 11,800", status: "Completed",
      cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80"],
      description: ["Courtyard Villa turns the desert climate into the plan: rooms wrap a shaded central court so the house cools itself through cross-ventilation and water long before air-conditioning is asked to.","Hand-finished plaster, stone and screened light give the interior a calm, tactile quietness against the heat outside."] },
    { slug: "the-terraces", name: "The Terraces", location: "Lisbon, Portugal", category: "residential", glyph: "bars", coords: [38.72, -9.14],
      year: "2024", client: "Aurora Living", typology: "Residential", size: "8,400 / 90,400", status: "Under Construction",
      cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80"],
      description: ["The Terraces stacks 64 apartments as a cascade of planted decks down a south-facing hillside, giving every home a garden and the block a green public stair.","The terracing is structural and social at once — shading the homes below while opening shared landings where neighbours actually meet."] },
    { slug: "kaisen-hq-tower", name: "Kaisen HQ Tower", location: "Singapore", category: "commercial", glyph: "grid", coords: [1.35, 103.82],
      year: "2025", client: "Kaisen Group", typology: "Work", size: "32,000 / 344,000", status: "In Progress",
      cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"],
      description: ["Kaisen HQ Tower threads sky-gardens through a 38-storey workplace, breaking the floorplate so daylight, planting and shared terraces reach the core of the building.","A high-performance facade and rainwater harvesting target a net-positive water balance and one of the lowest cooling loads in the district."] },
    { slug: "market-pavilion", name: "Market Pavilion", location: "Copenhagen, Denmark", category: "commercial", glyph: "arc", coords: [55.68, 12.57],
      year: "2021", client: "City of Copenhagen", typology: "Culture", size: "2,300 / 24,700", status: "Completed",
      cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1400&q=80"],
      description: ["A single timber roof, vaulted like a wave, shelters a year-round food market and gathering hall on the Copenhagen waterfront.","Built from glue-laminated spruce and left almost entirely open, the pavilion is warm public infrastructure the city can grow into."] },
    { slug: "helix-offices", name: "Helix Offices", location: "Austin, United States", category: "commercial", glyph: "slash", coords: [30.27, -97.74],
      year: "2023", client: "Helix Ventures", typology: "Work", size: "18,000 / 193,700", status: "Completed",
      cover: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80"],
      description: ["Helix Offices spirals a continuous landscaped ramp through the building, so a walk from lobby to roof is one unbroken, planted promenade.","The geometry doubles as shading and as the social spine of the company — every team sits on the same climbing path."] },
    { slug: "atrium-loft", name: "Atrium Loft", location: "New York, United States", category: "interiors", glyph: "ring", coords: [40.71, -74.01],
      year: "2022", client: "Private Client", typology: "Interiors", size: "320 / 3,400", status: "Completed",
      cover: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"],
      description: ["A former warehouse floor is reorganised around a carved double-height atrium that pulls daylight deep into the plan.","Warm oak, lime plaster and a restrained palette let the light and the original structure do the talking."] },
    { slug: "warm-minimal-penthouse", name: "Warm Minimal Penthouse", location: "Tokyo, Japan", category: "interiors", glyph: "plus", coords: [35.68, 139.69],
      year: "2024", client: "Private Client", typology: "Interiors", size: "210 / 2,260", status: "Completed",
      cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"],
      description: ["Perched above the city, this penthouse pairs a spare, calm interior with deep timber framing that turns the skyline into a series of quiet, framed views.","Every joint is detailed for touch — the minimalism is warm, not cold."] },
    { slug: "riverside-park", name: "Riverside Park", location: "Seoul, South Korea", category: "landscape", glyph: "wave", coords: [37.57, 126.98],
      year: "2024", client: "Seoul Metropolitan Government", typology: "Park", size: "64,000 / 688,800", status: "Under Construction",
      cover: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80"],
      description: ["Riverside Park reclaims a hardened flood bank as a soft, walkable edge — wetlands, meadows and a continuous waterfront promenade that floods on purpose when the river rises.","The park is engineered as living infrastructure: it absorbs storms, cleans runoff and gives the district a front porch on the water."] },
    { slug: "desert-garden", name: "Desert Garden", location: "Phoenix, United States", category: "landscape", glyph: "tri", coords: [33.45, -112.07],
      year: "2022", client: "City of Phoenix", typology: "Garden", size: "12,000 / 129,100", status: "Completed",
      cover: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80"],
      description: ["Desert Garden shows that a public garden in an arid city can be lush without being thirsty — native planting, shade structures and shaded water channels.","Every drop is captured and reused, proving comfort and conservation can share the same ground."] },
    { slug: "heritage-mill-conversion", name: "Heritage Mill Conversion", location: "Manchester, United Kingdom", category: "renovation", glyph: "split", coords: [53.48, -2.24],
      year: "2021", client: "Northworks", typology: "Adaptive Reuse", size: "9,600 / 103,300", status: "Completed",
      cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80"],
      description: ["A derelict cotton mill becomes homes and workspaces while keeping its brick, cast-iron columns and saw-tooth roof intact.","Reusing the structure saved thousands of tonnes of carbon — the greenest building is the one already standing."] },
    { slug: "brownstone-revival", name: "Brownstone Revival", location: "Brooklyn, United States", category: "renovation", glyph: "dot", coords: [40.68, -73.94],
      year: "2023", client: "Private Client", typology: "Renovation", size: "410 / 4,400", status: "Completed",
      cover: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1100&q=80",
      images: ["https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80"],
      description: ["A tired 1890s brownstone is brought back to life — original mouldings and stair restored, the rear opened up with a glazed garden extension.","Old and new sit comfortably together, modern comfort inside a preserved historic shell."] }
  ];

  const indexOf = (slug) => PROJECTS.findIndex((p) => p.slug === slug);
  let filter = "all";

  /* ---------- list ---------- */
  function rowHTML(p) {
    return `<a class="pr-row" href="#" data-slug="${p.slug}" data-category="${p.category}" aria-label="${esc(p.name)}">
      <span class="pr-meta">
        <span class="pr-icon">${glyph(p.glyph)}</span>
        <span class="pr-name">${esc(p.name)}</span>
        <span class="pr-loc">${esc(p.location)}</span>
      </span>
      <span class="pr-shot"><img loading="lazy" onerror="this.style.opacity=0" src="${p.cover}" alt="${esc(p.name)}"></span>
    </a>`;
  }

  let io = null;
  function observeRows() {
    const rows = $$(".pr-row", list);
    if (!("IntersectionObserver" in window)) { rows.forEach((r) => r.classList.add("in")); return; }
    io = io || new IntersectionObserver((es, o) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    rows.forEach((r) => io.observe(r));
  }

  function render() {
    const items = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    list.innerHTML = items.length ? items.map(rowHTML).join("") : '<p class="pr-empty">No projects in this category yet.</p>';
    observeRows();
  }

  $$(".filter").forEach((b) => b.addEventListener("click", () => {
    $$(".filter").forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    filter = b.dataset.filter;
    render();
  }));

  /* ---------- detail page ---------- */
  const SOCIAL = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14v-1.5c0-.6.3-.5.5-.5z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8A1.5 1.5 0 106.5 5a1.5 1.5 0 000 3zM5 10h3v9H5zM10 10h3v1.3c.5-.8 1.5-1.5 3-1.5 2.3 0 3 1.5 3 4V19h-3v-4c0-1-.4-1.8-1.4-1.8S13 14 13 15v4h-3z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3h3l-7 8 8 10h-6l-4.5-6L5 21H2l7.5-8.5L2 3h6l4 5.5z"/></svg>'
  };
  const metaRow = (k, v) => (v && v !== "—") ? `<div class="pd-row"><div class="k">${k}</div><div class="v">${esc(v)}</div></div>` : "";

  function sliderHTML(imgs) {
    const slides = imgs.map((s) => `<div class="pd-slide"><img loading="lazy" onerror="this.style.opacity=0" src="${s}" alt=""></div>`).join("");
    return `<div class="pd-slider">
        <div class="pd-track" id="pdTrack">${slides}</div>
        <div class="pd-count"><span id="pdIdx">01</span> / ${String(imgs.length).padStart(2, "0")}</div>
      </div>`;
  }

  function moreListHTML() {
    return `<section class="pd-more">
      <h3 class="pd-more-h">More projects</h3>
      <div class="proj-list">${PROJECTS.map(rowHTML).join("")}</div>
    </section>`;
  }

  function initSlider(total) {
    const track = $("#pdTrack");
    if (!track) return;
    let i = 0;
    const idxEl = $("#pdIdx");
    const go = (n) => {
      i = (n + total) % total;
      track.style.transform = `translateX(${-i * 100}%)`;
      if (idxEl) idxEl.textContent = String(i + 1).padStart(2, "0");
    };
    const prev = $("#pdPrev"), next = $("#pdNext");
    if (prev) prev.addEventListener("click", () => go(i - 1));
    if (next) next.addEventListener("click", () => go(i + 1));
    go(0);
  }

  function mapHTML(coords, name) {
    if (!coords) return "";
    const [la, lo] = coords, dLa = 0.06, dLo = 0.10;
    const bbox = `${(lo - dLo).toFixed(4)},${(la - dLa).toFixed(4)},${(lo + dLo).toFixed(4)},${(la + dLa).toFixed(4)}`;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${la},${lo}`;
    return `<div class="pd-map"><iframe loading="lazy" title="Map — ${esc(name)}" src="${src}"></iframe></div>`;
  }

  function creditsHTML() {
    const c = CREDITS;
    return `<div class="pd-credits">
      <div class="pd-cred"><h4>Partner in Charge</h4>${c.partner.map((n) => `<p>${esc(n)}</p>`).join("")}</div>
      <div class="pd-cred"><h4>Project Leader</h4><p>${esc(c.lead)}</p></div>
      <div class="pd-cred"><h4>Project Manager</h4><p>${esc(c.manager)}</p></div>
      <div class="pd-cred span2"><h4>Project Team</h4><ul class="pd-team-cols">${c.team.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>
      <div class="pd-cred span2"><h4>Kaisen Engineering</h4><ul class="pd-team-cols">${c.engineers.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>
    </div>`;
  }

  function openDetail(slug) {
    const idx = indexOf(slug);
    if (idx < 0 || !overlay) return;
    const p = PROJECTS[idx];
    const allImg = p.images.concat(poolFor(idx));   // hero + gallery

    overlay.innerHTML = `
      <div class="pd-bar">
        <button class="pd-back" id="pdBack">&larr; All projects</button>
        <button class="pd-close" id="pdClose" aria-label="Close">&times;</button>
      </div>
      <article class="pd-page">
        <section class="pd-grid">
          <aside class="pd-meta">
            <span class="pr-icon lg">${glyph(p.glyph)}</span>
            <h1 class="pd-name">${esc(p.name)}</h1>
            <div class="pr-loc">${esc(p.location)}</div>
            <div class="pd-table">
              ${metaRow("Year", p.year)}${metaRow("Client", p.client)}${metaRow("Typology", p.typology)}${metaRow("Size m²/ft²", p.size)}${metaRow("Status", p.status)}
            </div>
            <div class="pd-share"><div class="k">Share</div><div class="pd-icons">
              <a href="#" aria-label="Email">${SOCIAL.mail}</a><a href="#" aria-label="Facebook">${SOCIAL.fb}</a>
              <a href="#" aria-label="LinkedIn">${SOCIAL.li}</a><a href="#" aria-label="X">${SOCIAL.x}</a>
            </div></div>
          </aside>
          <div class="pd-center">${sliderHTML(allImg)}</div>
          <div class="pd-text">${p.description.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
          <button class="pd-arrow prev" id="pdPrev" aria-label="Previous image">&lsaquo;</button>
          <button class="pd-arrow next" id="pdNext" aria-label="Next image">&rsaquo;</button>
        </section>

        ${moreListHTML()}

        <section class="pd-foot">
          ${mapHTML(p.coords, p.name)}
          ${creditsHTML()}
        </section>
      </article>`;

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    document.body.classList.add("pd-open");
    overlay.scrollTop = 0;
    $$(".pr-row", overlay).forEach((r) => r.classList.add("in"));   // reveal the "more projects" rows
    initSlider(allImg.length);
  }

  function closeDetail() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove("show");
    document.body.classList.remove("pd-open");
    setTimeout(() => { overlay.hidden = true; overlay.innerHTML = ""; }, 360);
  }

  /* open from the main list */
  list.addEventListener("click", (e) => {
    const a = e.target.closest(".pr-row");
    if (a) { e.preventDefault(); openDetail(a.dataset.slug); }
  });
  /* inside the detail: row clicks open that project; back/close exit */
  if (overlay) overlay.addEventListener("click", (e) => {
    if (e.target.closest("#pdClose, .pd-back")) { closeDetail(); return; }
    const row = e.target.closest(".pr-row");
    if (row) { e.preventDefault(); openDetail(row.dataset.slug); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

  render();
})();
