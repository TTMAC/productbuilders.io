# Content Approval Workflow - Visual Guide

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTENT APPROVAL WORKFLOW                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   CREATOR    │  Creates new article/book
│   📝 Draft   │
└──────┬───────┘
       │
       │ Self-review complete
       ▼
┌──────────────┐
│   SUBMIT     │  Change status to "In Review"
│  🔍 Review   │
└──────┬───────┘
       │
       │ Reviewer evaluates
       ▼
    ┌──────┐
    │  ✅   │  Approved?
    └──┬───┘
       │
   ┌───┴────┐
   │        │
   NO      YES
   │        │
   │        ▼
   │   ┌────────────┐
   │   │  APPROVE   │  Move to "Ready"
   │   │  ✅ Ready  │
   │   └────┬───────┘
   │        │
   │        │ Publisher reviews
   │        ▼
   │   ┌────────────┐
   │   │  PUBLISH   │  Click "Publish" button
   │   │ 🚀 Live    │
   │   └────┬───────┘
   │        │
   │        ▼
   │   ┌────────────┐
   │   │   DEPLOY   │  Netlify rebuilds site (~2 min)
   │   │   🌐 Web   │
   │   └────────────┘
   │
   └──► Back to Draft (request changes)


ALTERNATE FLOWS:

1. EMERGENCY FIX:
   Published → Edit → Save → Publish (skip workflow)

2. SCHEDULED:
   Ready → Hold → Publish on date

3. REJECT:
   In Review → Comment → Back to Draft
```

## Detailed State Diagram

```
                    ┌─────────────────────────────────────┐
                    │         NEW CONTENT                  │
                    │    Author clicks "New Article"       │
                    └──────────────┬──────────────────────┘
                                   │
                                   ▼
    ╔══════════════════════════════════════════════════════════════╗
    ║                      DRAFT STATUS 📝                          ║
    ║                                                                ║
    ║  Who can edit:  Creator, Editors, Admins                     ║
    ║  Visible to:    Creator only (in Drafts column)              ║
    ║  Actions:       • Edit content                                ║
    ║                 • Save changes                                ║
    ║                 • Delete                                      ║
    ║                 • Move to "In Review"                         ║
    ║                                                                ║
    ║  Typical time: 2-5 days (writing + self-editing)             ║
    ╚═══════════════════════════╦══════════════════════════════════╝
                                │
                                │ Author decides content is ready
                                │ Changes status to "In Review"
                                ▼
    ╔══════════════════════════════════════════════════════════════╗
    ║                   IN REVIEW STATUS 🔍                         ║
    ║                                                                ║
    ║  Who can edit:  Reviewers, Editors, Admins                   ║
    ║  Visible to:    All team members (In Review column)          ║
    ║  Actions:       • Review content                              ║
    ║                 • Add comments                                ║
    ║                 • Request changes (→ Draft)                   ║
    ║                 • Approve (→ Ready)                           ║
    ║                                                                ║
    ║  Typical time: 1-2 days (peer review)                        ║
    ╚═══════════════════════════╦══════════════════════════════════╝
                                │
                    ┌───────────┴───────────┐
                    │                       │
          NEEDS CHANGES                  APPROVED
                    │                       │
                    ▼                       ▼
        ╔═══════════════════╗    ╔═══════════════════════════════╗
        ║  BACK TO DRAFT    ║    ║    READY STATUS ✅            ║
        ║                   ║    ║                                ║
        ║  Reviewer adds    ║    ║  Who: Publishers, Admins      ║
        ║  feedback         ║    ║  Visible: All (Ready column)  ║
        ║                   ║    ║  Actions:                      ║
        ║  Author revises   ║    ║    • Final review              ║
        ║  → Resubmits      ║    ║    • Publish to site           ║
        ╚═══════════════════╝    ║    • Send back for edits       ║
                                 ║                                ║
                                 ║  Typical time: 0-1 day         ║
                                 ╚══════════╦═════════════════════╝
                                            │
                                            │ Publisher clicks "Publish"
                                            ▼
    ╔══════════════════════════════════════════════════════════════╗
    ║                    PUBLISHED STATUS 🚀                        ║
    ║                                                                ║
    ║  Who: Public (live on site)                                   ║
    ║  Actions:                                                      ║
    ║    • Commit to main branch                                    ║
    ║    • Netlify builds site                                      ║
    ║    • Content goes live                                        ║
    ║                                                                ║
    ║  Can edit: Yes (creates new draft of published content)       ║
    ║                                                                ║
    ║  Deploy time: ~2 minutes                                      ║
    ╚══════════════════════════════════════════════════════════════╝
```

## Workflow Board View

```
┌─────────────────────────────────────────────────────────────────────┐
│  WORKFLOW                                              [+ New Entry] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │   DRAFTS 📝   │  │  IN REVIEW 🔍 │  │    READY ✅   │          │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤          │
│  │               │  │               │  │               │          │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │          │
│  │ │ API Design│ │  │ │ Roadmaps  │ │  │ │ Design    │ │          │
│  │ │ for PMs   │ │  │ │ Guide     │ │  │ │ Systems   │ │          │
│  │ │           │ │  │ │           │ │  │ │           │ │          │
│  │ │ 2026-02-01│ │  │ │ 2026-01-25│ │  │ │ 2026-01-20│ │          │
│  │ │ Draft     │ │  │ │ In Review │ │  │ │ Ready     │ │          │
│  │ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │          │
│  │               │  │               │  │               │          │
│  │ ┌───────────┐ │  │ ┌───────────┐ │  │               │          │
│  │ │ Testing   │ │  │ │ Book:     │ │  │               │          │
│  │ │ Strategy  │ │  │ │ Inspired  │ │  │               │          │
│  │ │           │ │  │ │           │ │  │               │          │
│  │ │ 2026-02-05│ │  │ │ 2026-01-30│ │  │               │          │
│  │ │ Draft     │ │  │ │ In Review │ │  │               │          │
│  │ └───────────┘ │  │ └───────────┘ │  │               │          │
│  │               │  │               │  │               │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
│                                                                       │
│  Drag cards between columns to change status                         │
└─────────────────────────────────────────────────────────────────────┘
```

## User Journey Map

### Content Creator Journey

```
Day 1-3: WRITING
├─ Login to CMS
├─ Click "New Article"
├─ Fill in metadata (title, description, disciplines)
├─ Write content in markdown
├─ Upload hero image
├─ Save as Draft (multiple times)
└─ Self-review using checklist

