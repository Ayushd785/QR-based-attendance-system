import { openDB } from 'idb';

const DB_NAME = 'attendance-db';
const DB_VERSION = 1;
const STORE_NAME = 'pendingAttendance';

// Initialize IndexedDB
export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
  return db;
};

// Save attendance to offline storage
export const saveOfflineAttendance = async (attendanceData) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const record = {
      ...attendanceData,
      createdAt: new Date().toISOString(),
      synced: false
    };
    
    await store.add(record);
    await tx.done;
    
    return { success: true, id: record.id };
  } catch (error) {
    console.error('Error saving offline attendance:', error);
    throw error;
  }
};

// Get all pending attendance records
export const getPendingAttendance = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const records = await store.getAll();
    await tx.done;
    
    return records.filter(record => !record.synced);
  } catch (error) {
    console.error('Error getting pending attendance:', error);
    return [];
  }
};

// Mark attendance as synced
export const markAsSynced = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const record = await store.get(id);
    if (record) {
      record.synced = true;
      record.syncedAt = new Date().toISOString();
      await store.put(record);
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error marking as synced:', error);
    throw error;
  }
};

// Delete synced records
export const deleteSyncedRecords = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const records = await store.getAll();
    
    for (const record of records) {
      if (record.synced) {
        await store.delete(record.id);
      }
    }
    
    await tx.done;
  } catch (error) {
    console.error('Error deleting synced records:', error);
    throw error;
  }
};

// Get count of pending records
export const getPendingCount = async () => {
  try {
    const pending = await getPendingAttendance();
    return pending.length;
  } catch (error) {
    console.error('Error getting pending count:', error);
    return 0;
  }
};

// Clear all records (for testing)
export const clearAllRecords = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    await tx.done;
  } catch (error) {
    console.error('Error clearing records:', error);
    throw error;
  }
};

