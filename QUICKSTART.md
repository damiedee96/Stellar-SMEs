# 🚀 Quick Start - Stellar SMEs

## One-Command Setup

```bash
# Clone and setup
git clone https://github.com/damiedee96/Stellar-SMEs.git
cd Stellar-SMEs
npm run install:all

# Configure
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start everything
docker-compose up -d

# Run migrations
cd backend && npm run db:migrate
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

## First Steps

1. Open http://localhost:3000
2. Click "Register" 
3. Create your business account
4. Start managing your finances!

## Key Features

✅ Digital payments (Stellar blockchain)  
✅ Income/expense tracking  
✅ Business dashboard with analytics  
✅ Invoice management  
✅ Cross-border transactions  
✅ Multi-currency support  

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + PostgreSQL
- **Blockchain**: Stellar SDK (Testnet)
- **Auth**: JWT

## Need Help?

📖 Full docs: [SETUP.md](./SETUP.md)  
🐛 Issues: https://github.com/damiedee96/Stellar-SMEs/issues  
💬 Discussions: https://github.com/damiedee96/Stellar-SMEs/discussions
