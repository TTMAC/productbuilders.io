# Testing Strategy — ProductBuilders.io

> **Purpose:** Define the test-driven development practices, testing standards, and quality gates for ProductBuilders.io. This document serves as the authoritative reference for how tests should be written, organized, and maintained.

---

## 1. Testing Philosophy

**TDD Adoption Level:** TDD for critical paths — strict TDD for Zod schemas, serverless functions, and utility logic; test-after for Astro components and layouts.

**Core Principles:**

1. **Build-time validation is the first line of defense** — Zod schema enforcement means invalid content never deploys. Tests verify schemas are correct.
2. **Tests are documentation** — they describe what frontmatter is valid, what API responses look like, and what user flows should work.
3. **Performance is testable** — Lighthouse audits run as tests; performance budgets (TTFB <200ms, LCP <2.5s, Lighthouse >90) are enforced.
4. **Test behavior, not implementation** — test what the build outputs and what the user sees, not Astro internals.

**Test-Driven Development Workflow:**

```
┌─────────────────────────────────────────────────────────────┐
│  RED         →        GREEN        →        REFACTOR       │
│  Write a          Write minimal         Clean up code      │
│  failing test     code to pass          while tests pass   │
└─────────────────────────────────────────────────────────────┘
```

**Unique to this project:** Because ProductBuilders.io is a static site, many "tests" are build-time validations (Zod) and post-build audits (Lighthouse, HTML checks). The test pyramid skews toward unit tests on schemas/utils and E2E audits on build output.

---

## 2. Test Pyramid

**Target Distribution:**

```
                    ┌───────────┐
                   /   E2E /   \          ~15%
                  / Lighthouse  \    (build output audits, critical flows)
                 /────────────────\
                /   Integration    \       ~15%
               / (build pipeline,  \  (CMS→Git→build, API proxy)
              /   API integration)  \
             /──────────────────────\
            /        Unit Tests      \    ~70%
           /   (Zod schemas, utils,   \  (fast, many, isolated)
          /    serverless functions)    \
         /──────────────────────────────\
```

| Test Type | Target % | Max Execution Time | Scope |
|-----------|----------|-------------------|-------|
| Unit | 70% | <50ms per test | Zod schemas, utility functions, serverless function logic |
| Integration | 15% | <10s per test | Build output validation, Buttondown API integration, CMS-to-Git flow |
| E2E / Audit | 15% | <60s per test | Lighthouse performance, full subscription flow, search UX, accessibility |

---

## 3. Test Types & Standards

### 3.1 Unit Tests

**Definition:** Tests that verify a single unit of behavior in isolation — Zod schema validation, utility functions, and serverless function logic.

**Scope:**

- Content schemas (Zod validation rules for Article and BookReview)
- Utility functions (reading time calculation, date formatting, slug generation)
- Serverless function logic (Buttondown request construction, error mapping)
- Component logic (discipline badge color mapping, filter state)

**Isolation Rules:**

| Dependency Type | Approach |
|-----------------|----------|
| Buttondown API | Mock fetch / HTTP client |
| Plausible | No-op mock (analytics is fire-and-forget) |
| File system (Markdown) | Inline test fixtures (YAML strings) |
| Astro Content Collections | Mock `getCollection()` / `getEntry()` |
| Browser APIs (Pagefind) | Mock Pagefind JS API |

**Naming Convention (BDD-style):**

```
should_<expected_behavior>_when_<condition>

Examples:
should_reject_article_when_no_disciplines_provided
should_calculate_reading_time_when_given_word_count
should_return_201_status_when_valid_email_submitted
should_map_pm_discipline_to_blue_badge_color
```

**Structure (AAA Pattern):**

```typescript
// Arrange: Set up test data and dependencies
// Act: Execute the behavior under test
// Assert: Verify the expected outcome
```

**Example — Zod Schema Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { articleSchema } from '../src/content/config';

