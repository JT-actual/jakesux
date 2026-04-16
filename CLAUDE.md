# JakeSux

A parody SaaS landing page — "The Enterprise Disappointment Platform." Pure static site. No build step, no framework, no dependencies. Hand-written HTML + CSS + vanilla JS.

## Live URLs

- **GitHub Pages:** https://jt-actual.github.io/jakesux/
- **Custom domain:** https://jakesux.xyz/ (registered at Namecheap; DNS may still be propagating for new deployments)
- **Repo:** https://github.com/JT-actual/jakesux

## Stack

- Static HTML, CSS, and a single `script.js`. That's it.
- No bundler, no package manager, no build.
- Deploys automatically to GitHub Pages on every push to `main`.

## File structure

```
.
├── index.html          # Landing page (hero, features, pricing, etc.)
├── styles.css          # All styles — tokens, components, responsive, subpages
├── script.js           # Nav, reveal, counters, mobile menu, CTA form
├── jake.jpeg           # Jake (CSO photo)
├── CNAME               # jakesux.xyz — configures GH Pages custom domain
├── .gitignore          # Ignores screenshots, .DS_Store, logs
└── {subpages}.html     # 17 content pages (see below)
```

**Subpages** (all linked from `index.html` nav + footer):
- `sign-in.html` — Sign in to suffer
- `demo.html` — 90-sec demo page
- `about.html`, `careers.html`, `press.html`, `investors.html` — Company
- `integrations.html`, `status.html`, `changelog.html` — Product
- `docs.html`, `sdk.html`, `webhook.html`, `cli.html` — Developers
- `terms.html`, `privacy.html`, `dmca.html`, `cookies.html` — Legal

## Design system

CSS custom properties (tokens) live at the top of `styles.css` under `:root`. Primary tokens:

- **Colors:** `--bg #07070b`, `--text #e8e8ee`, `--muted #9b9bab`, `--primary #a78bfa` (purple), `--primary-2 #22d3ee` (cyan)
- **Gradient:** `--grad` (purple → cyan, 135deg) — used on `.grad` text, CTAs, accents
- **Typography:** Inter (400-900), JetBrains Mono for code. Loaded from Google Fonts.
- **Radii:** `--radius 14px`, `--radius-lg 22px`
- **Shadow:** `--shadow-lg` — soft dark + purple bloom

Reusable components (class-based):
- `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-sm`, `.btn.full`
- `.card` (feature cards with cursor-follow spotlight)
- `.tile`, `.tile-grid` — subpage grids
- `.prose` — subpage content wrapper (sets typography for `h2`, `h3`, `p`, `ul`, `ol`, `code`, `pre`, `blockquote`)
- `.page-hero`, `.page-body` — subpage layout
- `.auth-card` — sign-in form wrapper
- `.video-frame` — fake video player
- `.status-pill` — green/yellow/red status indicator
- `.reveal` / `.reveal.in` — JS-driven scroll reveal
- `.eyebrow`, `.eyebrow-pill` — small caps label, pill-style announcement

## Scroll-reveal + JS behavior

- `script.js` handles: sticky nav blur on scroll, `.reveal` intersection observer, animated number counters (`.counter[data-to]`), card cursor spotlight (`--mx`/`--my` custom props), CTA form toast, live "sigh feed" auto-update, mobile menu toggle.
- All JS is idempotent and null-safe — `script.js` is included on every page and only acts on elements that exist. You can include it everywhere without breakage.

## Responsive breakpoints

- `<=980px` — tablet. Nav links collapse into a hamburger menu. Grids collapse to 2 columns.
- `<=620px` — phone. Everything becomes 1 column. CTA form stacks.
- `<=420px` — narrow phone. Tighter container padding (`18px`), smaller typography, mock card paddings tightened, tile grid goes to 1 column.

`prefers-reduced-motion: reduce` disables animations (blobs, spin, counters, reveal).

## Adding a new subpage

Every subpage shares the same nav + footer HTML. The quickest path:

1. Copy an existing subpage (e.g., `about.html`) as a starting template.
2. Update `<title>`, `<meta description>`, the `.eyebrow` label, `<h1>`, and `.lede`.
3. Replace the `.prose` content between `<section class="page-body">` tags.
4. Add a link to the new page from `index.html`'s footer (and from any related subpage if relevant).
5. Commit and push. GH Pages rebuilds in ~30 seconds.

Nav + footer use **relative URLs** (`index.html#pricing`, `about.html`, etc.) so the site works identically on `jt-actual.github.io/jakesux/` and `jakesux.xyz`.

## Deployment

GitHub Pages is configured to serve from `main` branch root. Nothing else. To deploy:

```bash
git add -A
git commit -m "your message"
git push
```

GH Pages picks up changes automatically. Build status:

```bash
gh api /repos/JT-actual/jakesux/pages/builds/latest --jq '.status'
```

## Custom domain setup (historical)

- Domain: `jakesux.xyz` — registered at Namecheap on 2026-04-16.
- `CNAME` file at repo root contains `jakesux.xyz`.
- Pages API was configured via:
  ```bash
  gh api -X PUT /repos/JT-actual/jakesux/pages -f 'cname=jakesux.xyz'
  ```
- DNS records at Namecheap:
  - `A @` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` (GitHub Pages IPs)
  - `CNAME www` → `jt-actual.github.io.`
- **After DNS propagation** and GitHub's DNS check passes, enable "Enforce HTTPS" in repo Settings → Pages. GH auto-provisions a Let's Encrypt cert.

## Tone (important for any content edits)

The entire site is enterprise SaaS parody. Key voice notes:
- **Jake sucks.** This is the premise. Every page leans into it.
- **Enterprise jargon, played straight.** Terms like "Single Sigh-On," "SOC 2 Type Sus," "Aggressively Confident Wrongness mode," "Webhook of Shame."
- **Dry, deadpan, specific.** Funny details beat broad jokes. "Jake's mom paid $49 and disputed the charge 6 days later" > "Jake is bad."
- **Self-aware callbacks across pages.** Integrations references jakectl, docs references the webhook, the changelog references them all. It should feel cohesive.
- **Never break character** — even the legal pages and changelog stay in tone.

When adding content, match this voice. Avoid references that don't fit (real companies, real people, actual technical advice).

## Things NOT to do

- Don't add frameworks or bundlers. The whole point is it's a 5-file static site.
- Don't change the existing nav or footer structure on one page without updating all 18 pages (nav/footer is duplicated in every HTML file by design).
- Don't introduce external dependencies beyond Google Fonts.
- Don't commit screenshots or `.DS_Store` files (the `.gitignore` handles this).
- Don't force-push to `main` — just create new commits.

## Known quirks

- Nav + footer HTML is duplicated across all 18 pages. If you need to change a nav link site-wide, it's a find/replace operation across every `.html` file. Worth it given the simplicity of the stack.
- The landing page uses `<ol class="timeline">` in the changelog section; the subpage `changelog.html` also uses `.timeline` inside a `.prose` wrapper. `.prose` has its own `ol` counter styles — `styles.css` has an explicit `.prose ol.timeline` override to restore the timeline look. Don't remove that override.
- `script.js`'s mobile menu logic queries `#menuBtn` and `#mobileMenu` — both IDs exist on every page. Don't rename them without updating the JS.
