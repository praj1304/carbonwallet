import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import TransactionUpload from "./components/TransactionUpload";

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
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 🔐 Auth Routes */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword onBackToLogin={() => navigate("/login")} />}
      />

      {/* 🏠 Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 📤 Upload Transactions Page */}
      <Route
        path="/upload"
        element={
          user ? (
            <TransactionUpload user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ❌ 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-700">
              404 - Page Not Found
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
