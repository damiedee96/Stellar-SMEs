# Stellar SMEs - Setup Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/damiedee96/Stellar-SMEs.git
cd Stellar-SMEs
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
DATABASE_URL=postgres://stellar_user:stellar_pass@localhost:5432/stellar_smes
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start with Docker (Recommended)
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Backend API on port 5000
- Frontend on port 3000

### 5. Run Database Migrations
```bash
cd backend
npm run db:migrate
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Manual Setup (Without Docker)

### 1. Start PostgreSQL
Ensure PostgreSQL is running locally on port 5432.

### 2. Create Database
```sql
CREATE DATABASE stellar_smes;
CREATE USER stellar_user WITH PASSWORD 'stellar_pass';
GRANT ALL PRIVILEGES ON DATABASE stellar_smes TO stellar_user;
```

### 3. Run Migrations
```bash
cd backend
npm run db:migrate
```

### 4. Start Backend
```bash
cd backend
npm run dev
```

### 5. Start Frontend
```bash
cd frontend
npm run dev
```

## Testing Stellar Integration

### Fund a Testnet Account
```bash
cd blockchain
npm run fund-account <YOUR_STELLAR_PUBLIC_KEY>
```

### Check Account Balance
```bash
cd blockchain
npm run check-balance <YOUR_STELLAR_PUBLIC_KEY>
```

## Project Structure

```
stellar-smes/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth & validation
│   │   └── db/           # Database utilities
│   └── package.json
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── pages/        # Route components
│   │   ├── components/   # Reusable UI
│   │   ├── api/          # API client
│   │   └── store/        # State management
│   └── package.json
├── blockchain/           # Stellar utilities
│   └── scripts/          # Helper scripts
└── docker-compose.yml
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in

### Payments
- `POST /api/payments/send` - Send payment
- `POST /api/payments/invoice` - Create invoice
- `GET /api/payments/invoices` - List invoices

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Record transaction

### Dashboard
- `GET /api/dashboard/summary` - Get summary stats
- `GET /api/dashboard/cashflow` - Get cashflow data

### Wallet
- `GET /api/wallet/balance` - Get Stellar balances
- `GET /api/wallet/stellar-transactions` - Get on-chain txs

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists and user has permissions

### Stellar Network Issues
- Using testnet by default
- Fund accounts via Friendbot
- Check STELLAR_HORIZON_URL is correct

### Port Already in Use
```bash
# Change ports in docker-compose.yml or .env files
```

## Next Steps

1. Register a new business account
2. Fund your Stellar wallet via testnet Friendbot
3. Start recording transactions
4. Send test payments
5. Create invoices

## Support

For issues, visit: https://github.com/damiedee96/Stellar-SMEs/issues
