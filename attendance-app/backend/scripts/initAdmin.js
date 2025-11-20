import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const initAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_db');
    console.log('✅ Connected to MongoDB');

    // Check if admin/teacher exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️  Admin/Teacher user already exists');
      process.exit(0);
    }

    const admin = new User({
      username: 'admin',
      password: 'admin123',
      role: 'teacher' 
    });

    await admin.save();
    console.log('✅ Default teacher user created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: teacher');
    console.log('   ⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
    process.exit(1);
  }
};

initAdmin();