describe('Article Schema', () => {
  describe('disciplines', () => {
    it('should_reject_article_when_no_disciplines_provided', () => {
      // Arrange
      const frontmatter = {
        title: 'Test Article',
        description: 'A test description',
        author: 'Tshepo Machele',
        publishDate: new Date('2025-03-01'),
        disciplines: [], // Invalid: must have ≥1
      };

      // Act & Assert
      expect(() => articleSchema.parse(frontmatter)).toThrow();
    });

    it('should_accept_article_when_multiple_valid_disciplines_provided', () => {
      // Arrange
      const frontmatter = {
        title: 'Cross-Functional Article',
        description: 'Covers PM and Engineering',
        author: 'Tshepo Machele',
        publishDate: new Date('2025-03-01'),
        disciplines: ['PM', 'Engineering'],
      };

      // Act
      const result = articleSchema.parse(frontmatter);

      // Assert
      expect(result.disciplines).toEqual(['PM', 'Engineering']);
    });

    it('should_reject_article_when_invalid_discipline_provided', () => {
      // Arrange
      const frontmatter = {
        title: 'Bad Article',
        description: 'Invalid discipline',
        author: 'Tshepo Machele',
        publishDate: new Date('2025-03-01'),
        disciplines: ['Marketing'], // Invalid: not in enum
      };

      // Act & Assert
      expect(() => articleSchema.parse(frontmatter)).toThrow();
    });
  });

  describe('SEO metadata', () => {
    it('should_reject_article_when_title_exceeds_60_chars', () => {
      // Arrange
      const frontmatter = {
        title: 'A'.repeat(61), // 61 chars — exceeds limit
        description: 'Valid description',
        author: 'Tshepo Machele',
        publishDate: new Date('2025-03-01'),
        disciplines: ['PM'],
      };

      // Act & Assert
      expect(() => articleSchema.parse(frontmatter)).toThrow();
    });

    it('should_reject_article_when_description_exceeds_155_chars', () => {
      // Arrange
      const frontmatter = {
        title: 'Valid Title',
        description: 'A'.repeat(156), // 156 chars — exceeds limit
        author: 'Tshepo Machele',
        publishDate: new Date('2025-03-01'),
        disciplines: ['Design'],
      };

      // Act & Assert
      expect(() => articleSchema.parse(frontmatter)).toThrow();
    });
  });
});
```

**Example — Utility Function Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../src/utils/reading-time';

describe('calculateReadingTime', () => {
  it('should_return_1_min_when_word_count_under_200', () => {
    expect(calculateReadingTime(150)).toBe(1);
  });

  it('should_return_10_min_when_word_count_is_2000', () => {
    expect(calculateReadingTime(2000)).toBe(10);
  });

  it('should_round_up_when_word_count_not_evenly_divisible', () => {
    expect(calculateReadingTime(450)).toBe(3); // 450/200 = 2.25 → 3
  });
});
```

**Example — Serverless Function Test:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { handleNewsletterSignup } from '../functions/newsletter-signup';

describe('Newsletter Signup Handler', () => {
  it('should_return_201_when_valid_email_submitted', async () => {
    // Arrange
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 'uuid-123', email: 'test@example.com' }),
    });

    // Act
    const result = await handleNewsletterSignup(
      { email: 'test@example.com', discipline: 'PM' },
      mockFetch
    );

    // Assert
    expect(result.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.buttondown.email/v1/subscribers',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test@example.com'),
      })
    );
  });

  it('should_return_already_subscribed_when_duplicate_email', async () => {
    // Arrange
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
    });

    // Act
    const result = await handleNewsletterSignup(
      { email: 'existing@example.com' },
      mockFetch
    );

    // Assert
    expect(result.status).toBe(409);
    expect(result.message).toContain('already subscribed');
  });
});
```

---

### 3.2 Integration Tests

**Definition:** Tests that verify multiple components work together — build pipeline output, CMS-to-Git flow, and API integration with external services.

**Scope:**

- Build output validation (Astro generates expected HTML with correct meta tags)
- Pagefind index generation (search index includes all published content)
- Buttondown API integration with sandbox/test mode
- Decap CMS schema parity (CMS config matches Zod schema)
- RSS feed generation (valid RSS 2.0 at /rss.xml)

**Environment:**

- Build: Local `npm run build` with test content fixtures
- API: Buttondown test mode (sandbox) or mocked HTTP
- Search: Pagefind run on test build output

**Naming Convention:**

```
<Component>Integration_<scenario>

