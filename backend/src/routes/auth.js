const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const stellarService = require('../services/stellarService');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { business_name, email, password, currency } = req.body;
  if (!business_name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const keypair = stellarService.generateKeypair();

    const result = await pool.query(
      `INSERT INTO users (business_name, email, password_hash, stellar_public_key, stellar_secret_key, currency)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, business_name, email, stellar_public_key, currency`,
      [business_name, email, hash, keypair.publicKey(), keypair.secret(), currency || 'USD']
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        business_name: user.business_name,
        email: user.email,
        stellar_public_key: user.stellar_public_key,
        currency: user.currency,
      },
    });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
