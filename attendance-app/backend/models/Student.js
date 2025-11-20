import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);

