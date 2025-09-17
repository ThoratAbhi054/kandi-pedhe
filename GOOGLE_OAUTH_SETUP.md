# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Ingale Pedha House application using Supabase.

## Prerequisites

- A Google Cloud Platform account
- A Supabase project
- Your Next.js application running

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### 1.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: `Ingale Pedha House`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add your domain to **Authorized domains** (if you have a custom domain)
5. Save and continue through the scopes and test users sections

### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure the following:
   - **Name**: `Ingale Pedha House Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - Add your Supabase project URL (get this from your Supabase dashboard)

### 1.4 Get Your Credentials

1. Copy the **Client ID** and **Client Secret**
2. Keep these secure - you'll need them for Supabase configuration

## Step 2: Configure Supabase

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and toggle it **ON**

### 2.2 Configure Google Provider

1. In the Google provider settings, enter:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
2. **Optional**: Configure additional settings:
   - **Additional scopes**: Leave default unless you need specific permissions
   - **Redirect URL**: This should match what you configured in Google Console
3. Click **Save**

### 2.3 Configure Site URL (Important!)

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set your **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/**` (for development)
   - `https://your-domain.com/**` (for production)

## Step 3: Test the Integration

### 3.1 Development Testing

1. Make sure your `.env.local` file has the correct Supabase configuration:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Start your development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Navigate to `/login` or `/signup`
4. Click the **"Sign in with Google"** or **"Sign up with Google"** button
5. You should be redirected to Google's OAuth consent screen
6. After authorization, you should be redirected back to your application

### 3.2 Production Deployment

1. Update your Google OAuth credentials with production URLs
2. Update Supabase Site URL and Redirect URLs for production
3. Deploy your application
4. Test the Google OAuth flow in production

## Step 4: Troubleshooting

### Common Issues and Solutions

#### 1. "Redirect URI mismatch" Error

- **Cause**: The redirect URI in Google Console doesn't match Supabase's callback URL
- **Solution**: Ensure your Google OAuth redirect URI is exactly: `https://your-project-ref.supabase.co/auth/v1/callback`

#### 2. "Invalid client" Error

- **Cause**: Incorrect Client ID or Client Secret in Supabase
- **Solution**: Double-check your Google OAuth credentials in Supabase settings

#### 3. "Access blocked" Error

- **Cause**: OAuth consent screen not properly configured
- **Solution**: Complete the OAuth consent screen setup in Google Console

#### 4. "Site URL mismatch" Error

- **Cause**: Supabase Site URL doesn't match your application URL
- **Solution**: Update the Site URL in Supabase Authentication settings

#### 5. Google Sign-in Button Not Working

- **Cause**: JavaScript errors or network issues
- **Solution**: Check browser console for errors and ensure Supabase is properly configured

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify Supabase configuration in your environment variables
3. Test with different browsers/incognito mode
4. Check Supabase logs in the dashboard
5. Verify Google OAuth consent screen is published (for production)

## Step 5: Security Considerations

### 5.1 Environment Variables

- Never commit your `.env.local` file to version control
- Use different credentials for development and production
- Regularly rotate your OAuth credentials

### 5.2 Domain Restrictions

- Configure authorized domains in Google Console
- Use HTTPS in production
- Implement proper CORS policies

### 5.3 User Data

- Review what data you're requesting from Google
- Implement proper user data handling
- Follow GDPR/privacy regulations if applicable

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google Provider Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase and Google documentation
3. Check the browser console for errors
4. Verify all configuration steps are completed correctly