Day 4: SUBMISSION
├─ Final proofread
├─ Check all required fields
├─ Change status to "In Review"
├─ Notify team in Slack
└─ Wait for feedback

Day 5-6: REVISION (if needed)
├─ Receive feedback notification
├─ Read reviewer comments
├─ Make requested changes
├─ Resubmit to "In Review"
└─ Wait for approval

Day 7: CELEBRATION
├─ Receive approval notification
├─ See content move to "Ready"
├─ Wait for publisher
├─ Content goes live! 🎉
└─ Share on social media
```

### Reviewer Journey

```
DAILY ROUTINE:
├─ Login to CMS
├─ Check "In Review" column
├─ Select oldest item first
└─ Begin review

REVIEW PROCESS (30-60 min per article):
├─ Read for clarity and accuracy
├─ Check cross-functional balance
│   ├─ PM perspective? ✓
│   ├─ Design perspective? ✓
│   └─ Engineering perspective? ✓
├─ Verify SEO requirements
│   ├─ Title ≤ 60 chars? ✓
│   ├─ Description ≤ 155 chars? ✓
│   └─ Keywords included? ✓
├─ Test code examples (if any)
├─ Check formatting
└─ Make decision

DECISION:
├─ APPROVE: Move to "Ready" + notify author
└─ REQUEST CHANGES: Add comment + move to "Draft" + notify author
```

### Publisher Journey

```
WEEKLY PUBLICATION:
├─ Review "Ready" queue
├─ Prioritize by:
│   ├─ Strategic importance
│   ├─ Seasonality
│   └─ Team capacity
└─ Schedule publications

PUBLICATION PROCESS:
├─ Open article in "Ready"
├─ Final quality check
│   ├─ Preview on mobile
│   ├─ Test all links
│   ├─ Verify images load
│   └─ Check publish date
├─ Click "Publish" button
├─ Monitor Netlify build
├─ Verify live on site (2-3 min)
├─ Test newsletter signup
├─ Share with team
└─ Post to social media
```

## Timeline Example

```
Week 1: Content Creation
Mon   Tue   Wed   Thu   Fri   Sat   Sun
─────────────────────────────────────────
📝    📝    📝    📝    🔍
Draft Draft Draft Draft Review


Week 2: Review & Publish
Mon   Tue   Wed   Thu   Fri   Sat   Sun
─────────────────────────────────────────
🔍    ✅    ✅    🚀    📊
Review Ready Ready Pub  Track


Average Timeline:
• Draft: 3-5 days (creation + self-edit)
• In Review: 1-2 days (peer review)
• Ready: 0-1 day (final check)
• Total: 5-8 days from start to publish
```

## Workflow Metrics Dashboard

```
┌─────────────────────────────────────────────────────────┐
│              EDITORIAL METRICS                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  THIS WEEK:                                             │
│  ┌────────────┬────────────┬────────────┬──────────┐   │
│  │  Drafts    │ In Review  │   Ready    │Published │   │
│  │     8      │     3      │     2      │    4     │   │
│  └────────────┴────────────┴────────────┴──────────┘   │
│                                                          │
│  AVERAGE TIME IN STAGE:                                 │
│  Draft:      4.2 days                                   │
│  In Review:  1.8 days                                   │
│  Ready:      0.5 days                                   │
│  Total:      6.5 days ✅ (Target: < 7 days)            │
│                                                          │
│  APPROVAL RATE:                                         │
│  First submission: 65% ✅ (Target: > 60%)              │
│  After revision:   95%                                  │
│                                                          │
│  TOP CONTRIBUTORS:                                      │
│  1. Author A - 5 articles                               │
│  2. Author B - 3 articles                               │
│  3. Author C - 2 articles                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║         WORKFLOW QUICK REFERENCE                          ║
╠═══════════════════════════════════════════════════════════╣
║                                                            ║
║  STATUS MEANINGS:                                         ║
║  📝 Draft     = Work in progress                          ║
║  🔍 In Review = Ready for team review                     ║
║  ✅ Ready     = Approved, ready to publish                ║
║  🚀 Published = Live on website                           ║
║                                                            ║
║  KEYBOARD SHORTCUTS:                                      ║
║  Cmd/Ctrl + S = Save                                      ║
║  Cmd/Ctrl + P = Publish                                   ║
║  Esc          = Exit editor                               ║
║                                                            ║
║  COMMON ACTIONS:                                          ║
║  • Submit for review → Change status to "In Review"       ║
║  • Request changes   → Add comment, move to "Draft"       ║
║  • Approve           → Move to "Ready"                    ║
║  • Publish           → Click "Publish" button             ║
║                                                            ║
║  NEED HELP?                                               ║
║  📖 Full guide: /docs/CONTENT_WORKFLOW.md                ║
║  🚀 Quick start: /docs/ADMIN_QUICK_START.md              ║
║                                                            ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Visual Guide Version:** 1.0
**Last Updated:** 2026-02-07
**For:** ProductBuilders.io Editorial Team
