# 🚀 Deployment Guide - EduAI Tutors Platform

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### ✅ **Code Ready:**
- [x] All features implemented
- [x] Video analytics working
- [x] Lead management functional
- [x] Email automation configured
- [x] AI Chatbot integrated
- [x] Mobile responsive
- [x] Error handling in place

### ✅ **Environment Variables:**
Make sure you have these ready:
```
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (optional)
ADMIN_EMAIL (optional)
GEMINI_API_KEY (optional but recommended)
NEXT_PUBLIC_BASE_URL
```

---

## 🎯 **OPTION 1: DEPLOY TO VERCEL (RECOMMENDED)**

**Why Vercel?**
- ✅ Made for Next.js (zero config)
- ✅ Free tier (generous limits)
- ✅ Auto-deploy on git push
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Built-in analytics

### **Step-by-Step:**

#### **1. Push to GitHub**

```bash
# Add all changes
git add .

# Commit with message
git commit -m "feat: complete platform with video analytics, lead management, email automation, and AI chatbot"

# Push to GitHub
git push origin main
```

#### **2. Deploy on Vercel**

**A. Sign Up:**
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

**B. Import Project:**
1. Click "Add New..." → "Project"
2. Select your GitHub repository: `edu-ai-tutors`
3. Click "Import"

**C. Configure:**
```
Framework Preset: Next.js (auto-detected)
Build Command: npm run build
Output Directory: .next (auto)
Install Command: npm install
```

