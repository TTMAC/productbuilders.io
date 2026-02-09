# Admin Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Deploy to Netlify

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial ProductBuilders.io setup"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/productbuilders.git
git push -u origin main
```

**In Netlify:**
1. Click "Add new site" → "Import an existing project"
2. Connect to GitHub
3. Select your repo
4. Build settings:
   - **Build command:** `npm run build && npx pagefind --site dist`
   - **Publish directory:** `dist`
5. Click "Deploy site"

### Step 2: Enable Netlify Identity (2 minutes)

1. Go to **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Under **Registration**, select **"Invite only"**
4. Under **Services**, enable **Git Gateway**

### Step 3: Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add variable:
   - **Key:** `BUTTONDOWN_API_KEY`
   - **Value:** Your Buttondown API key from buttondown.email

### Step 4: Invite Your First Admin

1. Go to **Identity** tab
2. Click **"Invite users"**
3. Enter your email
4. Check your email and accept invite
5. Set your password

### Step 5: Access the CMS

1. Visit `https://your-site.netlify.app/admin`
2. Click **"Login with Netlify Identity"**
3. Enter your credentials
4. You're in! 🎉

## 📝 Quick Actions

### Create Your First Article

1. In CMS, click **"New Article"**
2. Fill in required fields:
   - **Title** (max 60 chars)
   - **Description** (max 155 chars)
   - **Disciplines** (select 2+)
   - **Publish Date**
   - **Body** (write in Markdown)
3. Click **"Save"** to keep as draft
4. Change status to **"In Review"** when ready
5. Click **"Publish"** when approved

### Upload Images

1. In article editor, click **image icon** in toolbar
2. Choose **"Upload new image"**
3. Select file (< 5MB, JPG/PNG/WebP)
4. Image uploads to `/public/images/uploads/`
5. URL auto-inserted: `/images/uploads/filename.jpg`

### Use Editorial Workflow

**Draft → In Review → Ready → Published**

- **Draft:** Work in progress
- **In Review:** Ready for team review
- **Ready:** Approved, ready to publish
- **Published:** Live on site

Drag items between columns or use status dropdown.

## ⚙️ Configuration Files

### CMS Config
**Location:** `public/admin/config.yml`

**Key settings:**
```yaml
publish_mode: editorial_workflow  # Enables approval workflow
media_folder: "public/images/uploads"
local_backend: true  # For local development
```

### Environment Variables Needed

```bash
# .env file
BUTTONDOWN_API_KEY=your_key_here
```

## 🔒 User Management

### Add New Team Members

1. **Netlify Dashboard** → **Identity** → **Invite users**
2. Enter email address
3. They receive invite email
4. They set password and can access CMS

### Remove Users

1. **Netlify Dashboard** → **Identity**
2. Find user
3. Click **"..."** → **"Delete user"**

### No Role-Based Access Control

⚠️ All authenticated users have equal CMS access. Use team agreements for workflow stages.

## 📊 Monitoring & Analytics

### Check Build Status

1. **Netlify Dashboard** → **Deploys**
2. See recent builds and status
3. Click build for detailed logs

### Analytics Setup (Plausible)

1. Sign up at plausible.io
2. Add your domain
3. Already configured in site code! ✅
4. View at plausible.io/yourdomain.com

### Content Performance

- Use Plausible to track:
  - Page views per article
  - Reading time
  - Traffic sources
  - Popular content

## 🛠️ Troubleshooting

### "Cannot access CMS"
**Solution:** Check Netlify Identity is enabled and Git Gateway is active

### "Images not showing"
**Solution:** Ensure images in `public/images/uploads/` and path starts with `/images/`

### "Build failing"
**Solution:** Check deploy logs in Netlify. Common issues:
- Missing dependencies
- Zod validation errors
- Invalid markdown frontmatter

### "Newsletter not working"
**Solution:** Verify `BUTTONDOWN_API_KEY` is set in environment variables

## 📚 Resources

- **Full Workflow Guide:** `/docs/CONTENT_WORKFLOW.md`
- **Domain Model:** `/docs/DOMAIN_MODEL.md`
- **Style Guide:** `/docs/CLAUDE.md`
- **Decap CMS Docs:** https://decapcms.org/docs/
- **Netlify Identity:** https://docs.netlify.com/visitor-access/identity/

## 🆘 Getting Help

1. Check this guide and CONTENT_WORKFLOW.md
2. Review Netlify deploy logs
3. Check browser console for errors
4. Contact tech lead or developer

## ✅ Launch Checklist

Before going live:

- [ ] Netlify site deployed and building successfully
- [ ] Netlify Identity enabled
- [ ] Git Gateway enabled
- [ ] Admin users invited and can login
- [ ] Buttondown API key configured
- [ ] Plausible analytics set up
- [ ] At least 3 articles published
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Netlify)
- [ ] Test newsletter signup form
- [ ] Test CMS workflow end-to-end
- [ ] Mobile responsive check
- [ ] SEO meta tags verified

---

**Questions?** See `/docs/CONTENT_WORKFLOW.md` for detailed workflows and troubleshooting.
