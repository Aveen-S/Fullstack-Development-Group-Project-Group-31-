# CollabBoard Deployment Guide

This guide provides instructions on how to prepare and deploy the CollabBoard application to a production environment.

## 1. Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (MongoDB Atlas recommended)
- A server to host the application (e.g., Render, Heroku, DigitalOcean, AWS)

## 2. Environment Variables

Before deploying, you must configure your environment variables. **Never commit the `.env` file to version control.** A template is provided in `server/.env.example`.

Create a `.env` file in the `server` directory for your deployment environment with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection String (Keep this secret!)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority

# Security (JWT)
# Generate a strong, random 64-character string for production
# Example: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# CORS Configuration
# Set this to the exact URL of your deployed frontend client
CLIENT_URL=https://your-frontend-domain.com
```

## 3. Security Considerations

The application has been configured with basic security best practices:

- **Helmet**: Sets security HTTP headers.
- **Express Rate Limit**: Limits the number of requests from a single IP to prevent brute-force attacks and DDoS.
- **Express Mongo Sanitize**: Prevents NoSQL query injection attacks.
- **HPP**: Protects against HTTP Parameter Pollution.
- **CORS**: Configured to restrict access only to trusted domains (set via `CLIENT_URL`).
- **Secrets Management**: Removed hardcoded fallback secrets. The app will fail to start/authenticate if `JWT_SECRET` is missing, enforcing secure configurations.

## 4. Deployment Steps (General Node.js Server)

1. Clone the repository on your production server.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install --production
   ```
4. Create your `.env` file and populate it with production values.
5. Start the server using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "collabboard-api"
   ```

## 5. Docker Deployment (Optional)

If you prefer to deploy using Docker, a `Dockerfile` is provided in the `server` directory.

### Build the Image
```bash
cd server
docker build -t collabboard-api .
```

### Run the Container
```bash
docker run -d \
  -p 5000:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e CLIENT_URL="https://your-frontend-domain.com" \
  --name collabboard-backend \
  collabboard-api
```

## 6. Frontend Deployment

To deploy the frontend, you will generally build the static files and serve them using Vercel, Netlify, or a CDN.
Ensure that the frontend is configured to send API requests to the deployed backend URL instead of `localhost`.

