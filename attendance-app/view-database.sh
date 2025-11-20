#!/bin/bash
# Script to view database contents

echo "📊 Attendance Database Contents"
echo "================================"
echo ""

echo "👥 USERS (Teachers & Students):"
docker exec mongodb mongosh attendance_db --quiet --eval "
  db.users.find({}, {username: 1, role: 1, createdAt: 1, _id: 0}).forEach(user => {
    print('  Username:', user.username, '| Role:', user.role, '| Created:', user.createdAt);
  });
  print('  Total Users:', db.users.countDocuments());
"

echo ""
echo "🎓 STUDENTS:"
docker exec mongodb mongosh attendance_db --quiet --eval "
  db.students.find({}, {studentId: 1, name: 1, email: 1, _id: 0}).forEach(student => {
    print('  ID:', student.studentId, '| Name:', student.name, '| Email:', student.email || 'N/A');
  });
  print('  Total Students:', db.students.countDocuments());
"

echo ""
echo "📝 ATTENDANCE RECORDS:"
docker exec mongodb mongosh attendance_db --quiet --eval "
  db.attendances.find({}, {studentId: 1, sessionId: 1, timestamp: 1, _id: 0}).limit(10).forEach(att => {
    print('  Student:', att.studentId, '| Session:', att.sessionId, '| Time:', att.timestamp);
  });
  print('  Total Records:', db.attendances.countDocuments());
  if (db.attendances.countDocuments() > 10) {
    print('  (Showing first 10 records)');
  }
"

echo ""
echo "✅ Database: attendance_db"
echo "📍 Location: MongoDB Docker Container (mongodb)"
echo "🔗 Connection: mongodb://localhost:27017/attendance_db"

