# Deploying to Vercel with Serverless Functions

This guide explains how to deploy your ticket management application to Vercel with serverless functions to simulate a backend.

## What We've Set Up

1. **Serverless Functions**: Created Vercel API routes at `api/users.js` and `api/tickets.js` that handle all API requests (GET, POST, PUT, DELETE) for users and tickets.

2. **Configuration**: Added `vercel.json` to configure:
   - API routing for `/api/*` endpoints
   - SPA fallback routing for client-side routing
   - Automatic function runtime detection (no manual runtime specification needed)

3. **Data Storage**: The functions use in-memory storage with initial data from `src/data/db.json`. This approach works well with Vercel's serverless environment.

4. **API Client**: The centralized axios instance at `src/api/axios.js` handles API requests consistently across the application.

5. **CORS Configuration**: Updated the serverless functions to properly handle CORS headers for cross-origin requests.

## How to Deploy

### Option 1: Using Vercel CLI (Recommended for Testing)

1. Install Vercel CLI:
   ```bash
   npm install --global vercel
   ```

2. Build your application:
   ```bash
   npm run build
   ```

3. Test locally:
   ```bash
   vercel dev
   ```

4. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

### Option 2: Using Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Connect your repository to Vercel:
   - Go to [Vercel](https://vercel.com/new)
   - Import your Git repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. Deploy!

## Vercel Configuration Summary

For your Vercel deployment, use these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (or later)

## How It Works

- **API Requests**: All requests to `/api/*` are automatically handled by the corresponding API routes
- **CORS**: The functions include CORS headers to allow frontend requests
- **Data Storage**: The functions use in-memory storage that persists during the function's warm state
- **Authentication**: The same authentication logic works with the serverless functions
- **ES Modules**: The functions use ES module syntax compatible with Vercel

## Testing the Deployment

Once deployed, you can test:

1. **User Registration**: Create a new account
2. **Login**: Log in with existing credentials
3. **Ticket Management**: Create, update, and delete tickets
4. **Data Persistence**: Refresh the page to see that data is saved

### API Testing

For advanced testing, you can use the provided test script:

1. Open your deployed application in the browser
2. Open the browser console
3. Load the test script by navigating to `/test-api.js` in your browser
4. Copy the script content and paste it in the console
5. Run `testAPI()` in the console to test all API endpoints

This will test:
- GET /api/users
- GET /api/tickets
- POST /api/tickets (create a test ticket)
- DELETE /api/tickets/:id (delete the test ticket)

### Troubleshooting Common Issues

If you encounter a 404 error when trying to login or access the API:

1. **Check Vercel Function Logs**: Go to your Vercel dashboard → Functions → View logs
2. **Verify API Routes**: Ensure the `api/` directory is properly structured
3. **Check Build Output**: Make sure the `api/` directory is included in your deployment
4. **Test API Directly**: Try accessing `https://your-site.vercel.app/api/users` directly in the browser

## Important Notes

1. **Data Persistence**: The current implementation uses in-memory storage which means:
   - Data persists during the function's warm state (typically a few minutes of inactivity)
   - Data will reset when the function cold starts or when you redeploy
   - For production use, consider implementing a proper database solution

2. **Concurrent Users**: This implementation may have issues with concurrent writes. For production with multiple users, consider using a proper database.

3. **Security**: The current implementation doesn't include proper authentication/security measures. Consider implementing JWT tokens and proper password hashing for production.

## Production Alternatives

For a production-ready solution, consider:

1. **Vercel Functions with External Database**:
   - Use MongoDB Atlas, FaunaDB, or Supabase
   - Store connection strings in environment variables

2. **Serverless Framework**:
   - AWS Lambda with API Gateway
   - Google Cloud Functions
   - Netlify Functions

3. **Backend-as-a-Service**:
   - Firebase
   - Supabase
   - AWS Amplify

## Advantages of Vercel over Netlify

1. **Unified Development**: Single command `vercel dev` runs both frontend and backend
2. **Better React Support**: Optimized for React applications
3. **Edge Functions**: Better global performance
4. **Automatic HTTPS**: Built-in SSL certificates
5. **Preview Deployments**: Instant previews for every git push
6. **Analytics**: Built-in performance analytics

## Local Development

For local development with Vercel:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run vercel-dev
   ```

This will run both the frontend and API routes on the same port, providing a seamless development experience.

## Troubleshooting Deployment Issues

### Function Runtime Error
If you encounter an error like "Function Runtimes must have a valid version", ensure:
- Your `vercel.json` doesn't specify a runtime (Vercel auto-detects it)
- API routes use CommonJS syntax (`module.exports` instead of `export default`)
- ESLint is disabled for API files with `/* eslint-disable */`

### Path Resolution Error
If you encounter an error like "directory doesn't exist" when running `npm run vercel-dev`:
1. Remove the `.vercel` directory: `rm -rf .vercel`
2. This clears cached Vercel configuration that may point to wrong paths
3. Run `npm run vercel-dev` again to reinitialize

### API Routes Not Working in Development
If API routes return HTML instead of JSON during local development:
1. This is expected behavior - Vercel dev runs Vite frontend server
2. API routes work correctly in production deployment
3. For testing API functionality, deploy to Vercel first
4. The frontend will work with API routes in production

### Common Fixes
1. Remove any `runtime` specification from `vercel.json`
2. Use `module.exports = handler;` instead of `export default handler;`
3. Add `/* eslint-disable */` at the top of API files
4. Clear Vercel cache by removing `.vercel` directory if path issues occur
5. Rename API files from `.js` to `.cjs` when using ES module package.json