# 🔐 Authentication Flow - TheBrokrs API

## Registration & Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER REGISTRATION                          │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Register User
├─ Request: POST /api/v1/auth/register
├─ Body: { name, email, phone, password }
├─ Validations:
│  ├─ Email format validation
│  ├─ Phone (10 digits)
│  ├─ Password (min 6 chars)
│  └─ Check if user already exists
├─ Response:
│  ├─ ✅ User created (NOT verified)
│  ├─ 📧 OTP sent to email
│  └─ No tokens yet!
└─ Status: 201 Created

                          ↓

STEP 2: User receives OTP via Email
├─ OTP valid for: 10 minutes
├─ User enters: Email + OTP
└─ User clicks: "Verify OTP"

                          ↓

STEP 3: Verify OTP
├─ Request: POST /api/v1/auth/verify-otp
├─ Body: { email, otp }
├─ Validations:
│  ├─ OTP must match
│  ├─ OTP must not be expired
│  └─ User must exist
├─ On Success:
│  ├─ ✅ User marked as verified
│  ├─ 🎫 Access Token generated (15m expire)
│  ├─ 🔄 Refresh Token generated (7d expire)
│  └─ 📧 Welcome email sent
├─ Response:
│  ├─ user object
│  ├─ accessToken (use for API calls)
│  └─ refreshToken (use to refresh expired token)
└─ Status: 200 OK

                          ↓

STEP 4: User is now authenticated!
├─ Store tokens in device storage
├─ Use accessToken in: Authorization: Bearer <token>
└─ Redirect to: Home/Dashboard
```

---

## Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LOGIN                               │
└─────────────────────────────────────────────────────────────────┘

STEP 1: User Login
├─ Request: POST /api/v1/auth/login
├─ Body: { email, password }
├─ Validations:
│  ├─ User exists?
│  └─ Password correct?
├─ On Success:
│  ├─ ✅ User authenticated
│  ├─ 🎫 Access Token generated (15m expire)
│  ├─ 🔄 Refresh Token generated (7d expire)
│  └─ 📝 Last login timestamp updated
├─ Response:
│  ├─ user object
│  ├─ accessToken
│  └─ refreshToken
└─ Status: 200 OK

                          ↓

STEP 2: User is now authenticated!
├─ Store tokens in device storage
├─ Use accessToken in: Authorization: Bearer <token>
└─ Redirect to: Home/Dashboard
```

---

## Protected Route Flow (Profile, etc.)

```
┌─────────────────────────────────────────────────────────────────┐
│              ACCESS PROTECTED ENDPOINTS                         │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Make API Request with Token
├─ Request: GET /api/v1/users/profile
├─ Headers: Authorization: Bearer <accessToken>
└─ Method: GET / POST / PUT / DELETE

                          ↓

STEP 2: Middleware Validates Token
├─ Check if token exists
├─ Verify token signature
├─ Check if token expired
├─ Extract user ID from token
└─ Attach user to request

                          ↓

STEP 3: Two Possible Outcomes

A. TOKEN VALID ✅
   ├─ User info attached to request
   ├─ Controller function executes
   └─ Return user data

B. TOKEN EXPIRED ❌
   ├─ Return: 403 Unauthorized
   ├─ Next Step: Refresh token
   └─ Get new accessToken

```

---

## Refresh Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              REFRESH EXPIRED ACCESS TOKEN                       │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Access Token Expired
├─ API returns: 403 Unauthorized / Token expired
├─ App has: refreshToken (still valid)
└─ App needs: new accessToken

                          ↓

STEP 2: Refresh Token
├─ Request: POST /api/v1/auth/refresh-token
├─ Body: { token: refreshToken }
├─ Validations:
│  ├─ Refresh token valid?
│  ├─ Refresh token not expired?
│  └─ Refresh token matches database?
├─ Response:
│  └─ New accessToken (15m expire)
└─ Status: 200 OK

                          ↓

STEP 3: Retry Original Request
├─ Use new accessToken
├─ Add to Authorization header
└─ Request succeeds! ✅
```

---

## Resend OTP Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              RESEND OTP (User didn't receive)                   │
└─────────────────────────────────────────────────────────────────┘

STEP 1: User clicks "Resend OTP"
├─ Request: POST /api/v1/auth/resend-otp
├─ Body: { email }
├─ Validations:
│  ├─ User exists?
│  └─ User not already verified?
├─ Actions:
│  ├─ Generate new OTP
│  ├─ Update OTP in database
│  └─ Send new OTP email
├─ Response:
│  └─ { emailSent: true }
└─ Status: 200 OK

                          ↓

STEP 2: User receives new OTP
├─ Enter new OTP
└─ Go back to: Verify OTP step
```

---

## Token Details

### Access Token
- **Duration:** 15 minutes (configurable in .env)
- **Contains:** User ID, Email, Role
- **Usage:** Every API request that needs authentication
- **Stored in:** Device storage / App state
- **Header:** `Authorization: Bearer <token>`

### Refresh Token
- **Duration:** 7 days (configurable in .env)
- **Contains:** User ID only
- **Usage:** To get new access token when expired
- **Stored in:** Database + Device storage
- **Rotation:** Generated on login/registration, updated on refresh

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | ✅ Success | Login, verify OTP, refresh token |
| 201 | ✅ Created | Registration |
| 400 | ❌ Bad Request | Validation failed (invalid email, password too short, etc.) |
| 401 | ❌ Unauthorized | Invalid credentials or expired token |
| 404 | ❌ Not Found | User not found |
| 500 | ❌ Server Error | Database or email service error |

---

## Error Handling

### Common Errors:

**Registration:**
- `Email already registered` → User exists
- `Phone number already registered` → Phone exists
- `Invalid email format` → Email validation failed
- `Phone number must be 10 digits` → Phone format invalid
- `Password must be at least 6 characters` → Password too short

**OTP Verification:**
- `Invalid OTP` → Wrong OTP entered
- `OTP has expired` → User took too long (>10 mins)
- `User not found` → Email doesn't exist

**Login:**
- `Invalid email or password` → Wrong credentials
- `User not found` → Email doesn't exist

**Protected Routes:**
- `No token provided` → Missing Authorization header
- `Invalid or expired token` → Token expired or tampered

---

## Frontend Implementation Notes

### 1. Registration Screen
```javascript
// Step 1: Register
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "MyPass123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "nextStep": "verify-otp"  // ← Important!
  }
}
```

### 2. OTP Verification Screen
```javascript
// Step 2: Verify OTP
POST /api/v1/auth/verify-otp
{
  "email": "john@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

// Save tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### 3. Protected API Calls
```javascript
// Every request needs this header:
Authorization: Bearer <accessToken>

// Example:
fetch('http://api.thebrokrs.com/api/v1/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

### 4. Handle Expired Token
```javascript
// If get 403 Unauthorized:
POST /api/v1/auth/refresh-token
{
  "token": refreshToken
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJ..."  // New token
  }
}

// Update stored token and retry
```

---

## Summary

| Endpoint | Method | Body | Auth | Response |
|----------|--------|------|------|----------|
| `/auth/register` | POST | name, email, phone, password | ❌ | user, nextStep |
| `/auth/verify-otp` | POST | email, otp | ❌ | user, accessToken, refreshToken |
| `/auth/resend-otp` | POST | email | ❌ | emailSent |
| `/auth/login` | POST | email, password | ❌ | user, accessToken, refreshToken |
| `/auth/refresh-token` | POST | token | ❌ | accessToken |
| `/users/profile` | GET | - | ✅ | user data |
| `/users/profile` | PUT | name, bio, location, etc | ✅ | updated user |
