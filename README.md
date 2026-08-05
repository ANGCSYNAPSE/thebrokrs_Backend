# TheBrokrs Backend API

A professional real estate platform backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Features

- ✅ User Registration with Email OTP Verification
- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ PostgreSQL Database (Neon)
- ✅ Prisma ORM for Database Management
- ✅ Professional Email Templates with Nodemailer
- ✅ Standardized API Responses
- ✅ Property & Project Management
- ✅ User Profile Management
- ✅ Complete KYC Integration
- ✅ Swagger API Documentation

## 📋 Prerequisites

- Node.js v18+ 
- npm or pnpm
- PostgreSQL database (Neon recommended)
- Gmail account with App Password

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/ANGCSYNAPSE/thebrokrs_Backend.git
cd thebrokrs_Backend
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@thebrokrs.com
```

### 4. Database Setup
```bash
# Push Prisma schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 5. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

API Documentation: `http://localhost:5000/api/docs`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
  // phone is optional
}
```

**Response:**
```json
{
  "status": true,
  "message": "User registered successfully. OTP sent to your email",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "emailSent": true,
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Verify OTP
```bash
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```bash
POST /api/v1/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token
```bash
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "token": "refresh_token_value"
}
```

### User Endpoints

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users` - Get all users
- `PUT /api/v1/users/kyc` - Update KYC status

### Property Endpoints

- `GET /api/v1/properties` - Get all properties
- `GET /api/v1/properties/:id` - Get property details
- `POST /api/v1/properties` - Create property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Project Endpoints

- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

## 🔐 Authentication

All protected endpoints require Bearer token in Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Generate App Password
4. Add to `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

## 🗄️ Database Schema

### Users Table
- id (UUID)
- name
- email (unique)
- phone (unique, optional)
- password (hashed)
- role (buyer/agent/admin)
- otp & otpExpiresAt
- isVerified, phoneVerified
- KYC fields
- createdAt, updatedAt

### Properties Table
- id, title, description
- type, price, address, city, state
- area, bedrooms, bathrooms
- amenities, images
- views, isVerified
- agentId (FK), projectId (FK)

### Projects Table
- id, name, description
- type, status
- location, amenities
- price range, units
- images, dates
- developerId (FK)

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment
```bash
# Ensure all environment variables are set
# Create .env.production with production values
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Add environment variables
5. Deploy

### 4. Set Production Database
- Update `DATABASE_URL` in Vercel environment
- Point to your production Neon database

### 5. Vercel Configuration
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 📝 Project Structure

```
backend/
├── src/
│   ├── api/              # API integrations
│   ├── config/           # Configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── templates/        # Email templates
│   ├── utils/            # Utilities
│   └── index.js          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

## 🧪 Testing

### Register without phone
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- OTP email verification (10 min expiry)
- Input validation on all endpoints
- Environment variable protection
- CORS enabled
- Helmet.js for security headers

## 📊 Response Format

All endpoints follow standard response format:

**Success:**
```json
{
  "status": true,
  "message": "Success message",
  "data": { /* optional */ }
}
```

**Error:**
```json
{
  "status": false,
  "message": "Error message"
}
```

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Kill existing process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3000 npm start
```

### "Email not sending"
- Check `.env` has correct Gmail credentials
- Verify Gmail App Password is correct
- Check 2FA is enabled on Gmail account

### "Database connection error"
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL/Neon is running
- Ensure database exists

## 📧 Support

For issues or questions:
- GitHub: https://github.com/ANGCSYNAPSE/thebrokrs_Backend
- Email: support@thebrokrs.com

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for TheBrokrs**
