# Supabase Integration Guide

## Overview

Your Next.js application has been successfully integrated with Supabase while maintaining backward compatibility with your existing JWT-based authentication system. This hybrid approach allows you to:

- Use both JWT tokens (existing system) and Supabase authentication
- Gradually migrate from JWT to Supabase authentication
- Maintain all existing functionality without breaking changes

## What's Been Added

### 1. Supabase Configuration Files

- **`src/utils/supabase.js`** - Client-side Supabase client
- **`src/utils/supabase-server.js`** - Server-side Supabase client
- **`src/context/SupabaseContext.jsx`** - React context for Supabase authentication

### 2. Enhanced Authentication System

- **`src/app/auth/utils.js`** - Extended with Supabase auth functions
- **`src/utils/apiClient.js`** - Enhanced to support both JWT and Supabase tokens
- **`src/middleware.js`** - Updated to handle both authentication methods

### 3. Environment Configuration

- **`env.template`** - Template for required environment variables

### 4. Example Components

- **`src/components/SupabaseAuthExample.jsx`** - Example usage of Supabase auth

## Setup Instructions

### 1. Environment Variables

Copy the `env.template` file to `.env.local` and fill in your Supabase credentials:

```bash
cp env.template .env.local
```

Add your Supabase configuration to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project dashboard at:
`https://app.supabase.com/project/your-project/settings/api`

### 2. Supabase Project Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. (Optional) Set up authentication providers in Authentication > Providers

## Usage Examples

### Using the Supabase Context

```jsx
import { useSupabase } from "../context/SupabaseContext";

function MyComponent() {
  const { user, session, signIn, signOut, loading } = useSupabase();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("email@example.com", "password")}>
      Sign In
    </button>
  );
}
```

### Using Enhanced Auth Utils

```jsx
import { AuthActions } from "../app/auth/utils";

function AuthComponent() {
  const {
    supabaseSignIn,
    supabaseSignUp,
    isAuthenticated,
    getSupabaseSession,
  } = AuthActions();

  const handleLogin = async () => {
    const { data, error } = await supabaseSignIn(
      "email@example.com",
      "password"
    );
    if (error) {
      console.error("Login failed:", error);
    } else {
      console.log("Login successful:", data);
    }
  };

  const checkAuth = async () => {
    const { isAuth, method } = await isAuthenticated();
    console.log("Authenticated:", isAuth, "Method:", method);
  };
}
```

### Using Enhanced API Client

```jsx
import apiClient from "../utils/apiClient";

// The API client now automatically uses either JWT or Supabase tokens
async function fetchUserData() {
  try {
    const userData = await apiClient.get("/api/user/profile");
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}
```

## Authentication Flow

The system now supports both authentication methods:

1. **JWT Authentication (Existing)**: Uses cookies to store access/refresh tokens
2. **Supabase Authentication (New)**: Uses Supabase's built-in session management

### Priority Order

1. Check for JWT token first (backward compatibility)
2. If no JWT token, check for Supabase session
3. If neither exists, user is not authenticated

## API Reference

### Supabase Context Methods

- `signUp(email, password, options)` - Register a new user
- `signIn(email, password)` - Sign in with email/password
- `signOut()` - Sign out the current user
- `resetPassword(email)` - Send password reset email
- `updatePassword(password)` - Update user password

### Enhanced Auth Utils

- `supabaseSignUp()` - Supabase sign up
- `supabaseSignIn()` - Supabase sign in
- `supabaseSignOut()` - Supabase sign out
- `getSupabaseSession()` - Get current Supabase session
- `getSupabaseUser()` - Get current Supabase user
- `isAuthenticated()` - Check authentication status (both methods)
- `logoutAndRedirect()` - Universal logout function

### Enhanced API Client

- `apiClient.get(url, options)` - GET request with auto-auth
- `apiClient.post(data, url, options)` - POST request with auto-auth
- `apiClient.put(data, url, options)` - PUT request with auto-auth
- `apiClient.patch(data, url, options)` - PATCH request with auto-auth
- `apiClient.delete(url, options)` - DELETE request with auto-auth
- `apiClient.sync` - Backward compatible sync version (JWT only)

## Migration Strategy

### Phase 1: Dual Authentication (Current)

- Both JWT and Supabase authentication work simultaneously
- Existing users continue using JWT
- New users can use either system

### Phase 2: Gradual Migration (Optional)

- Migrate existing users to Supabase
- Update login/signup forms to use Supabase
- Maintain JWT fallback for compatibility

### Phase 3: Full Migration (Future)

- Remove JWT authentication code
- Use only Supabase authentication
- Simplify codebase

## Troubleshooting

### Build Errors

If you get build errors related to Supabase, ensure:

1. Environment variables are set correctly
2. The dummy client fallback is working (already implemented)

### Authentication Issues

1. Check browser console for error messages
2. Verify Supabase URL and anon key are correct
3. Ensure your Supabase project is active

### CORS Issues

If you encounter CORS issues:

1. Add your domain to Supabase project settings
2. Check Authentication > Settings > Site URL

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Anon Key**: The anon key is safe to use in client-side code
3. **RLS**: Consider enabling Row Level Security in Supabase for data protection
4. **JWT Validation**: Continue validating JWT tokens on your backend

## Next Steps

1. Set up your Supabase project and environment variables
2. Test the integration with the example component
3. Gradually migrate authentication flows to use Supabase
4. Consider setting up Supabase database tables for user data
5. Explore Supabase's real-time features and storage options

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Authentication Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## Files Modified

- `src/utils/supabase.js` (new)
- `src/utils/supabase-server.js` (new)
- `src/context/SupabaseContext.jsx` (new)
- `src/components/SupabaseAuthExample.jsx` (new)
- `src/app/auth/utils.js` (enhanced)
- `src/utils/apiClient.js` (enhanced)
- `src/utils/constant.js` (enhanced)
- `src/middleware.js` (enhanced)
- `src/app/layout.js` (enhanced)
- `env.template` (new)

The integration is complete and your application should continue working exactly as before, with the added benefit of Supabase authentication capabilities.
