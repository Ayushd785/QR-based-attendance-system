import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  synced: {
    type: Boolean,
    default: true
  },
  syncedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
attendanceSchema.index({ studentId: 1, sessionId: 1, timestamp: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);

