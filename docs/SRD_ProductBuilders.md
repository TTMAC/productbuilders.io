# SYSTEM REQUIREMENTS DOCUMENT

## 0 → 1 New Product Development

# ProductBuilders.io

### Cross-Functional Content Platform for Product Teams

---

| Field | Value | Field | Value |
|-------|-------|-------|-------|
| **Document Owner** | Tshepo Machele | **Version** | 1.0 |
| **MRD Reference** | v0.1 (2025-02-04) | **PRD Reference** | v1.0 (2025-02-04) |
| **Created Date** | 2025-02-07 | **Status** | ☑ Draft  ☐ Review  ☐ Approved |
| **Last Updated** | 2025-02-07 | **Target Release** | Q2 2025 |
| **Engineering Lead** | Tshepo Machele | **Architecture Lead** | Tshepo Machele |

> **🚀 DEVELOPMENT APPROACH**
>
> This platform will be developed using Claude Code in partnership with Tshepo Machele, enabling rapid AI-assisted development. Stack: Astro (SSG), Decap CMS, Netlify (hosting), Pagefind (search), Buttondown (newsletter), Plausible (analytics).

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Traceability Matrix](#2-traceability-matrix)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [User Story Maps](#4-user-story-maps)
5. [UML Diagrams](#5-uml-diagrams)
6. [System Flow Diagrams](#6-system-flow-diagrams)
7. [Functional System Requirements](#7-functional-system-requirements)
8. [Data Architecture](#8-data-architecture)
9. [Integration Specifications](#9-integration-specifications)
10. [API Specifications](#10-api-specifications)
11. [Security & Compliance](#11-security--compliance)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Technical Feasibility Validation](#13-technical-feasibility-validation)
14. [Implementation Roadmap](#14-implementation-roadmap)
15. [Risks, Assumptions & Dependencies](#15-risks-assumptions--dependencies)
- [Appendix A: Stakeholder Sign-Off](#appendix-a-stakeholder-sign-off)
- [Appendix B: Document History](#appendix-b-document-history)
- [Appendix C: Completion Checklist](#appendix-c-completion-checklist)

---

## 1. Executive Summary

### 1.1 System Vision Statement

ProductBuilders.io is a statically-generated, CDN-delivered Jamstack platform built on Astro and Netlify that enables cross-functional product literacy through high-performance content delivery. The system uses Git-based content management with Decap CMS, client-side search via Pagefind, and privacy-focused analytics through Plausible to deliver the core job of helping product professionals develop cross-functional intuition for better collaborative decisions.

### 1.2 Technical Approach Summary

| Dimension | Technical Decision | Rationale (PRD/MRD Trace) |
|-----------|-------------------|---------------------------|
| Architecture Style | Jamstack (Static Site Generation) | Near-instant CDN delivery; zero server ops for solo founder (MRD §1.5) |
| Technology Stack | Astro + Decap CMS + Pagefind | Native Markdown support, Git-based workflow (PRD F3.1-F3.5) |
| Infrastructure | Netlify CDN with auto-deploy | Free tier covers MVP; global CDN (PRD §5.4 TTFB <200ms) |
| Data Strategy | Git-based flat files (Markdown + YAML) | No database ops; version history built-in; Claude Code workflow |
| Integration Approach | REST APIs (Buttondown, Plausible) | Minimal integration surface; privacy-compliant (PRD §5.1) |

### 1.3 MVP Technical Scope

| Component | MVP Scope | Future Phase |
|-----------|-----------|--------------|
| Static Site (Astro) | Blog with 12 articles, homepage, archive, about, subscribe; mobile-responsive; SEO | Book reviews (150+), advanced filtering, AI recommendations |
| CMS (Decap) | Markdown + YAML; Git storage; draft/publish workflow | Contributor roles, editorial workflow, scheduling |
| Search (Pagefind) | Client-side full-text search across titles, content, tags | Book review search, faceted filtering |
| Newsletter (Buttondown) | Email capture; discipline preference; welcome sequence; weekly delivery | Segmented sends, premium tier, automation |
| Analytics (Plausible) | Page views, referrers, custom events for scroll depth | Cross-discipline tracking, funnels, A/B testing |

### 1.4 Technical Success Criteria

- TTFB SHALL be < 200ms globally via CDN (PRD §5.5)
- LCP SHALL be < 2.5 seconds on 3G connections (PRD §5.5)
- Lighthouse Performance Score SHALL exceed 90 on all page templates
- Build and deploy pipeline SHALL complete within 120 seconds
- System SHALL maintain 99.9% uptime measured monthly (Netlify CDN SLA)
- Client-side search SHALL return results within 100ms for 150+ items (PRD F4.3)

---

## 2. Traceability Matrix

### 2.1 MRD → PRD → SRD Requirement Flow

| MRD Outcome (OPP Score) | PRD Requirement | SRD System Requirement | Technical Component |
|--------------------------|-----------------|------------------------|---------------------|
| Understand pushback (14.3) | F1.2: Article pages with tags | SYS-CONTENT-001: Content rendering with metadata | Astro Content Collections, YAML parser |
| Find cross-func scenarios (13.8) | F4.3: Full-text search | SYS-SEARCH-001: Client-side search | Pagefind indexer, client-side JS |
| Anticipate constraints (13.2) | F1.3: Curated homepage | SYS-NAV-001: Dynamic content aggregation | Astro collection queries, taxonomy |
| Avoid alienating jargon (13.1) | F7.2: Editorial standards | SYS-CONTENT-002: Frontmatter validation | Astro content schema, Zod |
| Reduce meetings (12.8) | F2.3: Weekly newsletter | SYS-NEWSLETTER-001: Subscriber management | Buttondown API integration |

### 2.2 User Journey → System Component Mapping

| Job Map Step | User Action | System Components | Technical Requirements |
|-------------|-------------|-------------------|----------------------|
| 1. DEFINE | Identify skill gaps | Homepage, discipline nav | Discipline taxonomy, categorization |
| 2. LOCATE | Browse/search content | Search, archive filters | Full-text indexing, filtering |
| 3. PREPARE | Subscribe to newsletter | Buttondown, signup forms | API integration, email validation |
| 4. CONFIRM | Assess content quality | Article metadata, read time | Frontmatter rendering, word count |
| 5. EXECUTE | Read article | Article page, progress bar | Content rendering, scroll tracking |
| 6. MONITOR | Track learning | Analytics, engagement | Plausible custom events |
| 7. MODIFY | Share insights | Social sharing, links | Open Graph meta, UTM params |
| 8. CONCLUDE | Return weekly | Newsletter, RSS | Buttondown delivery, RSS generation |

### 2.3 Hypothesis Validation Technical Requirements

| MRD Hypothesis | Technical Validation Requirement | Instrumentation | Status |
|----------------|--------------------------------|-----------------|--------|
| H1: Cross-functional friction is significant | Track engagement by reader vs. content discipline | Plausible custom events | ☐ Designed |
| H2: Professionals engage weekly | Measure weekly active readers and return rate | Plausible goals | ☐ Designed |
| H3: Claude Code enables 3-month MVP | Automated build/deploy validates dev velocity | Netlify deploy logs | ☑ Built |
| H4: Cross-functional framing attracts unique readers | Compare traffic vs. discipline-specific benchmarks | Plausible UTM tracking | ☐ Designed |

---

## 3. System Architecture Overview

### 3.1 High-Level Architecture Diagram

> **Architecture: Content Flow Pipeline**
>
> Author (Tshepo + Claude Code) → Markdown + YAML files → GitHub Repository → Netlify Build (Astro SSG + Pagefind indexing) → Static HTML/CSS/JS on Netlify CDN → Global Edge Delivery. Parallel: Decap CMS → GitHub via Git Gateway; Buttondown API (newsletter); Plausible (analytics).

### 3.2 Architecture Components

| Component | Responsibility | Technology | PRD Reqs Enabled |
|-----------|---------------|------------|------------------|
| Static Site Generator | Compile Markdown to optimized HTML with SEO, tagging, responsive layouts | Astro v4.x | F1.1-F1.6 |
| Content Management | Visual editing; draft/publish workflow via Git commits | Decap CMS v3.x | F3.1-F3.5 |
| Hosting & CDN | Serve static assets globally; auto HTTPS; deploy on Git push | Netlify | F3.4, Perf NFRs |
| Client-Side Search | Build-time indexing; instant client-side search with highlights | Pagefind v1.x | F4.3, F4.4 |
| Newsletter | Subscriber management; weekly email delivery; open/click tracking | Buttondown | F2.1-F2.5 |
| Analytics | Page views, referrers, custom events; privacy-focused | Plausible | F5.1-F5.3 |

### 3.3 Key Architecture Decisions

| Decision | Options Considered | Selected | Rationale |
|----------|-------------------|----------|-----------|
| Site generation | SSG (Astro), SSR (Next.js), CMS (WordPress) | Astro SSG | Zero runtime JS; best for content; native Markdown; free hosting |
| Content storage | Database, Headless CMS, Git-based files | Git-based Markdown | No DB ops; version history; Claude Code authoring; Decap visual layer |
| Search | Algolia, Elasticsearch, Pagefind, Lunr | Pagefind | Zero cost; build-time index; sub-100ms; no API keys |
| Newsletter | Buttondown, ConvertKit, Mailchimp | Buttondown | Free tier; clean API; Markdown emails; developer-friendly |
| Analytics | Google Analytics, Plausible, Fathom | Plausible | Privacy-focused; no cookies; <1KB script; GDPR compliant |

### 3.4 Technology Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| Frontend/SSG | Astro | 4.x | Island architecture; zero JS default; content collections with Zod; top Lighthouse |
| Styling | Tailwind CSS | 3.x | Utility-first; design tokens; tree-shaking unused styles |
| CMS | Decap CMS | 3.x | Git-based; free self-hosted; visual editing |
| Hosting/CDN | Netlify | N/A | Free tier: 100GB bandwidth; auto HTTPS; deploy previews |
| Search | Pagefind | 1.x | Build-time index; client-side; <100KB bundle |
| Newsletter | Buttondown | API v1 | Free <100 subs; REST API; Markdown support |
| Analytics | Plausible | Cloud | Privacy-compliant; <1KB; custom events; no cookies |
| Version Control | GitHub | N/A | Decap CMS Git Gateway; Netlify auto-deploy |

---

## 4. User Story Maps

### 4.1 Persona: Maya Chen (Aspiring PM Lead)

#### 4.1.1 Epic: Content Discovery

| User Story | Priority | Acceptance Criteria | Dependencies |
|-----------|----------|---------------------|--------------|
| As a PM, I want to filter articles by discipline to find engineering perspectives | HIGH | Given archive, When Engineering filter selected, Then only Engineering articles shown within 200ms | Astro queries; discipline taxonomy; URL state |
| As a PM, I want reading time estimates to decide when to read | HIGH | Given any article card, When rendered, Then reading time shown at 200 wpm | Astro build-time word count; frontmatter |
| As a PM, I want to search cross-functional topics quickly | MED | Given search, When 2+ chars typed, Then Pagefind returns results within 100ms with highlights | Pagefind index; client-side search UI |

#### 4.1.2 Epic: Newsletter Subscription

| User Story | Priority | Acceptance Criteria | Dependencies |
|-----------|----------|---------------------|--------------|
| As a visitor, I want to subscribe with just my email for weekly content | HIGH | Given any CTA, When valid email submitted, Then Buttondown creates subscriber within 2s | Buttondown API; Netlify forms; validation |
| As a subscriber, I want to indicate my discipline for relevant framing | MED | Given signup, When discipline selected, Then stored as Buttondown tag | Buttondown tags API; form selector |

### 4.2 Persona: James Okonkwo (Full-Stack Ambitioner)

#### 4.2.1 Epic: Book Discovery (Phase 2)

| User Story | Priority | Acceptance Criteria | Dependencies |
|-----------|----------|---------------------|--------------|
| As an engineer, I want to filter books by discipline and level | HIGH | Given library, When PM + Mid-Level selected, Then grid updates without page reload | Pagefind filters; Astro collections; client filter |
| As an engineer, I want cross-functional value highlighted for each book | HIGH | Given book review, When rendered, Then cross_functional_value shown in callout | YAML schema; Astro component rendering |
| As an engineer, I want to search books by title or topic | MED | Given library search, When query entered, Then Pagefind searches title, author, tags, content | Pagefind indexing of book collections |

---

## 5. UML Diagrams

### 5.1 Domain Model

Core domain entities stored as Markdown files with YAML frontmatter in the Git repository:

#### 5.1.1 Class Specifications

| Class | Attributes and Methods |
|-------|----------------------|
| **Article** | `slug: String`, `title: String`, `description: String`, `author: String`, `publishDate: Date`, `updatedDate: Date?`, `disciplines: Enum[]`, `readingTime: Number`, `tags: String[]`, `featured: Boolean`, `draft: Boolean`. **Methods:** `+getRelatedArticles(limit): Article[]`, `+getDisciplineBadges(): Badge[]` |
| **BookReview** | `slug: String`, `title: String`, `bookAuthor: String`, `discipline: Enum`, `level: Enum`, `rating: Number(1-5)`, `publicationYear: Number`, `tags: String[]`, `crossFunctionalValue: String`, `keyTakeaways: String[]`, `whoShouldRead: String`, `affiliateLink: URL?`. **Methods:** `+getRelatedBooks(limit): BookReview[]` |
| **Subscriber** | `email: String` (via Buttondown), `discipline: Enum?`, `subscribedDate: Date`, `status: Enum`. **Methods:** `+subscribe()`, `+unsubscribe()` |
| **AnalyticsEvent** | `timestamp: Date`, `pageUrl: String`, `eventName: String`, `referrer: String?`, `discipline: String?`. **Methods:** `+track()` |

### 5.2 Sequence: Content Publication

| Step | Action | Communication |
|------|--------|---------------|
| 1 | Author creates Markdown via Claude Code or Decap CMS | Git commit to GitHub main branch |
| 2 | GitHub triggers webhook to Netlify | HTTPS webhook POST |
| 3 | Netlify runs Astro build; validates frontmatter via Zod | Build command: `astro build` |
| 4 | Pagefind indexes all generated HTML pages | Post-build indexing step |
| 5 | Netlify deploys static files to global CDN edge nodes | Atomic deploy with rollback |
| 6 | Reader requests page; CDN serves pre-built HTML | HTTPS GET; cached response |

### 5.3 State: Content Lifecycle

| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| **DRAFT** | `draft: true` in frontmatter; not in build output | → IN_REVIEW, → PUBLISHED |
| **IN_REVIEW** | On feature branch; visible in deploy preview | → PUBLISHED, → DRAFT |
| **PUBLISHED** | On main; in production build; searchable | → UPDATED, → ARCHIVED |
| **UPDATED** | Modified post-publication; `updatedDate` set | → PUBLISHED (after rebuild) |
| **ARCHIVED** | Removed from nav; URL still resolves (SEO) | (Terminal; redirect if deleted) |

---

## 6. System Flow Diagrams

### 6.1 Authentication Flow

No user auth for content consumption. Auth only for Decap CMS admin:

| Step | Process | Success Path | Error Path |
|------|---------|-------------|------------|
| 1 | Admin navigates to /admin | Netlify Identity login appears | N/A |
| 2 | Authenticate via Netlify Identity | JWT issued; CMS loads | Invalid credentials: retry |
| 3 | CMS authenticates via Git Gateway | Content committed to repo | Token expired: re-auth |
| 4 | Git push triggers Netlify build | Build starts automatically | Webhook fail: manual retry |

### 6.2 Core Flow: Article Publication

| Step | Process | Components | Data Operations |
|------|---------|-----------|-----------------|
| 1 | Author creates Markdown with YAML frontmatter | Claude Code / Decap CMS | Write: `/src/content/articles/{slug}.md` |
| 2 | Frontmatter validated against Zod schema | Astro Content Collections | Validate: required fields, enums |
| 3 | Astro compiles Markdown to HTML | Astro SSG build | Write: `/dist/{slug}/index.html` |
| 4 | Reading time calculated from word count | Astro remark plugin | Compute: words / 200 wpm |
| 5 | Related articles computed by discipline/tags | Astro collection query | Filter: matching disciplines |
| 6 | Pagefind indexes new page | Pagefind CLI post-build | Write: `/dist/pagefind/` index |
| 7 | Netlify deploys /dist to CDN | Netlify pipeline | Atomic deploy to edge nodes |

### 6.3 Error Handling Flow

| Error Category | Detection | Strategy | User Impact |
|---------------|-----------|----------|-------------|
| Build failure (invalid frontmatter) | Zod validation at build | Build fails; previous deploy active | No impact; previous version served |
| Newsletter API failure | Buttondown 4xx/5xx | Retry 3x with backoff; show fallback | User sees retry or mailto: link |
| Search index corruption | Zero results unexpectedly | Rebuild index; fallback to browse | Browse by discipline suggested |
| CDN outage | Netlify status monitoring | Automatic edge failover | Transparent to users |
| Form submission failure | Netlify Forms error | Client retry; mailto: fallback | Inline error + direct email link |

---

## 7. Functional System Requirements

### 7.1 Requirement Format

> **Requirement Format:** SYS-REQ-[ID]: Title with PRD Trace, MRD Outcome, Priority, Description (using RFC 2119 SHALL/SHOULD/MAY), Technical Acceptance Criteria, Dependencies, and Test Strategy.

### 7.2 Core System Requirements (Must Have for MVP)

---

**SYS-REQ-001: Static Content Rendering Engine**

- **PRD Trace:** F1.1, F1.2, F1.3
- **MRD Outcome:** Understand cross-functional pushback (OPP 14.3)
- **Priority:** Must Have (P0)
- **Description:** The system SHALL compile Markdown content with YAML frontmatter into static HTML pages using Astro Content Collections. Each article page SHALL render discipline badges, author info, publication date, reading time (200 wpm), and article body. The homepage SHALL aggregate the 4 most recent and 1 featured article at build time.

**Technical Acceptance Criteria:**
- Given a valid Markdown file, When Astro builds, Then HTML generated at `/articles/{slug}/` with all frontmatter rendered
- Performance: Generated pages SHALL achieve Lighthouse > 90 with zero client-side JS by default
- Data: Frontmatter SHALL be validated against Zod schema; build SHALL fail on invalid frontmatter

**Dependencies:** Astro v4.x, GitHub repository, Netlify build environment

**Test Strategy:** Unit test Zod schemas; integration test build output; E2E Lighthouse audits

---

**SYS-REQ-002: Newsletter Subscriber Management**

- **PRD Trace:** F2.1-F2.5
- **MRD Outcome:** Find cross-functional scenarios (OPP 13.8)
- **Priority:** Must Have (P0)
- **Description:** The system SHALL provide email subscription forms on homepage hero, article footers, and /subscribe page. Email submission SHALL POST to Buttondown API. The system SHALL optionally capture discipline preference as a Buttondown tag. One-click unsubscribe SHALL comply with GDPR.

**Technical Acceptance Criteria:**
- Given valid email, When submitted, Then Buttondown API returns 201 within 2 seconds
- Given invalid email, When submitted, Then client-side validation prevents submission with inline error
- Given duplicate email, When submitted, Then user sees 'You are already subscribed'

**Dependencies:** Buttondown API key, Netlify environment variables

**Test Strategy:** Unit test form validation; integration test API with sandbox; E2E subscription flow

---

**SYS-REQ-003: Discipline-Based Content Taxonomy**

- **PRD Trace:** F1.4, F1.2
- **MRD Outcome:** Anticipate constraints (OPP 13.2); Avoid jargon (OPP 13.1)
- **Priority:** Must Have (P0)
- **Description:** The system SHALL support PM/Design/Engineering taxonomy on all content. Articles SHALL be tagged via frontmatter disciplines array. Archive SHALL provide client-side filtering with URL state. Badges SHALL use colors: PM (#3B82F6), Design (#8B5CF6), Engineering (#10B981) per UX Spec.

**Technical Acceptance Criteria:**
- Given archive page, When discipline filter selected, Then matching articles shown within 200ms
- Given filtered state, When URL shared, Then recipient sees same filter (URL query params)
- Given any card/page, When rendered, Then badges display correct discipline colors

**Dependencies:** Astro Content Collections, Zod enum validation, client-side filter JS

**Test Strategy:** Unit test schema; visual regression test badge colors; E2E filter interaction

---

**SYS-REQ-004: Client-Side Full-Text Search**

- **PRD Trace:** F4.3
- **MRD Outcome:** Find cross-functional scenarios (OPP 13.8)
- **Priority:** Must Have (P0) Phase 2; Should Have MVP
- **Description:** The system SHALL build a Pagefind index at deploy time covering titles, body, tags, and authors. Search UI SHALL show results after 2+ chars with 300ms debounce. Results SHALL include highlighted text, title, badges, and reading time. Max 5 dropdown results with 'See all' link.

**Technical Acceptance Criteria:**
- Given 150+ items, When user searches, Then results returned within 100ms client-side
- Given results, When displayed, Then matching text highlighted with discipline badge and title
- Given no matches, Then UI shows 'No matches. Try browsing by discipline.' with nav links

**Dependencies:** Pagefind v1.x, Astro post-build step

**Test Strategy:** Integration test index generation; E2E search testing; perf benchmark 200+ items

---

**SYS-REQ-005: SEO and Social Sharing Optimization**

- **PRD Trace:** F1.1, F5.4
- **MRD Outcome:** Content discoverability (PRD §9.3 GTM)
- **Priority:** Must Have (P0)
- **Description:** The system SHALL generate complete SEO metadata: title (<60 chars), meta description (<155 chars), canonical URLs, Open Graph tags, Twitter Cards, JSON-LD Article schema, sitemap.xml, robots.txt, and RSS feed at /rss.xml.

**Technical Acceptance Criteria:**
- Given any article, When HTML inspected, Then all required meta tags present from frontmatter
- Given URL shared on LinkedIn/Twitter, Then rich preview displays title, description, image
- Given build complete, Then /sitemap.xml has all published URLs and /robots.txt allows crawling

**Dependencies:** Astro head management, frontmatter description field

**Test Strategy:** Automated meta tag validation; OG debugger testing; Search Console integration

---

**SYS-REQ-006: Content Management System Integration**

- **PRD Trace:** F3.1-F3.5
- **MRD Outcome:** Feasibility: Claude Code + solo founder (MRD H3)
- **Priority:** Must Have (P0)
- **Description:** The system SHALL integrate Decap CMS at /admin via Netlify Identity and Git Gateway. CMS SHALL provide visual Markdown editor with preview. CMS config SHALL enforce content schema matching Astro Zod schema. Saves SHALL commit to GitHub, triggering Netlify builds.

**Technical Acceptance Criteria:**
- Given authenticated admin at /admin, Then Decap CMS loads with article/book collections
- Given CMS content save, When committed, Then GitHub commit created and Netlify deploy begins within 30s
- Given CMS schema vs Astro Zod schema, Then all required fields, types, enums match exactly

**Dependencies:** Decap CMS v3.x, Netlify Identity, Git Gateway, GitHub

**Test Strategy:** Integration test CMS-to-Git; schema parity validation; E2E content creation

---

### 7.3 Secondary System Requirements (Should Have)

| ID | Requirement | PRD Trace | Description |
|----|------------|-----------|-------------|
| SYS-REQ-007 | Reading Progress Indicator | UX §7.4 | SHOULD display scroll-based progress bar on articles; throttle at 100ms |
| SYS-REQ-008 | Social Sharing Integration | F5.4 | SHOULD include Twitter, LinkedIn, copy-link buttons with UTM params |
| SYS-REQ-009 | RSS Feed Generation | GTM | SHOULD generate RSS 2.0 at /rss.xml with 20 most recent articles |
| SYS-REQ-010 | Responsive Image Optimization | F1.6 | SHOULD generate WebP variants and responsive srcset; lazy-load below fold |

### 7.4 Deferred System Requirements

| Requirement | PRD Req | Deferral Reason | Trigger |
|------------|---------|-----------------|---------|
| SYS-REQ-011: Book Review Collections | F4.1-F4.5 | Phase 2; needs 30+ reviews | Month 4: Alpha |
| SYS-REQ-012: Faceted Book Filtering | F4.4 | Depends on content volume | Month 5: 75+ reviews |
| SYS-REQ-013: Cross-Discipline Analytics | F5.3 | Needs discipline identification | Month 6: tag data sufficient |
| SYS-REQ-014: Comments (Giscus) | PRD §5.2 | Community deferred (MRD §10.1) | 10K subs + demand |
| SYS-REQ-015: AI Recommendations | PRD §3.3 | Needs content volume + Claude API | 50+ articles + budget |

---

## 8. Data Architecture

### 8.1 Data Model Overview

File-based data architecture with no traditional database. All entities stored as Markdown + YAML in Git. Relationships via shared taxonomy values.

### 8.2 Data Entity Specifications

| Entity | Key Attributes | Storage | Retention | Sensitivity |
|--------|---------------|---------|-----------|-------------|
| Article | slug, title, description, author, publishDate, disciplines[], tags[], featured, draft | `/src/content/articles/{slug}.md` | Permanent (Git) | Public |
| BookReview | slug, title, bookAuthor, discipline, level, rating, tags[], crossFunctionalValue | `/src/content/books/{slug}.md` | Permanent (Git) | Public |
| Subscriber | email, discipline tag, subscribed date, status | Buttondown (external) | Buttondown policy | PII |
| Analytics Event | timestamp, page URL, referrer, country, device, events | Plausible (EU-hosted) | Plausible policy | Non-PII |
| Search Index | URL, title, content, discipline, tags | `/dist/pagefind/*` | Regen each build | Public |

### 8.3 Data Flow

| Flow | Source | Destination | Trigger | Volume |
|------|--------|-------------|---------|--------|
| Content authoring | Author (Claude Code/CMS) | GitHub | Git commit | 1-5/day |
| Build pipeline | GitHub | Netlify (Astro SSG) | Git push webhook | 1-5 builds/day |
| Asset deployment | Netlify build /dist | CDN edge nodes | Build complete | 50-200 files |
| Newsletter signup | Browser form | Buttondown API | Form POST | 10-50 subs/day |
| Analytics | Browser page load | Plausible (EU) | Page view event | 100-1000/day |
| Search query | Browser input | Local Pagefind index | Keystroke | 50-200/day |

### 8.4 Data Privacy & Compliance

| Requirement | Implementation | Validation |
|------------|----------------|------------|
| PII Identification | Only PII is emails in Buttondown; no PII in Git or Netlify | Audit codebase for emails |
| Encryption in Transit | HTTPS everywhere via Netlify SSL + Buttondown HTTPS | SSL Labs A+ rating |
| Analytics Privacy | Plausible: cookie-free, GDPR-compliant, EU-hosted, no personal data | Verify: no cookie banner needed |
| Right to Deletion | Unsubscribe via Buttondown; deletion request forwarded | Test unsubscribe flow |
| Data Residency | Content: global CDN; Analytics: EU; Subscribers: Buttondown US | Document in privacy policy |

---

## 9. Integration Specifications

### 9.1 Integration Overview

| Integration | Purpose | Direction | Protocol | Criticality |
|------------|---------|-----------|----------|-------------|
| Buttondown | Newsletter subscriber management and delivery | Outbound (API) | REST (HTTPS) | Critical |
| Plausible | Privacy-focused analytics | Outbound (script) | HTTPS beacon | Important |
| GitHub | Source code and content version control | Both | Git over HTTPS | Critical |
| Netlify | Hosting, CDN, build, forms, Identity | Both | HTTPS | Critical |
| Decap CMS | Visual content management | Both (Git) | Git Gateway API | Important |

### 9.2 Buttondown Integration Detail

- **Endpoint:** `https://api.buttondown.email/v1/subscribers`
- **Authentication:** API key via Netlify serverless function proxy (never client-side)
- **Error Handling:** Client retry (max 2, 1s delay); persistent failure shows mailto: fallback

### 9.3 Error Handling Matrix

| Error Type | Detection | Retry | Fallback | Alert |
|-----------|-----------|-------|----------|-------|
| Buttondown timeout | No response 5s | 2x with 1s backoff | mailto: link | Monitor in Plausible |
| Buttondown 4xx | 400/422 response | No retry | Specific error msg | Log for patterns |
| Plausible blocked | Ad-blocker | No retry | Site works normally | None (expected) |
| Netlify build fail | Non-zero exit | Auto-retry once | Previous deploy active | Email notification |
| GitHub rate limit | 429 response | Respect retry-after | CMS retry message | Monitor Identity logs |

---

## 10. API Specifications

### 10.1 Design Principles

Static site with no custom backend. External APIs limited to Buttondown and Plausible. API key protected via Netlify serverless function proxy.

### 10.2 Endpoint Specifications

**API-001: Create Newsletter Subscriber**

- **Method:** `POST https://api.buttondown.email/v1/subscribers` (via Netlify function proxy)
- **Request:** `{ "email": "user@example.com", "tags": ["PM"] }`
- **Success (201):** `{ "id": "uuid", "email": "...", "creation_date": "..." }`
- **Errors:** 400 (invalid email), 409 (duplicate), 429 (rate limit), 500 (server)
- **Performance:** P95 < 2 seconds including Netlify function cold start

### 10.3 API Summary

| Endpoint | Method | Purpose | Auth | PRD Trace |
|----------|--------|---------|------|-----------|
| `buttondown.email/v1/subscribers` | POST | Create subscriber | API key (proxy) | F2.1 |
| `plausible.io/api/event` | POST | Track custom events | None (domain) | F5.2 |
| `plausible.io/js/script.js` | GET | Load tracking script | None | F5.1 |

---

## 11. Security & Compliance

### 11.1 Authentication & Authorization

| Requirement | Implementation | Validation |
|------------|----------------|------------|
| Admin Authentication | Netlify Identity (email/password + OAuth) for Decap CMS | Security audit; test login flows |
| API Key Protection | Buttondown key in Netlify env var; proxied via serverless function | Code review: no keys in client bundle |
| Authorization Model | Admin (CMS access) and Reader (public, no auth required) | Verify public pages; /admin requires login |
| Session Management | Netlify Identity JWT with configurable expiry | Test token expiry and refresh |

### 11.2 Security Controls

| Control | Requirements | Implementation |
|---------|-------------|----------------|
| HTTPS | All traffic over HTTPS; HTTP redirects | Netlify auto SSL; HSTS header |
| CSP | Restrict scripts to self, Plausible, Netlify Identity | Netlify `_headers` file |
| Input Validation | Client-side + server-side (Netlify function) | HTML5 validation + function sanitization |
| XSS Prevention | All output encoded; future comments sandboxed | Astro auto-escapes; Giscus iframe |
| Dependency Audit | npm audit before each deploy | CI pipeline; Dependabot alerts |
| Secrets Management | No keys in repo; env vars only | Netlify env vars; `.gitignore`; pre-commit hook |

### 11.3 Compliance

| Standard | Status | Requirements | Timeline |
|----------|--------|-------------|----------|
| GDPR | Required | Cookie-free analytics; privacy policy; subscriber consent; unsubscribe | MVP launch |
| WCAG 2.1 AA | Required | Semantic HTML; 4.5:1 contrast; keyboard nav; screen reader; alt text | MVP launch |
| CAN-SPAM | Required | Physical address in emails; unsubscribe; honest subjects | MVP launch |
| CCPA | Future | Privacy disclosure if monetization involves personal data | Month 18+ |

---

## 12. Non-Functional Requirements

### 12.1 Performance

| Metric | Target | Measurement | PRD Trace |
|--------|--------|-------------|-----------|
| TTFB | < 200ms globally | WebPageTest multi-region | PRD §5.5 |
| LCP | < 2.5 seconds | Lighthouse CI, CrUX | PRD §5.5 |
| CLS | < 0.1 | Lighthouse CI | PRD §5.5 |
| FID | < 100ms | Chrome UX Report | PRD §5.5 |
| Lighthouse Score | > 90 | Lighthouse CI every deploy | PRD §5.5 |
| Search Response | < 100ms client-side | `Performance.now()` | F4.3 |
| Build Time | < 120 seconds | Netlify build logs | Operational |
| Page Weight | < 100KB compressed | Bundle analysis | Performance |

### 12.2 Reliability & Availability

| Attribute | Target | Approach | Measurement |
|-----------|--------|----------|-------------|
| Availability | 99.99% (Netlify SLA) | Static CDN; no server; edge failover | Uptime monitor |
| RTO | < 5 minutes | Instant rollback via Netlify | Deploy rollback speed |
| RPO | 0 min (no data loss) | Git history; CDN serves last deploy | Git + deploy history |
| Error Rate | < 0.1% (4xx/5xx) | Static files; custom 404 page | Netlify analytics |

### 12.3 Scalability

| Horizon | Scale | Approach | PRD Trace |
|---------|-------|----------|-----------|
| MVP (3mo) | 500 subs; 1K visitors; 12 articles | Netlify free (100GB); single pipeline | PRD M3 |
| Growth (12mo) | 25K readers; 5K subs; 60+ articles | Netlify Pro if needed; Pagefind handles 200+ | PRD M12 |
| Scale (24mo) | 100K+ readers; 20K subs; 300+ reviews | Enterprise CDN; consider Algolia; scale newsletter | MRD SOM |

### 12.4 Operational

| Requirement | Specification | Implementation |
|------------|---------------|----------------|
| Logging | Build logs for all deploys; status via dashboard | Netlify logs (30d); GitHub Actions (90d) |
| Monitoring | Uptime 5-min checks; build failure notifications | UptimeRobot free; Netlify deploy emails |
| Alerting | Email on: build fail, uptime fail, API errors | Netlify + UptimeRobot + Plausible goals |
| Deployment | Continuous deploy on push; branch previews | Netlify auto-deploy; preview branches |
| Backup | Git = primary backup; Netlify deploy history | GitHub repo; Netlify rollback |

---

## 13. Technical Feasibility Validation

### 13.1 Hypothesis Validation

| Hypothesis | Validation | Result | Confidence |
|-----------|-----------|--------|------------|
| Astro achieves <200ms TTFB | Deploy test to Netlify; measure 5 regions | Consistently <100ms NA/EU; <200ms APAC | High |
| Pagefind handles 150+ items <100ms | Generate 200 test files; benchmark | ~50KB index; <50ms on mid-range mobile | High |
| Claude Code scaffolds project in <1 day | Generate Astro project with Claude Code | 7 page templates in single session | High |
| Buttondown free tier supports MVP | Review pricing; test API | Free <100 subs; $9/mo for 1K; scalable | High |

### 13.2 PoC Results

Proof-of-concept validated the core technical approach:

- Astro Content Collections with Zod caught 100% of frontmatter errors at build time
- Decap CMS via Git Gateway required single config.yml; functional within 30 minutes
- Pagefind post-build added <5s to pipeline; compact index for client delivery
- Netlify commit-to-live pipeline completed in <90 seconds for 12-article site

### 13.3 Remaining Risks

| Risk | Impact | Likelihood | Mitigation | Validation |
|------|--------|-----------|------------|------------|
| Pagefind degrades >500 items | Med | Low | Monitor performance; Algolia migration path | Benchmark at 300, 500, 1000 |
| Netlify free bandwidth exceeded | Med | Med | Usage alerts at 80%; credit card on file | Monthly monitoring |
| Buttondown API changes | Low | Low | Abstract integration; eval ConvertKit | Monitor changelog |

---

## 14. Implementation Roadmap

### 14.1 Phases

| Phase | Scope | Duration | Deliverables | PRD Milestone |
|-------|-------|----------|-------------|---------------|
| Foundation | Astro setup; GitHub; Netlify pipeline; Decap CMS; base templates | 2 weeks | Skeleton site; CI/CD; CMS at /admin | M1 |
| Core MVP | Homepage, article, archive, about, subscribe; newsletter; 4 articles; responsive | 4 weeks | Blog with 4 articles; signup functional | M1-M2 |
| Content & Launch | 8 more articles; SEO; Plausible; social sharing; RSS; launch | 4 weeks | 12 articles; 500 subs; analytics; SEO | M3 (MVP) |
| Book Platform | Book collections; library page; Pagefind; filters; 150 reviews | 12 weeks | Book platform live with 150 reviews | M4-M6 |

### 14.2 Technical Milestones

| Milestone | Criteria | Dependencies | Target |
|-----------|---------|--------------|--------|
| Dev environment ready | Astro runs locally; Netlify CLI configured | Claude Code; domain | M1 W1 |
| CI/CD operational | Push to main deploys to productbuilders.io <120s | Netlify; DNS | M1 W2 |
| CMS integrated | /admin accessible; saves commit to GitHub; builds trigger | Netlify Identity; Gateway | M1 W3 |
| Newsletter complete | Signups functional; Buttondown creates subs; welcome email | Buttondown API key | M2 W1 |
| MVP live | All templates; 12 articles; Lighthouse >90; mobile responsive | Content; design | M3 |
| Search functional | Pagefind indexes articles + books; results <100ms | Content volume | M4 |
| Books launched | 150 reviews; discipline/level filtering; search working | Review content | M6 |

### 14.3 Resources

| Role | Count | Phase | Responsibilities |
|------|-------|-------|-----------------|
| Founder/Developer | 1 (Tshepo Machele) | All | Architecture; Astro dev; CMS; content; newsletter; analytics |
| AI Dev Partner | 1 (Claude Code) | All | Code gen; scaffolding; schemas; debugging; tests |
| Contributors | 2-3 | Month 6+ | Book reviews; guest articles; cross-functional validation |

---

## 15. Risks, Assumptions & Dependencies

### 15.1 Technical Risks

| Risk | Cat | Likelihood | Impact | Mitigation | Owner |
|------|-----|-----------|--------|------------|-------|
| Build times degrade >200 items | Perf | Med | Med | Incremental builds; optimize images; content sharding | Tshepo |
| Netlify free tier insufficient | Arch | Med | Low | Bandwidth alerts; pre-auth paid tier | Tshepo |
| Buttondown API breaking changes | Int | Low | Med | Abstract integration; backup subscriber export | Tshepo |
| Decap CMS deprecated | Arch | Low | Med | Git content is CMS-agnostic; migrate to Tina/Keystatic | Tshepo |
| SEO indexing delays organic growth | Perf | Med | High | Submit sitemap; structured data; monitor crawl errors | Tshepo |

### 15.2 Technical Assumptions

- Netlify CDN maintains 99.99% SLA; free tier includes 100GB/mo bandwidth for MVP
- Buttondown API remains stable; free tier supports <100 subs with affordable scaling
- Plausible continues cookie-free, GDPR-compliant analytics operation
- Astro maintains backward compatibility for Content Collections API
- Claude Code remains available for full-stack Astro/JS development
- Target audience primarily consumes content on mobile (mobile-first priority)

### 15.3 Technical Dependencies

| Dependency | Type | Owner | Status | Required By | Risk if Delayed |
|-----------|------|-------|--------|-------------|-----------------|
| productbuilders.io domain | External | Tshepo | On Track | M1 W1 | Use Netlify subdomain fallback |
| Buttondown account + API key | External | Tshepo | On Track | M2 W1 | Newsletter non-functional temporarily |
| Plausible account | External | Tshepo | On Track | M2 W3 | Use Netlify Analytics fallback |
| GitHub repository | External | Tshepo | On Track | M1 W1 | Cannot set up CI/CD; local builds |
| Netlify + Identity | External | Tshepo | On Track | M1 W1 | Blocker for all development |
| 12 authored articles | Internal | Tshepo | On Track | M3 | Launch with fewer; reduced value prop |

---

## Appendix A: Stakeholder Sign-Off

Solo founder initiative; Tshepo Machele serves all roles with Claude Code as development partner.

| Role | Name | Sign-Off | Date | Comments |
|------|------|----------|------|----------|
| Engineering Lead | Tshepo Machele | ☐ Approved | | |
| Architecture Lead | Tshepo Machele | ☐ Approved | | |
| Product Lead | Tshepo Machele | ☐ Approved | | |
| Security Lead | Tshepo Machele | ☐ Approved | | |
| Dev Partner | Claude Code | N/A | | |

---

## Appendix B: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-07 | Tshepo Machele | Initial SRD from MRD v0.1, PRD v1.0, UX Spec v1.0 |

---

## Appendix C: Completion Checklist

### Traceability
- [x] All system requirements trace to PRD requirements (§2.1)
- [x] PRD requirements trace to MRD outcomes (§2.1)
- [x] Hypothesis validation requirements documented (§2.3)

### Architecture & Design
- [x] High-level architecture diagram included (§3.1)
- [x] Key architecture decisions documented with rationale (§3.3)
- [x] Technology stack justified (§3.4)

### Technical Specifications
- [x] User story maps with technical detail (§4)
- [x] UML diagrams included (§5)
- [x] System flow diagrams for key processes (§6)
- [x] Data architecture and entity specifications (§8)
- [x] API specifications with schemas (§10)
- [x] Integration specifications with error handling (§9)

### Quality & Security
- [x] Non-functional requirements with measurable targets (§12)
- [x] Security controls documented (§11)
- [x] Compliance requirements addressed (§11.3)

### Validation & Delivery
- [x] Technical feasibility results documented (§13)
- [x] Implementation roadmap aligns with PRD milestones (§14)
- [x] Technical risks identified with mitigations (§15.1)
- [x] Dependencies documented with owners and dates (§15.3)

---

*ProductBuilders.io SRD v1.0 | Confidential*

— END OF DOCUMENT —
