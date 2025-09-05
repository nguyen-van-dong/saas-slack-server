# Response Utility Functions Guide

## Quick Start

### Basic Usage

```typescript
import { successResponse, successResponsePaginate } from 'src/common/utils/response.util';

// Simple success response
return successResponse(data, 'Custom message', request);

// Paginated response
return successResponsePaginate(items, page, limit, total, 'Custom message', request);
```

## Functions Overview

### 1. `successResponse(data, message?, request?)`
Creates a standardized success response.

**Parameters:**
- `data` - The data to include in the response
- `message` - Custom success message (optional, auto-generated if not provided)
- `request` - Express request object for path information (optional)

**Example:**
```typescript
// Auto-generated message
return successResponse(userData, undefined, request);

// Custom message
return successResponse(userData, 'User created successfully', request);
```

### 2. `successResponsePaginate(data, page, limit, total, message?, request?)`
Creates a standardized paginated success response.

**Parameters:**
- `data` - Array of data items
- `page` - Current page number
- `limit` - Number of items per page
- `total` - Total number of items
- `message` - Custom success message (optional)
- `request` - Express request object for path information (optional)

**Example:**
```typescript
return successResponsePaginate(
  users,
  1,    // page
  10,   // limit
  100,  // total
  'Users retrieved successfully',
  request
);
```

## Helper Functions

### `validatePaginationParams(page, limit)`
Validates and sanitizes pagination parameters.

```typescript
const { page: validPage, limit: validLimit } = validatePaginationParams(page, limit);
```

### `calculatePaginationOffset(page, limit)`
Calculates the database offset for pagination.

```typescript
const offset = calculatePaginationOffset(page, limit);
```

### `createPaginationMeta(page, limit, total)`
Creates pagination metadata object.

```typescript
const meta = createPaginationMeta(page, limit, total);
```

## Response Formats

### Basic Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users"
}
```

### Paginated Success Response
```json
{
  "success": true,
  "message": "Retrieved 10 of 100 items (page 1 of 10)",
  "data": {
    "data": [
      { "id": "1", "email": "user1@example.com", "fullName": "User 1" },
      { "id": "2", "email": "user2@example.com", "fullName": "User 2" }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users?page=1&limit=10"
}
```

## Common Use Cases

### 1. Create Operation
```typescript
const user = await this.userService.create(userData);
const userResponse = pick(user, ['id', 'email', 'fullName']);
return successResponse({ user: userResponse }, 'User created successfully', request);
```

### 2. Read Operation
```typescript
const user = await this.userService.findById(id);
const userResponse = pick(user, ['id', 'email', 'fullName']);
return successResponse(userResponse, 'User retrieved successfully', request);
```

### 3. Update Operation
```typescript
const user = await this.userService.update(id, userData);
const userResponse = pick(user, ['id', 'email', 'fullName']);
return successResponse({ user: userResponse }, 'User updated successfully', request);
```

### 4. Delete Operation
```typescript
await this.userService.delete(id);
return successResponse(null, 'User deleted successfully', request);
```

### 5. List with Pagination
```typescript
const { page: validPage, limit: validLimit } = validatePaginationParams(page, limit);
const offset = calculatePaginationOffset(validPage, validLimit);

const [users, total] = await this.userService.findMany(validLimit, offset);
const userResponses = users.map(user => pick(user, ['id', 'email', 'fullName']));

return successResponsePaginate(
  userResponses,
  validPage,
  validLimit,
  total,
  undefined,
  request
);
```

## Auto-Generated Messages

If you don't provide a custom message, the functions will auto-generate appropriate messages:

- **Single item**: "Item retrieved successfully"
- **Multiple items**: "5 items retrieved successfully"
- **User operations**: "User operation completed successfully"
- **Empty data**: "No data found"
- **Paginated**: "Retrieved 10 of 100 items (page 1 of 10)"

## Best Practices

1. **Always use field limiting** with `pick()` to exclude sensitive data
2. **Validate pagination parameters** before using them
3. **Use consistent message patterns** across your API
4. **Include request object** for proper path information
5. **Handle errors** with your exception filter, not in these functions

## Migration from Old Code

### Before:
```typescript
return { user: userResponse };
```

### After:
```typescript
return successResponse({ user: userResponse }, 'User created successfully', request);
```

The new approach provides consistent response format, automatic timestamps, and better error handling! 🚀
