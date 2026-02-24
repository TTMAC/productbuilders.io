# Project CLAUDE.md — ProductBuilders.tech

> **Scope:** Project-specific instructions that supplement the global CLAUDE.md. These instructions take precedence when working in this codebase.

---

## Quick Reference

| Document | Location | Purpose |
|----------|----------|---------|
| Domain Model | `docs/DOMAIN_MODEL.md` | Bounded contexts, aggregates, ubiquitous language |
| Testing Strategy | `docs/TESTING_STRATEGY.md` | TDD workflow, test standards, coverage targets |
| MRD | `docs/ProductBuilders_MRD_TshepoMachele.docx` | Market requirements, JTBD, opportunity scores |
| PRD | `docs/ProductBuilders_PRD_TshepoMachele.md` | Feature requirements, user stories, release plan |
| UX Specification | `docs/ProductBuilders_UX_Specification.md` | JJG five-plane UX design, wireframes, interaction patterns |
| SRD | `docs/ProductBuilders_SRD_TshepoMachele.docx` | System architecture, NFRs, API specs, traceability |

**Claude must read the relevant doc before making changes in that area.**

---

## Project Context

**Project:** ProductBuilders.tech

**Description:** A cross-functional content platform (blog + newsletter + book review library) that helps product professionals (PMs, designers, engineers) develop shared vocabulary and mutual understanding across disciplines. Built as a Jamstack static site targeting 25K monthly active readers within 12 months.

**Tech Stack:**

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend / SSG | Astro | 4.x |
| Styling | Tailwind CSS | 3.x |
| CMS | Decap CMS (Git-based) | 3.x |
| Search | Pagefind (client-side) | 1.x |
| Hosting / CDN | Netlify | — |
| Newsletter | Buttondown (REST API) | v1 |
| Analytics | Plausible (cookie-free) | Cloud |
| Version Control | GitHub | — |
| Dev Partner | Claude Code | — |

**Repository Structure:**

```
productbuilders.io/
├── src/
│   ├── content/               # Markdown + YAML content (Git-based)
│   │   ├── articles/          # Blog articles ({slug}.md)
│   │   └── books/             # Book reviews ({slug}.md) — Phase 2
│   ├── components/            # Astro/HTML components
│   │   ├── ArticleCard.astro
│   │   ├── BookCard.astro
│   │   ├── Badge.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── NewsletterCTA.astro
│   │   ├── SearchBar.astro
│   │   └── ProgressBar.astro
│   ├── layouts/               # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── BookReviewLayout.astro
│   ├── pages/                 # Route pages
│   │   ├── index.astro        # Homepage
│   │   ├── articles/          # Article listing + individual pages
│   │   ├── books/             # Book library + individual reviews (Phase 2)
│   │   ├── about.astro
│   │   ├── subscribe.astro
│   │   └── rss.xml.ts         # RSS feed generation
│   ├── styles/                # Global styles + Tailwind config
│   └── utils/                 # Helpers (reading time, date formatting)
├── public/                    # Static assets (images, fonts, favicons)
├── functions/                 # Netlify serverless functions
│   └── newsletter-signup.ts   # Buttondown API proxy (protects API key)
├── tests/
│   ├── unit/                  # Zod schema, utils, component logic
│   ├── integration/           # Build output, CMS-Git flow
│   └── e2e/                   # Lighthouse, subscription flow, search
├── docs/
│   ├── DOMAIN_MODEL.md
│   ├── TESTING_STRATEGY.md
│   └── ARCHITECTURE.md
├── astro.config.mjs
├── tailwind.config.mjs
├── netlify.toml
├── decap-config.yml           # Decap CMS collection config
└── CLAUDE.md                  # This file
```

---

## Active Work

**Current Focus:** MVP build — blog platform, newsletter integration, first 12 articles

**Phase:** Phase 1 (Months 1–3) — Foundation + Core MVP

**Key Decisions Made:**

- Jamstack (Astro SSG) over Django/Wagtail — zero server ops, free hosting, native Markdown, CDN performance
- Pagefind over Algolia — zero cost, build-time indexing, <100ms client-side, no API keys needed
- Buttondown over ConvertKit/Mailchimp — clean API, Markdown emails, developer-friendly, free <100 subs
- Plausible over Google Analytics — cookie-free, GDPR-compliant, <1KB script, no consent banner
- Decap CMS over Contentful/Sanity — Git-based (content stays in repo), free self-hosted, visual editing layer
- Tailwind CSS for utility-first styling with design token system
- Netlify serverless function to proxy Buttondown API (never expose API key client-side)

