import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StudentList from "./StudentList";
import QRGenerator from "./QRGenerator";
import OfflineSyncStatus from "./OfflineSyncStatus";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/attendance/analytics");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      // Set empty analytics to prevent crashes
      setAnalytics({
        total: 0,
        daily: [],
        monthly: [],
        byStudent: [],
        bySession: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const formatChartData = (data) => {
    return data.map((item) => ({
      date: item._id,
      count: item.count,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <header className="relative border-b border-slate-800/60 bg-gradient-to-r from-slate-900/80 via-indigo-900/50 to-slate-900/80 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),_transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/60">
                Control center
              </p>
              <h1 className="text-3xl font-semibold text-white mt-1">
                Attendance cockpit
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {user?.role === "teacher" ? "Teacher" : "Admin"} •{" "}
                {user?.username}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/scan"
                className="px-4 py-2 rounded-2xl border border-slate-700/70 text-slate-200 hover:border-slate-400/80 transition"
              >
                Scanner mode
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-900/40 hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-900/60 border-b border-slate-800/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4">
            {[
              { key: "dashboard", label: "Overview" },
              { key: "students", label: "Students" },
              { key: "qr", label: "QR Studio" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition border ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-cyan-400/30 to-indigo-500/40 border-indigo-400/60 text-white shadow-lg shadow-slate-900/50"
                    : "border-transparent text-slate-400 hover:text-white hover:border-slate-600/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-12 text-slate-400">
                Loading analytics...
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-indigo-900/60 via-slate-900/70 to-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
                    <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/70">
                      Total scans
                    </p>
                    <p className="text-4xl font-semibold mt-3 text-white">
                      {analytics?.total || 0}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Across all sessions
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-cyan-900/50 via-slate-900/70 to-slate-900/70 p-6 shadow-xl shadow-cyan-900/25">
                    <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                      Daily avg
                    </p>
                    <p className="text-4xl font-semibold mt-3 text-white">
                      {analytics?.daily?.length > 0
                        ? Math.round(
                            analytics.daily.reduce(
                              (sum, d) => sum + d.count,
                              0
                            ) / analytics.daily.length
                          )
                        : 0}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">Last 7 days</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-emerald-900/50 via-slate-900/70 to-slate-900/70 p-6 shadow-xl shadow-emerald-950/30">
                    <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">
                      Active sessions
                    </p>
                    <p className="text-4xl font-semibold mt-3 text-white">
                      {analytics?.bySession?.length || 0}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Tracked simultaneously
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/40">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Daily attendance
                    </h3>
                    {analytics?.daily && analytics.daily.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={formatChartData(analytics.daily)}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                          />
                          <XAxis dataKey="date" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              border: "1px solid #1e293b",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#7c3aed"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        No data available
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-inner shadow-slate-950/40">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Monthly trend
                    </h3>
                    {analytics?.monthly && analytics.monthly.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formatChartData(analytics.monthly)}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                          />
                          <XAxis dataKey="date" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              border: "1px solid #1e293b",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#22d3ee"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        No data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Students */}
                <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Top students
                      </h3>
                      <p className="text-sm text-slate-500">
                        Most consistent attendees
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      Live
                    </span>
                  </div>
                  {analytics?.byStudent && analytics.byStudent.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-900/80">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                              Student ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                              Attendance Count
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {analytics.byStudent.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-800/60 transition"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {item._id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                {item.count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No data available
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "students" && <StudentList />}
        {activeTab === "qr" && <QRGenerator />}
      </main>

      <OfflineSyncStatus />
    </div>
  );
};

export default AdminDashboard;
