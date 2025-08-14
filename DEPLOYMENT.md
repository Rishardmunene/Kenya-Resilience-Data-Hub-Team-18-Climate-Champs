# 🚀 Deployment Guide - Kenya Climate Resilience Dashboard

## Vercel Deployment with CI/CD

### Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)
- PostgreSQL database (can use Vercel Postgres or external provider)

### Step 1: Environment Variables Setup

Create the following environment variables in Vercel:

#### Frontend Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
```

#### Backend Variables:
```
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=kcrd_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-jwt-key
```

### Step 2: Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard
2. Create a new Postgres database
3. Copy the connection string
4. Set environment variables accordingly

#### Option B: External Database
- Use services like:
  - Supabase (free tier available)
  - Railway
  - PlanetScale
  - AWS RDS

### Step 3: Deploy to Vercel

1. **Connect GitHub Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables:**
   - Add all variables from Step 1
   - Save and deploy

### Step 4: Backend Deployment

Since your backend is currently in a separate service, you have two options:

#### Option A: Deploy Backend to Vercel Functions
1. Move API routes to `src/app/api/`
2. Update database connection for serverless
3. Deploy as part of the same project

#### Option B: Deploy Backend Separately
1. Create a separate Vercel project for the API
2. Use Vercel Functions for the backend
3. Update frontend to point to the new API URL

### Step 5: CI/CD Setup

Vercel automatically sets up CI/CD:
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failed deployments

### Step 6: Custom Domain (Optional)

1. Go to Project Settings in Vercel
2. Add your custom domain
3. Configure DNS records
4. Enable HTTPS automatically

### Step 7: Monitoring & Analytics

Vercel provides:
- Real-time performance monitoring
- Error tracking
- Analytics dashboard
- Function logs

## 🛠️ Development Workflow

### Local Development:
```bash
# Frontend
npm run dev

# Backend (if separate)
cd services/api
npm run dev
```

### Production Deployment:
```bash
# Push to main branch
git push origin main

# Vercel automatically deploys
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check environment variables
   - Verify TypeScript errors
   - Check for missing dependencies

2. **Database Connection:**
   - Verify connection string
   - Check firewall settings
   - Ensure database is accessible

3. **API Routes:**
   - Check Vercel Functions logs
   - Verify route configuration
   - Test locally first

### Support:
- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: Create issue in your repository
- Vercel Support: Available in dashboard

## 📊 Performance Optimization

1. **Image Optimization:**
   - Use Next.js Image component
   - Configure domains in next.config.js

2. **Caching:**
   - Implement proper caching headers
   - Use Vercel Edge Cache

3. **Bundle Size:**
   - Monitor bundle analyzer
   - Optimize imports
   - Use dynamic imports where appropriate

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **API Security:**
   - Implement proper authentication
   - Use HTTPS in production
   - Validate all inputs

3. **Database Security:**
   - Use connection pooling
   - Implement proper access controls
   - Regular backups

---

**Happy Deploying! 🎉**
