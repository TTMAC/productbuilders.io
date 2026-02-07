# PRODUCT REQUIREMENTS DOCUMENT

## ProductBuilders.io
*Cross-Functional Content Platform for Product Teams*

| Document Owner | Version | Status | Target Launch |
|----------------|---------|--------|---------------|
| Tshepo Machele | 1.0 | Draft | Q2 2025 |

| Created | Last Updated | Source MRD | Dev Partner |
|---------|--------------|------------|-------------|
| 2025-02-04 | 2025-02-04 | v0.1 | Claude Code |

> **🚀 Development Approach**
> 
> This platform will be developed using Claude Code in partnership with Tshepo Machele, enabling rapid AI-assisted development with full-stack capabilities. Technical stack: Astro (static site generator), Decap CMS (content management), Netlify (hosting), Pagefind (search).

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas & Use Cases](#2-user-personas--use-cases)
3. [Feature Requirements](#3-feature-requirements)
4. [Book Review Platform](#4-book-review-platform)
5. [Technical Architecture](#5-technical-architecture)
6. [User Interface Requirements](#6-user-interface-requirements)
7. [Content Strategy](#7-content-strategy)
8. [Analytics & Success Metrics](#8-analytics--success-metrics)
9. [Release Plan](#9-release-plan)
10. [Dependencies & Assumptions](#10-dependencies--assumptions)
11. [Appendices](#11-appendices)

---

## 1. Product Overview

### 1.1 Product Vision

ProductBuilders.io is the first content platform designed explicitly for cross-functional product literacy. The platform delivers integrated perspectives where every article surfaces how design, engineering, and product decisions interconnect, enabling product builders to develop shared vocabulary and mutual understanding that transforms functional collaboration from conflict to co-creation.

### 1.2 Problem Statement

> **Core Problem**
> 
> Product builders (designers, engineers, and product managers) struggle to develop holistic product thinking skills because existing knowledge resources are siloed by discipline. This results in cross-functional friction, longer alignment cycles, and products that fail to balance technical feasibility, user desirability, and business viability.

### 1.3 Target Audience

**Primary:** Mid-career product professionals (3-8 years experience) at technology companies transitioning into leadership roles or seeking to expand their influence across functions.

| Product Managers | Designers | Engineers |
|------------------|-----------|-----------|
| Need technical literacy to communicate constraints effectively | Need PM context to prioritize user value vs. business goals | Need design thinking to contribute beyond code |

### 1.4 Success Criteria

| Metric | Target | Timeline |
|--------|--------|----------|
| Monthly Active Readers | 25,000 | 12 months |
| Newsletter Open Rate | >45% | 6 months |
| Net Promoter Score (NPS) | >50 | 12 months |
| Cross-Discipline Engagement | 40% | 12 months |
| Book Reviews Published | 150+ | 12 months |

---

## 2. User Personas & Use Cases

### 2.1 Primary Personas

#### Persona 1: The Aspiring PM Lead

| Attribute | Details |
|-----------|---------|
| Name | Maya Chen |
| Role | Senior Product Manager at Series C SaaS startup |
| Experience | 5 years in product management |
| Goal | Transition to Product Director role; needs to lead cross-functional teams more effectively |
| Pain Point | Engineering pushback feels personal; struggles to understand technical constraints without asking 'dumb' questions |
| Success Metric | Reduce alignment meetings by 30%; gain engineer respect through technical literacy |

#### Persona 2: The Full-Stack Ambitioner

| Attribute | Details |
|-----------|---------|
| Name | James Okonkwo |
| Role | Staff Engineer at mid-size fintech |
| Experience | 7 years in software engineering |
| Goal | Move into technical product management or engineering leadership |
| Pain Point | Excellent at building; struggles to understand why PM priorities shift; feels disconnected from business context |
| Success Metric | Contribute meaningfully in product reviews; propose features that balance tech and business value |

#### Persona 3: The Strategic Designer

| Attribute | Details |
|-----------|---------|
| Name | Priya Sharma |
| Role | Senior UX Designer at enterprise tech company |
| Experience | 6 years in design, transitioning from agency to product |
| Goal | Become a design leader who can advocate for user needs in business terms |
| Pain Point | Beautiful designs get rejected for 'technical complexity' she doesn't fully understand |
| Success Metric | Propose designs that engineering champions; speak product metrics fluently |

### 2.2 User Stories

#### Content Discovery & Consumption

- As a product professional, I want to subscribe to a newsletter so that I receive curated cross-functional content weekly without having to remember to visit the site.
- As a PM, I want to read articles that explain engineering constraints in business terms so that I can anticipate pushback and adjust my proposals accordingly.
- As a designer, I want to understand how technical debt affects design systems so that I can propose scalable solutions.
- As an engineer, I want to learn how PMs prioritize features so that I can contribute more strategically to roadmap discussions.

#### Book Review Platform

- As a junior professional, I want to find recommended books for my discipline organized by career level so that I can build foundational knowledge efficiently.
- As a mid-level professional, I want to discover books from adjacent disciplines so that I can develop T-shaped skills.
- As a senior professional, I want to filter books by cross-functional topics so that I can deepen my leadership capabilities.
- As any user, I want to search book reviews by title, author, or topic so that I can quickly find relevant resources.

---

## 3. Feature Requirements

### 3.1 MVP Features (Phase 1 - Month 1-3)

#### F1: Blog Platform

| ID | Requirement |
|----|-------------|
| F1.1 | Static site with fast page load (<2s) and SEO optimization |
| F1.2 | Article pages with reading time estimate, discipline tags, and related articles |
| F1.3 | Homepage featuring latest articles and curated collections |
| F1.4 | Archive page with filtering by discipline (PM, Design, Engineering) |
| F1.5 | About page explaining cross-functional mission |
| F1.6 | Mobile-responsive design (primary consumption on mobile) |

#### F2: Newsletter System

| ID | Requirement |
|----|-------------|
| F2.1 | Email capture form with discipline preference selection |
| F2.2 | Welcome email sequence (3 emails introducing cross-functional philosophy) |
| F2.3 | Weekly newsletter with featured article and curated picks |
| F2.4 | One-click unsubscribe compliance |
| F2.5 | Integration with Buttondown or ConvertKit for subscriber management |

#### F3: Content Management

| ID | Requirement |
|----|-------------|
| F3.1 | Decap CMS integration for visual content editing |
| F3.2 | Markdown support with YAML frontmatter for metadata |
| F3.3 | Git-based content storage (GitHub) |
| F3.4 | Auto-deploy on content commit via Netlify |
| F3.5 | Draft/publish workflow |

### 3.2 Phase 2 Features (Month 4-6)

#### F4: Book Review Platform (See Section 4 for detailed requirements)

| ID | Requirement |
|----|-------------|
| F4.1 | 150+ curated book reviews across three disciplines |
| F4.2 | Career level organization (Junior, Mid-level, Senior) |
| F4.3 | Full-text search with Pagefind |
| F4.4 | Filtering by discipline, level, and topic tags |
| F4.5 | Individual book review pages with structured metadata |

#### F5: Analytics & Engagement

| ID | Requirement |
|----|-------------|
| F5.1 | Privacy-focused analytics (Plausible or Fathom) |
| F5.2 | Article completion tracking (scroll depth) |
| F5.3 | Cross-discipline engagement measurement |
| F5.4 | Social sharing buttons (Twitter, LinkedIn, copy link) |

### 3.3 Future Features (Phase 3+)

- Community forum or Discord integration (trigger: 10K subscribers)
- Premium content tier or sponsorship model (trigger: Month 12)
- Contributor network to scale beyond founding team
- AI-powered content recommendations using Claude API
- Team subscriptions for product organizations

---

## 4. Book Review Platform

### 4.1 Overview

The Book Review Platform is a core differentiator for ProductBuilders.io, providing curated, cross-functional book recommendations that help product professionals develop T-shaped skills. Unlike generic reading lists, each review is structured to highlight cross-functional insights and organized by career stage.

### 4.2 Content Structure

#### 4.2.1 Discipline Categories

| Product Management | User Experience Design | Product Engineering |
|--------------------|------------------------|---------------------|
| ~50 books | ~50 books | ~50 books |
| Strategy, roadmaps, discovery, metrics, leadership | Research, interaction, visual, systems design, accessibility | Architecture, practices, DevOps, performance, leadership |

#### 4.2.2 Career Level Organization

| Level | Description |
|-------|-------------|
| Junior (0-3 years) | Foundational concepts, core skills, getting started in the discipline. Books that establish vocabulary and mental models. |
| Mid-Level (3-7 years) | Deepening expertise, expanding into adjacent skills, preparing for leadership. Books that bridge disciplines. |
| Senior (7+ years) | Strategic thinking, organizational leadership, cross-functional influence. Books on systems thinking and leadership. |

### 4.3 Book Review Schema

Each book review will follow a consistent YAML frontmatter schema:

| Field | Type | Description |
|-------|------|-------------|
| title | String | Book title |
| author | String | Book author(s) |
| discipline | Enum | PM \| Design \| Engineering |
| level | Enum | Junior \| Mid-Level \| Senior |
| rating | Number | 1-5 star rating |
| publication_year | Number | Year published (minimum 5 years ago) |
| tags | Array | Topic tags for filtering (e.g., strategy, leadership) |
| cross_functional_value | String | Why this book matters for other disciplines |
| key_takeaways | Array | 3-5 main insights |
| who_should_read | String | Target reader description |
| affiliate_link | URL | Optional purchase link |

**Example YAML frontmatter:**

```yaml
---
title: "Inspired: How to Create Tech Products Customers Love"
author: "Marty Cagan"
discipline: "PM"
level: "Mid-Level"
rating: 5
publication_year: 2017
tags: ["product discovery", "team structure", "customer research"]
cross_functional_value: "Engineers and designers learn why strong PM practices reduce wasted work; provides shared vocabulary for product teams."
key_takeaways:
  - "Product discovery must happen before delivery"
  - "Empowered teams outperform feature teams"
  - "Continuous discovery reduces risk"
who_should_read: "PMs ready to move beyond feature shipping; engineers and designers who want to understand product leadership."
affiliate_link: "https://..."
---
```

### 4.4 User Interface Requirements

#### 4.4.1 Book Library Page

- Grid layout displaying book covers with title, author, discipline badge, and rating
- Filter panel with discipline checkboxes, career level dropdown, and topic tag cloud
- Search bar with autocomplete for title and author
- Sort options: rating, publication year, recently added
- Pagination or infinite scroll (20 books per page)

#### 4.4.2 Individual Book Review Page

- Book metadata card: cover image, title, author, publication year, rating
- Discipline and level badges
- Full review content in readable typography
- Cross-functional insights callout box
- Key takeaways as bulleted list
- Related books carousel (same discipline or topic)
- Social sharing buttons
- Optional affiliate purchase button

#### 4.4.3 Search Functionality

- Client-side search using Pagefind (builds at deploy time)
- Searchable fields: title, author, review content, tags
- Search results with highlighted matches
- Zero-JS fallback for accessibility

### 4.5 Content Production Plan

| Phase | Timeline | Reviews | Focus |
|-------|----------|---------|-------|
| Alpha | Month 4 | 30 reviews | Top 10 per discipline |
| Beta | Month 5 | 75 reviews | Complete Junior level |
| Launch | Month 6 | 150 reviews | All levels complete |
| Ongoing | Monthly | +5-10 reviews | New releases, requests |

---

## 5. Technical Architecture

### 5.1 Stack Overview

> **Recommended Stack**
> 
> - **Frontend:** Astro (static site generator)
> - **CMS:** Decap CMS (Git-based)
> - **Hosting:** Netlify
> - **Search:** Pagefind
> - **Analytics:** Plausible
> - **Newsletter:** Buttondown

### 5.2 Architecture Diagram

**Content Flow:**

```
Claude Code (generate content)
       ↓
   Markdown + YAML files
       ↓
   GitHub Repository
       ↓
   Netlify (auto-build on push)
       ↓
   Static HTML on CDN (fast, global)
       
   + Decap CMS for visual editing when needed
   + Pagefind for full-text search
   + Giscus for comments (optional)
```

### 5.3 Why Jamstack over Django

| Factor | Jamstack (Astro) | Django + Wagtail |
|--------|------------------|------------------|
| Performance | Near-instant (CDN-served) | Good (requires caching) |
| Hosting Cost | Free (Netlify tier) | $10-50/mo server + DB |
| Ops Overhead | Zero (no server) | Medium (updates, backups) |
| Content Workflow | Claude Code → Git → deploy | Import to DB then publish |
| Markdown Support | Native, uses files directly | Requires import process |

### 5.4 Infrastructure Requirements

| Component | Solution | Monthly Cost |
|-----------|----------|--------------|
| Hosting | Netlify Free Tier | $0 |
| Domain | productbuilders.io | ~$15/year |
| Newsletter | Buttondown Free Tier | $0 (<100 subs) |
| Analytics | Plausible | ~$9/month |
| CMS | Decap CMS | $0 (self-hosted) |
| **Total** | | **~$10-15/month** |

### 5.5 Performance Requirements

| Metric | Target |
|--------|--------|
| Time to First Byte (TTFB) | <200ms |
| Largest Contentful Paint (LCP) | <2.5s |
| Cumulative Layout Shift (CLS) | <0.1 |
| First Input Delay (FID) | <100ms |
| Lighthouse Performance Score | >90 |
| Mobile PageSpeed Score | >85 |

---

## 6. User Interface Requirements

### 6.1 Design Principles

- **Readability First:** Long-form content optimized for extended reading sessions
- **Cross-Functional Visual Identity:** Design elements that communicate integration, not silos
- **Minimalist:** Reduce visual noise to focus on content quality
- **Accessible:** WCAG 2.1 AA compliance minimum
- **Fast:** Zero unnecessary JavaScript; static where possible

### 6.2 Page Templates Required

| Template | Purpose |
|----------|---------|
| Homepage | Featured content, newsletter signup, value proposition |
| Article Page | Single article with related content, author bio |
| Archive/Browse | Filterable list of all articles by discipline |
| Book Library | Grid view of all book reviews with filters |
| Book Review | Individual book review with metadata card |
| About | Mission statement, team, methodology |
| Subscribe | Dedicated newsletter signup with benefits |

### 6.3 Responsive Breakpoints

| Breakpoint | Width | Layout Notes |
|------------|-------|--------------|
| Mobile | <640px | Single column, hamburger nav, stacked cards |
| Tablet | 640-1024px | Two column grids, expanded nav |
| Desktop | >1024px | Full layout, sidebar, three column grids |

### 6.4 Accessibility Requirements

- Semantic HTML with proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratio minimum 4.5:1
- Focus states visible for all interactive elements
- Alt text for all images
- Skip to content link

---

## 7. Content Strategy

### 7.1 Content Pillars

| Pillar | Description | Frequency |
|--------|-------------|-----------|
| Cross-Functional Collaboration | How PM, Design, and Engineering work together effectively | 2x/month |
| Technical Literacy | Engineering concepts for non-engineers; design concepts for non-designers | 2x/month |
| Career Growth | Developing T-shaped skills, transitioning to leadership | 1x/month |
| Book Reviews | Curated reviews of essential product building books | Ongoing |

### 7.2 Editorial Standards

- Every article must include perspectives from at least two disciplines
- No unexplained discipline-specific jargon (define terms or link to glossary)
- Actionable takeaways for readers from each function at article end
- 10-minute target read time (2,000-2,500 words)
- One primary author with discipline expertise, reviewed by cross-functional editor

### 7.3 Content Calendar (First 12 Weeks)

| Week | Article Topic | Primary Discipline |
|------|---------------|-------------------|
| 1 | Why Product Builders Need Cross-Functional Literacy | All |
| 2 | How Engineers Should Give Feedback in Design Reviews | Engineering |
| 3 | Technical Debt Explained for Non-Engineers | PM/Design |
| 4 | The PM's Guide to Reading Architecture Diagrams | PM |
| 5 | Design Systems: Why Engineers Should Care | Engineering |
| 6 | Estimating Like an Engineer: A PM's Perspective | PM |
| 7 | Accessibility as a Cross-Functional Responsibility | Design |
| 8 | The Real Reason Your Sprint Planning Fails | All |
| 9 | How to Propose Features That Engineers Champion | Design/PM |
| 10 | Product Metrics: What Each Function Should Track | PM |
| 11 | Async Communication Patterns for Distributed Teams | All |
| 12 | Book Reviews Launch: Essential Reading by Discipline | All |

---

## 8. Analytics & Success Metrics

### 8.1 North Star Metric

> **Weekly Active Readers Who Engage Across Disciplines**
> 
> Definition: Unique readers who, in a given week, either (a) open and read an article from a discipline other than their primary, or (b) engage (comment, share, reply) with cross-functional content.

### 8.2 Key Performance Indicators

| Category | Metric | Target | Measurement |
|----------|--------|--------|-------------|
| Acquisition | Monthly new subscribers | 2,000/mo by M6 | Buttondown |
| Engagement | Newsletter open rate | >45% | Buttondown |
| Engagement | Article completion rate | >60% | Scroll depth |
| Retention | Monthly returning readers | >40% | Plausible |
| Satisfaction | NPS Score | >50 | Quarterly survey |
| Differentiation | Cross-discipline reads | >40% | Tag analytics |

### 8.3 Book Review Platform Metrics

| Metric | Target |
|--------|--------|
| Book reviews published | 150 by Month 6 |
| Monthly book review page views | 5,000 by Month 9 |
| Search queries per month | 1,000 by Month 9 |
| Average time on book review page | >3 minutes |
| Cross-discipline book discovery | >30% of book views from outside discipline |

---

## 9. Release Plan

### 9.1 Milestone Timeline

| Milestone | Target Date | Deliverables |
|-----------|-------------|--------------|
| M1 | Month 1 | Technical infrastructure complete; blog skeleton live; 4 articles drafted |
| M2 | Month 2 | Newsletter integration; 8 articles published; 100 founding subscribers |
| M3 | Month 3 (MVP) | Full blog live; 12 articles; 500 subscribers; analytics operational |
| M4 | Month 4 | Book review platform alpha; 30 reviews; search functional |
| M5 | Month 5 | Book review beta; 75 reviews; filtering complete |
| M6 | Month 6 | Book review launch; 150 reviews; 5,000 total subscribers |
| M7-12 | Month 7-12 | Scale content; community features exploration; monetization pilot |

### 9.2 MVP Definition (Month 3)

The MVP is a weekly newsletter + blog delivering one high-quality article per week that explicitly addresses cross-functional product building.

**MVP includes:**
- Blog with 12 published articles
- Newsletter with 500+ subscribers
- Analytics tracking engagement and cross-discipline reading
- Mobile-responsive design
- SEO-optimized for organic discovery

### 9.3 Go-to-Market Strategy

- Soft launch to personal network and early supporters
- LinkedIn content strategy: repurpose articles into 3-5 posts each
- Twitter engagement with product Twitter community
- Cross-promotion with complementary newsletters (non-competitive)
- Product Hunt launch at Month 6 with book review platform

---

## 10. Dependencies & Assumptions

### 10.1 Dependencies

| Dependency | Risk Level | Mitigation |
|------------|------------|------------|
| Claude Code availability | Low | Core Anthropic product; alternative AI coding tools exist |
| Netlify free tier limits | Low | Generous limits; paid tier affordable if exceeded |
| Founder time commitment | Medium | Estimate 15-20 hrs/week; content batching reduces load |
| Content quality at scale | Medium | AI-assisted writing; contributor network for Phase 3 |

### 10.2 Assumptions

- There is sufficient demand for cross-functional content (validated via MRD research)
- Mid-career professionals are willing to subscribe to another newsletter
- Claude Code can accelerate development to achieve 3-month MVP timeline
- Book reviews add value beyond existing Goodreads/Amazon reviews
- The founder can produce 1 quality article per week consistently

### 10.3 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content doesn't resonate | High | Early user interviews; iterate based on engagement data |
| Low subscriber growth | Medium | Diversify acquisition channels; SEO investment |
| Founder burnout | High | Sustainable pace; batch content; consider co-founder |
| Competition enters space | Low | First-mover advantage; community lock-in |

---

## 11. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| Cross-functional | Spanning multiple disciplines (PM, Design, Engineering) |
| T-shaped professional | Deep expertise in one area with broad knowledge across others |
| Product Builder | Anyone who contributes to building products (PM, Designer, Engineer) |
| Jamstack | Web architecture using JavaScript, APIs, and pre-rendered Markup |
| SSG | Static Site Generator (e.g., Astro) |
| CMS | Content Management System |

### Appendix B: Reference Documents

- ProductBuilders MRD v0.1 (Tshepo Machele, 2025-02-04)
- 100 Article Ideas Document
- Top 50 Books Research (by discipline and career level)
- Book Review Site Architecture Recommendation

### Appendix C: Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Product Lead | Tshepo Machele | ☐ Approved | |
| Engineering Lead | Tshepo Machele | ☐ Approved | |
| Design Lead | Tshepo Machele | ☐ Approved | |
| Dev Partner | Claude Code | N/A | |

### Appendix D: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-04 | Tshepo Machele | Initial PRD created from MRD v0.1 with Book Review capabilities |

---

*ProductBuilders.io PRD v1.0 | Confidential*
