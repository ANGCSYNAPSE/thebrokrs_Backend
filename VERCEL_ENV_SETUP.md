# Vercel Environment Variables Setup

## 🔧 How to Add Environment Variables in Vercel

1. Go to your project on Vercel
2. Click **Settings** (top navigation)
3. Click **Environment Variables** (left sidebar)
4. Add each variable below
5. Click **Save**

---

## 📋 Environment Variables to Set

Copy and paste each one into Vercel:

### 1. DATABASE_URL
**Key:** `DATABASE_URL`
**Value:** Your PostgreSQL connection string from Neon
```
postgresql://neondb_owner:YOUR_PASSWORD@ep-late-cloud-aq81lis3-pooler.c-8.us-east-1.aws.neon.tech/thebrokrs?sslmode=require&channel_binding=require
```
**Environment:** Production, Preview, Development

---

### 2. JWT_SECRET
**Key:** `JWT_SECRET`
**Value:** (Generate a secure random string - at least 32 characters)
```
your_super_secret_jwt_key_change_this_12345678901234567890
```
**Environment:** Production, Preview, Development

---

### 3. JWT_EXPIRE
**Key:** `JWT_EXPIRE`
**Value:** 
```
15m
```
**Environment:** Production, Preview, Development

---

### 4. REFRESH_TOKEN_EXPIRE
**Key:** `REFRESH_TOKEN_EXPIRE`
**Value:**
```
7d
```
**Environment:** Production, Preview, Development

---

### 5. PORT
**Key:** `PORT`
**Value:**
```
3000
```
**Environment:** Production, Preview, Development

---

### 6. NODE_ENV
**Key:** `NODE_ENV`
**Value:**
```
production
```
**Environment:** Production only

---

### 7. CORS_ORIGIN
**Key:** `CORS_ORIGIN`
**Value:** Your frontend URL (or * for development)
```
*
```
Or when ready for production:
```
https://yourdomain.com
```
**Environment:** Production, Preview, Development

---

### 8. EMAIL_HOST
**Key:** `EMAIL_HOST`
**Value:**
```
smtp.gmail.com
```
**Environment:** Production, Preview, Development

---

### 9. EMAIL_PORT
**Key:** `EMAIL_PORT`
**Value:**
```
587
```
**Environment:** Production, Preview, Development

---

### 10. EMAIL_USER
**Key:** `EMAIL_USER`
**Value:** Your Gmail address
```
akshayshakr@gmail.com
```
**Environment:** Production, Preview, Development

---

### 11. EMAIL_PASS
**Key:** `EMAIL_PASS`
**Value:** Your Gmail App Password (16 characters)
```
kgyz jbvv eoyi odsx
```
**Environment:** Production, Preview, Development

---

### 12. EMAIL_FROM
**Key:** `EMAIL_FROM`
**Value:**
```
noreply@thebrokrs.com
```
**Environment:** Production, Preview, Development

---

## 📝 Complete Setup Summary

| Key | Value | Notes |
|-----|-------|-------|
| DATABASE_URL | postgresql://... | From Neon Console |
| JWT_SECRET | your_secret_key | Generate secure random string |
| JWT_EXPIRE | 15m | Token expiry time |
| REFRESH_TOKEN_EXPIRE | 7d | Refresh token expiry |
| PORT | 3000 | Vercel assigns port automatically |
| NODE_ENV | production | Set for production |
| CORS_ORIGIN | * | Change to frontend URL in production |
| EMAIL_HOST | smtp.gmail.com | Gmail SMTP server |
| EMAIL_PORT | 587 | Gmail SMTP port |
| EMAIL_USER | your_email@gmail.com | Gmail address |
| EMAIL_PASS | 16_char_app_password | Gmail App Password |
| EMAIL_FROM | noreply@thebrokrs.com | From email address |

---

## 🔐 How to Generate JWT_SECRET

Use this command to generate a secure random string:

**On Windows (PowerShell):**
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char][System.Random]::new().Next(33, 126) } | Join-String)))
```

**Or use this simple string:**
```
thebrokrs_jwt_secret_2026_production_key_12345678
```

---

## 📱 How to Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Look for "App passwords" (near bottom)
3. Select **Mail** and **Windows Computer**
4. Google will generate a 16-character password
5. Copy it and paste in Vercel as `EMAIL_PASS`

---

## ✅ Verification Checklist

After adding all variables in Vercel:

- [ ] DATABASE_URL is set
- [ ] JWT_SECRET is set
- [ ] Email variables are configured
- [ ] NODE_ENV is set to production
- [ ] CORS_ORIGIN is configured
- [ ] Click **Deploy** button
- [ ] Wait 2-3 minutes for deployment
- [ ] Check Vercel logs for any errors

---

## 🧪 Test After Deployment

Once deployed, test your API:

```bash
# Replace with your Vercel URL
BACKEND_URL="https://thebrokrs-backend-xxx.vercel.app"

# Register
curl -X POST $BACKEND_URL/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Check docs
curl $BACKEND_URL/api/docs
```

---

## 🚨 Common Issues

### "Email not sending"
- Verify EMAIL_USER is correct Gmail address
- Check EMAIL_PASS is the 16-character App Password (not regular password)
- Ensure 2FA is enabled on Gmail account

### "Database connection failed"
- Verify DATABASE_URL is complete and correct
- Check Neon database is active
- Ensure SSL mode is enabled in connection string

### "Deployment failed"
- Check Vercel logs for error messages
- Verify all environment variables are set
- Ensure NODE_ENV is set to production

---

## 📞 Support

If you need help:
1. Check Vercel logs: Project → Deployments → Click deployment → View logs
2. Verify environment variables: Project → Settings → Environment Variables
3. Test API locally first before deploying

**Your API is almost live! 🚀**
