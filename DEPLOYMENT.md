# Deployment Guide - TheBrokrs Backend to Vercel

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Neon Database
1. Go to https://console.neon.tech
2. Create a PostgreSQL database
3. Copy your connection string (DATABASE_URL)

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub account

2. **Import Repository**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose: `ANGCSYNAPSE/thebrokrs_Backend`
   - Click "Import"

3. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:

   ```
   DATABASE_URL = postgresql://neondb_owner:password@host/database
   JWT_SECRET = your_jwt_secret_key_change_this
   JWT_EXPIRE = 7d
   REFRESH_TOKEN_EXPIRE = 30d
   PORT = 3000
   NODE_ENV = production
   CORS_ORIGIN = *
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your_email@gmail.com
   EMAIL_PASS = your_app_password
   EMAIL_FROM = noreply@thebrokrs.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - Your API will be available at a Vercel URL

#### Option B: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd D:\thebrokrs_Application\TheBrokrsApp\backend
   vercel
   ```

3. **Follow prompts**
   - Select your GitHub account
   - Confirm project name
   - Link to existing project or create new

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   # ... add all other env vars
   ```

5. **Redeploy with variables**
   ```bash
   vercel --prod
   ```

### Step 3: Setup Database

1. **Run Prisma Migrations**
   ```bash
   # In Vercel dashboard, you may need to run this in local CLI connected to Vercel
   npx prisma db push
   ```

2. **Verify Database Connection**
   - Check Vercel logs to ensure PostgreSQL connection is successful

### Step 4: Test Your API

Once deployed, test endpoints:

```bash
# Get your Vercel URL from dashboard (looks like: https://thebrokrs-backend.vercel.app)

# Register
curl -X POST https://your-vercel-url.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Check API docs
https://your-vercel-url.vercel.app/api/docs
```

## 📊 Environment Variables - Production

| Variable | Value | Example |
|----------|-------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| JWT_SECRET | Secret for signing tokens | `super_secret_key_here` |
| JWT_EXPIRE | Access token expiry | `15m` |
| REFRESH_TOKEN_EXPIRE | Refresh token expiry | `7d` |
| PORT | Server port | `3000` |
| NODE_ENV | Environment | `production` |
| CORS_ORIGIN | Allowed origins | `https://yourdomain.com` |
| EMAIL_HOST | SMTP host | `smtp.gmail.com` |
| EMAIL_PORT | SMTP port | `587` |
| EMAIL_USER | Gmail address | `your@gmail.com` |
| EMAIL_PASS | Gmail app password | `16-char app password` |
| EMAIL_FROM | From email | `noreply@thebrokrs.com` |

## 🔗 Deployment Checklist

- [ ] GitHub repository pushed: `https://github.com/ANGCSYNAPSE/thebrokrs_Backend`
- [ ] Neon PostgreSQL database created
- [ ] Database URL copied
- [ ] Gmail App Password generated
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Database deployed (migrations run)
- [ ] API endpoints tested
- [ ] Swagger docs accessible
- [ ] Email verification working

## 🌍 Your Live API URL

After deployment, your API will be available at:
```
https://[project-name]-[username].vercel.app
```

Example: `https://thebrokrs-backend-angcsynapse.vercel.app`

## 📚 API Endpoints (Production)

- **Registration:** `POST /api/v1/auth/register`
- **Verify OTP:** `POST /api/v1/auth/verify-otp`
- **Login:** `POST /api/v1/auth/login`
- **Properties:** `GET /api/v1/properties`
- **Projects:** `GET /api/v1/projects`
- **Docs:** `GET /api/docs`

## 🔒 Security Best Practices

1. **Never commit `.env`** - Use Vercel's environment variables
2. **Change JWT_SECRET** - Use a strong random key
3. **Use strong passwords** - For database and email
4. **Enable HTTPS only** - Vercel does this automatically
5. **Set CORS_ORIGIN** - Restrict to your frontend domain in production
6. **Monitor logs** - Check Vercel logs for errors

## 🚨 Troubleshooting

### Build Fails
- Check: Node version (should be 18+)
- Ensure: All dependencies in package.json
- Verify: No `.env` file committed

### Database Connection Error
- Check: DATABASE_URL is correct
- Ensure: Neon database is active
- Verify: Network access allowed from Vercel

### Email Not Sending
- Check: EMAIL_USER and EMAIL_PASS are correct
- Ensure: Gmail 2FA enabled
- Verify: App Password generated (not regular password)

### Environment Variables Not Working
- Redeploy after adding variables: `vercel --prod`
- Clear cache: Go to project settings → Deployments → clear cache

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- GitHub Issues: https://github.com/ANGCSYNAPSE/thebrokrs_Backend/issues

---

**Your backend is ready to go live! 🎉**
