# Autonomous Operations Instruction Set

## ProductBuilders.io
*MECE Framework for Agents, Skills & MCPs*

---

| Document Owner | Version | Status | Platform |
|----------------|---------|--------|----------|
| Tshepo Machele | 1.0 | Draft | ProductBuilders.io |

| Created | Last Updated | Source Documents |
|---------|--------------|------------------|
| 2025-02-11 | 2025-02-11 | MRD v0.1, PRD v1.0, SRD v1.0, Domain Model v1.0 |

> **Operating Principle:** Every instruction in this document is designed for AI agents to execute autonomously with a human-in-the-loop for approval gates. The human (Tshepo Machele, solo founder) reviews, approves, or rejects at defined checkpoints — agents handle everything else.

---

## Table of Contents

1. [How to Read This Document](#1-how-to-read-this-document)
2. [Part 1: Agents](#2-part-1-agents)
3. [Part 2: Skills](#3-part-2-skills)
4. [Part 3: MCPs (Model Context Protocols)](#4-part-3-mcps-model-context-protocols)
5. [Orchestration & Governance](#5-orchestration--governance)

---

## 1. How to Read This Document

This document is structured using the **MECE principle** (Mutually Exclusive, Collectively Exhaustive):

- **Mutually Exclusive:** Each agent has a single, non-overlapping domain of responsibility. No two agents own the same task. Each skill belongs to exactly one functional category. Each MCP serves a distinct integration boundary.
- **Collectively Exhaustive:** Together, the agents, skills, and MCPs cover every operational function required to run ProductBuilders.io — from content ideation through publication, distribution, analytics, and site maintenance.

**Human-in-the-Loop Model:** Agents operate on a "propose → approve → execute" cycle. The human approves at defined gates marked with 🚦 throughout this document. Between gates, agents act autonomously.

---

## 2. Part 1: Agents

Agents are autonomous entities that own a bounded domain of work. Each agent maps to one or more bounded contexts from the Domain Model and has clearly defined inputs, outputs, and approval gates.

### 2.1 Agent Registry

| ID | Agent Name | Bounded Context | Primary Responsibility | Upstream | Downstream |
|----|-----------|-----------------|----------------------|----------|------------|
| A1 | Content Strategist | Strategy / Planning | Editorial calendar, topic ideation, audience research | Human direction | A2, A5 |
| A2 | Content Author | Content Publishing | Article drafting, book review writing, frontmatter generation | A1 | A3 |
| A3 | Editorial Quality Agent | Content Publishing | Proofreading, cross-functional review, schema validation | A2 | A4 |
| A4 | Publishing & Deployment Agent | CMS / Authoring + Infrastructure | Git commits, build triggers, deployment verification | A3 | A5, A6, A7 |
| A5 | Distribution & Growth Agent | Newsletter / Subscriber | Newsletter curation, social repurposing, subscriber growth | A1, A4 | A6 |
| A6 | Analytics & Insights Agent | Analytics / Engagement | Metric tracking, reporting, content performance analysis | A4, A5 | A1 |
| A7 | Site Reliability Agent | Infrastructure | Performance monitoring, build health, uptime, SEO audits | A4 | A1, A4 |

---

### 2.2 Agent Specifications

#### A1 — Content Strategist Agent

**Domain:** Editorial planning and content strategy across all three disciplines (PM, Design, Engineering).

**Inputs:**
- Analytics performance reports from A6
- Trending topics and competitor content (via web research)
- Content calendar backlog and PRD §7.3 editorial plan
- Reader feedback and engagement signals

**Outputs:**
- Weekly editorial briefs (topic, target discipline, cross-functional angle, target keywords)
- Updated content calendar (rolling 4-week lookahead)
- Book review assignment queue (title, discipline, career level)

**Autonomous Actions:**
- Research trending topics in product management, design, and engineering
- Analyse content gaps across the three discipline pillars
- Draft editorial briefs with suggested cross-functional angles
- Prioritise book review queue by discipline balance and career level coverage
- Monitor competitor newsletters (Lenny's, UX Collective) for positioning gaps

**🚦 Human Approval Gates:**
- Approve/modify the weekly editorial brief before A2 begins drafting
- Approve quarterly content calendar updates
- Approve or swap book review assignments

**Constraints:**
- Every editorial brief must specify perspectives from ≥2 disciplines
- Content must map to one of four pillars: Cross-Functional Collaboration, Technical Literacy, Career Growth, or Book Reviews
- Book selections must be ≥5 years old (per PRD §4.3 schema)
- Target ~10 min read time (2,000–2,500 words) per article

---

#### A2 — Content Author Agent

**Domain:** Drafting articles and book reviews that meet ProductBuilders.io editorial standards.

**Inputs:**
- Approved editorial brief from A1
- Content authoring rules from CLAUDE.md
- Zod schema specifications for frontmatter
- Style guide (domain language from Domain Model §4)

**Outputs:**
- Complete Markdown files with valid YAML frontmatter
- Article body with cross-functional perspectives woven throughout
- Actionable takeaways segmented by function (For PMs: / For Engineers: / For Designers:)

**Autonomous Actions:**
- Generate complete article drafts from editorial briefs
- Write book reviews following the BookReview schema (title, author, discipline, level, rating, cross_functional_value, key_takeaways, who_should_read)
- Produce valid YAML frontmatter conforming to Zod schemas
- Calculate and set estimated reading time (~200 wpm)
- Generate SEO-optimised meta descriptions (<155 chars) and titles (<60 chars)
- Define or link any discipline-specific jargon used in the article
- Research source material for factual accuracy

**🚦 Human Approval Gates:**
- Review and approve/edit each completed draft before handoff to A3
- Final sign-off on cross-functional framing and voice/tone

**Constraints:**
- Use domain language exclusively (Article, not "Post"; Product Builder, not "User" — per Domain Model §4)
- Include perspectives from ≥2 disciplines in every article
- End every article with function-segmented takeaways
- Book reviews must include cross_functional_value field
- No unexplained jargon — define terms inline or link to glossary

---

#### A3 — Editorial Quality Agent

**Domain:** Quality assurance for all content before publication.

**Inputs:**
- Draft Markdown files from A2
- Zod content schemas (Article schema, BookReview schema)
- CLAUDE.md editorial rules and style constraints
- TESTING_STRATEGY.md quality gates

**Outputs:**
- Validated Markdown files (schema-compliant, editorially sound)
- Quality report (issues found, corrections made, score)
- Approval recommendation for human review

**Autonomous Actions:**
- Run Zod schema validation against frontmatter (required fields, enum values, type checks)
- Proofread for grammar, spelling, punctuation, and style consistency
- Verify cross-functional coverage (≥2 disciplines addressed)
- Check that actionable takeaways exist for each function
- Validate meta description length (<155 chars) and title length (<60 chars)
- Verify reading time accuracy (word count / 200 wpm)
- Check for undefined jargon and suggest definitions
- Flag any content that uses anti-terms from Domain Model §4 (e.g., "Post" instead of "Article")
- Generate a structured quality report with pass/fail per criterion

**🚦 Human Approval Gates:**
- Final editorial sign-off on quality report and corrected content
- Human resolves any subjective quality issues flagged by agent

**Constraints:**
- Content must pass all Zod schema validations or it cannot proceed
- Zero tolerance for anti-term usage
- Quality report must accompany every piece of content

---

#### A4 — Publishing & Deployment Agent

**Domain:** Moving approved content from draft to live production via the Git-based deployment pipeline.

**Inputs:**
- Approved, validated Markdown files from A3
- GitHub repository structure and conventions
- Netlify build and deploy pipeline configuration

**Outputs:**
- Git commits to the appropriate branch
- Successful Netlify build confirmation
- Deploy preview URL (for PRs) or production URL (for main)
- Post-deploy verification report (build time, Pagefind index status)

**Autonomous Actions:**
- Create feature branches for new content
- Commit Markdown files to the correct directory (`/src/content/articles/` or `/src/content/book-reviews/`)
- Open pull requests with descriptive titles and content summaries
- Verify `npm run build` succeeds locally before pushing
- Monitor Netlify build status and capture build logs
- Verify Pagefind index includes new content post-build
- Verify deploy preview renders correctly (page loads, frontmatter renders, badges display)
- Merge to main after approval and verify production deploy
- Trigger rollback if production deploy fails health checks

**🚦 Human Approval Gates:**
- Approve pull request before merge to main
- Approve production deploy for content that touches templates or configuration

**Constraints:**
- Never deploy without explicit human instruction (CLAUDE.md rule)
- Build must complete within 120 seconds
- Lighthouse Performance Score must exceed 90 for any template changes
- All Zod validations must pass (build fails on invalid frontmatter)

---

#### A5 — Distribution & Growth Agent

**Domain:** Newsletter curation, social media repurposing, and subscriber acquisition.

**Inputs:**
- Published article URLs and metadata from A4
- Subscriber analytics from Buttondown
- Content calendar and editorial briefs from A1
- Engagement data from A6

**Outputs:**
- Weekly newsletter draft (curated from published articles)
- Social media post drafts (LinkedIn, Twitter/X) — 3–5 per article
- Subscriber growth reports
- Welcome sequence email drafts

**Autonomous Actions:**
- Curate weekly newsletter content from recently published articles
- Draft newsletter copy with cross-functional framing and article teasers
- Repurpose article content into LinkedIn posts (long-form) and Twitter threads
- Generate Open Graph and social sharing metadata verification
- Draft welcome sequence emails for new subscribers
- Segment newsletter content by discipline preference where possible
- Track and report subscriber growth metrics (new subs, churn, open rate)
- Suggest cross-promotion opportunities with complementary newsletters

**🚦 Human Approval Gates:**
- Approve weekly newsletter content and copy before send
- Approve social media post drafts before publishing
- Approve any changes to welcome sequence emails

**Constraints:**
- Newsletter must go out on a consistent weekly schedule
- Social posts must not misrepresent article content
- Subscriber data must be handled in compliance with privacy standards
- All newsletter content must emphasise the cross-functional differentiator

---

#### A6 — Analytics & Insights Agent

**Domain:** Tracking, analysing, and reporting on platform performance and content engagement.

**Inputs:**
- Plausible analytics data (page views, referrers, custom events, scroll depth)
- Buttondown metrics (open rate, click rate, subscriber growth)
- KPI targets from PRD §8.2
- Content metadata (discipline, tags, publication date)

**Outputs:**
- Weekly performance dashboard (key metrics vs. targets)
- Content performance rankings (by article, by discipline, by topic)
- Cross-discipline engagement analysis (North Star Metric tracking)
- Monthly trend reports with recommendations for A1
- Anomaly alerts (traffic spikes, engagement drops, broken pages)

**Autonomous Actions:**
- Pull and aggregate analytics data from Plausible and Buttondown APIs
- Calculate North Star Metric: Weekly Active Readers Who Engage Across Disciplines
- Generate weekly performance dashboards
- Rank content by engagement, completion rate, and social shares
- Identify cross-discipline reading patterns (readers from one discipline consuming another's content)
- Detect anomalies (unexpected traffic drops, broken referral sources, 404 spikes)
- Produce monthly insight summaries with actionable recommendations
- Track progress against 12-month success targets (25K MAR, >45% open rate, NPS >50)

**🚦 Human Approval Gates:**
- Review and acknowledge weekly dashboard (no gate — informational)
- Approve strategic recommendations that change content direction

**Constraints:**
- Analytics must be privacy-focused (Plausible is cookieless, GDPR-compliant)
- Reports must separate vanity metrics from actionable insights
- Cross-discipline engagement is the North Star — always report it prominently

---

#### A7 — Site Reliability Agent

**Domain:** Infrastructure health, performance monitoring, and technical SEO compliance.

**Inputs:**
- Netlify deploy logs and build metrics
- Lighthouse audit results
- Pagefind index status
- SEO crawl data (sitemap, robots.txt, meta tags)
- Performance budgets from SRD §12.1

**Outputs:**
- Build health reports (time, success/failure, warnings)
- Lighthouse audit reports (Performance, Accessibility, SEO scores)
- SEO compliance reports (meta tags, Open Graph, structured data, sitemap coverage)
- Uptime and availability reports
- Performance budget violation alerts

**Autonomous Actions:**
- Run Lighthouse audits on all page templates after every deploy
- Verify TTFB <200ms, LCP <2.5s, CLS <0.1, FID <100ms
- Monitor Netlify build times and flag if approaching 120s threshold
- Validate sitemap.xml includes all published URLs
- Verify robots.txt allows crawling
- Check Open Graph tags render correctly (LinkedIn/Twitter preview validation)
- Validate RSS feed at /rss.xml is complete and well-formed
- Monitor 99.9% uptime SLA via Netlify CDN status
- Run accessibility audits (WCAG 2.1 AA, Lighthouse Accessibility >95)
- Alert on any performance budget violations
- Verify Pagefind search returns results within 100ms for the current content volume

**🚦 Human Approval Gates:**
- Approve remediation plan for any critical performance or SEO regression
- Approve infrastructure changes (Netlify config, DNS, CDN rules)

**Constraints:**
- All performance budgets from SRD §12.1 are non-negotiable thresholds
- Never modify infrastructure configuration without human approval
- Lighthouse scores: Performance >90, Accessibility >95, SEO >95

---

## 3. Part 2: Skills

Skills are the specific capabilities agents need to execute their responsibilities. Each skill belongs to exactly one functional category. An agent may draw from multiple skill categories.

### 3.1 Skills Matrix (Agent × Skill Mapping)

| Skill Category | A1 Strategy | A2 Author | A3 Quality | A4 Publish | A5 Distribute | A6 Analytics | A7 Reliability |
|----------------|:-----------:|:---------:|:----------:|:----------:|:-------------:|:------------:|:--------------:|
| 1. Editorial & Content | ● | ● | ● | | ● | | |
| 2. Technical Writing | | ● | ● | | | | |
| 3. Schema & Validation | | ● | ● | ● | | | |
| 4. Git & Version Control | | | | ● | | | |
| 5. Build & Deploy | | | | ● | | | ● |
| 6. Newsletter & Email | | | | | ● | | |
| 7. Social Media & Distribution | ● | | | | ● | | |
| 8. Data Analysis & Reporting | ● | | | | | ● | |
| 9. SEO & Discoverability | | ● | ● | | | | ● |
| 10. Performance & Monitoring | | | | | | | ● |
| 11. Accessibility & Compliance | | | ● | | | | ● |
| 12. Research & Competitive Intel | ● | ● | | | ● | ● | |

---

### 3.2 Skill Specifications

#### 1. Editorial & Content Skills

These skills govern how content is planned, structured, and maintained to meet ProductBuilders.io's editorial standards.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Content Pillar Mapping | Classify every piece of content into one of four pillars: Cross-Functional Collaboration, Technical Literacy, Career Growth, Book Reviews | Advanced | A1 |
| Cross-Functional Framing | Ensure every article surfaces perspectives from ≥2 disciplines and explains how PM, Design, and Engineering decisions interconnect | Advanced | A1, A2, A3 |
| Editorial Brief Writing | Produce structured briefs containing: topic, target discipline, cross-functional angle, target keywords, suggested sources, and target word count | Intermediate | A1 |
| Content Calendar Management | Maintain a rolling 4-week editorial calendar balanced across disciplines and pillars, aligned to PRD §7.3 | Intermediate | A1 |
| Book Review Curation | Select and prioritise books by discipline coverage gaps, career level distribution, and cross-functional relevance | Intermediate | A1, A2 |
| Actionable Takeaway Segmentation | Write function-specific takeaways (For PMs: / For Engineers: / For Designers:) that give concrete next steps | Advanced | A2, A3 |
| Jargon Management | Identify discipline-specific jargon, define it inline, or link to a glossary entry — zero unexplained terms | Intermediate | A2, A3 |
| Newsletter Curation | Select, sequence, and frame published articles for weekly email distribution with compelling subject lines and teasers | Intermediate | A5 |

---

#### 2. Technical Writing Skills

These skills ensure content meets the specific technical and structural requirements of the platform's Markdown-first workflow.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Markdown Authoring | Write clean, well-structured Markdown with proper heading hierarchy, code blocks, links, and images | Advanced | A2 |
| YAML Frontmatter Authoring | Produce valid YAML frontmatter fields matching Zod schema definitions (Article and BookReview schemas) | Advanced | A2, A3 |
| Reading Time Calculation | Accurately compute reading time at 200 wpm and set the appropriate frontmatter field | Basic | A2 |
| Meta Description Copywriting | Write compelling SEO meta descriptions under 155 characters that include primary keywords and convey article value | Intermediate | A2 |
| Domain Language Enforcement | Use the Ubiquitous Language Glossary (Domain Model §4) consistently — Article (not Post), Product Builder (not User), Discipline (not Category) | Advanced | A2, A3 |

---

#### 3. Schema & Validation Skills

These skills ensure all content conforms to the platform's type-safe content pipeline.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Zod Schema Validation | Run Zod schema checks against frontmatter and understand error messages to diagnose and fix validation failures | Advanced | A3, A4 |
| Article Schema Compliance | Validate all Article fields: title, description, disciplines (enum array), tags, publishDate, draft status, and optional fields | Advanced | A2, A3 |
| BookReview Schema Compliance | Validate all BookReview fields: title, author, discipline (single enum), level (enum), rating (1–5), publication_year (≥5 years old), cross_functional_value, key_takeaways (3–5), who_should_read | Advanced | A2, A3 |
| Frontmatter Debugging | Diagnose and resolve build failures caused by invalid frontmatter (type mismatches, missing required fields, invalid enum values) | Intermediate | A3, A4 |
| Content Lifecycle Management | Manage content state transitions: DRAFT → IN_REVIEW → PUBLISHED → UPDATED → ARCHIVED (per SRD §5.3) | Intermediate | A3, A4 |

---

#### 4. Git & Version Control Skills

These skills govern how content moves through the Git-based publishing pipeline.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Branch Management | Create feature branches for new content, name them conventionally (e.g., `content/article-slug`), and manage PR lifecycle | Advanced | A4 |
| Git Commit Hygiene | Write descriptive commit messages following conventional commit format; commit Markdown files to correct directory paths | Intermediate | A4 |
| Pull Request Management | Open PRs with content summaries, request human review, manage approval workflow, and merge after approval | Intermediate | A4 |
| Merge Conflict Resolution | Detect and resolve content merge conflicts (concurrent edits to same files or shared configuration) | Basic | A4 |
| Git-Based Content Auditing | Use Git history to track content changes, publication dates, and update frequency | Basic | A4 |

---

#### 5. Build & Deploy Skills

These skills manage the Astro SSG build pipeline and Netlify deployment.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Astro Build Execution | Run `npm run build` locally, interpret build output, and diagnose build failures (Zod errors, missing assets, template issues) | Advanced | A4, A7 |
| Netlify Deploy Management | Monitor Netlify auto-deploy on Git push, verify atomic deployments, and trigger rollbacks when needed | Advanced | A4, A7 |
| Deploy Preview Verification | Inspect deploy preview URLs for content rendering, frontmatter display, badge colours, navigation, and responsive layout | Intermediate | A4 |
| Pagefind Index Verification | Confirm Pagefind post-build indexing completes successfully and new content appears in search results | Intermediate | A4, A7 |
| Build Performance Monitoring | Track build duration against 120s budget, identify slow steps, and flag regressions | Basic | A7 |

---

#### 6. Newsletter & Email Skills

These skills manage the Buttondown-powered newsletter operation.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Buttondown API Integration | Use the Buttondown REST API to manage subscribers, send emails, and retrieve engagement metrics | Advanced | A5 |
| Email Copy Drafting | Write newsletter copy with compelling subject lines, article teasers, and clear CTAs that emphasise cross-functional value | Advanced | A5 |
| Welcome Sequence Design | Create and maintain an automated welcome email sequence for new subscribers that introduces the platform's cross-functional mission | Intermediate | A5 |
| Subscriber Segmentation | Segment subscriber lists by discipline preference (PM, Design, Engineering) for targeted content recommendations | Intermediate | A5 |
| Email Deliverability Management | Monitor open rates, click rates, bounce rates, and spam complaints; maintain list hygiene | Basic | A5 |

---

#### 7. Social Media & Distribution Skills

These skills repurpose content for social platforms to drive subscriber growth.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| LinkedIn Content Repurposing | Transform articles into 3–5 long-form LinkedIn posts with hooks, value delivery, and newsletter CTAs | Advanced | A5 |
| Twitter/X Thread Writing | Distill article insights into concise, engaging tweet threads with visual hooks and engagement prompts | Intermediate | A5 |
| Social Scheduling & Cadence | Plan and maintain a consistent posting cadence aligned to the editorial calendar | Basic | A5 |
| Cross-Promotion Outreach | Identify and engage with complementary newsletters and content creators for mutual promotion | Intermediate | A1, A5 |
| UTM Parameter Management | Apply consistent UTM tracking parameters to all shared links for attribution in Plausible | Basic | A5 |

---

#### 8. Data Analysis & Reporting Skills

These skills power the analytics feedback loop that drives content strategy.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Plausible Analytics Querying | Pull data from Plausible's API: page views, referrers, custom events (scroll depth, search queries, signup events) | Advanced | A6 |
| KPI Dashboard Generation | Build weekly dashboards tracking: Monthly Active Readers, newsletter open rate, article completion rate, cross-discipline reads, NPS | Advanced | A6 |
| North Star Metric Calculation | Compute "Weekly Active Readers Who Engage Across Disciplines" by correlating reader discipline with content discipline | Advanced | A6 |
| Content Performance Ranking | Rank articles by engagement (views, completion rate, shares), identify top performers and underperformers | Intermediate | A6 |
| Trend Analysis & Forecasting | Identify month-over-month trends in key metrics and project trajectory against 12-month targets | Intermediate | A6 |
| Anomaly Detection | Detect sudden drops or spikes in traffic, engagement, or subscriber metrics and generate alerts | Basic | A6 |
| Actionable Insight Synthesis | Translate raw data into strategic recommendations for A1 (e.g., "Engineering content underperforms — increase cross-functional framing") | Advanced | A1, A6 |

---

#### 9. SEO & Discoverability Skills

These skills ensure content ranks well in search engines and renders correctly when shared.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| On-Page SEO Optimisation | Ensure proper heading hierarchy (H1 > H2 > H3), keyword placement, internal linking, and semantic HTML | Advanced | A2, A3 |
| Meta Tag Validation | Verify title (<60 chars), meta description (<155 chars), canonical URLs, and Open Graph / Twitter Card tags on every page | Advanced | A3, A7 |
| Structured Data (JSON-LD) | Validate JSON-LD Article schema markup on article pages for rich search results | Intermediate | A7 |
| Sitemap & Robots Management | Verify sitemap.xml includes all published URLs and robots.txt allows crawling | Intermediate | A7 |
| RSS Feed Validation | Ensure /rss.xml is complete, well-formed, and includes all published content | Basic | A7 |
| Social Preview Testing | Verify Open Graph tags render correct previews on LinkedIn, Twitter, and Slack | Intermediate | A3, A7 |

---

#### 10. Performance & Monitoring Skills

These skills ensure the site meets its performance budgets and availability targets.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Lighthouse Auditing | Run Lighthouse CI on all page templates; enforce thresholds: Performance >90, Accessibility >95, SEO >95 | Advanced | A7 |
| Core Web Vitals Monitoring | Track TTFB (<200ms), LCP (<2.5s), CLS (<0.1), FID (<100ms) continuously | Advanced | A7 |
| Page Weight Analysis | Monitor compressed page weight against <100KB budget; identify heavy assets | Intermediate | A7 |
| Uptime Monitoring | Track 99.9% uptime SLA via Netlify CDN status; alert on outages | Basic | A7 |
| Search Performance Testing | Verify Pagefind client-side search returns results within 100ms for current content volume (150+ items) | Intermediate | A7 |
| Build Pipeline Health | Monitor CI/CD pipeline health: build success rate, average build time, deploy frequency | Intermediate | A7 |

---

#### 11. Accessibility & Compliance Skills

These skills ensure the platform is usable by all readers and meets regulatory requirements.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| WCAG 2.1 AA Compliance | Verify 4.5:1 colour contrast ratios, keyboard navigation, ARIA labels, semantic HTML, skip-to-content links | Advanced | A3, A7 |
| Alt Text Authoring | Write descriptive, meaningful alt text for all images in articles and book reviews | Intermediate | A3 |
| Motion Sensitivity | Verify all animations respect `prefers-reduced-motion` media query | Basic | A7 |
| Privacy Compliance | Ensure Plausible analytics is cookieless and GDPR-compliant; no tracking without consent where required | Intermediate | A7 |

---

#### 12. Research & Competitive Intelligence Skills

These skills keep the platform informed about its market, audience, and competitive landscape.

| Skill | Description | Proficiency Required | Used By |
|-------|-------------|---------------------|---------|
| Audience Research | Survey and interview mid-career product professionals (3–8 years experience) to validate content resonance and identify unmet needs | Intermediate | A1 |
| Competitor Monitoring | Track competitor newsletters (Lenny's, UX Collective) for topic coverage, positioning, and engagement benchmarks | Intermediate | A1, A6 |
| Trend Identification | Identify emerging topics in product management, design, and engineering that merit coverage | Intermediate | A1, A2 |
| Book Discovery | Research and evaluate professional development books across all three disciplines for the review pipeline | Intermediate | A1, A2 |
| Market Opportunity Assessment | Apply the Opportunity Score framework (IMP + max(IMP - SAT, 0); scores >12 = high opportunity) from MRD to evaluate new content areas | Advanced | A1, A6 |

---

## 4. Part 3: MCPs (Model Context Protocols)

MCPs are the integration interfaces that connect agents to external tools, APIs, and data sources. Each MCP serves a distinct system boundary and provides a standardised way for agents to interact with the outside world.

### 4.1 MCP Registry

| ID | MCP Name | External System | Primary Agent(s) | Direction | Auth Method |
|----|---------|-----------------|-------------------|-----------|-------------|
| M1 | GitHub MCP | GitHub API | A4 | Read/Write | Personal Access Token |
| M2 | Netlify MCP | Netlify API | A4, A7 | Read/Write | OAuth / API Token |
| M3 | Buttondown MCP | Buttondown API | A5, A6 | Read/Write | API Key |
| M4 | Plausible MCP | Plausible API | A6, A7 | Read-Only | API Key |
| M5 | File System MCP | Local / Git Repo | A2, A3, A4 | Read/Write | Filesystem Access |
| M6 | Web Research MCP | Search Engines / Web | A1, A2, A5, A6 | Read-Only | Web Search Tool |
| M7 | Lighthouse MCP | Lighthouse CI | A7 | Read-Only | CLI / Local Execution |
| M8 | Social Platform MCP | LinkedIn, Twitter/X APIs | A5 | Write | OAuth / API Tokens |

---

### 4.2 MCP Specifications

#### M1 — GitHub MCP

**Purpose:** Manage the Git-based content pipeline — branches, commits, pull requests, and repository state.

**External System:** GitHub REST & GraphQL APIs

**Capabilities:**

| Operation | Endpoint / Action | Agent | Human Gate? |
|-----------|------------------|-------|-------------|
| Create branch | `POST /repos/{owner}/{repo}/git/refs` | A4 | No |
| Commit files | `PUT /repos/{owner}/{repo}/contents/{path}` | A4 | No |
| Open pull request | `POST /repos/{owner}/{repo}/pulls` | A4 | No |
| List PR status | `GET /repos/{owner}/{repo}/pulls/{number}` | A4 | No |
| Merge pull request | `PUT /repos/{owner}/{repo}/pulls/{number}/merge` | A4 | 🚦 Yes |
| Get build status | `GET /repos/{owner}/{repo}/commits/{sha}/status` | A4, A7 | No |
| List recent commits | `GET /repos/{owner}/{repo}/commits` | A4, A7 | No |
| Read file contents | `GET /repos/{owner}/{repo}/contents/{path}` | A2, A3 | No |

**Configuration:**
- Repository: `tshepo-machele/productbuilders.io` (or equivalent)
- Default branch: `main`
- Branch naming: `content/{article-slug}`, `review/{book-slug}`, `fix/{description}`
- Commit message format: `content: add article "{title}"` or `review: add book review "{title}"`

**Error Handling:**
- Rate limit (5,000 req/hr): Implement exponential backoff; queue non-urgent operations
- Merge conflicts: Alert A4 to resolve; escalate to human if resolution is ambiguous
- Auth failure: Alert human immediately; do not retry with invalid credentials

---

#### M2 — Netlify MCP

**Purpose:** Manage builds, deploys, and site configuration on Netlify's hosting platform.

**External System:** Netlify REST API

**Capabilities:**

| Operation | Endpoint / Action | Agent | Human Gate? |
|-----------|------------------|-------|-------------|
| Get site info | `GET /sites/{site_id}` | A7 | No |
| List deploys | `GET /sites/{site_id}/deploys` | A4, A7 | No |
| Get deploy details | `GET /deploys/{deploy_id}` | A4, A7 | No |
| Trigger build | `POST /builds` (via webhook or API) | A4 | No |
| Lock/unlock deploys | `POST /deploys/{id}/lock` | A4 | 🚦 Yes |
| Rollback deploy | `POST /sites/{site_id}/rollback` | A4, A7 | 🚦 Yes |
| Get build log | `GET /deploys/{deploy_id}/log` | A7 | No |
| Check DNS | `GET /dns_zones/{zone_id}/dns_records` | A7 | No |

**Configuration:**
- Site: productbuilders.io
- Build command: `npm run build` (Astro SSG + Pagefind indexing)
- Publish directory: `dist/`
- Auto-deploy: Enabled on `main` branch push
- Deploy previews: Enabled on pull requests

**Health Checks (A7 runs after every deploy):**
1. Build completed successfully (exit code 0)
2. Build time < 120 seconds
3. Deploy status = "ready"
4. Homepage returns 200
5. Sample article returns 200
6. Pagefind assets exist in deploy

**Error Handling:**
- Build failure: Capture build log, identify failing step, alert human with diagnosis
- Deploy timeout: Retry once; if persistent, alert human
- Rollback trigger: Automatic if post-deploy health checks fail (with human notification)

---

#### M3 — Buttondown MCP

**Purpose:** Manage newsletter subscribers, send emails, and retrieve engagement metrics.

**External System:** Buttondown REST API

**Capabilities:**

| Operation | Endpoint / Action | Agent | Human Gate? |
|-----------|------------------|-------|-------------|
| List subscribers | `GET /subscribers` | A5, A6 | No |
| Get subscriber count | `GET /subscribers` (count) | A6 | No |
| Create draft email | `POST /emails` (draft status) | A5 | No |
| Send email | `PUT /emails/{id}` (publish) | A5 | 🚦 Yes |
| Get email metrics | `GET /emails/{id}` (open/click rates) | A6 | No |
| List all emails | `GET /emails` | A5, A6 | No |
| Manage tags | `POST /tags`, `GET /tags` | A5 | No |
| Get subscriber by email | `GET /subscribers/{email}` | A5 | No |
| Update subscriber | `PATCH /subscribers/{id}` | A5 | No |

**Configuration:**
- Newsletter name: ProductBuilders Weekly
- Send frequency: Weekly (consistent day/time)
- Discipline tags: `pm`, `design`, `engineering`
- Free tier limit: <100 subscribers (upgrade path defined)

**Data Flow:**
- New subscriber → Buttondown captures email + discipline preference → Welcome sequence triggers → Weekly emails begin
- Article published → A5 curates for newsletter → Draft created via API → Human approves → Send via API

**Error Handling:**
- Rate limiting: Respect Buttondown rate limits; queue operations
- Bounce management: Auto-unsubscribe after 3 hard bounces
- Send failure: Retry once; alert human if persistent

---

#### M4 — Plausible MCP

**Purpose:** Retrieve privacy-focused analytics data for performance tracking and content insights.

**External System:** Plausible Analytics API

**Capabilities:**

| Operation | Endpoint / Action | Agent | Human Gate? |
|-----------|------------------|-------|-------------|
| Get aggregate stats | `GET /stats/aggregate` | A6 | No |
| Get timeseries | `GET /stats/timeseries` | A6 | No |
| Get breakdown (by page) | `GET /stats/breakdown?property=event:page` | A6 | No |
| Get breakdown (by source) | `GET /stats/breakdown?property=visit:source` | A6 | No |
| Get breakdown (by country) | `GET /stats/breakdown?property=visit:country` | A6 | No |
| Get custom events | `GET /stats/breakdown?property=event:name` | A6, A7 | No |
| Get real-time visitors | `GET /stats/realtime/visitors` | A6 | No |

**Custom Events Tracked:**
- `scroll_depth` — 25%, 50%, 75%, 100% article completion
- `search_query` — Pagefind search terms used
- `newsletter_signup` — Subscription form submissions
- `discipline_filter` — Archive page filter selections
- `outbound_click` — Clicks to external resources (affiliate links, book purchases)

**Metric Definitions (mapped to PRD §8.2):**

| KPI | Plausible Query | Target |
|-----|----------------|--------|
| Monthly Active Readers | Unique visitors, 30-day window | 25,000 by M12 |
| Article Completion Rate | scroll_depth = 100% / total pageviews | >60% |
| Monthly Returning Readers | Returning visitors / total visitors | >40% |
| Cross-Discipline Reads | Pageviews where reader discipline ≠ content discipline | >40% |
| Search Queries/Month | Count of search_query events | 1,000 by M9 |

**Error Handling:**
- API unavailable: Cache last known data; report stale data age
- Rate limiting: Batch requests; max 600 req/hr on free plan

---

#### M5 — File System MCP

**Purpose:** Read, write, and validate Markdown content files and configuration in the local repository.

**External System:** Local filesystem / Git working directory

**Capabilities:**

| Operation | Path Pattern | Agent | Human Gate? |
|-----------|-------------|-------|-------------|
| Read article | `/src/content/articles/{slug}.md` | A2, A3, A4 | No |
| Write article | `/src/content/articles/{slug}.md` | A2, A4 | No |
| Read book review | `/src/content/book-reviews/{slug}.md` | A2, A3, A4 | No |
| Write book review | `/src/content/book-reviews/{slug}.md` | A2, A4 | No |
| Read config | `/src/content/config.ts` (Zod schemas) | A3 | No |
| Read Astro config | `/astro.config.mjs` | A4, A7 | No |
| List content | `/src/content/articles/`, `/src/content/book-reviews/` | A1, A3, A6 | No |
| Read build output | `/dist/**` | A7 | No |
| Read Pagefind index | `/dist/pagefind/` | A7 | No |

**File Naming Conventions:**
- Articles: `{kebab-case-slug}.md` (e.g., `why-product-builders-need-cross-functional-literacy.md`)
- Book reviews: `{kebab-case-book-title}.md` (e.g., `inspired-how-to-create-tech-products.md`)
- Images: `/public/images/articles/{slug}/` or `/public/images/book-reviews/{slug}/`

**Validation Rules (enforced by A3 before A4 commits):**
- File must parse as valid Markdown with YAML frontmatter
- Frontmatter must pass Zod schema validation
- File must be saved with UTF-8 encoding
- Slug must be unique across all content

---

#### M6 — Web Research MCP

**Purpose:** Search the web for trending topics, competitive intelligence, book information, and factual verification.

**External System:** Web search engines, web pages

**Capabilities:**

| Operation | Use Case | Agent | Human Gate? |
|-----------|---------|-------|-------------|
| Topic research | Find trending product management, design, and engineering topics | A1, A2 | No |
| Competitor analysis | Monitor competitor newsletters and content platforms | A1, A6 | No |
| Book lookup | Research book details (author, publication year, reviews, key themes) | A1, A2 | No |
| Fact verification | Verify claims, statistics, and references in article drafts | A2, A3 | No |
| Cross-promotion discovery | Identify complementary newsletters and creators for partnership | A5 | No |
| Industry news | Track product industry developments for timely content | A1 | No |

**Usage Guidelines:**
- Keep search queries short and specific (1–6 words)
- Favour original sources (company blogs, peer-reviewed papers, official documentation) over aggregators
- Verify information across multiple sources before including in content
- Always cite sources in article content where appropriate

---

#### M7 — Lighthouse MCP

**Purpose:** Run automated performance, accessibility, and SEO audits against the deployed site.

**External System:** Lighthouse CI (local CLI execution)

**Capabilities:**

| Operation | Command / Action | Agent | Human Gate? |
|-----------|-----------------|-------|-------------|
| Performance audit | `lhci autorun` | A7 | No |
| Accessibility audit | `lhci autorun --collect.settings.onlyCategories=accessibility` | A7 | No |
| SEO audit | `lhci autorun --collect.settings.onlyCategories=seo` | A7 | No |
| Full audit | `lhci autorun` (all categories) | A7 | No |
| Compare to baseline | `lhci assert --preset=lighthouse:recommended` | A7 | No |

**Thresholds (from SRD §12.1 and TESTING_STRATEGY.md):**

| Category | Minimum Score | Action on Failure |
|----------|--------------|-------------------|
| Performance | >90 | Block deploy; alert human |
| Accessibility | >95 | Block deploy; alert human |
| SEO | >95 | Block deploy; alert human |
| Best Practices | >90 | Warning; investigate |

**Execution Schedule:**
- After every production deploy (automated)
- Weekly full audit of all page templates (scheduled)
- On-demand when A4 makes template or configuration changes

---

#### M8 — Social Platform MCP

**Purpose:** Publish content to social media platforms for distribution and subscriber acquisition.

**External System:** LinkedIn API, Twitter/X API (or scheduling tools like Buffer/Typefully)

**Capabilities:**

| Operation | Platform | Agent | Human Gate? |
|-----------|---------|-------|-------------|
| Draft LinkedIn post | LinkedIn | A5 | 🚦 Yes |
| Publish LinkedIn post | LinkedIn | A5 | 🚦 Yes |
| Draft Twitter thread | Twitter/X | A5 | 🚦 Yes |
| Publish Twitter thread | Twitter/X | A5 | 🚦 Yes |
| Schedule posts | Both | A5 | 🚦 Yes |
| Get engagement metrics | Both | A6 | No |

**Content Guidelines:**
- LinkedIn: Long-form posts (800–1,300 characters), professional tone, end with newsletter CTA
- Twitter/X: Thread format (5–8 tweets), punchy hooks, visual elements where possible
- All posts: Include UTM-tagged links back to articles

**Social posts always require human approval before publishing.**

---

### 4.3 MCP Dependency Map

```
                    ┌─────────────────────────────┐
                    │   M6: Web Research MCP       │
                    │   (Read-Only)                │
                    └──────────┬──────────────────-┘
                               │ Research inputs
                               ▼
┌─────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│ M4: Plausible│◄───│ A1: Content         │───►│ A2: Content      │
│ (Read-Only)  │    │     Strategist      │    │     Author       │
└──────┬───────┘    └─────────────────────┘    └────────┬─────────┘
       │                                                │
       │ Analytics                                      │ Markdown files
       ▼                                                ▼
┌─────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│ A6: Analytics│    │ M5: File System MCP  │◄───│ A3: Editorial    │
│    Agent     │    │ (Read/Write)         │    │     Quality      │
└──────────────┘    └──────────┬───────────┘    └────────┬─────────┘
                               │                         │
                               │ Validated files          │ Approved content
                               ▼                         ▼
                    ┌─────────────────────────────────────────┐
                    │         A4: Publishing &                 │
                    │         Deployment Agent                 │
                    └──────────┬──────────┬───────────────────┘
                               │          │
                    ┌──────────▼──┐  ┌────▼──────────┐
                    │ M1: GitHub   │  │ M2: Netlify   │
                    │ (Read/Write) │  │ (Read/Write)  │
                    └──────────────┘  └───────────────┘
                                          │
                              Published site
                                          │
                    ┌─────────────────────┼──────────────────┐
                    │                     │                  │
              ┌─────▼──────┐    ┌────────▼────────┐  ┌──────▼──────┐
              │ M3:Buttondown│   │ M7: Lighthouse  │  │ M8: Social  │
              │ (Read/Write) │   │ (Read-Only)     │  │ (Write)     │
              └──────────────┘   └─────────────────┘  └─────────────┘
                    │                     │                  │
              ┌─────▼──────┐    ┌────────▼────────┐  ┌──────▼──────┐
              │ A5: Distrib.│   │ A7: Site        │  │ A5: Distrib.│
              │     Agent   │   │    Reliability  │  │     Agent   │
              └─────────────┘   └─────────────────┘  └─────────────┘
```

---

## 5. Orchestration & Governance

### 5.1 End-to-End Content Lifecycle

This is the complete flow from ideation to published, distributed content — showing which agent owns each step and where human approval is required.

| Step | Agent | Action | Output | Human Gate? |
|------|-------|--------|--------|-------------|
| 1 | A6 | Generate weekly performance report | Performance dashboard | No |
| 2 | A1 | Analyse report + research trends → draft editorial brief | Editorial brief | 🚦 Yes |
| 3 | A2 | Write article/review from approved brief | Draft Markdown file | 🚦 Yes |
| 4 | A3 | Validate schema, proofread, check cross-functional coverage | Quality report + corrected file | 🚦 Yes |
| 5 | A4 | Create branch, commit, open PR | Pull request | No |
| 6 | A4 | Verify build succeeds on deploy preview | Deploy preview URL | No |
| 7 | Human | Review PR + deploy preview | Merge approval | 🚦 Yes |
| 8 | A4 | Merge to main → Netlify auto-deploys | Production URL | No |
| 9 | A7 | Run post-deploy health checks + Lighthouse audit | Health report | No (alert on failure) |
| 10 | A5 | Curate newsletter + draft social posts | Newsletter draft + social drafts | 🚦 Yes |
| 11 | A5 | Send newsletter + publish social posts | Sent email + live posts | No |
| 12 | A6 | Track engagement and update dashboards | Updated metrics | No |

### 5.2 Approval Gate Summary

| Gate | Who Approves | What They're Approving | SLA |
|------|-------------|----------------------|-----|
| Editorial brief | Tshepo | Topic, angle, discipline balance | 24 hours |
| Article draft | Tshepo | Content quality, voice, accuracy | 48 hours |
| Quality report | Tshepo | Final editorial sign-off | 24 hours |
| Pull request merge | Tshepo | Content + build verification | 24 hours |
| Newsletter send | Tshepo | Email copy, subject line, content selection | 12 hours |
| Social posts | Tshepo | Post copy, tone, links | 12 hours |
| Infrastructure changes | Tshepo | Any config or DNS modification | Immediate |
| Remediation plans | Tshepo | Response to performance/SEO regression | 24 hours |

### 5.3 Escalation Protocol

| Severity | Condition | Action | Agent Responsible |
|----------|-----------|--------|-------------------|
| Critical | Production site is down or returning errors | Trigger Netlify rollback → alert human immediately | A7 |
| High | Build failure on main branch | Capture logs → diagnose → propose fix → alert human | A4, A7 |
| High | Lighthouse score drops below threshold | Block future deploys → alert human with report | A7 |
| Medium | Content fails Zod validation | Return to A3 with error details → A3 corrects → re-validate | A3, A4 |
| Medium | Newsletter open rate drops below 30% | A6 alerts A1 → A1 proposes content strategy adjustment | A6, A1 |
| Low | Build time exceeds 90s (warning zone) | Log warning → investigate on next cycle | A7 |
| Low | Social post underperforms | A6 notes in report → A1 adjusts strategy next cycle | A6, A1 |

### 5.4 Weekly Operating Rhythm

| Day | Activity | Agent(s) | Human Involvement |
|-----|----------|----------|-------------------|
| Monday | Performance review + editorial brief generation | A6, A1 | Review + approve brief |
| Tuesday | Content drafting begins | A2 | None |
| Wednesday | Draft completed → quality review | A2, A3 | Review draft |
| Thursday | Final approval + publish | A3, A4 | Approve PR + merge |
| Friday | Newsletter curation + social drafts | A5 | Approve newsletter + social posts |
| Saturday | Newsletter send + social publishing | A5 | None (pre-approved) |
| Sunday | Weekly analytics aggregation + health checks | A6, A7 | None |

---

*Last updated: 2025-02-11*
