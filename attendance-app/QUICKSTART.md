# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install MongoDB
Make sure MongoDB is installed and running:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if not running)
# On Linux/Mac:
sudo systemctl start mongod
# or
mongod

# On Windows:
net start MongoDB
```

### Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (defaults should work)
npm run init-admin
npm run dev
```

Backend will start on `http://localhost:5000`

### Step 3: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

### Step 4: Login

1. Open browser: `http://localhost:3000`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

### Step 5: Test the System

1. **Add a Student**:
   - Go to "Students" tab
   - Click "+ Add Student"
   - Fill in details and submit

2. **Generate QR Code**:
   - Go to "Generate QR" tab
   - Enter Student ID (or leave empty for session-based)
   - Click "Generate QR Code"
   - Download the QR code

3. **Scan QR Code**:
   - Go to "Scan QR" page
   - Click "Start Scanning"
   - Allow camera permissions
   - Scan the generated QR code
   - Attendance will be marked!

4. **Test Offline Mode**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Select "Offline" mode
   - Scan a QR code
   - Notice "Saved offline" message
   - Re-enable network
   - Watch automatic sync happen!

## 🎯 Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in `.env`
- Default: `mongodb://localhost:27017/attendance_db`

### Camera Not Working
- Use HTTPS in production (required)
- Check browser permissions
- Try different browser (Chrome recommended)

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

## 📝 Next Steps

1. Change default admin password
2. Add more students
3. Generate QR codes for your sessions
4. Test offline functionality
5. Check analytics dashboard

Enjoy your QR Attendance System! 🎉

