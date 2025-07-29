# Quiz App Deployment Guide

## Prerequisites

1. Vercel account
2. Upstash Redis database
3. Google OAuth credentials

## Environment Variables

The following environment variables must be set in your Vercel project settings:

### Required Variables

```
UPSTASH_REDIS_URL=<your-upstash-redis-rest-url>
UPSTASH_REDIS_TOKEN=<your-upstash-redis-rest-token>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
JWT_SECRET=<your-secure-jwt-secret>
```

### Setting up Upstash Redis

1. Create an account at [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and REST Token from the database details

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for local development)
   - `https://quiz-app-v2.vercel.app` (for production)
   - Your Vercel preview URLs
6. Add authorized redirect URIs if needed

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Make sure to add them for Production, Preview, and Development environments

## Deployment Steps

1. Push your code to GitHub
2. Import project in Vercel
3. Set all environment variables
4. Deploy

## Testing Session Persistence

After deployment:

1. Visit your deployed app
2. Sign in with Google
3. Refresh the page - you should remain logged in
4. Open a new tab - you should be logged in there too
5. Log out in one tab - all tabs should log out

## Troubleshooting

### Session not persisting after refresh

1. Check browser console for errors
2. Verify all environment variables are set in Vercel
3. Check Network tab for failed API calls
4. Ensure CORS headers are properly configured

### 405 Method Not Allowed errors

1. Verify API routes exist in `/api` directory
2. Check `vercel.json` configuration
3. Ensure API handlers export proper HTTP method handling

### Google OAuth not working

1. Verify `GOOGLE_CLIENT_ID` is set correctly
2. Check authorized origins in Google Console
3. Ensure the domain is added to authorized JavaScript origins

## API Endpoints

- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/login` - Standard login (demo only)
- `POST /api/auth/logout` - Logout and clear session
- `POST /api/auth/validate` - Validate session token

## Security Notes

1. Always use HTTPS in production
2. Keep `JWT_SECRET` secure and unique
3. Regularly rotate secrets
4. Monitor Redis for unusual activity
5. Implement rate limiting for production use
