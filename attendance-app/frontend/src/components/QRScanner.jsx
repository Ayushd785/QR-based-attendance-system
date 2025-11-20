import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";
import {
  saveOfflineAttendance,
  getPendingCount,
} from "../services/offlineStorage";
import { isOnline } from "../services/syncService";
import OfflineSyncStatus from "./OfflineSyncStatus";
import { decodeQRData, extractAttendanceData } from "../utils/qrDecoder";

const QRScanner = ({ user, onLogout }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    updatePendingCount();
    const interval = setInterval(updatePendingCount, 2000);
    return () => {
      clearInterval(interval);
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const updatePendingCount = async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  };

  const handleScan = async (decodedText) => {
    if (!decodedText) return;

    setScanning(false);
    setError("");
    setSuccess("");

    // Stop scanner temporarily
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }

    try {
      // Decode QR data
      const qrData = decodeQRData(decodedText);
      if (!qrData) {
        throw new Error("Invalid QR code format");
      }

      // Extract attendance data
      const attendanceData = extractAttendanceData(qrData);

      if (!attendanceData) {
        throw new Error("Could not extract attendance data from QR code");
      }

      // If encrypted, send to backend for decryption
      if (attendanceData.encrypted) {
        try {
          const decodeResponse = await api.post("/qr/decode", {
            encrypted: attendanceData.encryptedData,
            iv: attendanceData.iv,
          });
          attendanceData.studentId = decodeResponse.data.data.studentId;
          attendanceData.sessionId = decodeResponse.data.data.sessionId;
          attendanceData.timestamp = decodeResponse.data.data.timestamp;
        } catch (err) {
          throw new Error("Failed to decode QR code");
        }
      }

      // Prepare attendance record
      const record = {
        studentId: attendanceData.studentId || user?.username || "unknown",
        sessionId: attendanceData.sessionId || `session-${Date.now()}`,
        timestamp: attendanceData.timestamp || new Date().toISOString(),
      };

      // Check if online
      if (isOnline()) {
        try {
          // Try to mark attendance online
          await api.post("/attendance/mark", record);
          setSuccess("✅ Attendance marked successfully!");
          setResult(record);
        } catch (err) {
          // If online sync fails, save offline
          console.warn("Online sync failed, saving offline:", err);
          await saveOfflineAttendance(record);
          setSuccess("💾 Saved offline (will sync automatically)");
          setResult(record);
          await updatePendingCount();
        }
      } else {
        // Save offline
        await saveOfflineAttendance(record);
        setSuccess("💾 Saved offline (will sync when online)");
        setResult(record);
        await updatePendingCount();
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setResult(null);
        setSuccess("");
        if (scanning) {
          startScanner();
        }
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to process QR code");
      console.error("Scan error:", err);
      // Restart scanner after error
      setTimeout(() => {
        if (scanning) {
          startScanner();
        }
      }, 2000);
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;

    try {
      const html5QrCode = new Html5Qrcode(scannerRef.current.id);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScan,
        (errorMessage) => {
          // Ignore errors - scanner will keep trying
        }
      );
      setScanning(true);
      setError("");
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Failed to start camera. Please check permissions.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/70 bg-slate-900/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Scanner
            </p>
            <h1 className="text-3xl font-semibold text-white">
              {user?.role === "student" ? "Student scanner" : "QR code scanner"}
            </h1>
            <p className="text-sm text-slate-400">
              {user?.role === "student"
                ? `Student: ${user?.username}`
                : `Operator: ${user?.username}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(user?.role === "admin" || user?.role === "teacher") && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-2xl border border-slate-700/70 text-slate-200 hover:border-slate-400 transition"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-900/40 hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/40">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-white mb-2">
              {user?.role === "student"
                ? "Mark your attendance"
                : "Scan & sync attendance"}
            </h2>
            <p className="text-slate-400">
              {user?.role === "student"
                ? "Point your camera at the QR code shared by your teacher."
                : "Use your device camera to scan encrypted QR codes and mark attendance instantly."}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/40 text-rose-100 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-100 px-4 py-3 rounded-2xl">
              {success}
            </div>
          )}

          {pendingCount > 0 && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/40 text-amber-100 px-4 py-3 rounded-2xl">
              ⚠️ {pendingCount} attendance record{pendingCount !== 1 ? "s" : ""}{" "}
              pending sync
            </div>
          )}

          <div className="relative border border-dashed border-slate-700 rounded-3xl overflow-hidden bg-slate-950/40">
            <div
              id="qr-reader"
              ref={scannerRef}
              className="w-full min-h-[320px]"
            ></div>
            {!scanning && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-slate-400">Scanner paused</p>
                  <button
                    onClick={startScanner}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/40 hover:opacity-90 transition"
                  >
                    Start scanning
                  </button>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <h3 className="font-semibold text-white mb-2">Last scanned</h3>
              <div className="text-sm text-slate-300 space-y-1">
                <p>
                  <span className="text-slate-500">Student ID:</span>{" "}
                  {result.studentId}
                </p>
                <p>
                  <span className="text-slate-500">Session ID:</span>{" "}
                  {result.sessionId}
                </p>
                <p>
                  <span className="text-slate-500">Timestamp:</span>{" "}
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (scanning) {
                  stopScanner();
                } else {
                  startScanner();
                }
                setError("");
                setSuccess("");
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-fuchsia-900/40 hover:opacity-90 transition"
            >
              {scanning ? "Stop scanning" : "Start scanning"}
            </button>
          </div>
        </div>
      </main>

      <OfflineSyncStatus />
    </div>
  );
};

export default QRScanner;
