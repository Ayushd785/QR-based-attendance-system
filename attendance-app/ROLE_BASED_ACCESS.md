# Role-Based Access Control

The system now supports two user roles: **Teacher** and **Student**.

## User Roles

### Teacher Role
- **Access**: Full admin dashboard
- **Capabilities**:
  - View attendance analytics and charts
  - Add, view, and delete students
  - Generate QR codes for students or sessions
  - View all attendance records
  - Access to all features

### Student Role
- **Access**: QR Scanner only
- **Capabilities**:
  - Scan QR codes to mark attendance
  - View their own attendance status
  - Works offline (saves locally, syncs when online)

## Login Flow

### For Teachers:
1. Login with teacher credentials
2. Automatically redirected to **Dashboard**
3. Can generate QR codes, manage students, view analytics

### For Students:
1. Login with student credentials
2. Automatically redirected to **QR Scanner**
3. Can only scan QR codes to mark attendance

## Registration

When registering a new account:
1. Click "Don't have an account? Register"
2. Choose role: **Teacher** or **Student**
3. Enter username and password
4. Click "Register"

## Default Credentials

- **Teacher**: `admin` / `admin123`
- **Students**: Register a new account with "Student" role

## How It Works

### Teacher Workflow:
1. Teacher logs in → Dashboard
2. Add students to the system
3. Generate QR code (for a student or session)
4. Share QR code with students
5. Students scan QR code to mark attendance
6. Teacher views analytics on dashboard

### Student Workflow:
1. Student logs in → Scanner page
2. Teacher provides QR code
3. Student scans QR code
4. Attendance is marked automatically
5. Works even offline (syncs later)

## Technical Details

- **Backend**: User model supports `teacher` and `student` roles
- **Frontend**: Routing automatically redirects based on role
- **Security**: Teachers can access admin routes, students cannot
- **Middleware**: `requireAdmin` now accepts both `admin` and `teacher` roles

## Notes

- The default `admin` user is created as a `teacher` role
- Old `admin` role still works for backward compatibility
- Students cannot access the dashboard or generate QR codes
- Teachers can access both dashboard and scanner

