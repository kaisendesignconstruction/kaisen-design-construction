# Kaisen Design & Construction — Website

A fast, photography-first static website for **Kaisen Design & Construction** — an integrated
design-build studio. Minimal chrome, full-bleed imagery, a discipline-based project grid, and clean
modernist typography, branded with Kaisen's copper accent.

It is a clean, original Kaisen site with two signature touches:

- **Intro animation** — on load the logo appears centred, then glides up to the top-left.
- **Logo menu** — clicking the logo opens a slide-in drawer menu (the "hamburger" menu).

No framework, no build step — plain HTML/CSS/JS.

## Run it

- **Just open it:** double-click `index.html`, or
- **Serve locally** (recommended, so fonts/lazy-loading behave):
  ```bash
  python -m http.server 8000   # then visit http://localhost:8000
  ```

## Structure

```
index.html          # the page: intro, header (logo menu), hero, projects, approach, stats,
                     # sustainability, studio, contact, footer
css/style.css       # design system + intro animation + logo-menu drawer + responsive layout
js/main.js          # intro fly animation, logo menu, project filter, scroll reveals, count-up, form
assest/brand-logo.png   # your logo (intro + header + footer + favicon)
```

## How the two borrowed interactions work

- **Intro (`#intro` + `runIntro()` in `js/main.js`)** — a full-screen panel shows the logo centred,
  then JS measures the header logo's position and transforms the intro logo to fly there (FLIP-style),
  fading the panel out to reveal the hero. Respects `prefers-reduced-motion` (skips the animation).
  Tune timing via the three `setTimeout` values (850 / 1650 / 2450 ms).
- **Logo menu (`#brandBtn` → `#menu`)** — the logo is a button; clicking it slides in the drawer menu.
  Closes via the X, the overlay, `Escape`, or selecting a link. A subtle hamburger hint appears on hover.

## Make it yours (quick edits)

1. **Projects** — edit the `<article class="card">` blocks in `index.html` (image, title, location,
   and a `data-category` matching a filter: `residential` | `commercial` | `interiors` | `landscape` | `renovation`).
2. **Real photos** — swap the Unsplash URLs for your own (e.g. an `images/` folder). Images fade
   gracefully if one fails to load.
3. **Brand color** — change `--copper` in `css/style.css` (`:root`).
4. **Intro speed** — adjust the `setTimeout` timings + the `.intro-logo` transition in the CSS.
5. **Contact details** — update email/phone/address in the `#contact` section.
6. **Form delivery** — the form is front-end only; point it at a backend such as
   [Formspree](https://formspree.io/) / [Basin](https://usebasin.com/) (see the submit handler in `js/main.js`).

## Notes

- Images are hotlinked from Unsplash for the demo and are not owned by Kaisen — replace before going live.
- Footer social links and the menu CTA are placeholders — wire them up before launch.
- Folder is named `assest` (as provided); the logo lives there.
