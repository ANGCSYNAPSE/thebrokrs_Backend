# Email OTP Configuration Guide

## ✅ What Has Been Implemented

Your backend now has a complete email OTP system with:

### 1. **Email Service** (`src/services/email.service.js`)
   - Generate random 6-digit OTP
   - Send OTP via email with beautiful HTML template
   - Send welcome email after verification
   - Email configuration for both development and production

### 2. **Auth Endpoints**
   - `POST /api/v1/auth/register` - Register user + sends OTP to email
   - `POST /api/v1/auth/verify-otp` - Verify OTP
   - `POST /api/v1/auth/resend-otp` - Resend OTP if expired
   - `POST /api/v1/auth/login` - Login user
   - `POST /api/v1/auth/refresh-token` - Refresh JWT token

### 3. **Database**
   - User registration data stored in PostgreSQL (Neon DB)
   - OTP and expiry timestamps tracked
   - Email verification status tracked

---

## ⚙️ WHAT YOU NEED TO DO - Email Configuration

### **Option 1: Using Gmail (RECOMMENDED FOR TESTING)**

1. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Factor Authentication if not already enabled
   - Go to "App passwords" section
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this password

2. **Update `.env` file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_char_app_password
   EMAIL_FROM=noreply@thebrokrs.com
   ```

3. **Test it:**
   ```bash
   curl -X POST http://localhost:5000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "your_test@gmail.com",
       "phone": "9876543210",
       "password": "password123"
     }'
   ```
   - Check your email for the OTP

---

### **Option 2: Using SendGrid (FOR PRODUCTION)**

1. **Create SendGrid Account:**
   - Go to https://sendgrid.com
   - Sign up and create API key

2. **Install SendGrid (optional):**
   ```bash
   npm install @sendgrid/mail
   ```

3. **Update `.env`:**
   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=noreply@thebrokrs.com
   ```

---

### **Option 3: Using AWS SES (FOR PRODUCTION)**

1. **Create AWS Account and configure SES**
2. **Verify sender email in SES**
3. **Update `.env` with AWS credentials**

---

## 📧 API Usage Examples

### **1. Register User**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please verify OTP sent to your email.",
  "emailSent": true,
  "user": {
    "id": "clxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isVerified": false
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### **2. Verify OTP**
```bash
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "isVerified": true,
  "user": {
    "id": "clxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

---

### **3. Resend OTP**
```bash
POST /api/v1/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "OTP resent to your email",
  "emailSent": true
}
```

---

### **4. Login**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

---

## 🔒 Security Features

✅ **Password Hashing** - bcryptjs with 10 rounds
✅ **JWT Tokens** - Access token (15m) + Refresh token (7d)
✅ **OTP Expiry** - 10 minutes
✅ **OTP Validation** - Checked for validity and expiration
✅ **Email Verification** - User marked as verified only after OTP confirmation
✅ **Duplicate Prevention** - No duplicate emails/phones allowed

---

## 📊 Database Schema

**Users Table:**
```sql
- id (UUID)
- name (String)
- email (String, UNIQUE)
- phone (String, UNIQUE)
- password (String, hashed)
- role (String) - buyer, agent, admin
- isVerified (Boolean)
- isActive (Boolean)
- otp (String, nullable)
- otpExpiresAt (DateTime, nullable)
- phoneVerified (Boolean)
- aadhaarVerified (Boolean)
- panNumber (String)
- videoKycCompleted (Boolean)
- refreshToken (String)
- lastLogin (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

## 🧪 Testing Without Real Email

If you don't have email configured:
- OTP will be logged in console: `📧 OTP for email@example.com: 123456`
- Copy the OTP from console logs
- Use it to verify

---

## 🚀 Next Steps

1. **Configure email** (Gmail or SendGrid recommended)
2. **Update .env file** with email credentials
3. **Restart backend**: `npm run start`
4. **Test registration** - you should receive OTP email
5. **Test OTP verification** - verify and get access token
6. **Your registration data** is now saved in Neon PostgreSQL! ✅

---

## ❓ Troubleshooting

**Not receiving email?**
- Check .env file is configured correctly
- Check spam folder
- Check console for error messages
- Verify email credentials are correct

**OTP expired?**
- Use `/api/v1/auth/resend-otp` endpoint
- Default expiry is 10 minutes

**Email not configured?**
- OTP will be logged to console
- Check server logs for: `📧 OTP for user@email.com: XXXXXX`

---

## 📝 Notes

- All registration data is stored in PostgreSQL (Neon DB)
- OTP is not sent in registration response (only via email)
- User needs to verify OTP within 10 minutes
- After verification, user gets welcome email
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
