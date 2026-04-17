const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../db/pool');

// GET /api/dashboard/summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const income = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions
       WHERE user_id = $1 AND type IN ('receive', 'income') AND status = 'completed'`,
      [req.user.id]
    );
    const expenses = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions
       WHERE user_id = $1 AND type IN ('send', 'expense') AND status = 'completed'`,
      [req.user.id]
    );
    const txCount = await pool.query(
      'SELECT COUNT(*) FROM transactions WHERE user_id = $1',
      [req.user.id]
    );
    const invoiceCount = await pool.query(
      `SELECT COUNT(*) FROM invoices WHERE user_id = $1 AND status = 'unpaid'`,
      [req.user.id]
    );

    res.json({
      total_income: parseFloat(income.rows[0].total),
      total_expenses: parseFloat(expenses.rows[0].total),
      net_cashflow: parseFloat(income.rows[0].total) - parseFloat(expenses.rows[0].total),
      transaction_count: parseInt(txCount.rows[0].count),
      unpaid_invoices: parseInt(invoiceCount.rows[0].count),
    });
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/dashboard/cashflow  (last 30 days grouped by day)
router.get('/cashflow', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) AS date,
              SUM(CASE WHEN type IN ('receive','income') THEN amount ELSE 0 END) AS income,
              SUM(CASE WHEN type IN ('send','expense') THEN amount ELSE 0 END) AS expenses
       FROM transactions
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to load cashflow' });
  }
});

module.exports = router;
