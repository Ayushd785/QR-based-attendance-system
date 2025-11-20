import { getPendingAttendance, markAsSynced, deleteSyncedRecords } from './offlineStorage.js';
import api from './api.js';

let syncInterval = null;
let isSyncing = false;

// Check if online
export const isOnline = () => {
  return navigator.onLine;
};

// Sync pending attendance records
export const syncPendingAttendance = async () => {
  if (isSyncing || !isOnline()) {
    return { success: false, message: 'Already syncing or offline' };
  }

  try {
    isSyncing = true;
    const pending = await getPendingAttendance();

    if (pending.length === 0) {
      return { success: true, message: 'No pending records', synced: 0 };
    }

    // Format logs for API
    const logs = pending.map(record => ({
      studentId: record.studentId,
      sessionId: record.sessionId,
      time: record.timestamp || record.createdAt
    }));

    // Call sync API
    const response = await api.post('/attendance/sync', { logs });

    // Mark successfully synced records
    const results = response.data.results;
    const syncedIds = [];

    results.success.forEach((syncedRecord) => {
      const pendingRecord = pending.find(
        p => p.studentId === syncedRecord.studentId &&
        p.sessionId === syncedRecord.sessionId
      );
      if (pendingRecord) {
        syncedIds.push(pendingRecord.id);
      }
    });

    // Mark as synced in IndexedDB
    for (const id of syncedIds) {
      await markAsSynced(id);
    }

    // Clean up old synced records
    await deleteSyncedRecords();

    return {
      success: true,
      message: `Synced ${results.success.length} records`,
      synced: results.success.length,
      failed: results.failed.length,
      duplicates: results.duplicates.length
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Sync failed',
      error: error
    };
  } finally {
    isSyncing = false;
  }
};

// Start auto-sync service
export const startAutoSync = (intervalMs = 5000, onSyncUpdate = null) => {
  if (syncInterval) {
    stopAutoSync();
  }

  // Initial sync
  if (isOnline()) {
    syncPendingAttendance().then(result => {
      if (onSyncUpdate) onSyncUpdate(result);
    });
  }

  // Set up interval
  syncInterval = setInterval(async () => {
    if (isOnline() && !isSyncing) {
      const result = await syncPendingAttendance();
      if (onSyncUpdate) onSyncUpdate(result);
    }
  }, intervalMs);

  // Listen to online/offline events
  window.addEventListener('online', async () => {
    const result = await syncPendingAttendance();
    if (onSyncUpdate) onSyncUpdate(result);
  });
};

// Stop auto-sync service
export const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

// Manual sync trigger
export const manualSync = async () => {
  return await syncPendingAttendance();
};

