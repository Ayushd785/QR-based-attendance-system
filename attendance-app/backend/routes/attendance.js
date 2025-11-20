import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Mark single attendance
router.post('/mark', async (req, res) => {
  try {
    const { studentId, sessionId, timestamp } = req.body;

    if (!studentId || !sessionId) {
      return res.status(400).json({ error: 'Student ID and Session ID are required' });
    }

    // Verify student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendanceTime = timestamp ? new Date(timestamp) : new Date();

    // Check for duplicate
    const existing = await Attendance.findOne({
      studentId,
      sessionId,
      timestamp: {
        $gte: new Date(attendanceTime.getTime() - 60000), // Within 1 minute
        $lte: new Date(attendanceTime.getTime() + 60000)
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Attendance already marked for this session' });
    }

    const attendance = new Attendance({
      studentId,
      sessionId,
      timestamp: attendanceTime,
      synced: true,
      syncedAt: new Date()
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate attendance record' });
    }
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Batch sync attendance
router.post('/sync', async (req, res) => {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ error: 'Logs array is required' });
    }

    const results = {
      success: [],
      failed: [],
      duplicates: []
    };

    for (const log of logs) {
      try {
        const { studentId, sessionId, time } = log;

        if (!studentId || !sessionId) {
          results.failed.push({ log, error: 'Missing required fields' });
          continue;
        }

        // Verify student exists
        const student = await Student.findOne({ studentId });
        if (!student) {
          results.failed.push({ log, error: 'Student not found' });
          continue;
        }

        const timestamp = time ? new Date(time) : new Date();

        // Check for duplicate
        const existing = await Attendance.findOne({
          studentId,
          sessionId,
          timestamp: {
            $gte: new Date(timestamp.getTime() - 60000),
            $lte: new Date(timestamp.getTime() + 60000)
          }
        });

        if (existing) {
          results.duplicates.push(log);
          continue;
        }

        const attendance = new Attendance({
          studentId,
          sessionId,
          timestamp,
          synced: true,
          syncedAt: new Date()
        });

        await attendance.save();
        results.success.push(attendance);
      } catch (error) {
        if (error.code === 11000) {
          results.duplicates.push(log);
        } else {
          results.failed.push({ log, error: error.message });
        }
      }
    }

    res.json({
      message: `Synced ${results.success.length} records`,
      results
    });
  } catch (error) {
    console.error('Sync attendance error:', error);
    res.status(500).json({ error: 'Failed to sync attendance' });
  }
});

// Get attendance analytics
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, studentId, sessionId } = req.query;

    const query = {};
    if (studentId) query.studentId = studentId;
    if (sessionId) query.sessionId = sessionId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const totalCount = await Attendance.countDocuments(query);

    // Daily attendance
    const dailyAttendance = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Monthly attendance
    const monthlyAttendance = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // By student
    const byStudent = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$studentId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // By session
    const bySession = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$sessionId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      total: totalCount,
      daily: dailyAttendance,
      monthly: monthlyAttendance,
      byStudent,
      bySession
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { studentId, sessionId, limit = 100, skip = 0 } = req.query;

    const query = {};
    if (studentId) query.studentId = studentId;
    if (sessionId) query.sessionId = sessionId;

    const attendance = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

export default router;

