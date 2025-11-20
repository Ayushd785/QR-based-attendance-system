import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Student from '../models/Student.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Generate QR code for a student or session
router.post('/generate', requireAdmin, async (req, res) => {
  try {
    const { studentId, sessionId } = req.body;

    if (!studentId && !sessionId) {
      return res.status(400).json({ error: 'Either studentId or sessionId is required' });
    }

    // If studentId provided, verify student exists
    if (studentId) {
      const student = await Student.findOne({ studentId });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    const timestamp = new Date().toISOString();
    const qrData = {
      studentId: studentId || null,
      sessionId: sessionId || `session-${Date.now()}`,
      timestamp,
      // Add encryption key for security
      key: crypto.randomBytes(16).toString('hex')
    };

    // Encrypt the data
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'your-secret-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(qrData), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = {
      data: encrypted,
      iv: iv.toString('hex')
    };

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(encryptedData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      qrCode: qrCodeDataURL,
      data: qrData,
      encrypted: encryptedData
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Decode QR code (for testing/verification)
router.post('/decode', authenticateToken, async (req, res) => {
  try {
    const { encrypted, iv } = req.body;

    if (!encrypted || !iv) {
      return res.status(400).json({ error: 'Encrypted data and IV are required' });
    }

    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'your-secret-key', 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const data = JSON.parse(decrypted);

    res.json({ data });
  } catch (error) {
    console.error('Decode QR error:', error);
    res.status(500).json({ error: 'Failed to decode QR code' });
  }
});

export default router;

