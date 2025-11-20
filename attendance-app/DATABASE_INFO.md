# Database Information

## Where is the Data Stored?

### MongoDB Location
Your MongoDB database is running in a **Docker container** named `mongodb`.

### Database Name
- **Database Name**: `attendance_db`
- **Connection String**: `mongodb://localhost:27017/attendance_db`

### Data Storage Location
MongoDB data is stored **inside the Docker container**. By default, Docker stores container data in:
- **Linux**: `/var/lib/docker/volumes/` (managed by Docker)
- The data persists even if you stop the container
- The data is deleted only if you remove the container with `docker rm mongodb`

## Collections (Tables) in the Database

### 1. **users** Collection
Stores all user accounts (teachers and students):
- `username` - Login username
- `password` - Hashed password (bcrypt)
- `role` - Either "teacher" or "student"
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### 2. **students** Collection
Stores student information:
- `studentId` - Unique student ID
- `name` - Student name
- `email` - Student email (optional)
- `course` - Course name (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### 3. **attendances** Collection
Stores all attendance records:
- `studentId` - Which student
- `sessionId` - Which session/class
- `timestamp` - When attendance was marked
- `synced` - Whether synced from offline storage
- `syncedAt` - When it was synced
- `createdAt` - Record creation time
- `updatedAt` - Last update time

## How to Access the Database

### Method 1: Using MongoDB Compass (GUI - Recommended)
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `attendance_db`
4. Browse collections and data

### Method 2: Using mongosh (Command Line)
```bash
# Connect to MongoDB
docker exec -it mongodb mongosh

# Switch to your database
use attendance_db

# View all collections
show collections

# View all users
db.users.find().pretty()

# View all students
db.students.find().pretty()

# View all attendance records
db.attendances.find().pretty()

# Count records
db.users.countDocuments()
db.students.countDocuments()
db.attendances.countDocuments()
```

### Method 3: Using Node.js Script
Create a script to query the database programmatically.

## Viewing Your Data

### Check if users exist:
```bash
docker exec mongodb mongosh attendance_db --eval "db.users.find().pretty()"
```

### Check students:
```bash
docker exec mongodb mongosh attendance_db --eval "db.students.find().pretty()"
```

### Check attendance records:
```bash
docker exec mongodb mongosh attendance_db --eval "db.attendances.find().pretty()"
```

## Data Persistence

### To Backup Your Data:
```bash
# Export database
docker exec mongodb mongodump --out /data/backup --db attendance_db

# Copy from container
docker cp mongodb:/data/backup ./mongodb-backup
```

### To Restore Data:
```bash
# Copy backup to container
docker cp ./mongodb-backup mongodb:/data/backup

# Restore
docker exec mongodb mongorestore --db attendance_db /data/backup/attendance_db
```

## Important Notes

1. **Data Persists**: Your data stays in the Docker container even if you stop it
2. **Data is Lost If**: You run `docker rm mongodb` (removes container)
3. **To Keep Data Safe**: Use Docker volumes or backup regularly
4. **Default Admin**: Created by `npm run init-admin` in backend directory

## Current Database Status

To check what's in your database right now, run:
```bash
docker exec mongodb mongosh attendance_db --eval "
  print('Users:', db.users.countDocuments());
  print('Students:', db.students.countDocuments());
  print('Attendance Records:', db.attendances.countDocuments());
"
```

