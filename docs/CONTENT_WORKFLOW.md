# Content Approval Workflow

## Overview

ProductBuilders.io uses Decap CMS with an **Editorial Workflow** for content approval. This gives you a three-stage publishing process with clear status tracking.

## Workflow Stages

```
📝 Draft → 🔍 In Review → ✅ Ready → 🚀 Published
```

### 1. **Draft** 📝
- **Who:** Content creators, editors
- **What:** Work in progress, not visible to reviewers
- **Actions:**
  - Create new articles/book reviews
  - Edit and revise content
  - Upload images
  - Save changes without publishing

### 2. **In Review** 🔍
- **Who:** Reviewers, editors, approvers
- **What:** Content ready for review
- **Actions:**
  - Review for accuracy, quality, SEO
  - Check cross-functional perspectives
  - Request changes (send back to Draft)
  - Approve (move to Ready)

### 3. **Ready** ✅
- **Who:** Publishers, site admins
- **What:** Approved content ready to publish
- **Actions:**
  - Final check before going live
  - Publish to main branch
  - Send back for revisions if needed

### 4. **Published** 🚀
- **What:** Live on the website
- **Note:** Can still be edited (creates new Draft)

## User Roles & Permissions

### Content Creator
**Can:**
- ✅ Create new drafts
- ✅ Edit their own drafts
- ✅ Submit for review (Draft → In Review)
- ✅ View In Review items
- ❌ Cannot approve or publish

### Reviewer/Editor
**Can:**
- ✅ All Creator permissions
- ✅ Move content between stages
- ✅ Edit any draft
- ✅ Request changes
- ✅ Approve content (In Review → Ready)
- ❌ Cannot publish to live site

### Publisher/Admin
**Can:**
- ✅ All Creator & Reviewer permissions
- ✅ Publish content (Ready → Published)
- ✅ Delete content
- ✅ Manage media library
- ✅ Override all workflow stages

> **Note:** Netlify Identity doesn't have granular roles. All authenticated users have equal CMS access. Role enforcement is through team agreement, not technical restrictions.

## Step-by-Step Workflow

### Creating New Content

1. **Login to CMS**
   ```
   https://productbuilders.io/admin
   ```

2. **Start New Content**
   - Click **"New Article"** or **"New Book"**
   - You're in **Draft** status automatically

3. **Fill in Content**
   - Title (max 60 chars for SEO)
   - Description (max 155 chars for SEO)
   - Select discipline(s)
   - Add tags
   - Write body content in Markdown
   - Upload hero image (optional)

4. **Save Draft**
   - Click **"Save"** (top right)
   - Content saved but not published
   - Only you can see it in **Draft** column

### Submitting for Review

1. **Review Your Content**
   - Check for typos, formatting
   - Verify all required fields
   - Ensure cross-functional perspectives included

2. **Change Status**
   - In the editor, change status dropdown to **"In Review"**
   - Click **"Save"**
   - Content moves to **In Review** column

3. **Notify Reviewers**
   - Slack/email your reviewer team
   - Include link to CMS

### Reviewing Content

1. **Access Review Queue**
   - Login to CMS
   - Open **Workflow** tab
   - View **In Review** column

2. **Review Content**
   - Click item to open editor
   - Check against quality standards:
     - [ ] Clear, actionable title
     - [ ] Compelling description
     - [ ] 2+ disciplines represented
     - [ ] 2000-2500 words (10 min read)
     - [ ] No unexplained jargon
     - [ ] Actionable takeaways for each discipline
     - [ ] Proper formatting
     - [ ] Hero image (if applicable)

3. **Take Action**

   **Option A: Request Changes**
   - Add comment with feedback
   - Change status back to **"Draft"**
   - Click **"Save"**
   - Notify author

   **Option B: Approve**
   - Change status to **"Ready"**
   - Click **"Save"**
   - Content moves to **Ready** column

### Publishing Content

1. **Access Ready Queue**
   - Login to CMS (Publisher role)
   - Open **Workflow** tab
   - View **Ready** column

2. **Final Check**
   - Review content one last time
   - Verify publish date is correct
   - Ensure draft flag is `false`

3. **Publish**
   - Click **"Publish"** button
   - Content commits to main branch
   - Netlify triggers rebuild (~2 minutes)
   - Content goes live

4. **Verify**
   - Visit live site
   - Check article displays correctly
   - Test on mobile if applicable

## CMS Interface Guide

### Workflow Board View

```
┌─────────────┬──────────────┬─────────────┐
│   DRAFTS    │  IN REVIEW   │    READY    │
├─────────────┼──────────────┼─────────────┤
│ Article 1   │ Article 3    │ Article 5   │
│ Article 2   │ Article 4    │             │
│ Book 1      │              │             │
└─────────────┴──────────────┴─────────────┘
```

**Features:**
- Drag & drop between columns (changes status)
- Filter by collection (Articles, Books)
- Search by title
- Sort by date, author

### Content Editor

**Top Bar:**
- Status dropdown (Draft/In Review/Ready)
- Delete button
- Save button
- Publish button (if Ready status)

**Main Area:**
- Form fields for metadata
- Rich markdown editor for body
- Media browser for images

**Right Sidebar:**
- Publish status
- Last updated timestamp
- Preview link (if published)

## Quality Standards Checklist

Before moving to **In Review**, ensure:

