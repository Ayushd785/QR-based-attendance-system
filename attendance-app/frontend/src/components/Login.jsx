import { useState } from "react";
import api from "../services/api";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("teacher"); // 'teacher' or 'student'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = showRegister ? "/auth/register" : "/auth/login";
      const requestData = showRegister
        ? { username, password, role: userRole }
        : { username, password };
      const response = await api.post(endpoint, requestData);
      const { token, user } = response.data;
      onLogin(user, token);
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setError(
          "Cannot connect to server. Make sure the backend is running on http://localhost:5000"
        );
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(
          showRegister
            ? "Registration failed. Please try again."
            : "Login failed. Please check your credentials and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-32 -right-16 h-96 w-96 bg-fuchsia-500/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-10 h-[28rem] w-[28rem] bg-cyan-500/20 blur-3xl rounded-full" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[1.1fr,0.9fr] glass-panel rounded-[32px] p-8 md:p-12">
          <div className="hidden lg:flex flex-col justify-between rounded-3xl bg-gradient-to-br from-indigo-600/70 via-violet-600/50 to-fuchsia-500/40 p-10 border border-white/10 shadow-2xl">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-100/80 mb-8">
                Attendance Studio
              </p>
              <h1 className="text-4xl xl:text-5xl font-semibold leading-tight text-white">
                Seamless QR based attendance with offline confidence
              </h1>
              <p className="mt-6 text-indigo-50/90 text-lg">
                Single hub for admins, teachers and students. Syncs
                automatically, even when the network doesn&apos;t.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-white/90">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-widest text-white/70">
                  Sync uptime
                </p>
                <p className="text-3xl font-semibold mt-2">99.2%</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-widest text-white/70">
                  Records handled
                </p>
                <p className="text-3xl font-semibold mt-2">25k+</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/70 rounded-3xl p-8 shadow-2xl space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold mt-3 text-white">
                {showRegister ? "Create an account" : "Access your dashboard"}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Use the credentials shared by your admin or create a new
                teacher/student profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-200"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
                  placeholder="e.g. admin"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-700/70 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {showRegister && (
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-3">
                    Register as
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["teacher", "student"].map((role) => (
                      <label
                        key={role}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm capitalize cursor-pointer transition-all ${
                          userRole === role
                            ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-400 text-white"
                            : "border-slate-700/80 text-slate-300 hover:border-slate-500/80"
                        }`}
                      >
                        <span>{role}</span>
                        <input
                          type="radio"
                          value={role}
                          checked={userRole === role}
                          onChange={(e) => setUserRole(e.target.value)}
                          className="accent-cyan-400 h-4 w-4"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-indigo-900/50 hover:opacity-95 disabled:opacity-40 transition"
              >
                {loading
                  ? showRegister
                    ? "Registering..."
                    : "Signing in..."
                  : showRegister
                  ? "Create account"
                  : "Continue"}
              </button>
            </form>

            <div className="space-y-3 text-center">
              <button
                type="button"
                onClick={() => setShowRegister(!showRegister)}
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200 transition"
              >
                {showRegister
                  ? "Already have an account? Sign in"
                  : "Need access? Register here"}
              </button>
              {!showRegister && (
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Default teacher: admin / admin123</p>
                  <p>
                    Registration lets you create additional teacher or student
                    profiles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