Examples:
AstroBuild_generatesValidArticleHtml
AstroBuild_failsOnInvalidFrontmatter
PagefindIndex_includesAllPublishedArticles
RSSFeed_containsLatest20Articles
ButtondownApi_createsSubscriberInSandbox
DecapConfig_matchesZodSchema
```

**Example — Build Output Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { JSDOM } from 'jsdom';

describe('Astro Build Integration', () => {
  // Run `npm run build` before these tests
  const distDir = './dist';

  it('AstroBuild_generatesArticleWithRequiredMetaTags', () => {
    const html = readFileSync(
      `${distDir}/articles/technical-debt-for-non-engineers/index.html`,
      'utf-8'
    );
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // SEO meta tags
    expect(doc.querySelector('meta[name="description"]')?.content).toBeTruthy();
    expect(doc.querySelector('meta[property="og:title"]')?.content).toBeTruthy();
    expect(doc.querySelector('meta[property="og:description"]')?.content).toBeTruthy();
    expect(doc.querySelector('meta[name="twitter:card"]')?.content).toBe('summary_large_image');

    // Semantic HTML
    expect(doc.querySelector('article')).toBeTruthy();
    expect(doc.querySelector('h1')).toBeTruthy();

    // Discipline badges present
    expect(html).toContain('PM');
  });

  it('AstroBuild_generatesSitemapXml', () => {
    expect(existsSync(`${distDir}/sitemap.xml`)).toBe(true);
  });

  it('AstroBuild_generatesRobotsTxt', () => {
    expect(existsSync(`${distDir}/robots.txt`)).toBe(true);
  });

  it('AstroBuild_generatesRssFeed', () => {
    const rss = readFileSync(`${distDir}/rss.xml`, 'utf-8');
    expect(rss).toContain('<rss');
    expect(rss).toContain('<channel>');
    expect(rss).toContain('ProductBuilders');
  });

  it('AstroBuild_generatesPagefindIndex', () => {
    expect(existsSync(`${distDir}/pagefind`)).toBe(true);
  });
});
```

**Example — Schema Parity Test:**

```typescript
describe('Decap CMS Config Parity', () => {
  it('DecapConfig_matchesArticleZodSchema', () => {
    // Parse decap-config.yml and verify all required fields
    // match the Zod articleSchema definition
    const decapFields = parseDecapConfig('articles');
    const zodFields = extractZodFields(articleSchema);

    expect(decapFields.sort()).toEqual(zodFields.sort());
  });
});
```

---

### 3.3 End-to-End (E2E) / Audit Tests

**Definition:** Tests that verify complete user experiences, performance budgets, and accessibility standards on the built static site.

**Scope:**

- Lighthouse performance audits (all page templates)
- Newsletter subscription flow (form → API → success message)
- Search functionality (type → results → navigate)
- Accessibility audits (axe-core)
- Mobile responsiveness checks
- Cross-discipline navigation (filter → article → different discipline)

**Framework:** Playwright (browser automation) + Lighthouse CI (performance)

**Environment:** Local preview server (`npm run preview` on build output)

**Critical Paths to Cover:**

| Journey | Priority | Frequency |
|---------|----------|-----------|
| Homepage → Article → Read complete | P0 | Every deploy |
| Any page → Newsletter signup → Success | P0 | Every deploy |
| Homepage → Archive → Filter by discipline | P0 | Every deploy |
| Any page → Search → Result click | P1 | Every deploy |
| Book Library → Filter → Book Review (Phase 2) | P1 | Phase 2 deploys |
| Lighthouse audit: Homepage template | P0 | Every deploy |
| Lighthouse audit: Article template | P0 | Every deploy |
| Lighthouse audit: Archive template | P0 | Every deploy |
| Accessibility audit (axe-core): All templates | P0 | Every deploy |

