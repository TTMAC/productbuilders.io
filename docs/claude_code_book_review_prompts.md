# Claude Code Book Review Generation System

A systematic prompt framework for generating consistent, high-quality book reviews for a professional website.

---

## Overview

This document contains:
1. **Master System Prompt** — Sets context and standards for all reviews
2. **Book Review Generation Prompt** — Template for individual book reviews
3. **Batch Processing Prompt** — For generating multiple reviews efficiently
4. **Quality Control Prompt** — For reviewing and improving generated content
5. **Book Data CSV Template** — Structured input format
6. **Output Schema** — Consistent JSON/Markdown structure

---

## 1. Master System Prompt

Use this as the system context or initial prompt when starting a Claude Code session:

```
You are a professional book review writer creating content for a career development website 
focused on Product Management, UX Design, and Software Engineering professionals.

## Your Writing Style
- Authoritative but accessible — write for busy professionals
- Practical and actionable — focus on what readers will gain
- Honest and balanced — acknowledge limitations without being dismissive
- Scannable — use clear structure with headers, bullets where appropriate
- SEO-aware — naturally incorporate relevant keywords

## Review Standards
- Every review should help readers decide if this book is right for THEM
- Include specific examples of concepts/frameworks from the book
- Compare to related books when relevant
- Indicate reading time/difficulty level
- Never fabricate quotes or page numbers
- If you don't have specific information, say so or search for it

## Target Audience Segments
- Junior: 0-2 years experience, building foundations
- Mid-Level: 2-5 years experience, deepening expertise  
- Senior: 5+ years experience, strategic/leadership focus

## Output Format
Generate all reviews in Markdown format with YAML frontmatter for metadata.
```

---

## 2. Individual Book Review Prompt

Use this template for generating a single detailed book review:

```
Generate a comprehensive book review for:

**Title:** [BOOK_TITLE]
**Author:** [AUTHOR_NAME]
**Year Published:** [YEAR]
**Category:** [Product Management | UX Design | Product Engineering]
**Career Level:** [Junior | Mid-Level | Senior]

## Research Instructions
Before writing the review:
1. Search for the book's key concepts, frameworks, and main arguments
2. Find the book's Goodreads rating and number of reviews
3. Identify 2-3 competing or complementary books
4. Look for notable endorsements or criticisms from industry figures

## Review Structure
Generate the review with these sections:

### YAML Frontmatter
```yaml
---
title: "[Book Title] Review"
slug: "[book-title-review]"
book_title: "[Full Book Title]"
author: "[Author Name]"
year: [Year]
category: "[Category]"
career_level: "[Level]"
rating: [Your 1-5 rating]
goodreads_rating: [X.XX]
pages: [Page count]
reading_time: "[X hours]"
difficulty: "[Beginner | Intermediate | Advanced]"
tags: ["tag1", "tag2", "tag3"]
date_reviewed: "[YYYY-MM-DD]"
affiliate_link: ""
---
```

### 1. TL;DR (50-75 words)
A punchy summary for readers who want the bottom line immediately.

### 2. Who Should Read This Book (100-150 words)
Specific reader profiles who will benefit most. Include:
- Career stage and role
- Current challenges this book addresses
- Prerequisites (other books/knowledge needed)
- Who should skip this book

### 3. Key Concepts & Frameworks (200-300 words)
The 3-5 most important ideas with brief explanations:
- Name of concept/framework
- What it is (1-2 sentences)
- Why it matters (1-2 sentences)

### 4. What You'll Learn (150-200 words)
Concrete skills and knowledge gains, written as outcomes:
- "How to [specific skill]"
- "A framework for [specific challenge]"
- "Understanding of [specific domain]"

### 5. Strengths (150-200 words)
What the book does exceptionally well. Be specific with examples.

### 6. Limitations (100-150 words)
Honest assessment of weaknesses:
- What's missing or underdeveloped
- Where it shows its age (if applicable)
- What type of reader might be frustrated

### 7. How to Read This Book (100-150 words)
Practical reading advice:
- Cover-to-cover vs. reference style
- Chapters to prioritize
- Exercises or activities to actually do
- Suggested reading pace

### 8. Pairs Well With (75-100 words)
2-3 complementary books that extend or contrast with this one.

### 9. Notable Quotes (2-3 quotes)
Memorable passages that capture the book's essence. 
IMPORTANT: Only include if you can verify the exact quote. Otherwise, paraphrase key ideas.

### 10. The Bottom Line (50-75 words)
Final verdict with a clear recommendation.

---

Total target length: 1,200-1,500 words
```

---

## 3. Batch Processing Prompt

