# QR Code Attendance Tracking System

A modern, offline-first web application for tracking student attendance using QR codes. Built with React and Node.js, featuring automatic synchronization, encrypted QR codes, and a beautiful glassmorphic UI.

## 🎯 What This Project Does

This attendance tracking system allows teachers and administrators to:

- **Manage Students**: Add, view, and manage student records
- **Generate QR Codes**: Create encrypted QR codes for attendance sessions
- **Scan QR Codes**: Use device camera to scan QR codes and mark attendance
- **View Analytics**: Track attendance trends with daily/monthly charts and statistics
- **Work Offline**: Automatically saves attendance data locally when offline and syncs when connection is restored
- **Role-Based Access**: Separate dashboards for admins/teachers and students

## 🚀 Features

- ✨ **Modern UI**: Beautiful glassmorphic design with neon accents and smooth animations
- 📱 **Offline-First**: Works seamlessly even without internet connection
- 🔒 **Encrypted QR Codes**: Secure attendance tracking with encrypted QR data
- 📊 **Analytics Dashboard**: Visual charts showing attendance trends and statistics
- 🔄 **Auto-Sync**: Automatically syncs pending attendance records when online
- 👥 **Role-Based Access**: Different interfaces for admins, teachers, and students
- 📷 **Camera Integration**: Real-time QR code scanning using device camera

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **IndexedDB (idb)** - Offline storage
- **html5-qrcode** - QR code scanning
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **qrcode** - QR code generation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mcomlabproject/attendance-app
```

### 2. Setup Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_db
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

Initialize the admin user:

```bash
npm run init-admin
```

This creates a default admin account:

- Username: `admin`
- Password: `admin123`

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Login with the default credentials:
   - Username: `admin`
   - Password: `admin123`

## 📖 How to Use

### For Administrators/Teachers

1. **Add Students**

   - Navigate to the "Students" tab
   - Click "+ Add Student"
   - Fill in student details (ID, name, email, course)
   - Submit the form

2. **Generate QR Codes**

   - Go to "QR Studio" tab
   - Enter optional Student ID or Session ID
   - Click "Generate QR Code"
   - Download the QR code image

3. **Scan QR Codes**

   - Click "Scanner mode" or navigate to Scan page
   - Click "Start Scanning"
   - Allow camera permissions
   - Point camera at QR code
   - Attendance is marked automatically

4. **View Analytics**
   - Check the "Overview" dashboard
   - View total scans, daily averages, and active sessions
   - Review daily/monthly attendance charts
   - See top students by attendance

### For Students

1. Login with student credentials
2. Navigate to the scanner page
3. Scan the QR code provided by your teacher
4. Attendance is marked instantly

### Testing Offline Mode

1. Open browser DevTools (F12)
2. Go to Network tab
3. Select "Offline" mode
4. Scan a QR code
5. Notice "Saved offline" message
6. Re-enable network
7. Watch automatic sync happen in the bottom-right sync widget

## 🏗️ Project Structure

```
attendance-app/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── scripts/         # Initialization scripts
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API and offline storage
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md
```

## 🔧 Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-admin` - Initialize admin user

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in `.env` is correct
- For local MongoDB on Windows: `net start MongoDB`
- For Linux/Mac: `sudo systemctl start mongod` or `mongod`

### Camera Not Working

- Ensure you're using HTTPS in production (required for camera access)
- Check browser permissions for camera access
- Try a different browser (Chrome recommended)
- For local development, `http://localhost` should work

### Port Already in Use

- Backend: Change `PORT` in `.env` file
- Frontend: Modify `server.port` in `vite.config.js`

### Blank Page on Frontend

- Check browser console for errors
- Ensure backend is running on port 5000
- Verify API proxy configuration in `vite.config.js`
- Clear browser cache and reload

## 🔐 Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time

## 📝 Notes

- The default admin password should be changed in production
- Offline data is stored in browser's IndexedDB
- QR codes are encrypted for security
- Automatic sync runs every 5 seconds when online
- Manual sync can be triggered from the sync widget