# Domain Model — ProductBuilders.io

> **Purpose:** Define the domain-driven design structure for ProductBuilders.io, including bounded contexts, aggregates, entities, value objects, and domain events. This document serves as the authoritative reference for domain language and boundaries.

---

## 1. Domain Overview

**Business Domain:** Professional Development / Content Publishing

**Problem Space:**
Product builders (designers, engineers, and product managers) struggle to develop holistic product thinking skills because existing knowledge resources are siloed by discipline. This results in cross-functional friction, longer alignment cycles, and products that fail to balance technical feasibility, user desirability, and business viability. 78% of product knowledge content remains single-discipline focused (MRD §1.1).

**Solution Space:**
ProductBuilders.io delivers integrated cross-functional perspectives through a blog, newsletter, and curated book review library. Every content piece surfaces how design, engineering, and product decisions interconnect, enabling product builders to develop shared vocabulary and mutual understanding. The platform is built as a Jamstack static site with Git-based content, external newsletter management, and privacy-focused analytics.

**Domain Complexity Level:** Simple to Complicated (content publishing with structured taxonomy, no transactional complexity)

---

## 2. Strategic Design

### 2.1 Bounded Contexts

| Bounded Context | Responsibility | Owner/Team | Upstream Dependencies | Downstream Consumers |
|-----------------|----------------|------------|----------------------|----------------------|
| Content Publishing | Article and book review authoring, validation, rendering, and delivery via static site generation | Tshepo Machele + Claude Code | None | Newsletter, Search, Analytics |
| Newsletter / Subscriber | Subscriber acquisition, preference capture, email delivery, unsubscribe management | Tshepo Machele | Content Publishing (content for emails) | Analytics |
| Search / Discovery | Full-text indexing, client-side search, discipline/level filtering | Tshepo Machele | Content Publishing (content to index) | Analytics |
| Analytics / Engagement | Page views, scroll depth, custom events, cross-discipline tracking | Tshepo Machele | Content Publishing, Newsletter, Search | None (terminal) |
| CMS / Authoring | Visual editing interface, draft/publish workflow, Git commits | Tshepo Machele | None | Content Publishing (via Git) |

### 2.2 Context Map

```
┌─────────────────┐
│  CMS / Authoring│
│  (Decap CMS)    │
└────────┬────────┘
         │ Git commit
         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    Content      │─────▶│    Search /     │─────▶│   Analytics /   │
│   Publishing    │      │   Discovery     │      │   Engagement    │
│   (Astro SSG)   │      │  (Pagefind)     │      │  (Plausible)    │
└────────┬────────┘      └─────────────────┘      └─────────────────┘
         │                                                ▲
         │ Content for emails                             │
         ▼                                                │
┌─────────────────┐                                       │
│  Newsletter /   │───────────────────────────────────────┘
│   Subscriber    │       Signup events, open/click tracking
│  (Buttondown)   │
└─────────────────┘
```

### 2.3 Context Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| CMS → Content Publishing | Published Language | CMS produces Markdown+YAML files conforming to Zod schemas; Astro consumes them at build time |
| Content Publishing → Search | Customer/Supplier | Astro build produces HTML; Pagefind indexes it post-build |
| Content Publishing → Newsletter | Conformist | Newsletter content curated from published articles; Buttondown receives via manual curation or API |
| Content Publishing → Analytics | Published Language | Pages include Plausible script; custom events defined by Content Publishing |
| Newsletter → Analytics | Published Language | Signup events tracked via Plausible custom events |
| Search → Analytics | Published Language | Search queries tracked via Plausible custom events |

**Key Insight: No shared database.** Each context has its own data store — Git (content), Buttondown (subscribers), Plausible (events), Pagefind (search index). This eliminates coupling and simplifies operations for a solo founder.

---

## 3. Tactical Design by Bounded Context

### 3.1 Content Publishing

**Context Purpose:** Author, validate, build, and serve cross-functional articles and book reviews as static HTML pages optimized for performance and SEO.

