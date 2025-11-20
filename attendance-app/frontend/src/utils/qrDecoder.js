// Decode QR code data (simplified version for frontend)
// Note: Full decryption should ideally be done on backend for security
export const decodeQRData = (qrString) => {
  try {
    const data = JSON.parse(qrString);
    
    // If it's already decrypted JSON
    if (data.studentId || data.sessionId) {
      return data;
    }

    // If it's encrypted, try to decrypt (using same key derivation as backend)
    // Note: This is a simplified version. In production, decryption should be on backend
    if (data.data && data.iv) {
      // For now, return the encrypted data - backend will handle decryption
      return { encrypted: true, data: data.data, iv: data.iv };
    }

    return null;
  } catch (error) {
    console.error('Error decoding QR data:', error);
    return null;
  }
};

// Extract attendance data from QR code
export const extractAttendanceData = (qrData) => {
  try {
    // If QR contains encrypted data, we'll send it to backend for decryption
    if (qrData.encrypted) {
      return {
        encrypted: true,
        encryptedData: qrData.data,
        iv: qrData.iv
      };
    }

    // If QR contains plain data
    if (qrData.studentId || qrData.sessionId) {
      return {
        studentId: qrData.studentId,
        sessionId: qrData.sessionId,
        timestamp: qrData.timestamp || new Date().toISOString()
      };
    }

    return null;
  } catch (error) {
    console.error('Error extracting attendance data:', error);
    return null;
  }
};