**E2E Test Rules:**

- Maximum 15 E2E tests total (static site = fewer user flows)
- Each test must be independent (no shared state)
- Use stable selectors (`data-testid`, not CSS classes)
- Lighthouse thresholds enforced: Performance >90, Accessibility >95, SEO >95
- Never test content correctness in E2E — that's what Zod + unit tests are for

**Example — Lighthouse Performance Test:**

```typescript
import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';

test('Lighthouse_homepageExceedsPerformanceBudget', async () => {
  const result = await lighthouse('http://localhost:4321/', {
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'seo'],
  });

  expect(result.lhr.categories.performance.score * 100).toBeGreaterThan(90);
  expect(result.lhr.categories.accessibility.score * 100).toBeGreaterThan(95);
  expect(result.lhr.categories.seo.score * 100).toBeGreaterThan(95);
});
```

**Example — Newsletter Signup E2E:**

```typescript
import { test, expect } from '@playwright/test';

test('E2E_newsletterSignup_showsSuccessOnValidEmail', async ({ page }) => {
  await page.goto('http://localhost:4321/');

  // Find hero CTA
  const emailInput = page.locator('[data-testid="newsletter-email"]');
  const submitButton = page.locator('[data-testid="newsletter-submit"]');

  // Fill and submit
  await emailInput.fill('e2e-test@example.com');
  await submitButton.click();

  // Verify success state
  const successMessage = page.locator('[data-testid="newsletter-success"]');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
  await expect(successMessage).toContainText('subscribed');
});
```

---

### 3.4 Performance Tests

**Definition:** Tests that verify page weight, load time, and search performance meet SRD budgets.

**Tool:** Lighthouse CI (automated), WebPageTest (manual spot checks)

**Baseline Metrics (from SRD §12.1):**

| Metric | Target | Test Method |
|--------|--------|-------------|
| TTFB | <200ms | Lighthouse CI |
| LCP | <2.5s (3G) | Lighthouse CI throttled |
| CLS | <0.1 | Lighthouse CI |
| FID | <100ms | Chrome UX Report |
| Page weight | <100KB compressed | Bundle analysis script |
| Search response | <100ms client-side | `performance.now()` in Pagefind test |
| Build time | <120s | Netlify build log assertion |

---

## 4. Test Organization

### 4.1 Directory Structure

**Selected Structure:** Separate test directory (Option B) — keeps test code away from Astro's strict src/ expectations.

```
tests/
├── unit/
│   ├── schemas/
│   │   ├── article-schema.test.ts
│   │   └── book-review-schema.test.ts
│   ├── utils/
│   │   ├── reading-time.test.ts
│   │   ├── date-format.test.ts
│   │   └── discipline-colors.test.ts
│   └── functions/
│       └── newsletter-signup.test.ts
├── integration/
│   ├── build-output.test.ts
│   ├── pagefind-index.test.ts
│   ├── rss-feed.test.ts
│   ├── schema-parity.test.ts
│   └── sitemap.test.ts
├── e2e/
│   ├── homepage.e2e.test.ts
│   ├── article-reading.e2e.test.ts
│   ├── newsletter-signup.e2e.test.ts
│   ├── search.e2e.test.ts
│   ├── archive-filter.e2e.test.ts
│   └── lighthouse.e2e.test.ts
├── fixtures/
│   ├── valid-article.md
│   ├── invalid-article-no-discipline.md
│   ├── valid-book-review.md
│   └── invalid-book-review-no-cross-value.md
└── helpers/
    ├── schema-test-utils.ts
    └── build-test-utils.ts
```

### 4.2 File Naming Conventions

| Test Type | Pattern | Example |
|-----------|---------|---------|
| Unit | `<name>.test.ts` | `article-schema.test.ts` |
| Integration | `<name>.test.ts` (in integration/) | `build-output.test.ts` |
| E2E | `<name>.e2e.test.ts` | `newsletter-signup.e2e.test.ts` |

---

## 5. Coverage Requirements

