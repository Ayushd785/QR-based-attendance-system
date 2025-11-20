import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import QRScanner from "./components/QRScanner";
import { startAutoSync, stopAutoSync } from "./services/syncService";
import api from "./services/api";

function AppContent() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("App mounted, checking auth...");
    // Check for existing auth
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verify token is still valid by making a test API call
        api
          .get("/students")
          .then(() => {
            setUser(parsedUser);
            setIsAuthenticated(true);
            setIsCheckingAuth(false);
            console.log("User authenticated:", parsedUser);

            // Redirect based on role if on login page
            if (location.pathname === "/login") {
              if (
                parsedUser.role === "admin" ||
                parsedUser.role === "teacher"
              ) {
                navigate("/dashboard", { replace: true });
              } else {
                navigate("/scan", { replace: true });
              }
            }
          })
          .catch((error) => {
            console.error("Token invalid, clearing auth:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            setIsCheckingAuth(false);
            if (location.pathname !== "/login") {
              navigate("/login", { replace: true });
            }
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    } else {
      console.log("No auth found");
      setUser(null);
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      if (location.pathname !== "/login" && location.pathname !== "/") {
        navigate("/login", { replace: true });
      }
    }

    // Start auto-sync service
    try {
      startAutoSync(5000);
    } catch (error) {
      console.error("Error starting sync service:", error);
    }

    // Cleanup on unmount
    return () => {
      stopAutoSync();
    };
  }, [navigate, location.pathname]);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    // Navigate based on role
    if (userData.role === "admin" || userData.role === "teacher") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/scan", { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-indigo-500/40 border-t-transparent animate-spin mx-auto"></div>
            <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full -z-10"></div>
          </div>
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">
            Preparing UI
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === "admin" || user?.role === "teacher" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/scan" replace />
            )
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated &&
          (user?.role === "admin" || user?.role === "teacher") ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/scan"
        element={
          isAuthenticated ? (
            <QRScanner user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? user?.role === "admin" || user?.role === "teacher"
                  ? "/dashboard"
                  : "/scan"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
