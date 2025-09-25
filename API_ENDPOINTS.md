# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api/v1
https://notes-api.kuldeepdev.me
```

## Authentication Endpoints

### 1. Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!",
  "role": "user"  // optional: "user" or "admin", defaults to "user"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "userId",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "Registration Successful"
}
```

---

### 2. Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "userId",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

---

### 3. Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "userId",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

---

### 4. Refresh Token
```http
POST /auth/refresh
```
*Uses refresh token from cookies*

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  },
  "message": "Token refreshed successfully"
}
```

---

### 5. Logout
```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Notes Endpoints

### 1. Create Note
```http
POST /notes
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "note": {
      "_id": "noteId",
      "title": "My First Note",
      "content": "This is the content of my note",
      "user": "userId",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Note created successfully"
}
```

---

### 2. Get All Notes
```http
GET /notes?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "_id": "noteId",
        "title": "Note Title",
        "content": "Note content",
        "user": {
          "_id": "userId",
          "name": "John Doe",
          "email": "user@example.com"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  },
  "message": "Notes retrieved successfully"
}
```

---

### 3. Get Note by ID
```http
GET /notes/{noteId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "note": {
      "_id": "noteId",
      "title": "Note Title",
      "content": "Note content",
      "user": {
        "_id": "userId",
        "name": "John Doe",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Note retrieved successfully"
}
```

---

### 4. Update Note
```http
PUT /notes/{noteId}
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",      // optional
  "content": "Updated content"    // optional
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "note": {
      "_id": "noteId",
      "title": "Updated Title",
      "content": "Updated content",
      "user": "userId",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Note updated successfully"
}
```

---

### 5. Delete Note
```http
DELETE /notes/{noteId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## Admin Endpoints

### Get All Notes (Admin Only)
```http
GET /admin/notes/?page=1&limit=20
```

**Headers:**
```
Authorization: Bearer {token}  // Must be admin
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notes": [...],  // All notes from all users
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  },
  "message": "All notes retrieved successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Authentication failed"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Access Denied"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error"
  }
}
```