# API Services with Automatic Error Handling

This directory contains API service modules that automatically handle errors and display toast notifications using Sonner.

## How it works

The automatic error handling is implemented through Axios interceptors in `axiosConfig.ts`. This approach:

1. **Catches all HTTP errors automatically** - No need for try-catch blocks in every API call
2. **Shows user-friendly toast notifications** - Errors are displayed using Sonner toast
3. **Provides detailed error logging** - Errors are logged to console for debugging
4. **Maintains error propagation** - Errors are still rejected so calling code can handle them if needed

## Error Handling Features

- **HTTP Status Codes**: Different messages for 400, 401, 403, 404, 422, 429, 500, 502, 503, 504
- **Network Errors**: Handles connection issues and timeouts
- **Request Timeout**: 30-second timeout for all requests
- **Error Logging**: Detailed console logging for debugging
- **Toast Duration**: 5-second toast notifications with request URL in description

## Usage

Simply use the API functions as normal - errors will be automatically handled:

```typescript
import {getGlossaryEntries} from "./services/glossaryApi";

// No try-catch needed - errors are automatically handled
const entries = await getGlossaryEntries("en", "es");
```

## Custom Error Handling

If you need custom error handling for specific cases, you can still use try-catch:

```typescript
try {
  const entries = await getGlossaryEntries("en", "es");
  // Handle success
} catch (error) {
  // Custom error handling (toast will still show automatically)
  console.log("Custom error handling:", error);
}
```

## Files

- `axiosConfig.ts` - Axios instance with interceptors for automatic error handling
- `glossaryApi.ts` - Glossary-related API calls
- `graphApi.ts` - Translation graph API calls
- `translateApi.ts` - Re-exports all API functions