**Open Questions:**

- Giscus comments integration — deferred per MRD §10.1 (revisit at 10K subs)
- Dark mode — not in MVP scope per UX Spec §5.3; consider post-launch
- Exit-intent popup for newsletter — UX Spec notes it can be intrusive; needs user testing

---

## Domain Reminders

> Full definitions in `docs/DOMAIN_MODEL.md`

**Bounded Contexts in Scope:**

| Context | Status | Notes |
|---------|--------|-------|
| Content Publishing | Active | Articles, frontmatter schemas, build pipeline |
| Book Reviews | Planned (Phase 2) | 150 reviews, discipline/level taxonomy — Month 4-6 |
| Newsletter / Subscriber | Active | Buttondown integration, signup forms |
| Analytics / Engagement | Active | Plausible setup, custom events |
| Search / Discovery | Active (basic) | Pagefind for articles; enhanced for books in Phase 2 |

**Key Ubiquitous Language:**

| Term | Meaning | Don't Say |
|------|---------|-----------|
| Product Builder | Anyone who contributes to building products — PM, Designer, Engineer | User, Customer, Reader (in domain contexts) |
| Article | A published Markdown content piece with cross-functional perspectives | Post, Blog, Entry |
| Book Review | A curated review with structured YAML metadata (discipline, level, cross-functional value) | Book summary, Book listing |
| Discipline | One of three product functions: PM, Design, Engineering | Category, Department, Role |
| Cross-Functional | Spanning ≥2 disciplines; the platform's core differentiator | Multi-disciplinary, Interdisciplinary |
| T-Shaped Professional | Deep expertise in one discipline with broad knowledge across others | Generalist, Full-stack (in non-engineering context) |
| Subscriber | A person who has opted into the Buttondown newsletter | Member, User, Follower |
| Career Level | Junior (0-3yr), Mid-Level (3-7yr), Senior (7+yr) — used for book reviews | Experience tier, Seniority |
| Opportunity Score | IMP + max(IMP - SAT, 0); scores >12 = high opportunity (MRD §4.2) | Priority score, Rank |

**Claude must:**

