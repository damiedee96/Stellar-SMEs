const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/pool');
const stellarService = require('../services/stellarService');

// POST /api/payments/send
router.post('/send', authMiddleware, async (req, res) => {
  const { destination, amount, currency, description } = req.body;
  if (!destination || !amount) return res.status(400).json({ error: 'destination and amount required' });

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const txHash = await stellarService.sendPayment({
      secretKey: user.stellar_secret_key,
      destination,
      amount: String(amount),
      asset: currency || 'XLM',
    });

    await pool.query(
      `INSERT INTO transactions (user_id, type, amount, currency, description, stellar_tx_hash, status)
       VALUES ($1, 'send', $2, $3, $4, $5, 'completed')`,
      [req.user.id, amount, currency || 'XLM', description, txHash]
    );

    res.json({ success: true, tx_hash: txHash });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Payment failed' });
  }
});

// POST /api/payments/invoice
router.post('/invoice', authMiddleware, async (req, res) => {
  const { recipient_email, amount, currency, description, due_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO invoices (user_id, recipient_email, amount, currency, description, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, recipient_email, amount, currency || 'USD', description, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// GET /api/payments/invoices
router.get('/invoices', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

module.exports = router;
