# TheBrokrs API - Response Format Documentation

## Standard Response Format

All API endpoints follow a consistent response format:

### Success Response (2xx)
```json
{
  "status": true,
  "message": "Success message describing what happened",
  "data": {
    // Response data here
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "status": false,
  "message": "Error message describing what went wrong"
}
```

---

## Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST that creates resource)
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error

---

## Example: User Registration

### Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "SecurePass123"
  }'
```

### Success Response (201)
```json
{
  "status": true,
  "message": "User registered successfully. OTP sent to your email",
  "data": {
    "user": {
      "id": "cmsfzod480001lgiznptt7ss3",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isVerified": false
    },
    "emailSent": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (400)
```json
{
  "status": false,
  "message": "Email already registered"
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/v1/auth/register`

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required, 10 digits)",
  "password": "string (required, min 6 chars)"
}
```

**Responses:**
- `201` - User registered, OTP sent
- `400` - Validation error

**Response Fields:**
- `user` - User object with id, name, email, phone, isVerified
- `emailSent` - Boolean indicating if OTP was sent
- `accessToken` - JWT token for API access
- `refreshToken` - JWT token for refreshing access token

---

### 2. Verify OTP
**POST** `/api/v1/auth/verify-otp`

**Request:**
```json
{
  "email": "string (required)",
  "otp": "string (required, 6 digits)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "isVerified": true
    }
  }
}
```

---

### 3. Resend OTP
**POST** `/api/v1/auth/resend-otp`

**Request:**
```json
{
  "email": "string (required)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "OTP resent to your email",
  "data": {
    "emailSent": true
  }
}
```

---

### 4. Login
**POST** `/api/v1/auth/login`

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "phone": "...",
      "role": "buyer",
      "isVerified": true
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### 5. Refresh Token
**POST** `/api/v1/auth/refresh-token`

**Request:**
```json
{
  "token": "string (refresh token)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

---

## User Endpoints

### Get User Profile
**GET** `/api/v1/users/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "status": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "phone": "...",
    "role": "...",
    "isVerified": true,
    "createdAt": "2026-08-05T10:00:00Z"
  }
}
```

---

### Update User Profile
**PUT** `/api/v1/users/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "string (optional)",
  "bio": "string (optional)",
  "location": "string (optional)",
  "profileImage": "string (optional, URL)"
}
```

---

## Property Endpoints

### Get All Properties
**GET** `/api/v1/properties?city=Mumbai&type=residential&minPrice=5000000&maxPrice=10000000&page=1&limit=10`

**Query Parameters:**
- `city` - Filter by city (optional)
- `type` - Filter by property type (optional)
- `minPrice` - Minimum price (optional)
- `maxPrice` - Maximum price (optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "status": true,
  "message": "Properties retrieved successfully",
  "data": {
    "properties": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

---

### Create Property
**POST** `/api/v1/properties`

**Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "type": "string (required: residential/commercial)",
  "price": "number (required)",
  "address": "string (required)",
  "city": "string (required)",
  "state": "string (required)",
  "area": "number (optional)",
  "bedrooms": "number (optional)",
  "bathrooms": "number (optional)",
  "amenities": ["array", "of", "strings"],
  "images": ["array", "of", "image_urls"]
}
```

**Response:** `201` Created

---

## Common Error Messages

| Status | Message | Cause |
|--------|---------|-------|
| 400 | All fields are required | Missing required field |
| 400 | Email already registered | Email exists |
| 400 | Invalid email format | Email validation failed |
| 400 | Invalid OTP | OTP doesn't match |
| 400 | OTP has expired | OTP > 10 minutes old |
| 401 | Invalid email or password | Wrong credentials |
| 401 | Invalid or expired refresh token | Token expired/invalid |
| 404 | User not found | User doesn't exist |
| 500 | Internal Server Error | Server error |

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123"
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

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## API Documentation

Live API docs available at: `http://localhost:5000/api/docs`

Swagger UI with interactive testing capabilities.
