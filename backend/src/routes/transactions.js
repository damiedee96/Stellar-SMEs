const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/pool');

// GET /api/transactions
router.get('/', authMiddleware, async (req, res) => {
  const { limit = 20, offset = 0, type } = req.query;
  let query = 'SELECT * FROM transactions WHERE user_id = $1';
  const params = [req.user.id];

  if (type) {
    query += ` AND type = $${params.length + 1}`;
    params.push(type);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/transactions (manual income/expense entry)
router.post('/', authMiddleware, async (req, res) => {
  const { type, amount, currency, description } = req.body;
  if (!type || !amount) return res.status(400).json({ error: 'type and amount required' });

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, currency, description, status)
       VALUES ($1, $2, $3, $4, $5, 'completed') RETURNING *`,
      [req.user.id, type, amount, currency || 'USD', description]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

module.exports = router;