Use this for generating multiple reviews efficiently:

```
I need to generate book reviews for multiple books. Process them in batches.

## Input Format
I'll provide books as a CSV or list with: Title, Author, Year, Category, Level

## Batch Instructions
For each book in the batch:

1. **Research Phase** (use web search)
   - Search: "[Book Title] [Author] summary key concepts"
   - Search: "[Book Title] Goodreads rating"
   - Search: "[Book Title] book review criticism"

2. **Generation Phase**
   - Generate the full review using the standard template
   - Save each review as: `reviews/[category]/[slug].md`

3. **Index Update**
   - After each batch, update the index file with new entries

## Batch Size
Process 5 books at a time, then pause for my confirmation before continuing.

## Output Structure
```
/reviews
  /product-management
    /junior
    /mid-level  
    /senior
  /ux-design
    /junior
    /mid-level
    /senior
  /product-engineering
    /junior
    /mid-level
    /senior
  index.json
```

## Here are the books to process:

[PASTE BOOK LIST HERE]
```

---

## 4. Quality Control Prompt

Use this to review and improve generated content:

```
Review the following book review for quality and accuracy:

[PASTE GENERATED REVIEW]

## Quality Checklist

### Accuracy Check
- [ ] Book title and author are correct
- [ ] Publication year is accurate
- [ ] Key concepts actually appear in the book
- [ ] Any quotes are verifiable or clearly marked as paraphrased
- [ ] Goodreads rating matches current data

### Content Quality
- [ ] TL;DR is genuinely useful and specific
- [ ] "Who Should Read" gives actionable guidance
- [ ] Key concepts are explained clearly
- [ ] Strengths include specific examples
- [ ] Limitations are honest but fair
- [ ] Reading advice is practical

### Writing Quality
- [ ] No jargon without explanation
- [ ] Sentences are concise
- [ ] Structure is scannable
- [ ] Tone is professional but engaging
- [ ] No repetition between sections

### SEO & Metadata
- [ ] Slug is URL-friendly
- [ ] Tags are relevant and consistent
- [ ] Title is compelling

## Output
Provide:
1. List of issues found (if any)
2. Corrected version of the review
3. Confidence score (1-10) for the review's accuracy
```

---

## 5. Book Data Input Template (CSV)

Create a CSV file with this structure to feed into Claude Code:

```csv
title,author,year,category,level,priority,notes
"Inspired: How to Create Tech Products Customers Love","Marty Cagan",2017,"Product Management","Junior",1,"PM Bible - prioritize"
"The Mom Test","Rob Fitzpatrick",2013,"Product Management","Junior",1,"Customer interview classic"
"Clean Code","Robert C. Martin",2008,"Product Engineering","Junior",1,"Coding fundamentals"
"The Design of Everyday Things","Don Norman",2013,"UX Design","Junior",1,"Design foundations"
```

---

## 6. Output Schema (JSON)

For programmatic use, reviews can also output as JSON:

```json
{
  "meta": {
    "title": "Inspired: How to Create Tech Products Customers Love",
    "slug": "inspired-marty-cagan-review",
    "author": "Marty Cagan",
    "year": 2017,
    "category": "Product Management",
    "careerLevel": "Junior",
    "rating": 5,
    "goodreadsRating": 4.23,
    "pages": 368,
    "readingTimeHours": 8,
    "difficulty": "Beginner",
    "tags": ["product management", "product discovery", "product teams", "tech products"],
    "dateReviewed": "2024-01-15",
    "affiliateLink": ""
  },
  "content": {
    "tldr": "...",
    "whoShouldRead": "...",
    "keyConcepts": [
      {
        "name": "Product Discovery",
        "description": "...",
        "whyItMatters": "..."
      }
    ],
    "whatYoullLearn": ["...", "..."],
    "strengths": "...",
    "limitations": "...",
    "howToRead": "...",
    "pairsWellWith": [
      {"title": "...", "author": "...", "reason": "..."}
    ],
    "notableQuotes": ["...", "..."],
    "bottomLine": "..."
  }
}
```

---

## 7. Automation Script Prompt

Use this to have Claude Code create an automation script:

