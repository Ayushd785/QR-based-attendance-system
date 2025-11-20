#!/bin/bash
echo "Installing MongoDB using snap..."
sudo snap install mongodb
echo "Starting MongoDB..."
sudo snap start mongodb
echo "Checking MongoDB status..."
sudo snap services mongodb
echo ""
echo "✅ MongoDB installation complete!"
echo "You can now run: cd backend && npm run init-admin && npm run dev"
