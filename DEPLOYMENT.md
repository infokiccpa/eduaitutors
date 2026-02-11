# AWS Deployment Guide for EduAI Tutors

This guide will help you deploy the Next.js application to AWS Amplify.

## Prerequisites

1. AWS Account (create one at https://aws.amazon.com if you don't have one)
2. GitHub repository with your code (already done ✅)
3. Environment variables ready

## Deployment Steps

### Step 1: Access AWS Amplify Console

1. Go to https://console.aws.amazon.com/amplify/
2. Sign in with your AWS account
3. Click "Get Started" under "Amplify Hosting"

### Step 2: Connect Your Repository

1. Choose "GitHub" as your Git provider
2. Click "Continue"
3. Authorize AWS Amplify to access your GitHub account
4. Select your repository: `eduaitutors`
5. Select branch: `main`
6. Click "Next"

### Step 3: Configure Build Settings

1. App name: `eduaitutors` (or your preferred name)
2. Build settings will be auto-detected from `amplify.yml`
3. Click "Advanced settings" to add environment variables

### Step 4: Add Environment Variables

Add the following environment variables (use your actual values from .env.local):

```
MSG91_AUTH_KEY=492263AqrHuinSK1698303d3P1
MSG91_TEMPLATE_ID=3661426a5779383632323530
MONGODB_URI=mongodb+srv://info_db_user:KamGlobal26@eduaitutors.cggrgks.mongodb.net/eduaitutors?retryWrites=true&w=majority&appName=EduAiTutors
NEXT_PUBLIC_MSG91_WIDGET_ID=3661426a5779383632323530
NEXT_PUBLIC_MSG91_TOKEN_AUTH=492263AqrHuinSK1698303d3P1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=kamglobalai@gmail.com
SMTP_PASS=chakxzlivamvkbbk
NEXTAUTH_SECRET=eduai_secret_at_least_32_characters_long_kjdshfg
NEXTAUTH_URL=https://main.YOUR_AMPLIFY_APP_ID.amplifyapp.com
```

**Note:** You'll need to update `NEXTAUTH_URL` after deployment with your actual Amplify URL.

### Step 5: Review and Deploy

1. Review all settings
2. Click "Save and deploy"
3. Wait for the build to complete (usually 5-10 minutes)

### Step 6: Update NEXTAUTH_URL

1. Once deployed, copy your Amplify app URL (e.g., https://main.d1a2b3c4d5e6f7.amplifyapp.com)
2. Go to "Environment variables" in Amplify console
3. Update `NEXTAUTH_URL` with your actual URL
4. Redeploy the app

### Step 7: Custom Domain (Optional)

1. In Amplify console, go to "Domain management"
2. Click "Add domain"
3. Follow the instructions to connect your custom domain
4. Update `NEXTAUTH_URL` with your custom domain

## Post-Deployment

### Update MongoDB IP Whitelist

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to Network Access
3. Add `0.0.0.0/0` to allow connections from AWS (or use Amplify's IP ranges)

### Test Your Deployment

1. Visit your Amplify URL
2. Test user registration and login
3. Verify email sending works
4. Test live classroom access

## Automatic Deployments

AWS Amplify will automatically deploy when you push to the `main` branch on GitHub!

## Monitoring

- View build logs in Amplify console
- Set up CloudWatch for application logs
- Enable Amplify monitoring for performance metrics

## Troubleshooting

### Build Fails
- Check build logs in Amplify console
- Verify all environment variables are set correctly
- Ensure `amplify.yml` is in the root directory

### Database Connection Issues
- Verify MongoDB connection string
- Check MongoDB Network Access settings
- Ensure IP whitelist includes AWS IPs

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check `NEXTAUTH_SECRET` is set correctly
- Ensure all auth-related environment variables are present

## Cost Estimate

AWS Amplify Free Tier includes:
- Build & deploy minutes: 1000 minutes/month
- Data served: 15 GB/month
- Data stored: 5 GB/month

Typical costs after free tier: $5-20/month depending on traffic.

## Support

For issues, check:
- AWS Amplify Documentation: https://docs.aws.amazon.com/amplify/
- Next.js Deployment Guide: https://nextjs.org/docs/deployment
