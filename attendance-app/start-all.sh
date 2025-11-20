#!/bin/bash
# Script to start MongoDB and Backend together

echo "🚀 Starting Attendance App Services..."

# Start MongoDB
echo "📦 Starting MongoDB..."
docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo:latest

echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Check if MongoDB is running
if docker ps | grep -q mongodb; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
    exit 1
fi

# Start Backend
echo "🔧 Starting Backend Server..."
cd "$(dirname "$0")/backend"
npm run dev