**D. Set Environment Variables:**
Click "Environment Variables" and add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/eduai
NEXTAUTH_SECRET = [generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-project.vercel.app
GEMINI_API_KEY = AIzaSy... (from Google AI Studio)
NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app

# Optional (for emails)
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
ADMIN_EMAIL = admin@yourcompany.com
```

**E. Deploy:**
1. Click "Deploy"
2. Wait 2-3 minutes ⏳
3. Your site is LIVE! 🎉

**F. Custom Domain (Optional):**
1. Go to Project Settings → Domains
2. Add your domain: `www.eduaitutors.com`
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate (5-10 mins)

---

## 🎯 **OPTION 2: DEPLOY TO NETLIFY**

**Step-by-Step:**

#### **1. Build Configuration**

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### **2. Deploy:**
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository
5. Add environment variables (same as Vercel)
6. Click "Deploy"

---

## 🎯 **OPTION 3: DEPLOY TO RAILWAY**

**Great for backend-heavy apps:**

1. Go to https://railway.app
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repo
5. Add environment variables
6. Railway auto-detects Next.js
7. Deploys in 2-3 minutes

---

## 📊 **POST-DEPLOYMENT TASKS**

### **1. Test Core Features:**

**Homepage:**
- [ ] Hero section loads
- [ ] Lead capture form works
- [ ] Course listings display
- [ ] Chatbot appears (bottom-right)

**Authentication:**
- [ ] Signup creates account
- [ ] Login works
- [ ] Session persists
- [ ] Logout works

**Student Dashboard:**
- [ ] Courses load
- [ ] Video player works
- [ ] Progress tracks
- [ ] Chatbot personalized

**Admin Dashboard:**
- [ ] Stats display
- [ ] Create course works
- [ ] View leads
- [ ] Update lead status

**Lead Management:**
- [ ] Submit form → Creates lead
- [ ] Admin sees lead
- [ ] Status change → Email sent (if SMTP configured)

**Chatbot:**
- [ ] Guest: Gets course info
- [ ] Student: Personalized responses
- [ ] Parent: Progress insights
- [ ] Mobile: Responsive

---

### **2. Configure MongoDB Atlas (If Not Done)**

**A. Whitelist Vercel IPs:**
1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Click "Allow Access from Anywhere" (for Vercel)
4. Or add specific IPs: https://vercel.com/docs/concepts/deployments/ip-addresses

**B. Connection String:**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/eduai?retryWrites=true&w=majority
```

---

### **3. Set Up Email (Optional but Recommended)**

**Option A: Gmail (Quick Test):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

**Option B: SendGrid (Production):**
1. Sign up: https://sendgrid.com
2. Create API key
3. Add to Vercel:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxx_your_api_key
```

---

### **4. Set Up Monitoring (Recommended)**

**Vercel Analytics:**
- Go to Project Settings → Analytics
- Enable "Enable Vercel Analytics"
- Track: Page views, unique visitors, top pages

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Add to Vercel:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 🔒 **SECURITY CHECKLIST**

- [ ] `.env` file NOT committed (check .gitignore)
- [ ] All API routes have authentication
- [ ] Role-based access control working
- [ ] MongoDB credentials secured
- [ ] NEXTAUTH_SECRET is strong & unique
- [ ] CORS configured (if needed)
- [ ] Rate limiting on public endpoints
- [ ] No sensitive data in client-side code

---

## 🎨 **CUSTOM DOMAIN SETUP**

### **Buy Domain:**
- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Google Domains: ~$12/year

### **Configure DNS (Example: Vercel):**

**A Records:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait:** 5 minutes - 24 hours for DNS propagation

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Already Done:**
- ✅ Next.js Image optimization
- ✅ Code splitting (automatic)
- ✅ Font optimization (Inter)

### **Recommended:**

**1. Compress Images:**
```bash
npm install sharp
```

**2. Enable Caching:**
```typescript
// In API routes
export const revalidate = 3600 // Cache for 1 hour
```

**3. Use CDN for Static Assets:**
- Upload images to Vercel/Cloudinary
- Update image paths

---

## 🧪 **TESTING IN PRODUCTION**

### **1. Lighthouse Audit:**
1. Open deployed site
2. Chrome DevTools → Lighthouse
3. Run audit
4. Target: 90+ score on all metrics

### **2. Mobile Testing:**
1. Test on real devices
2. Use Chrome DevTools mobile emulation
3. Check all features work

### **3. Load Testing:**
```bash
# Install Apache Bench
ab -n 1000 -c 100 https://your-site.vercel.app/
```

---

## 🔄 **CONTINUOUS DEPLOYMENT**

**Auto-Deploy on Git Push:**

Vercel automatically deploys when you:
```bash
git add .
git commit -m "fix: some bug"
git push origin main
```

**Preview Deployments:**
- Every pull request gets a unique URL
- Test before merging to main

**Rollback:**
```bash
# In Vercel dashboard
Deployments → [Previous Version] → Promote to Production
```

---

## 📊 **MONITORING & MAINTENANCE**

### **Daily:**
- Check error logs (Vercel dashboard)
- Monitor chatbot interactions
- Review new lead submissions

### **Weekly:**
- Check MongoDB database size
- Review user signups
- Update course content

### **Monthly:**
- Analyze user behavior (Vercel Analytics)
- Optimize slow pages
- Update dependencies:
```bash
npm outdated
npm update
```

---

## 🎯 **MARKETING POST-LAUNCH**

### **1. SEO:**
- Add sitemap.xml
- Submit to Google Search Console
- Optimize meta tags

### **2. Social Media:**
- Share on LinkedIn, Facebook
- Student success stories
- Behind-the-scenes content

### **3. Paid Ads:**
- Google Ads (search)
- Facebook/Instagram ads
- YouTube pre-roll

### **4. Partnerships:**
- School tie-ups
- Coaching center collaborations
- Influencer marketing

---

## ⚡ **QUICK COMMANDS REFERENCE**

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server (local test)
npm start

# Commit and push
git add .
git commit -m "your message"
git push origin main

# Install dependencies
npm install

# Update dependencies
npm update

# Check for issues
npm run lint
```

---

## 🎉 **CONGRATULATIONS!**

Your platform is now LIVE and accessible worldwide! 🌍

**Next Steps:**
1. Test all features
2. Share with friends/beta users
3. Collect feedback
4. Iterate and improve

**Support:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Community: https://github.com/vercel/next.js/discussions

---

## 🚨 **TROUBLESHOOTING**

**Build Fails:**
- Check Node version (use 18.x or 20.x)
- Verify all dependencies installed
- Check for TypeScript errors

**Database Connection Errors:**
- Verify MongoDB URI is correct
- Check IP whitelist in Atlas
- Ensure credentials are correct

**Environment Variables Not Working:**
- Redeploy after adding env vars
- Verify no typos in variable names
- Check `.env.example` for all required vars

**Email Not Sending:**
- Check SMTP credentials
- Verify app password (not regular password for Gmail)
- Check server logs for errors

---

**Your education platform is ready to change lives! 🎓✨**

Need help? Check the logs or reach out!
