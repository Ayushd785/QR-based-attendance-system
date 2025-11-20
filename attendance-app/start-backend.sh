#!/bin/bash
# Script to start the backend server

echo "Starting MongoDB..."
docker start mongodb 2>/dev/null || docker run -d --name mongodb -p 27017:27017 mongo:latest

echo "Waiting for MongoDB to be ready..."
sleep 3

echo "Starting backend server..."
cd "$(dirname "$0")/backend"
npm run dev