### SEO Requirements
- [ ] Title ≤ 60 characters
- [ ] Description ≤ 155 characters
- [ ] Title includes primary keyword
- [ ] Description is compelling & actionable

### Content Quality
- [ ] ≥ 2 disciplines represented
- [ ] 2000-2500 words (target 10 min read)
- [ ] Clear section headings (H2, H3)
- [ ] No discipline-specific jargon without explanation
- [ ] Concrete examples provided
- [ ] Actionable takeaways for each discipline

### Formatting
- [ ] Proper markdown syntax
- [ ] Code blocks formatted correctly
- [ ] Lists use proper bullet/number syntax
- [ ] Links open in new tab if external
- [ ] Hero image optimized (< 200KB)
- [ ] Alt text provided for images

### Metadata
- [ ] Correct disciplines selected
- [ ] Relevant tags added (3-5 tags)
- [ ] Publish date set correctly
- [ ] Author name correct
- [ ] Featured flag set appropriately
- [ ] Draft flag = false for publishing

## Common Scenarios

### Scenario 1: Emergency Content Update

**Problem:** Need to fix typo on live article immediately

**Solution:**
1. Edit published content
2. Make changes
3. Skip workflow (publish directly)
4. Or: Draft → In Review → Ready → Publish (if time allows)

### Scenario 2: Scheduled Publishing

**Problem:** Want article to go live at specific date/time

**Solution:**
1. Set `publishDate` to future date in frontmatter
2. Complete workflow to Ready
3. Publish immediately
4. Article won't appear on site until publish date reached
   (Requires custom implementation - currently publishes immediately)

**Workaround:**
1. Keep in Ready status until publish date
2. Publish manually on that date

### Scenario 3: Bulk Content Import

**Problem:** Need to migrate existing articles

**Solution:**
1. Add markdown files directly to `src/content/articles/`
2. Ensure frontmatter matches schema
3. Commit to git directly
4. CMS will show them as published
5. Or: Use CMS import feature (if available)

### Scenario 4: Content Collaboration

**Problem:** Multiple people editing same article

**Solution:**
- Decap CMS is git-based - last save wins
- Coordinate via Slack/email
- Use GitHub if concurrent editing needed
- Consider: One person in CMS at a time per article

## Troubleshooting

### Content Not Appearing After Publish

**Check:**
1. Build completed successfully on Netlify
2. `draft: false` in frontmatter
3. `publishDate` is not in future
4. Clear browser cache
5. Check Netlify deploy logs

### Unable to Change Status

**Possible causes:**
- Not logged in / session expired → Re-login
- Missing required fields → Fill all required fields
- Validation error → Check field constraints
- Permission issue → Contact admin

### Images Not Loading

**Check:**
1. Image uploaded to correct folder (`public/images/uploads/`)
2. Path in frontmatter correct (`/images/uploads/filename.jpg`)
3. Image file size < 5MB
4. Supported format (jpg, png, webp, svg)

### CMS Not Loading

**Solutions:**
1. Check Netlify Identity is enabled
2. Verify Git Gateway is configured
3. Clear browser cache
4. Try incognito mode
5. Check console for errors

## Best Practices

### For Content Creators

1. **Write in Drafts First**
   - Don't rush to In Review
   - Self-edit thoroughly
   - Use preview feature

2. **Follow SEO Guidelines**
   - Keep titles concise
   - Make descriptions compelling
   - Include keywords naturally

3. **Think Cross-Functionally**
   - Include PM, Design, and Engineering perspectives
   - Explain trade-offs
   - Provide actionable advice for each discipline

4. **Use Consistent Voice**
   - Match existing article tone
   - Avoid overly promotional language
   - Be helpful, not preachy

### For Reviewers

1. **Review Promptly**
   - Aim for 24-48 hour turnaround
   - Set expectations with creators

2. **Be Specific with Feedback**
   - ❌ "This needs work"
   - ✅ "Section 3 needs examples for engineers"

3. **Check Cross-Functional Balance**
   - Ensure all disciplines get value
   - Flag discipline-heavy sections
   - Suggest additional perspectives

4. **Verify Technical Accuracy**
   - Check facts, stats, quotes
   - Verify code examples work
   - Test links

### For Publishers

1. **Final Quality Check**
   - Preview on mobile
   - Test all links
   - Check images load
   - Verify formatting

2. **Monitor Analytics**
   - Track published article performance
   - Share insights with creators
   - Adjust strategy based on data

3. **Communicate Publication**
   - Notify author when live
   - Share social media posts
   - Update team on new content

## Metrics to Track

### Content Quality
- Average time in each workflow stage
- Number of revisions requested
- Approval rate (first submission)

### Publication Cadence
- Articles published per week/month
- Time from Draft to Published
- Backlog size (Ready queue)

### Team Performance
- Articles per author
- Review turnaround time
- Publishing velocity

## Support & Questions

**CMS Issues:**
- Check Decap CMS docs: https://decapcms.org/docs/
- Review Netlify Identity docs
- Contact tech admin

**Content Questions:**
- Review DOMAIN_MODEL.md for schema
- Check CLAUDE.md for style guide
- Refer to MRD for content strategy

**Workflow Questions:**
- This document!
- Team lead or editor
- Weekly content sync meetings

---

**Last Updated:** 2026-02-07
**Version:** 1.0
**Owner:** ProductBuilders.io Editorial Team