- Use domain terms exactly as defined above
- Respect bounded context boundaries (e.g., Subscriber data lives in Buttondown, not in Git)
- Reference `docs/DOMAIN_MODEL.md` for content schemas before modifying any content collection
- Use discipline colors consistently: PM (#3B82F6), Design (#8B5CF6), Engineering (#10B981)

---

## Testing Reminders

> Full standards in `docs/TESTING_STRATEGY.md`

**TDD Required:** Yes for content schemas (Zod), serverless functions, and utility logic. Test-after acceptable for Astro layout/component templates.

**Quick Coverage Targets:**

| Layer | Minimum |
|-------|---------|
| Content Schemas (Zod) | 95% |
| Serverless Functions (Netlify) | 90% |
| Utility Functions | 85% |
| Components / Layouts | 60% (visual regression + snapshot) |
| E2E Critical Paths | 100% of defined paths |

**Test Commands:**

```bash
# Unit tests (Zod schemas, utils, serverless functions)
npm test

# Unit tests in watch mode
npm run test:watch

# Integration tests (build output validation)
npm run test:integration

# All tests with coverage
npm run test:coverage

# E2E tests (Lighthouse, subscription flow, search)
npm run test:e2e

# Lighthouse performance audit
npm run lighthouse
```

**Claude must:**

- Write failing test before implementation for schemas and functions (Red-Green-Refactor)
- Validate all frontmatter changes against Zod schema tests
- Run Lighthouse audit after any template/layout change to ensure score >90
- Reference `docs/TESTING_STRATEGY.md` for naming conventions and patterns
- Flag if proposed changes would reduce coverage below thresholds

---

## Code Conventions

**Style:**

- Formatter: Prettier (Astro + TS + CSS)
- Linter: ESLint with Astro plugin
- Run before commit: `npm run lint && npm run format:check`

**Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Content files | kebab-case | `technical-debt-for-non-engineers.md` |
| Components | PascalCase | `ArticleCard.astro` |
| Layouts | PascalCase + Layout suffix | `ArticleLayout.astro` |
| Pages | kebab-case | `subscribe.astro` |
| Utility functions | camelCase | `calculateReadingTime()` |
| CSS tokens | kebab-case with `--` prefix | `--color-pm-primary` |
| Netlify functions | kebab-case | `newsletter-signup.ts` |

**Commit Messages (Conventional Commits):**

```
<type>(<scope>): <description>

feat(articles): add reading progress bar component
fix(newsletter): handle duplicate subscriber API response
content(articles): publish week-3 technical-debt article
style(components): update discipline badge colors per UX spec
test(schemas): add Zod validation tests for book review frontmatter
build(netlify): configure Pagefind post-build step
docs(claude): update active work section
```

**Scopes:** articles, books, newsletter, search, components, layouts, pages, schemas, netlify, analytics, docs

---

## Environment Setup

**Prerequisites:**

- Node.js 20+ (LTS)
- npm 10+
- Git
- Netlify CLI (`npm install -g netlify-cli`) — optional for local dev

**Local Setup:**

```bash
# Clone and install
git clone https://github.com/<org>/productbuilders.io.git
cd productbuilders.io
npm install

# Environment variables
cp .env.example .env
# Edit .env with local values:
#   BUTTONDOWN_API_KEY=your-key
#   PLAUSIBLE_DOMAIN=productbuilders.io

# Start development server (Astro dev mode)
npm run dev
# → http://localhost:4321

# Build static site locally
npm run build

# Preview production build
npm run preview

# Access CMS locally
# Navigate to http://localhost:4321/admin
```

**Environment Files:**

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.example` | Template with required vars | Yes |
| `.env` | Local development values (API keys) | No (.gitignore) |
| `netlify.toml` | Build config, redirects, headers | Yes |
| `decap-config.yml` | CMS collection schema | Yes |

---

## External Dependencies

| Dependency | Purpose | Docs | Sandbox/Mock |
|------------|---------|------|--------------|
| Buttondown | Newsletter subscriber management | https://api.buttondown.email/v1/docs | Free tier <100 subs; test with personal email |
| Plausible | Privacy-focused analytics | https://plausible.io/docs | Plausible Cloud dashboard |
| Netlify | Hosting, CDN, Identity, Git Gateway | https://docs.netlify.com | Free tier; deploy previews on branches |
| Decap CMS | Visual content editing | https://decapcms.org/docs | Local backend for dev; Git Gateway for prod |
| Pagefind | Client-side full-text search | https://pagefind.app | Build-time index; test with `npm run build` |

**API Keys Location:** `.env` file locally; Netlify environment variables in production.

**Claude must:**

- Never hardcode API keys — use `import.meta.env` or Netlify env vars
- Proxy Buttondown API calls through Netlify serverless function (never client-side)
- Use Plausible custom events API for scroll depth and engagement tracking
- Never commit `.env` or any file containing secrets

---

## Deployment

**Environments:**

| Environment | Branch | URL | Deploy Method |
|-------------|--------|-----|---------------|
| Preview | Feature branches | `https://deploy-preview-{n}--productbuilders.netlify.app` | Auto on PR |
| Production | `main` | `https://productbuilders.io` | Auto on merge to main |

**Deploy Commands:**

```bash
# Push to trigger production deploy
git push origin main

# Preview deploy (automatic on PR)
git push origin feature/my-branch

# Manual Netlify deploy (emergency)
netlify deploy --prod

# Check build status
netlify status
```

**Build Pipeline:**

```
Git push → Netlify webhook → npm run build (Astro SSG) → Pagefind post-build index → Atomic deploy to CDN
```

**Target: Build + deploy in <120 seconds.**

**Claude must:**

- Never deploy without explicit instruction
- Verify `npm run build` succeeds locally before suggesting push to main
- Verify Lighthouse score >90 for any template changes
- Note if new content requires Pagefind reindex (it does — automatic on build)
- Check that Zod schema validation passes (build fails on invalid frontmatter)

---

## Content Authoring Rules

**Every article MUST:**

- Include perspectives from ≥2 disciplines (MRD §7.2, PRD §7.2)
- Define or link any discipline-specific jargon (no unexplained terminology)
- End with actionable takeaways segmented by function (For PMs: / For Engineers: / For Designers:)
- Target ~10 minute read time (2,000–2,500 words at 200 wpm)
- Have valid YAML frontmatter passing Zod schema validation
- Include meta description <155 chars and title <60 chars for SEO

**Book reviews (Phase 2) MUST:**

- Include `cross_functional_value` field explaining why other disciplines should read
- Include `key_takeaways` array with 3–5 insights
- Include `who_should_read` field targeting specific audience
- Be tagged with exactly one `discipline` and one `level`
- Reference books published ≥5 years ago (publication_year validation)

**Content calendar:** See PRD §7.3 for first 12-week article schedule.

---

## Performance Budgets

| Metric | Target | Source |
|--------|--------|--------|
| TTFB | <200ms globally | SRD §12.1 |
| LCP | <2.5s on 3G | SRD §12.1 |
| CLS | <0.1 | SRD §12.1 |
| FID | <100ms | SRD §12.1 |
| Lighthouse Performance | >90 | SRD §12.1 |
| Page weight | <100KB compressed | SRD §12.1 |
| Search response | <100ms client-side | SRD §12.1 |
| Build time | <120s | SRD §12.1 |

**Claude must flag any change that risks violating these budgets.**

---

## Design System Reference

> Full spec in `docs/ProductBuilders_UX_Specification.md`

**Discipline Colors (use consistently everywhere):**

| Discipline | Primary | Light BG | Accessible Text |
|------------|---------|----------|-----------------|
| PM | `#3B82F6` | `#EFF6FF` | `#1E40AF` |
| Design | `#8B5CF6` | `#F5F3FF` | `#5B21B6` |
| Engineering | `#10B981` | `#ECFDF5` | `#047857` |

**Typography:**

- Headlines: Inter / system-ui (700/600 weight)
- Body: Georgia / Charter (400 weight, 18px, 1.7 line-height)
- Code: JetBrains Mono / SF Mono
- Article measure: 65–75 chars per line, max 680px width

**Spacing base unit:** 4px (use multiples: 4, 8, 12, 16, 24, 32, 48, 64)

**Accessibility:** WCAG 2.1 AA minimum — 4.5:1 contrast, keyboard nav, ARIA labels, semantic HTML, skip-to-content link

---

## Project-Specific Rules

**Always:**

- Validate frontmatter against Zod schema before committing content
- Include Open Graph + Twitter Card meta tags on every page
- Generate sitemap.xml and robots.txt on build
- Use `<article>` semantic HTML for content pages
- Respect `prefers-reduced-motion` for all animations
- Include alt text for all images
- Proxy external API calls through Netlify functions (never expose keys)

**Never:**

- Add client-side JavaScript unless absolutely necessary (Astro zero-JS default)
- Store PII in the Git repository (subscriber emails live only in Buttondown)
- Use Google Analytics or any cookie-based tracking
- Modify discipline color tokens without updating all badge/component references
- Publish content with `draft: true` to main branch (Astro excludes drafts, but be explicit)
- Hardcode API keys anywhere in the codebase

**Ask First:**

- Before adding new npm dependencies (check bundle impact)
- Before modifying Zod content schemas (affects all existing content)
- Before changing Netlify build configuration
- Before integrating any new external service
- Before modifying the CMS config (decap-config.yml)
- Before adding any JavaScript to the client bundle

---

## Key Metrics to Instrument

> North Star: Weekly Active Readers Who Engage Across Disciplines (MRD §9.1)

| Metric | Plausible Event | Implementation |
|--------|-----------------|----------------|
| Article page view | Automatic | Plausible script |
| Scroll depth (25/50/75/100%) | `scroll-depth` custom event | Throttled scroll listener |
| Newsletter signup | `newsletter-signup` | Fire on successful API response |
| Discipline filter used | `discipline-filter` | Fire on filter selection |
| Search query | `search-query` | Fire on Pagefind result display |
| Social share click | `social-share` | Fire on share button click |
| Book review view (Phase 2) | Automatic | Plausible script |
| Cross-discipline navigation | `cross-discipline-read` | Fire when discipline ≠ subscriber tag |

---

## Temporary Overrides

> Remove when no longer applicable

```
- [2025-02-07] E2E tests: Skip Lighthouse E2E until first deployment to Netlify
- [2025-02-07] Analytics: Plausible custom events deferred until Month 2 (basic pageviews first)
```

---

## Contacts & Ownership

| Area | Owner | Contact |
|------|-------|---------|
| All contexts | Tshepo Machele | Founder — Product, Engineering, Design, Content |
| Development Partner | Claude Code (Anthropic) | AI-assisted full-stack development |
| Future contributors | TBD | Month 6+ for book reviews and guest articles |

---

*Last updated: 2025-02-07*
