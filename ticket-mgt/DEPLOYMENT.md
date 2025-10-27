# Deploying to Netlify with Serverless Functions

This guide explains how to deploy your ticket management application to Netlify with serverless functions to simulate a backend.

## What We've Set Up

1. **Serverless Functions**: Created a Netlify Function at `netlify/functions/api.js` that handles all API requests (GET, POST, PUT, DELETE) for users and tickets.

2. **Configuration**: Added `netlify.toml` to configure:
   - Function directory location
   - API redirects from `/api/*` to `/.netlify/functions/api/:splat`
   - SPA fallback routing

3. **Data Storage**: The function uses in-memory storage with initial data from `src/data/db.json`. This approach works well for Netlify's serverless environment where file system access is limited.

## How to Deploy

### Option 1: Using Netlify CLI (Recommended for Testing)

1. Install Netlify CLI (already done):
   ```bash
   npm install --save-dev netlify-cli
   ```

2. Build your application:
   ```bash
   npm run build
   ```

3. Test locally:
   ```bash
   npx netlify dev
   ```

4. Deploy to Netlify:
   ```bash
   npx netlify deploy --prod
   ```

### Option 2: Using Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Connect your repository to Netlify:
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your Git provider
   - Select your repository
   - Configure build settings:
     - **Base directory**: `ticket-mgt` (leave blank if your repository root is the ticket-mgt folder)
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. Deploy!

## Netlify Configuration Summary

For your Netlify deployment, use these settings:

- **Base Directory**: `ticket-mgt` (or leave blank if deploying from the ticket-mgt folder directly)
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions` (automatically configured in netlify.toml)
- **Build Command**: `npm run build`

## How It Works

- **API Requests**: All requests to `/api/*` are automatically redirected to the serverless function
- **CORS**: The function includes CORS headers to allow frontend requests
- **Data Storage**: The function uses in-memory storage that persists during the function's warm state
- **Authentication**: The same authentication logic works with the serverless functions
- **ES Modules**: The function uses ES module syntax to work with the project's module configuration

## Testing the Deployment

Once deployed, you can test:

1. **User Registration**: Create a new account
2. **Login**: Log in with existing credentials
3. **Ticket Management**: Create, update, and delete tickets
4. **Data Persistence**: Refresh the page to see that data is saved

## Important Notes

1. **Data Persistence**: The current implementation uses in-memory storage which means:
   - Data persists during the function's warm state (typically a few minutes of inactivity)
   - Data will reset when the function cold starts or when you redeploy
   - For production use, consider implementing a proper database solution

2. **Concurrent Users**: This implementation may have issues with concurrent writes. For production with multiple users, consider using a proper database.

3. **Security**: The current implementation doesn't include proper authentication/security measures. Consider implementing JWT tokens and proper password hashing for production.

## Production Alternatives

For a production-ready solution, consider:

1. **Netlify Functions with External Database**:
   - Use MongoDB Atlas, FaunaDB, or Supabase
   - Store connection strings in environment variables

2. **Serverless Framework**:
   - AWS Lambda with API Gateway
   - Google Cloud Functions
   - Vercel Functions

3. **Backend-as-a-Service**:
   - Firebase
   - Supabase
   - AWS Amplify