| Layer | Minimum Coverage | Rationale |
|-------|-----------------|-----------|
| Content Schemas (Zod) | 95% | Schemas are the primary data validation — must be thoroughly tested |
| Serverless Functions | 90% | API proxy handles PII (email) and external integration |
| Utility Functions | 85% | Core logic reused across components |
| Components / Layouts | 60% | Visual output; covered by integration + E2E + visual snapshot |
| Overall | 80% | Balance of safety and development speed for solo founder |

**New code coverage minimum:** 90% (all new functions and schemas)

**Tool:** Vitest with `@vitest/coverage-v8`

**Configuration:** `vitest.config.ts`

---

## 6. Test Data Management

### 6.1 Test Data Strategies

| Strategy | Use Case | Example |
|----------|----------|---------|
| Fixtures | Markdown content files with valid/invalid frontmatter | `fixtures/valid-article.md` |
| Builders | Programmatic construction of frontmatter objects | `ArticleFrontmatterBuilder().withDisciplines(['PM']).build()` |
| Inline | Simple value objects in test files | `{ title: 'Test', disciplines: ['PM'] }` |

### 6.2 Test Data Builders

**Builder Pattern:**

```typescript
// tests/helpers/schema-test-utils.ts

class ArticleFrontmatterBuilder {
  private props = {
    title: 'Default Test Article',
    description: 'A valid test description under 155 chars',
    author: 'Tshepo Machele',
    publishDate: new Date('2025-03-01'),
    disciplines: ['PM'] as ('PM' | 'Design' | 'Engineering')[],
    tags: [] as string[],
    featured: false,
    draft: false,
  };

  withTitle(title: string) { this.props.title = title; return this; }
  withDescription(desc: string) { this.props.description = desc; return this; }
  withDisciplines(d: ('PM' | 'Design' | 'Engineering')[]) { this.props.disciplines = d; return this; }
  withTags(tags: string[]) { this.props.tags = tags; return this; }
  asFeatured() { this.props.featured = true; return this; }
  asDraft() { this.props.draft = true; return this; }

  build() { return { ...this.props }; }
}

class BookReviewFrontmatterBuilder {
  private props = {
    title: 'Default Test Book',
    bookAuthor: 'Test Author',
    discipline: 'PM' as 'PM' | 'Design' | 'Engineering',
    level: 'Mid-Level' as 'Junior' | 'Mid-Level' | 'Senior',
    rating: 4,
    publicationYear: 2018,
    tags: [] as string[],
    crossFunctionalValue: 'Engineers and designers learn shared vocabulary.',
    keyTakeaways: ['Takeaway 1', 'Takeaway 2', 'Takeaway 3'],
    whoShouldRead: 'Mid-level PMs transitioning to leadership.',
    draft: false,
  };

  withTitle(title: string) { this.props.title = title; return this; }
  withDiscipline(d: 'PM' | 'Design' | 'Engineering') { this.props.discipline = d; return this; }
  withLevel(l: 'Junior' | 'Mid-Level' | 'Senior') { this.props.level = l; return this; }
  withRating(r: number) { this.props.rating = r; return this; }
  withPublicationYear(y: number) { this.props.publicationYear = y; return this; }
  withCrossFunctionalValue(v: string) { this.props.crossFunctionalValue = v; return this; }
  withKeyTakeaways(t: string[]) { this.props.keyTakeaways = t; return this; }

  build() { return { ...this.props }; }
}

// Usage in tests
const validArticle = new ArticleFrontmatterBuilder()
  .withDisciplines(['PM', 'Engineering'])
  .asFeatured()
  .build();

const validBookReview = new BookReviewFrontmatterBuilder()
  .withDiscipline('Design')
  .withLevel('Senior')
  .withRating(5)
  .build();
```

### 6.3 Shared Test Utilities Location

```
tests/helpers/     — builders, mock factories, assertion helpers
tests/fixtures/    — static Markdown files for build integration tests
```

---

## 7. Mocking & Stubbing Standards

### 7.1 Mocking Framework

**Framework:** Vitest built-in mocking (`vi.fn()`, `vi.mock()`)

### 7.2 Mocking Rules

