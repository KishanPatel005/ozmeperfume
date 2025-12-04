# Environment Variables Setup Guide

## Frontend (.env file)

Create a file named `.env` in the `Ozme-frontend` folder with the following content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCn1X27mVRsI4_dDWmkIrtbhnC1PQ0GNTo
VITE_FIREBASE_AUTH_DOMAIN=ozmeperfume.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ozmeperfume
VITE_FIREBASE_STORAGE_BUCKET=ozmeperfume.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=647392858064
VITE_FIREBASE_APP_ID=1:647392858064:web:a24b5eeb5f6df154fab3d5
VITE_FIREBASE_MEASUREMENT_ID=G-DGSJGZJD1M

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend (.env file)

Create a file named `.env` in the `ozme-backend` folder with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/ozme

# Option 2: MongoDB Atlas (Cloud)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ozme?retryWrites=true&w=majority

# JWT Secrets (IMPORTANT: Change these in production!)
JWT_SECRET=ozme_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
ADMIN_JWT_SECRET=ozme_admin_secret_key_2024_change_in_production

# CORS Configuration
CLIENT_URL=http://localhost:5174
ADMIN_CLIENT_URL=http://localhost:5175

# Email Configuration (Optional - for contact form emails)
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_app_password
```

## Setup Instructions

### 1. Frontend Setup
1. Navigate to `Ozme-frontend` folder
2. Create a new file named `.env` (no extension)
3. Copy and paste the frontend .env content above
4. Save the file
5. Restart the dev server if it's running

### 2. Backend Setup
1. Navigate to `ozme-backend` folder
2. Create a new file named `.env` (no extension)
3. Copy and paste the backend .env content above
4. **IMPORTANT**: Update `MONGO_URI` with your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/ozme`
   - For MongoDB Atlas: Replace with your Atlas connection string
5. **IMPORTANT**: Change `JWT_SECRET` and `ADMIN_JWT_SECRET` to strong random strings in production
6. Save the file
7. Restart the backend server if it's running

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `MONGO_URI=mongodb://localhost:27017/ozme`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Replace username, password, and cluster URL in `MONGO_URI`

### 4. Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**
- Never commit `.env` files to git (already in .gitignore)
- Use strong, random JWT secrets (at least 32 characters)
- Use environment-specific values for production
- Keep Firebase credentials secure
- Use MongoDB Atlas with proper authentication in production

### 5. Verify Setup

After creating both .env files:
1. Start backend: `cd ozme-backend && npm run dev`
2. Start frontend: `cd Ozme-frontend && npm run dev`
3. Check console for any configuration errors
4. Test login/registration functionality

