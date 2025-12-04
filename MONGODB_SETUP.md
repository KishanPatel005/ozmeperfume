# MongoDB Setup Guide

## Problem
The backend server was crashing because MongoDB is not running. I've fixed this so the server will start even without MongoDB, but you still need MongoDB running for authentication to work.

## Solution Options

### Option 1: Start Local MongoDB (Recommended for Development)

#### Windows:
1. **If MongoDB is installed as a service:**
   ```powershell
   net start MongoDB
   ```
   Or start it from Services (services.msc) → Find "MongoDB" → Start

2. **If MongoDB is installed but not as a service:**
   ```powershell
   # Navigate to MongoDB bin directory (usually)
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   mongod.exe
   ```

3. **If MongoDB is not installed:**
   - Download from: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Edition
   - Follow installation wizard
   - MongoDB will start automatically after installation

#### Mac:
```bash
# If installed via Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

#### Linux:
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# Or manually
sudo mongod
```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get connection string
5. Update `ozme-backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ozme?retryWrites=true&w=majority
   ```

## Verify MongoDB is Running

After starting MongoDB, restart your backend server. You should see:
```
✅ MongoDB Connected: localhost
```

Instead of:
```
❌ MongoDB Connection Error: connect ECONNREFUSED
```

## Current Status

✅ **Backend server will now start even if MongoDB is down**
- Server runs on port 5000
- Health check endpoint works: `http://localhost:5000/api/health`
- Authentication endpoints return clear error messages when DB is unavailable

⚠️ **To use authentication features, MongoDB must be running**

## Test After Starting MongoDB

1. Restart backend server (if it's already running)
2. Try registering a new user at `http://localhost:5173/login`
3. You should see success message instead of database error

## Troubleshooting

**Port 27017 already in use:**
- Another MongoDB instance might be running
- Check: `netstat -ano | findstr :27017` (Windows)
- Kill the process or use a different port

**Permission denied:**
- Run as administrator (Windows)
- Use `sudo` (Mac/Linux)

**MongoDB not found:**
- Make sure MongoDB is installed
- Check PATH environment variable includes MongoDB bin directory

