import { useState, useEffect } from "react";
import { getPendingCount } from "../services/offlineStorage";
import { isOnline, syncPendingAttendance } from "../services/syncService";

const OfflineSyncStatus = ({ onSyncUpdate }) => {
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    const updateStatus = () => {
      setOnline(navigator.onLine);
      updatePendingCount();
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Update pending count periodically
    const interval = setInterval(updatePendingCount, 2000);
    updatePendingCount();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      clearInterval(interval);
    };
  }, []);

  const updatePendingCount = async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  };

  const handleManualSync = async () => {
    if (!online || syncing) return;

    setSyncing(true);
    setSyncMessage("Syncing...");

    try {
      const result = await syncPendingAttendance();
      if (result.success) {
        setSyncMessage(`✅ ${result.message}`);
        setLastSync(new Date());
        await updatePendingCount();

        if (onSyncUpdate) {
          onSyncUpdate(result);
        }

        // Clear message after 3 seconds
        setTimeout(() => setSyncMessage(""), 3000);
      } else {
        setSyncMessage(`❌ ${result.message}`);
        setTimeout(() => setSyncMessage(""), 3000);
      }
    } catch (error) {
      setSyncMessage("❌ Sync failed");
      setTimeout(() => setSyncMessage(""), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="glass-panel rounded-2xl p-4 min-w-[250px] border border-slate-800/80 text-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                online
                  ? "bg-emerald-400 shadow shadow-emerald-500/50"
                  : "bg-rose-400 shadow shadow-rose-500/50"
              }`}
            />
            <span className="text-sm font-medium">
              {online ? "Online" : "Offline"}
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Sync
          </span>
        </div>

        {pendingCount > 0 && (
          <div className="mb-2 text-sm text-slate-400">
            <span className="font-semibold text-white">{pendingCount}</span>{" "}
            pending record{pendingCount !== 1 ? "s" : ""}
          </div>
        )}

        {syncMessage && (
          <div className="mb-2 text-sm text-center text-slate-200">
            {syncMessage}
          </div>
        )}

        {online && pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="w-full mt-2 text-sm py-2 px-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-medium shadow-lg shadow-slate-900/40 hover:opacity-90 disabled:opacity-40 transition"
          >
            {syncing ? "Syncing..." : "Sync now"}
          </button>
        )}

        {lastSync && (
          <div className="mt-2 text-xs text-slate-500 text-center">
            Last sync: {lastSync.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineSyncStatus;
