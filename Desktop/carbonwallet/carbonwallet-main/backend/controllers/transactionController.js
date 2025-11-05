const Transaction = require('../models/Transaction');

const CARBON_FACTORS = {
  fuel: 0.24,
  electricity: 0.18,
  food: 0.02,
  'public-transport': 0.05,
  shopping: 0.12,
  'online-delivery': 0.15,
  healthcare: 0.08,
  entertainment: 0.06,
  groceries: 0.01
};

exports.addTransaction = async (req, res) => {
  try {
    const { name, amount, category, date } = req.body;
    const userId = req.user.id;
    const factor = CARBON_FACTORS[category] || 0.1;
    const carbonFootprint = (amount / 100) * factor;
    const transaction = await Transaction.create({
      userId, name, amount, category,
      date: date || Date.now(),
      carbonFootprint
    });
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTransactionsByPeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query;
    const today = new Date();
    let startDate;
    if (period === 'daily') {
      startDate = new Date(today.setHours(0, 0, 0, 0));
    } else if (period === 'weekly') {
      startDate = new Date(today.setDate(today.getDate() - 7));
    } else if (period === 'monthly') {
      startDate = new Date(today.setDate(today.getDate() - 30));
    }
    const transactions = await Transaction.find({ userId, date: { $gte: startDate } }).sort({ date: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