| Do | Don't |
|----|-------|
| Mock Buttondown API calls (HTTP boundary) | Mock Zod schema internals |
| Mock Plausible tracking (no-op in tests) | Mock Astro Content Collection query logic |
| Mock `fetch` for serverless function tests | Mock file reads for fixtures (use real fixtures) |
| Stub Pagefind JS API for component tests | Over-verify every analytics event call |

### 7.3 What to Mock vs What to Use Real

| Dependency | Test Approach | Rationale |
|------------|---------------|-----------|
| Zod schemas | Real (no mocking) | Schemas ARE the test subject |
| Astro build | Real (integration test) | Build output is what users see |
| Pagefind | Real for integration; mock for unit | Index generation must work; component logic can be isolated |
| Buttondown API | Mock in unit; sandbox in integration | Never hit prod API; sandbox for integration |
| Plausible | Always mock (no-op) | Analytics must not affect test outcomes |
| File system | Real for fixtures; mock for unit logic | Fixtures are stable; unit tests must be fast |

---

## 8. TDD Workflow Guidelines

### 8.1 When to Apply TDD

| Scenario | TDD Required? | Rationale |
|----------|---------------|-----------|
| New Zod schema or schema change | **Yes** | Schemas are data contracts — must be test-driven |
| New serverless function | **Yes** | Handles external API + PII — must be robust |
| New utility function | **Yes** | Pure logic — perfect for TDD |
| Bug fixes | **Yes** | Write failing test reproducing bug first |
| New Astro component | No (test-after) | Visual output; validate with integration/snapshot |
| New Astro layout | No (test-after) | Structural; validate with build output tests |
| Content authoring | No | Content validated by Zod at build time |
| Styling/CSS changes | No | Visual regression; validate with screenshot/Lighthouse |
| Config changes (netlify.toml, astro.config) | No | Validate via build success |

### 8.2 TDD Micro-Cycle

```
1. RED    - Write smallest failing test (should take <5 min)
2. GREEN  - Write minimal code to pass (no more than needed)
3. REFACTOR - Clean up while green (no new functionality)
4. REPEAT
```

**Red Phase Rules:**

- Test must fail for the right reason (not syntax error)
- Test must be specific about expected behavior
- Test name must describe the behavior (`should_X_when_Y`)

**Green Phase Rules:**

- Write the simplest code that passes
- It's okay to hardcode initially
- Don't add code "for later"

**Refactor Phase Rules:**

- Tests must stay green throughout
- Remove duplication
- Improve naming
- No new tests in this phase

### 8.3 Test-First Checklist

Before writing implementation code, Claude should confirm:

- [ ] Test exists and fails
- [ ] Test failure message is clear
- [ ] Test name describes expected behavior
- [ ] Test covers one behavior only

---

## 9. CI/CD Integration

### 9.1 Test Execution in Pipeline

| Stage | Tests Run | Failure Action |
|-------|-----------|----------------|
| Pre-commit (local) | Unit tests (fast) | Block commit |
| Netlify Build | Unit + Integration (Zod, build output) | Build fails; previous deploy active |
| Deploy Preview (PR) | Unit + Integration + Lighthouse audit | Block merge |
| Production (main) | All tests + Lighthouse + Accessibility | Alert; Netlify rollback available |

### 9.2 Quality Gates

| Gate | Threshold | Enforcement |
|------|-----------|-------------|
| Unit tests pass | 100% | Build fails on any failure |
| Zod schema validation | 100% | Build fails on invalid frontmatter |
| Integration tests pass | 100% | Block merge |
| Coverage (overall) | ≥ 80% | Block merge |
| Coverage (new code) | ≥ 90% | Block merge |
| Lighthouse Performance | > 90 | Block deploy |
| Lighthouse Accessibility | > 95 | Block deploy |
| Lighthouse SEO | > 95 | Block deploy |
| Build time | < 120s | Warning (investigate if >90s) |

### 9.3 Test Reporting

**Reports generated:**

