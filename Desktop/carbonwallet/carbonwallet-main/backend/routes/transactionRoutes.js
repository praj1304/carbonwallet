const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getTransactionsByPeriod, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addTransaction);
router.get('/', protect, getTransactions);
router.get('/period', protect, getTransactionsByPeriod);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;
