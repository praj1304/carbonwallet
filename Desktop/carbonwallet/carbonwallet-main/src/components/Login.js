import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import API from "../api";
import "../App.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // ✅ Save full user info and token to localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onLogin(res.data.user, res.data.token); // ✅ pass full user object and token
      } else {
        onLogin({ email }, res.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay"></div>

      <div className="login-card fade-in">
        <div className="logo-container">
          <div className="logo-circle">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">CarbonWallet</h1>
          <p className="text-green-100 text-lg">Welcome Back</p>
        </div>

        <div className="login-form-card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Sign up
              </Link>
            </p>

            <p className="text-sm text-gray-600 mt-2">
              <Link
                to="/forgot-password"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