```
Create a Python script that automates the book review generation process.

## Requirements

1. **Input Processing**
   - Read books from CSV file (books_to_review.csv)
   - Track which books have been reviewed (progress.json)
   - Skip already-completed books

2. **Review Generation**
   - For each book, construct the appropriate prompt
   - Call Claude API to generate the review
   - Parse the response and extract structured data

3. **Output Management**
   - Save markdown files to appropriate category/level folders
   - Update master index.json with new entries
   - Generate a summary report of completed reviews

4. **Error Handling**
   - Retry failed API calls (max 3 attempts)
   - Log errors to errors.log
   - Continue processing remaining books on failure

5. **Rate Limiting**
   - Add delays between API calls
   - Respect API rate limits

## File Structure
```
book_review_generator/
├── main.py
├── config.py
├── prompts/
│   ├── system_prompt.txt
│   └── review_template.txt
├── input/
│   └── books_to_review.csv
├── output/
│   ├── reviews/
│   │   ├── product-management/
│   │   ├── ux-design/
│   │   └── product-engineering/
│   ├── index.json
│   └── progress.json
└── logs/
    └── errors.log
```

## Usage
```bash
python main.py --input books_to_review.csv --batch-size 5
```
```

---

## 8. Website Integration Prompt

Use this to generate website-ready components:

```
Generate website components for displaying book reviews.

## Requirements

### 1. Book Review Card Component (React/JSX)
- Thumbnail display
- Title, author, rating
- Career level badge
- Category tag
- Quick "Who it's for" snippet
- Link to full review

### 2. Book Review Page Template
- Full review content
- Sidebar with metadata
- "Related Books" section
- "Buy Now" affiliate button
- Social sharing buttons
- Comments section placeholder

### 3. Book Listing Page
- Filter by category
- Filter by career level
- Sort by rating, date, title
- Search functionality
- Pagination

### 4. Reading List Builder
- Allow users to add books to personal list
- Export as markdown/PDF
- Share reading list URL

## Tech Stack
- React with TypeScript
- Tailwind CSS for styling
- Markdown processing with gray-matter and remark

Generate the components with clean, production-ready code.
```

---

## 9. Sample Workflow with Claude Code

Here's how to use these prompts in a typical Claude Code session:

### Session 1: Setup
```bash
# Start Claude Code
claude

# Prompt 1: Initialize project
> Create the book review generator project structure as specified in the automation 
> script prompt. Set up the folders, config files, and templates.

# Prompt 2: Import book data
> Here's the book list CSV. Save it to input/books_to_review.csv:
> [paste CSV data]
```

### Session 2: Generate Reviews (Batch)
```bash
# Prompt 3: Generate first batch
> Using the master system prompt and review template, generate reviews for the 
> first 5 books in the CSV. Save each review to the appropriate folder.

# Prompt 4: Quality check
> Review the generated files for quality. Flag any issues.

# Prompt 5: Continue
> Continue with the next batch of 5 books.
```

### Session 3: Export & Integration
```bash
# Prompt 6: Generate index
> Create the master index.json file with all completed reviews.

# Prompt 7: Generate website components  
> Create the React components for displaying these reviews on the website.
```

---

## 10. Prompt Variations

### Short Review Format (for social media / email)
```
Generate a 150-word micro-review of [BOOK TITLE] by [AUTHOR] suitable for 
LinkedIn or a newsletter. Include:
- One-sentence hook
- The #1 takeaway
- Who it's perfect for
- A rating out of 5
```

### Comparison Review Format
```
Generate a comparison review of these two books:
- Book A: [TITLE] by [AUTHOR]
- Book B: [TITLE] by [AUTHOR]

Compare them on:
1. Core philosophy/approach
2. Practical applicability
3. Writing style and accessibility
4. Best audience for each
5. Which to read first and why
```

### "Is It Still Relevant?" Review Format
```
Generate a "relevance review" for [BOOK TITLE] by [AUTHOR] (published [YEAR]).

Assess:
1. Which concepts have aged well
2. What's outdated or superseded
3. Modern alternatives/updates
4. Whether it's still worth reading in [CURRENT YEAR]
5. How to read it with a critical eye
```

---

## Quick Reference Card

| Task | Prompt to Use |
|------|---------------|
| Single detailed review | #2 Individual Book Review |
| Multiple books at once | #3 Batch Processing |
| Check review quality | #4 Quality Control |
| Full automation | #7 Automation Script |
| Website display | #8 Website Integration |
| Social media snippet | #10 Short Review Format |
| Compare two books | #10 Comparison Review |
| Old book assessment | #10 Relevance Review |

---

## Tips for Best Results

1. **Always include the Master System Prompt** at the start of new sessions
2. **Batch similar books together** — all Junior PM books, then Mid-level, etc.
3. **Verify Goodreads ratings** — they change over time
4. **Review outputs before publishing** — AI can hallucinate details
5. **Customize for your audience** — adjust tone/depth as needed
6. **Track progress** — use the progress.json to avoid duplicates
7. **Iterate on the template** — refine based on what works for your site