**Module/Package Location:** `src/content/`, `src/pages/`, `src/layouts/`, `src/components/`

#### Aggregates

| Aggregate Root | Invariants Protected | Child Entities | Lifecycle |
|----------------|---------------------|----------------|-----------|
| Article | Must have ≥1 discipline tag; must have title, description, author, publishDate; readingTime auto-calculated; description <155 chars; title <60 chars | None (flat content) | Draft → In Review (preview branch) → Published → Updated → Archived |
| BookReview | Must have exactly 1 discipline; must have exactly 1 level; rating 1–5; must include cross_functional_value; publication_year ≤ current year - 5 | None (flat content) | Draft → Published → Updated → Archived |

#### Entities

| Entity | Identity | Key Attributes | Belongs To |
|--------|----------|----------------|------------|
| Article | slug (derived from filename) | title, description, author, publishDate, updatedDate, disciplines[], readingTime, tags[], featured, draft | Aggregate Root |
| BookReview | slug (derived from filename) | title, bookAuthor, discipline, level, rating, publicationYear, tags[], crossFunctionalValue, keyTakeaways[], whoShouldRead, affiliateLink | Aggregate Root |

#### Value Objects

| Value Object | Attributes | Validation Rules | Used By |
|--------------|------------|------------------|---------|
| Discipline | value: Enum | Must be one of: "PM", "Design", "Engineering" | Article, BookReview |
| CareerLevel | value: Enum | Must be one of: "Junior", "Mid-Level", "Senior" | BookReview |
| Rating | value: Number | Integer 1–5 inclusive | BookReview |
| ReadingTime | minutes: Number | Computed at build: word count / 200 wpm; rounded | Article |
| DisciplineBadge | discipline: Discipline, color: HexColor, lightBg: HexColor, textColor: HexColor | Colors must match UX Spec §4.3 | Article, BookReview |
| SEOMetadata | title: String, description: String, canonicalUrl: URL, ogImage: URL | title <60 chars; description <155 chars | Article, BookReview |
| CrossFunctionalValue | value: String | Non-empty; describes why other disciplines benefit | BookReview |

#### Content Schemas (Zod — enforced at build time)

**Article Schema:**

```typescript
// src/content/config.ts
const articleSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  author: z.string().default("Tshepo Machele"),
  publishDate: z.date(),
  updatedDate: z.date().optional(),
  disciplines: z.array(z.enum(["PM", "Design", "Engineering"])).min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});
```

**Book Review Schema:**

```typescript
const bookReviewSchema = z.object({
  title: z.string(),
  bookAuthor: z.string(),
  discipline: z.enum(["PM", "Design", "Engineering"]),
  level: z.enum(["Junior", "Mid-Level", "Senior"]),
  rating: z.number().int().min(1).max(5),
  publicationYear: z.number().int().max(new Date().getFullYear() - 5),
  tags: z.array(z.string()).default([]),
  crossFunctionalValue: z.string().min(1),
  keyTakeaways: z.array(z.string()).min(3).max(5),
  whoShouldRead: z.string(),
  affiliateLink: z.string().url().optional(),
  draft: z.boolean().default(false),
});
```

#### Domain Events (Build-Time / Analytics)

| Event Name | Triggered When | Payload | Consumers |
|------------|----------------|---------|-----------|
| ArticlePublished | New article merged to main; build succeeds | slug, title, disciplines[], publishDate | Search (reindex), Newsletter (manual curation) |
| BookReviewPublished | New book review merged to main | slug, title, discipline, level | Search (reindex) |
| FrontmatterValidationFailed | Zod schema rejects content during build | filename, errors[] | Build pipeline (fail build) |
| BuildCompleted | Astro build + Pagefind index finishes | pageCount, buildDuration, deployUrl | Netlify (atomic deploy) |

#### Repository Interfaces (Astro Content Collections)

| Repository | Aggregate | Key Methods |
|------------|-----------|-------------|
| ArticleCollection | Article | `getCollection('articles')`, `getEntry('articles', slug)`, filter by discipline/tag/featured |
| BookReviewCollection | BookReview | `getCollection('books')`, `getEntry('books', slug)`, filter by discipline/level/tag |

