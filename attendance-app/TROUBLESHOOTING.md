# Troubleshooting Guide

## 🔴 Cannot Sign In

### Step 1: Check if Backend is Running

Open a terminal and check if the backend server is running:

```bash
# Check if port 5000 is in use
lsof -i :5000
# or
netstat -tulpn | grep 5000
```

If not running, start it:
```bash
cd backend
npm install  # If not already installed
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Step 2: Check if MongoDB is Running

```bash
# Check MongoDB status
sudo systemctl status mongod
# or
ps aux | grep mongod
```

If not running, start it:
```bash
sudo systemctl start mongod
# or
mongod
```

### Step 3: Create Admin User

If you haven't created the admin user yet:

```bash
cd backend
npm run init-admin
```

This will create:
- Username: `admin`
- Password: `admin123`

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Check for any error messages

Common errors:
- **Network Error**: Backend not running or wrong URL
- **401 Unauthorized**: Wrong username/password or user doesn't exist
- **CORS Error**: Backend CORS not configured properly

### Step 5: Test Backend Directly

Test if the backend is accessible:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Step 6: Check Environment Variables

Make sure `.env` file exists in `backend/` directory:

```bash
cd backend
cat .env
```

Should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Step 7: Register New Admin (Alternative)

If admin user doesn't exist, you can register directly from the login page:

1. Click "Don't have an account? Register"
2. Enter username and password
3. Click "Register"

This will create a new admin user.

## 🔧 Common Issues

### Issue: "Cannot connect to server"
**Solution**: 
- Make sure backend is running on port 5000
- Check if firewall is blocking the connection
- Verify API URL in frontend (should be `http://localhost:5000/api`)

### Issue: "Invalid credentials"
**Solution**:
- Make sure admin user exists: `npm run init-admin` in backend
- Try registering a new user from login page
- Check MongoDB connection

### Issue: "MongoDB connection error"
**Solution**:
- Start MongoDB: `sudo systemctl start mongod`
- Check MongoDB URI in `.env` file
- Verify MongoDB is accessible: `mongosh` or `mongo`

### Issue: CORS errors in browser
**Solution**:
- Backend should have CORS enabled (already configured)
- Make sure backend is running
- Check browser console for specific CORS error

### Issue: Port already in use
**Solution**:
- Change PORT in `.env` file
- Or kill the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

## 🧪 Quick Test

Run this to verify everything is set up:

```bash
# Terminal 1: Start MongoDB
sudo systemctl start mongod

# Terminal 2: Start Backend
cd backend
npm install
npm run init-admin
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm install
npm run dev
```

Then open browser: `http://localhost:3000`
Login with: `admin` / `admin123`

## 📞 Still Having Issues?

1. Check all terminal outputs for error messages
2. Check browser console (F12) for errors
3. Verify all dependencies are installed: `npm install` in both folders
4. Make sure Node.js version is 16+: `node --version`

