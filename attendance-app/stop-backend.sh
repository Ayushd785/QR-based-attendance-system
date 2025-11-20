#!/bin/bash
# Script to stop the backend server

echo "Stopping backend server..."

# Kill processes on port 5000
lsof -ti :5000 | xargs kill -9 2>/dev/null

# Kill nodemon and node server processes
pkill -f "nodemon server.js" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null

sleep 1

if lsof -i :5000 >/dev/null 2>&1; then
    echo "⚠️  Some processes may still be running"
else
    echo "✅ Backend server stopped"
fi

