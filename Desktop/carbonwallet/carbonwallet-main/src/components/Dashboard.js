import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, TrendingDown, Award, Calendar, Upload } from "lucide-react";
import {
  CARBON_FACTORS,
  CATEGORY_REWARDS,
  calculateStats,
  filterTransactionsByPeriod,
} from "./utils";

const Dashboard = ({ user, onLogout }) => {
  const [timeSegment, setTimeSegment] = useState("daily");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // ✅ Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(savedTransactions);
  }, []);

  const filtered = filterTransactionsByPeriod(transactions, timeSegment);
  const stats = calculateStats(filtered, CARBON_FACTORS, CATEGORY_REWARDS);

  // Category-wise carbon
  const categoryData = filtered.reduce((acc, t) => {
    const factor = CARBON_FACTORS[t.category] || 0.1;
    const carbon = (t.amount / 100) * factor;
    acc[t.category] = (acc[t.category] || 0) + carbon;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const getSegmentLabel = () => {
    if (timeSegment === "daily") return "Today";
    if (timeSegment === "weekly") return "This Week";
    return "This Month";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-green-800">CarbonWallet</h1>
              <p className="text-sm text-green-600">
                Welcome back, {user?.email?.split("@")[0] || "User"}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <Upload className="w-5 h-5" /> Upload
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                onLogout();
              }}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Time Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Time Period</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {["daily", "weekly", "monthly"].map((segment) => (
              <button
                key={segment}
                onClick={() => setTimeSegment(segment)}
                className={`py-4 px-6 rounded-xl font-semibold transition-all ${
                  timeSegment === segment
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-8 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-6">
            {getSegmentLabel()}'s Carbon Footprint
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<TrendingDown className="w-8 h-8" />}
              label="Total CO₂"
              value={`${stats.carbon.toFixed(1)} kg`}
              sub={`≈ ${(stats.carbon / 20).toFixed(1)} trees to offset`}
            />
            <StatCard
              icon={<Award className="w-8 h-8" />}
              label="Green Points"
              value={stats.points}
              sub={`${stats.points}/100 points`}
            />
            <StatCard
              icon={<span className="text-2xl">₹</span>}
              label="Total Spent"
              value={`₹${stats.totalSpent}`}
              sub={`${filtered.length} transactions`}
            />
          </div>
        </div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Top Carbon Emitting Categories ({getSegmentLabel()})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.map(([category, carbon], index) => (
                <div
                  key={category}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl font-bold text-orange-600">
                      #{index + 1}
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      {carbon.toFixed(2)} kg
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 capitalize">
                    {category.replace("-", " ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Transactions"
              value={transactions.length}
              color="blue"
            />
            <SummaryCard
              label="Categories"
              value={Object.keys(categoryData).length}
              color="purple"
            />
            <SummaryCard
              label="Eco-Friendly"
              value={transactions.filter((t) => CATEGORY_REWARDS[t.category]).length}
              color="green"
            />
            <SummaryCard
              label="₹ per kg CO₂"
              value={`₹${Math.round(stats.totalSpent / (stats.carbon || 1))}`}
              color="amber"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-4xl font-bold mb-2">{value}</div>
    <p className="text-green-100 text-sm">{sub}</p>
  </div>
);

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-${color}-50 rounded-xl p-4 text-center`}>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

export default Dashboard;
