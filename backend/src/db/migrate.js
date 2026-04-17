require('dotenv').config();
const pool = require('./pool');

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    stellar_public_key VARCHAR(255),
    stellar_secret_key VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(18, 7) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    stellar_tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    recipient_email VARCHAR(255),
    amount NUMERIC(18, 7) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'unpaid',
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

async function migrate() {
  try {
    await pool.query(schema);
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
