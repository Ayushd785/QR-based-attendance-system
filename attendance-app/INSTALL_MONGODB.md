# MongoDB Installation Guide

MongoDB is not currently installed on your system. Here are several options:

## Option 1: Install MongoDB using Snap (Easiest - Recommended)

```bash
# Install MongoDB using snap
sudo snap install mongodb

# Start MongoDB
sudo snap start mongodb

# Check status
sudo snap services mongodb
```

## Option 2: Install MongoDB Community Edition (Manual)

### For Ubuntu/Debian/Mint:

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

## Option 3: Use MongoDB Atlas (Cloud - Free Tier)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas (free tier):

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_db
   ```

## Option 4: Use Docker (If Docker is installed)

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:latest

# Update .env if using authentication:
# MONGODB_URI=mongodb://admin:admin123@localhost:27017/attendance_db?authSource=admin
```

## Quick Test After Installation

After installing MongoDB, test the connection:

```bash
# Test MongoDB connection
mongosh
# or
mongo
```

If it connects, you're good to go!

## After Installation

Once MongoDB is installed and running:

1. Go to backend directory:
   ```bash
   cd backend
   ```

2. Create admin user:
   ```bash
   npm run init-admin
   ```

3. Start the backend:
   ```bash
   npm run dev
   ```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