---

### 3.2 Newsletter / Subscriber

**Context Purpose:** Manage subscriber acquisition, discipline preferences, welcome sequences, and weekly newsletter delivery via Buttondown.

**Module/Package Location:** `functions/newsletter-signup.ts`, `src/components/NewsletterCTA.astro`

#### Aggregates

| Aggregate Root | Invariants Protected | Child Entities | Lifecycle |
|----------------|---------------------|----------------|-----------|
| Subscriber | Email must be valid format; email must be unique in Buttondown; discipline tag optional but constrained to enum | None | Pending → Active → Unsubscribed |

#### Entities

| Entity | Identity | Key Attributes | Belongs To |
|--------|----------|----------------|------------|
| Subscriber | email (managed by Buttondown) | email, discipline (tag), subscribedDate, status | External (Buttondown) |

#### Value Objects

| Value Object | Attributes | Validation Rules | Used By |
|--------------|------------|------------------|---------|
| EmailAddress | value: String | Valid email format (RFC 5322); max 255 chars | Subscriber |
| DisciplinePreference | value: Enum or null | If present, must be "PM", "Design", or "Engineering" | Subscriber (Buttondown tag) |

#### Domain Events

| Event Name | Triggered When | Payload | Consumers |
|------------|----------------|---------|-----------|
| SubscriberCreated | Buttondown API returns 201 | email (hashed), discipline, timestamp | Analytics (custom event) |
| SubscriberDuplicate | Buttondown API returns 409 | email (hashed), timestamp | UI (show "already subscribed") |
| SubscriptionFailed | Buttondown API returns 4xx/5xx after retries | errorCode, timestamp | UI (show retry/mailto fallback) |
| SubscriberUnsubscribed | User clicks one-click unsubscribe | email (hashed), timestamp | Analytics |

#### API Integration (Buttondown)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `api.buttondown.email/v1/subscribers` | POST | Create subscriber | API key via Netlify function proxy |

**Error Handling:** Client retry max 2x with 1s backoff → persistent failure shows `mailto:` fallback link.

---

### 3.3 Search / Discovery

**Context Purpose:** Provide instant, client-side full-text search and discipline/level filtering across all published content.

**Module/Package Location:** `src/components/SearchBar.astro`, Pagefind auto-generated `/dist/pagefind/`

#### Aggregates

| Aggregate Root | Invariants Protected | Child Entities | Lifecycle |
|----------------|---------------------|----------------|-----------|
| SearchIndex | Must include all published (non-draft) content; must regenerate on every build | IndexEntry[] | Generated → Active (until next build) → Replaced |

#### Value Objects

| Value Object | Attributes | Validation Rules | Used By |
|--------------|------------|------------------|---------|
| SearchQuery | value: String | Min 2 characters; debounce 300ms | SearchBar component |
| SearchResult | url, title, excerpt (highlighted), discipline, readingTime | Must include discipline badge data | SearchBar dropdown |

#### Domain Events

| Event Name | Triggered When | Payload | Consumers |
|------------|----------------|---------|-----------|
| SearchPerformed | User types 2+ chars after debounce | query (anonymized), resultCount | Analytics (custom event) |
| SearchNoResults | Pagefind returns empty results | query (anonymized) | UI (show browse suggestions) |

---

### 3.4 Analytics / Engagement

**Context Purpose:** Track reader engagement, cross-discipline reading patterns, and conversion metrics using privacy-focused, cookie-free analytics.

**Module/Package Location:** Plausible script in `BaseLayout.astro`, custom event helpers in `src/utils/analytics.ts`

#### Value Objects

| Value Object | Attributes | Validation Rules | Used By |
|--------------|------------|------------------|---------|
| PageView | url, referrer, country, device | Automatic via Plausible | All pages |
| CustomEvent | name: String, props: Object | name must be from defined event list | Scroll depth, signup, share, filter, search |
| ScrollDepth | percentage: Enum(25, 50, 75, 100), articleSlug: String | Throttled at 100ms | Article pages |

