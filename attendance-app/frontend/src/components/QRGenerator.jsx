import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";

const QRGenerator = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    sessionId: "",
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/qr/generate", formData);
      setQrData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = qrData.qrCode;
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          QR studio
        </p>
        <h2 className="text-3xl font-semibold">Generate QR code</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/40">
          <h3 className="text-xl font-semibold text-white mb-4">
            QR code settings
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            {[
              {
                key: "studentId",
                label: "Student ID (optional)",
                placeholder: "Leave empty for session-based QR",
              },
              {
                key: "sessionId",
                label: "Session ID (optional)",
                placeholder: "Auto-generated if left blank",
              },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-sm text-slate-400">{field.label}</label>
                <input
                  type="text"
                  value={formData[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/40 hover:opacity-90 disabled:opacity-40 transition"
            >
              {loading ? "Generating..." : "Generate QR code"}
            </button>
          </form>

          {qrData && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-sm text-slate-300">
              <p className="font-semibold text-white mb-2">
                QR payload preview
              </p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(qrData.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* QR Display */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/40">
          <h3 className="text-xl font-semibold text-white mb-4">
            Preview & export
          </h3>

          {qrData ? (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-slate-950/50 border border-slate-800 rounded-3xl">
                {qrData.qrCode ? (
                  <img
                    src={qrData.qrCode}
                    alt="QR Code"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <QRCodeSVG
                    value={JSON.stringify(qrData.encrypted || qrData.data)}
                    size={256}
                    level="M"
                  />
                )}
              </div>

              <button
                onClick={handleDownload}
                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold shadow-lg shadow-emerald-900/40 hover:opacity-90 transition"
              >
                Download PNG
              </button>

              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  <span className="text-slate-500">Student ID:</span>{" "}
                  {qrData.data.studentId || "N/A"}
                </p>
                <p>
                  <span className="text-slate-500">Session ID:</span>{" "}
                  {qrData.data.sessionId}
                </p>
                <p>
                  <span className="text-slate-500">Timestamp:</span>{" "}
                  {new Date(qrData.data.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Generate a QR code to preview and export it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
