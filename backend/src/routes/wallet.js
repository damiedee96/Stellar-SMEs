const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/pool');
const stellarService = require('../services/stellarService');

// GET /api/wallet/balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT stellar_public_key FROM users WHERE id = $1',
      [req.user.id]
    );
    const { stellar_public_key } = userResult.rows[0];
    const balances = await stellarService.getAccountBalances(stellar_public_key);
    res.json({ public_key: stellar_public_key, balances });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch balance' });
  }
});

// GET /api/wallet/stellar-transactions
router.get('/stellar-transactions', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT stellar_public_key FROM users WHERE id = $1',
      [req.user.id]
    );
    const { stellar_public_key } = userResult.rows[0];
    const txs = await stellarService.getAccountTransactions(stellar_public_key);
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch transactions' });
  }
});

module.exports = router;
