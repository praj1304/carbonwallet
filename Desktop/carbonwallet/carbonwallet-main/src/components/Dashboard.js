import React, { useState } from 'react';
import { Leaf, TrendingDown, Award, Calendar } from 'lucide-react';
import { 
  CARBON_FACTORS, 
  CATEGORY_REWARDS, 
  generateTransactions,
  calculateStats,
  filterTransactionsByPeriod 
} from './utils';

const Dashboard = ({ user, onLogout }) => {
  const [timeSegment, setTimeSegment] = useState('daily');
  const [allTransactions] = useState(generateTransactions());

  const transactions = filterTransactionsByPeriod(allTransactions, timeSegment);
  const stats = calculateStats(transactions, CARBON_FACTORS, CATEGORY_REWARDS);

  const categoryData = transactions.reduce((acc, t) => {
    const factor = CARBON_FACTORS[t.category] || 0.1;
    const carbon = (t.amount / 100) * factor;
    acc[t.category] = (acc[t.category] || 0) + carbon;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const getSegmentLabel = () => {
    if (timeSegment === 'daily') return 'Today';
    if (timeSegment === 'weekly') return 'This Week';
    return 'This Month';
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
                Welcome back, {user?.email?.split('@')[0] || 'User'}!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              onLogout();
            }}
            className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Time Segment Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Time Period</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['daily', 'weekly', 'monthly'].map((segment) => (
              <button
                key={segment}
                onClick={() => setTimeSegment(segment)}
                className={`py-4 px-6 rounded-xl font-semibold transition-all ${
                  timeSegment === segment
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Dashboard */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-8 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-6">{getSegmentLabel()}'s Carbon Footprint</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Carbon */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <TrendingDown className="w-8 h-8" />
                <span className="text-sm font-semibold uppercase tracking-wide">Total CO₂</span>
              </div>
              <div className="text-5xl font-bold mb-2">{stats.carbon.toFixed(1)}</div>
              <p className="text-green-100 text-sm">kg carbon emitted</p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <p className="text-xs">≈ {(stats.carbon / 20).toFixed(1)} trees needed to offset</p>
              </div>
            </div>

            {/* Green Points */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8" />
                <span className="text-sm font-semibold uppercase tracking-wide">Green Points</span>
              </div>
              <div className="text-5xl font-bold mb-2">{stats.points}</div>
              <p className="text-green-100 text-sm">points earned</p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((stats.points / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs">{stats.points}/100</span>
                </div>
              </div>
            </div>

            {/* Total Spending */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
                  <span className="text-2xl">₹</span>
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">Total Spent</span>
              </div>
              <div className="text-5xl font-bold mb-2">₹{stats.totalSpent}</div>
              <p className="text-green-100 text-sm">{transactions.length} transactions</p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <p className="text-xs">
                  Avg: ₹{transactions.length > 0 ? Math.round(stats.totalSpent / transactions.length) : 0} per transaction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Carbon Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Top Carbon Emitting Categories ({getSegmentLabel()})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCategories.map(([category, carbon], index) => (
              <div key={category} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-orange-600">#{index + 1}</span>
                  <span className="text-2xl font-bold text-gray-800">{carbon.toFixed(2)} kg</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 capitalize">
                  {category.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
              <p className="text-sm text-gray-600 mt-1">Transactions</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {Object.keys(categoryData).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Categories</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {transactions.filter(t => CATEGORY_REWARDS[t.category]).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Eco-Friendly</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">
                ₹{Math.round(stats.totalSpent / (stats.carbon || 1))}
              </p>
              <p className="text-sm text-gray-600 mt-1">₹ per kg CO₂</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
