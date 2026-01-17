# 📧 Email Automation Setup Guide

## ✅ **What's Implemented**

### 1. **Lead Capture Form**
- ✨ Beautiful, conversion-optimized UI on homepage
- 📱 Fully responsive with inline & modal variants
- 🎨 Premium design with gradient backgrounds
- ✍️ Collects: Name, Email, Phone, Grade, Course Interest

### 2. **Automated Email Workflows**

#### **Workflow 1: Admin Notification (Instant)**
```
Visitor submits form
  ↓
Lead saved to database
  ↓
📧 Admin receives instant email notification
```

#### **Workflow 2: Welcome Email (On Contact)**
```
Admin opens dashboard
  ↓
Changes lead status → "Contacted"
  ↓
📧 Lead receives beautiful welcome email automatically
```

---

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Install Dependencies**
Already done! We installed `nodemailer` for you.

### **Step 2: Configure Email (Choose One)**

#### **Option A: Gmail (Easiest)**
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down → Click **App passwords**
4. Select **Mail** and **Other (Custom name)** → Enter "EduAI Tutors"
5. Copy the 16-character password

#### **Option B: SendGrid (Recommended for Production)**
1. Sign up at https://sendgrid.com/ (free tier: 100 emails/day)
2. Create an API key
3. Use these settings:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

#### **Option C: Mailgun**
1. Sign up at https://www.mailgun.com/
2. Verify your domain or use sandbox
3. Get SMTP credentials from dashboard

---

### **Step 3: Update .env File**

Create or update `.env.local` in your project root:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

# Admin Email (receives lead notifications)
ADMIN_EMAIL=admin@yourcompany.com

# Base URL (for email links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### **Step 4: Restart Server**
```bash
# Stop the current server (Ctrl+C)
# Restart
npm run dev
```

---

## 🧪 **Testing Your Setup**

### **Test 1: Lead Capture Form**
1. Open http://localhost:3000
2. Scroll to the bottom → Find "Ready to Transform Your Future?"
3. Fill the form with your details
4. Click "Start Your Learning Journey"
5. ✅ You should see: "🎉 Thank you! Our team will contact you shortly."

### **Test 2: Admin Notification**
- If SMTP is configured correctly, you (admin) will receive an email with lead details
- Subject: "🔔 New Lead: [Name] ([Interest])"

### **Test 3: Welcome Email (Automated)**
1. Login as Admin → Click "Leads" tab
2. Find the lead you just created (status: "New")
3. Change status dropdown to "Contacted"
4. ✅ The lead should receive a beautiful welcome email instantly!

---

## 📧 **Email Templates**

### **Welcome Email Features:**
- 🎨 Responsive HTML design with your branding
- 🏆 Highlights platform benefits (AI learning, live classes, etc.)
- 🔗 Call-to-action button → "Explore Our Courses"
- 📞 Contact information embedded
- ✨ Professional footer with year auto-update

### **Admin Notification Features:**
- 📊 Quick lead summary (name, email, phone, interest)
- 🔗 Direct link to admin dashboard
- ⚡ Instant delivery (fire-and-forget)

---

## 🛠️ **Customization Guide**

### **Change Email Templates**
Edit `lib/email.ts`:

```typescript
// Customize welcome email HTML
const getWelcomeEmailHTML = (leadName: string) => `
  <!-- Your custom HTML here -->
  <h1>Welcome ${leadName}!</h1>
  ...
`;
```

### **Add More Email Triggers**
Example: Send email when status → "Qualified"

```typescript
// In app/api/admin/leads/route.ts
if (status === 'Qualified' && previousLead.status !== 'Qualified') {
  sendQualifiedEmail(lead.email, lead.name);
}
```

### **Customize Form Fields**
Edit `components/LeadCaptureForm.tsx`:
- Add new fields (source, city, etc.)
- Change dropdown options
- Modify styling

---

## 🎯 **Production Deployment**

### **Recommended: Use SendGrid or Mailgun**
- ✅ Better deliverability than Gmail
- ✅ Higher sending limits
- ✅ Email analytics dashboard
- ✅ No risk of account suspension

### **Environment Variables on Vercel/Netlify:**
1. Go to your project settings
2. Add all SMTP variables from `.env.example`
3. Redeploy

---

## 🔒 **Security Best Practices**

1. ✅ **Never commit** `.env` files to git (already in `.gitignore`)
2. ✅ Use **App Passwords** for Gmail (not your main password)
3. ✅ Rotate SMTP credentials periodically
4. ✅ Set up **SPF/DKIM** records for custom domain (reduces spam risk)

---

## 🐛 **Troubleshooting**

### **Emails not sending?**
**Check console logs:**
```bash
⚠️ SMTP not configured. Email would have been sent to: user@example.com
```
**Solution:** Configure `SMTP_USER` and `SMTP_PASS` in `.env.local`

---

### **Gmail "Less secure app" error?**
**Solution:** Use App Password instead of regular password (see Step 2)

---

### **Emails going to spam?**
**Solutions:**
1. Use a custom domain email (not Gmail)
2. Set up SPF/DKIM records
3. Use SendGrid/Mailgun for better reputation

---

### **Status update not triggering email?**
**Check:**
1. Ensure status changed FROM something other than "Contacted"
2. Check server console for error messages
3. Verify email address in lead data is valid

---

## 📊 **Current Workflow Diagram**

```
┌─────────────────────────────────────────────────┐
│  VISITOR SUBMITS FORM (Homepage)                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  API: /api/leads (POST)                         │
│  • Creates lead in database                     │
│  • Sends admin notification email 📧            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  ADMIN DASHBOARD: Views new lead (status: New)  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  ADMIN: Changes status → "Contacted"            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  API: /api/admin/leads (PATCH)                  │
│  • Updates lead status                          │
│  • Detects status = "Contacted"                 │
│  • Sends welcome email to lead 📧               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  LEAD: Receives beautiful welcome email 🎉      │
└─────────────────────────────────────────────────┘
```

---

## 🎉 **What You've Achieved**

✅ **Lead Capture Form** → Live on homepage  
✅ **Instant Admin Notifications** → Never miss a lead  
✅ **Automated Welcome Emails** → Professional first impression  
✅ **Beautiful Email Templates** → HTML with your branding  
✅ **Production Ready** → Just configure SMTP!  

---

## 🚀 **Next Steps**

1. **Configure SMTP** (5 minutes)
2. **Test the workflow** (submit test lead)
3. **Customize email templates** (optional)
4. **Deploy to production** 🎯

**Need help?** Check the troubleshooting section above!