- [x] Coverage report (HTML + JSON via `@vitest/coverage-v8`)
- [x] Lighthouse reports (JSON + HTML via Lighthouse CI)
- [x] Test duration tracking (Vitest built-in)
- [ ] Flaky test detection (monitor manually given low test count)

**Report location:** `./coverage/` (coverage), `./lighthouse-reports/` (Lighthouse)

---

## 10. Handling Flaky Tests

**Definition:** A flaky test is one that passes or fails inconsistently without code changes.

**Policy:**

1. Flaky tests must be fixed within 24 hours or quarantined (solo founder = fast turnaround)
2. Quarantined tests tracked with `// FIXME: FLAKY` comment + GitHub issue
3. Never ignore flaky tests — they erode trust

**Common Causes & Fixes (specific to this project):**

| Cause | Symptom | Fix |
|-------|---------|-----|
| Build output caching | Stale HTML in dist/ | Clean dist/ before integration tests (`rm -rf dist`) |
| Pagefind index timing | Search test finds no results | Ensure Pagefind post-build completes before test |
| Buttondown rate limiting | API test returns 429 | Use mock for unit; add retry logic for integration |
| Lighthouse variance | Score fluctuates ±3 points | Set threshold 3 points below target; average 3 runs |
| Port conflicts | Preview server fails to start | Use dynamic port assignment in test setup |

---

## 11. Testing Anti-Patterns to Avoid

| Anti-Pattern | Problem | Better Approach |
|--------------|---------|-----------------|
| Testing Astro internals | Brittle, breaks on framework update | Test build output (HTML) instead |
| Testing every CSS class | Couples tests to styling | Use Lighthouse accessibility + visual snapshot |
| E2E tests for schema validation | Slow, redundant with Zod | Unit test schemas; E2E tests user flows only |
| Mocking Zod | Defeats the purpose | Always use real Zod schemas in tests |
| Testing content correctness in code | Content changes constantly | Zod validates structure; editorial review validates quality |
| Hardcoded test URLs | Breaks on port changes | Use base URL from config |
| No assertions in Lighthouse tests | False confidence | Always assert specific score thresholds |
| Testing third-party behavior | Not our responsibility | Mock boundaries; trust Buttondown/Plausible work |

---

## 12. Claude-Specific Instructions

**When writing code, Claude should:**

- [ ] Write the test first (failing) for schemas, functions, and utils
- [ ] Run tests after each change to verify state (`npm test`)
- [ ] Follow the naming convention: `should_<behavior>_when_<condition>`
- [ ] Use builders from Section 6 for test data
- [ ] Mock at boundaries only (fetch, Plausible, Pagefind API)
- [ ] Ensure new code meets coverage thresholds (90% for new code)
- [ ] Run Lighthouse after template changes

**When reviewing or modifying existing tests, Claude should:**

- [ ] Preserve existing test coverage
- [ ] Flag if changes reduce coverage below thresholds
- [ ] Update test names if behavior changes
- [ ] Remove obsolete tests rather than commenting out

**When asked to skip tests or reduce coverage, Claude should:**

1. Clarify the reason (spike? time pressure? Phase 2 feature not yet in scope?)
2. Document the gap with `// TODO: Add tests when [condition]`
3. Never merge code that reduces coverage without explicit approval

**Test output verbosity:** Show failures only (clean CI output)

---

## 13. Tools & Configuration Reference

| Purpose | Tool | Config File |
|---------|------|-------------|
| Test runner | Vitest | `vitest.config.ts` |
| Assertions | Vitest (built-in expect) | — |
| Mocking | Vitest (built-in vi) | — |
| Coverage | `@vitest/coverage-v8` | `vitest.config.ts` (coverage section) |
| E2E / Browser | Playwright | `playwright.config.ts` |
| Performance audit | Lighthouse CI | `lighthouserc.json` |
| Accessibility audit | axe-core (via Playwright) | — |
| HTML parsing (integration) | JSDOM | — |
| DOM testing | @testing-library | — |

---

## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-07 | Tshepo Machele | Initial testing strategy derived from SRD v1.0, PRD v1.0 |

---

*Last updated: 2025-02-07*
