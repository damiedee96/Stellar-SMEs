# Stellar SMEs

A financial technology platform built on the Stellar ecosystem, empowering small and medium-sized enterprises (SMEs) with accessible, low-cost, and efficient financial tools.

## Project Structure

```
stellar-smes/
├── frontend/        # React web application
├── backend/         # Node.js REST API
├── blockchain/      # Stellar SDK integration layer
└── docker-compose.yml
```

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + PostgreSQL
- **Blockchain**: Stellar SDK (Horizon API + Soroban)
- **Auth**: JWT
- **Infrastructure**: Docker

## Getting Started

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL

### Setup

```bash
# Clone the repo
git clone https://github.com/damiedee96/Stellar-SMEs.git
cd Stellar-SMEs

# Install all dependencies
npm run install:all

# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker
docker-compose up -d

# Or run individually
cd backend && npm run dev
cd frontend && npm run dev
```

## Implementation Phases

- **Phase 1**: Core Payments & Dashboard
- **Phase 2**: Advanced Business Tools & Analytics
- **Phase 3**: Cross-Border Expansion
- **Phase 4**: Financial Services Integration

## License

MIT
