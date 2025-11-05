import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Keep user logged in after refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Handle login success
  const handleLogin = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/dashboard");
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword onBackToLogin={() => navigate("/login")} />}
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              // ✅ Fallback: if user.name isn’t available, show user.email
              userName={user.name || user.email}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          <h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>
        }
      />
    </Routes>
  );
}

export default App;
