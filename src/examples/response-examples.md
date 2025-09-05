# Unified API Response Examples

## Success Response Format

All successful API responses will now follow this unified format:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/register"
}
```

## Error Response Format

All error responses will follow this unified format:

```json
{
  "success": false,
  "message": "User already exists",
  "error": {
    "code": "BAD_REQUEST",
    "details": {
      "statusCode": 400,
      "message": "User already exists"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/register"
}
```

## API Endpoints Response Examples

### 1. User Registration
**POST** `/api/auth/register`

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/register"
}
```

**Error Response (User already exists):**
```json
{
  "success": false,
  "message": "User already exists",
  "error": {
    "code": "BAD_REQUEST",
    "details": {
      "statusCode": 400,
      "message": "User already exists"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/register"
}
```

### 2. User Login
**POST** `/api/auth/login`

**Success Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/login"
}
```

### 3. Validation Error
**POST** `/api/auth/register` (with invalid data)

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "statusCode": 422,
      "message": [
        "email must be a valid email",
        "password must be at least 6 characters"
      ]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/auth/register"
}
```

## Error Codes

The following error codes are used:

- `BAD_REQUEST` - 400 Bad Request
- `UNAUTHORIZED` - 401 Unauthorized
- `FORBIDDEN` - 403 Forbidden
- `NOT_FOUND` - 404 Not Found
- `CONFLICT` - 409 Conflict
- `VALIDATION_ERROR` - 422 Unprocessable Entity
- `INTERNAL_SERVER_ERROR` - 500 Internal Server Error
- `UNKNOWN_ERROR` - Other errors

## Benefits of Unified Response Format

1. **Consistency** - All API responses follow the same structure
2. **Predictability** - Frontend developers know what to expect
3. **Error Handling** - Standardized error codes and messages
4. **Debugging** - Timestamp and path information for easier debugging
5. **Documentation** - Clear success/error indicators
