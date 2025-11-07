import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, Leaf } from "lucide-react";
import Papa from "papaparse"; // make sure papaparse is installed → npm install papaparse

const TransactionUpload = () => {
  const [formData, setFormData] = useState({ amount: "", category: "", date: "" });
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // ✅ Save transactions to localStorage
  const saveToLocalStorage = (data) => {
    const existing = JSON.parse(localStorage.getItem("transactions")) || [];
    const updated = [...existing, ...data];
    localStorage.setItem("transactions", JSON.stringify(updated));
    setTransactions(updated);
  };

  // ✅ Add manually
  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill all fields!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    saveToLocalStorage([newEntry]);
    setFormData({ amount: "", category: "", date: "" });
  };

  // ✅ Upload CSV file
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data.map((row, i) => ({
          id: Date.now() + i,
          amount: parseFloat(row.amount) || 0,
          category: row.category || "unknown",
          date: row.date || new Date().toISOString().split("T")[0],
        }));
        saveToLocalStorage(parsed);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Leaf className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-green-700">Upload Transactions</h1>
        </div>

        {/* ✅ Fixed Back Navigation */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-700 hover:text-green-600 font-semibold transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Upload Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8">
        {/* Manual Add Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" /> Add Manually
          </h2>
          <form
            onSubmit={handleManualAdd}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="number"
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-green-500 outline-none"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-green-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="fuel">Fuel</option>
              <option value="electricity">Electricity</option>
              <option value="food">Food</option>
              <option value="public-transport">Public Transport</option>
              <option value="shopping">Shopping</option>
              <option value="groceries">Groceries</option>
              <option value="entertainment">Entertainment</option>
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border-2 border-gray-200 px-3 py-2 rounded-lg focus:border-green-500 outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-all"
            >
              Add
            </button>
          </form>
        </section>

        {/* CSV Upload Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" /> Upload CSV File
          </h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full cursor-pointer text-gray-600 hover:border-green-500 transition"
          />
          <p className="text-sm text-gray-500 mt-2">
            CSV Format: <strong>amount, category, date</strong>
          </p>
        </section>

        {/* Transactions Preview */}
        {transactions.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Preview</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{t.date}</td>
                      <td className="p-3 capitalize">{t.category}</td>
                      <td className="p-3">{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TransactionUpload;