#### Defined Custom Events

| Event Name | Props | Trigger |
|------------|-------|---------|
| `scroll-depth` | `{depth: "25\|50\|75\|100", slug}` | Scroll position crosses threshold |
| `newsletter-signup` | `{discipline: "PM\|Design\|Engineering\|none"}` | Successful Buttondown API response |
| `discipline-filter` | `{discipline, page: "articles\|books"}` | Filter selection on archive/library |
| `search-query` | `{resultCount}` | Pagefind returns results |
| `social-share` | `{platform: "twitter\|linkedin\|copy", slug}` | Share button click |
| `cross-discipline-read` | `{readerDiscipline, articleDiscipline, slug}` | Article view where disciplines differ |

---

## 4. Ubiquitous Language Glossary

> **Usage:** These terms must be used consistently in code, documentation, and conversations. Claude should use these exact terms when working in this codebase.

| Term | Definition | Context | Anti-Terms (Don't Use) |
|------|------------|---------|------------------------|
| Product Builder | Any professional who contributes to building digital products — PM, Designer, or Engineer | All | User, Customer, Reader (in domain code) |
| Article | A published cross-functional content piece in Markdown with YAML frontmatter | Content Publishing | Post, Blog, Entry, Story |
| Book Review | A structured review of a professional development book with cross-functional metadata | Content Publishing | Book summary, Book listing, Recommendation |
| Discipline | One of three product functions: PM, Design, Engineering | All | Category, Department, Role, Function |
| Career Level | Book review classification: Junior (0-3yr), Mid-Level (3-7yr), Senior (7+yr) | Content Publishing | Tier, Seniority, Grade |
| Cross-Functional | Content spanning ≥2 disciplines; the platform's core differentiator | All | Multi-disciplinary, Interdisciplinary, Cross-team |
| T-Shaped Professional | Deep expertise in one discipline with broad knowledge across others | Strategy | Generalist, Full-stack (non-engineering) |
| Subscriber | A person who has opted into the Buttondown newsletter | Newsletter | Member, User, Follower, Reader |
| Frontmatter | YAML metadata at the top of Markdown content files | Content Publishing | Metadata, Header, Config |
| Discipline Badge | Colored pill UI element indicating discipline(s) on a content card | Content Publishing, UX | Tag, Label, Chip (use Badge consistently) |
| Cross-Functional Value | BookReview field explaining why professionals outside the book's primary discipline should read it | Content Publishing | Relevance, Why read, Benefit |
| Opportunity Score | IMP + max(IMP - SAT, 0); scores >12 indicate high market opportunity | Strategy (MRD) | Priority score, Ranking |
| North Star Metric | Weekly Active Readers Who Engage Across Disciplines | Analytics | KPI (too generic) |
| Build | The Astro SSG compilation process that transforms Markdown into static HTML | Content Publishing | Deploy, Compile, Render |
| Deploy | The Netlify process that serves built static files to CDN edge nodes | Infrastructure | Build, Publish, Ship |

---

## 5. Aggregate Design Rules

**Aggregate Sizing Philosophy:** Minimal aggregates — content is flat files, not relational.

**Rules for this project:**

1. **Content-as-aggregate:** Each Markdown file is a self-contained aggregate root. All required data lives in frontmatter + body. No cross-file references needed for rendering.
2. **Validation at build time:** Zod schemas enforce all invariants when Astro builds. Invalid frontmatter = build failure = no deploy.
3. **Reference by slug:** Content pieces reference each other by slug only (for related articles/books). Astro resolves at build time.
4. **Subscriber data is external:** Subscriber state lives entirely in Buttondown. The platform never stores PII in Git or local files.
5. **Analytics data is external:** All event data lives in Plausible. The platform only fires events, never reads them back.
6. **Eventual consistency is fine:** Search index rebuilds every deploy. There is no requirement for real-time consistency between content and index.

---

## 6. Domain Event Standards

**Event Naming Convention:** Past tense verb + noun (e.g., `ArticlePublished`, `SubscriberCreated`, `SearchPerformed`)

**Event Structure:**

```typescript
// For Plausible custom events (client-side)
interface AnalyticsEvent {
  eventName: string;         // e.g., "newsletter-signup"
  props?: Record<string, string>;  // e.g., { discipline: "PM" }
}

// Usage
plausible('newsletter-signup', { props: { discipline: 'PM' } });
```

**Event Storage:** Plausible Cloud (EU-hosted, cookie-free, GDPR-compliant)

**Event Bus:** None — events are fire-and-forget Plausible API calls from the browser. No server-side event processing needed for MVP.

---

## 7. Anti-Corruption Layer (ACL) Definitions

| External System | ACL Location | Translation Logic |
|-----------------|--------------|-------------------|
| Buttondown API | `functions/newsletter-signup.ts` | Translates form POST (email + discipline) → Buttondown API payload with tags; handles 201/409/4xx/5xx responses → user-friendly messages |
| Plausible Script | `src/utils/analytics.ts` | Wraps `window.plausible()` calls with typed event names and props; handles ad-blocker gracefully (no-op) |
| Pagefind | `src/components/SearchBar.astro` | Wraps Pagefind JS API; transforms raw results → typed SearchResult objects with discipline badges |

---

## 8. Cross-Cutting Concerns

### 8.1 Identity Generation

- **Strategy:** Slug-based (derived from Markdown filename)
- **Where generated:** Author creates filename; slug auto-derived by Astro
- **Format:** kebab-case (e.g., `technical-debt-for-non-engineers`)

### 8.2 Timestamps

- **Timezone:** UTC always (stored in frontmatter as ISO dates)
- **Precision:** Day-level for publishDate/updatedDate
- **Display:** Formatted per user locale in browser

### 8.3 Soft Delete vs Hard Delete

- **Default approach:** Archive pattern — remove from navigation but URL still resolves (SEO preservation)
- **Implementation:** Set `draft: true` or add `archived: true` frontmatter field
- **Subscribers:** Deletion handled by Buttondown (GDPR right-to-deletion)

### 8.4 Content Versioning

- **Strategy:** Git history is the version history
- **Rollback:** Netlify instant rollback to any previous deploy
- **RPO:** 0 minutes (Git = primary backup; no data loss possible)

---

## 9. Claude-Specific Instructions

**When working in this codebase, Claude should:**

- [ ] Use ubiquitous language from Section 4 exactly as defined
- [ ] Respect bounded context boundaries — subscriber data stays in Buttondown, analytics in Plausible
- [ ] Validate all content changes against Zod schemas (build must pass)
- [ ] Use discipline colors from UX Spec consistently: PM (#3B82F6), Design (#8B5CF6), Engineering (#10B981)
- [ ] Never store PII in the Git repository
- [ ] Emit Plausible custom events for all user interactions listed in Section 3.4
- [ ] Reference articles/books by slug only, never by index or internal ID
- [ ] Ensure every article has ≥2 discipline tags (cross-functional invariant)
- [ ] Ask before modifying Zod schemas (affects all existing content)
- [ ] Flag when proposed changes might violate domain rules or performance budgets

**When creating new content entities, Claude should:**

1. Confirm which bounded context the entity belongs to
2. Determine the Zod schema requirements
3. Identify invariants that must be enforced at build time
4. Define any new Plausible custom events needed
5. Update this document with new definitions

**When adding new features, Claude should:**

1. Check which phase the feature belongs to (MVP / Phase 2 / Future)
2. Verify the feature traces to a PRD requirement and MRD outcome
3. Ensure no client-side JavaScript is added without justification (Astro zero-JS default)
4. Confirm performance budgets are maintained (Lighthouse >90)

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-07 | Tshepo Machele | Initial domain model derived from MRD v0.1, PRD v1.0, UX Spec v1.0, SRD v1.0 |

---

*Last updated: 2025-02-07*
