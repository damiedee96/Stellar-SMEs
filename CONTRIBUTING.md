# Contributing to Stellar SMEs

Thank you for your interest in contributing!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm run install:all`
3. Copy environment files:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
4. Start PostgreSQL (via Docker or locally)
5. Run migrations: `cd backend && npm run db:migrate`
6. Start services:
   - Backend: `npm run dev:backend`
   - Frontend: `npm run dev:frontend`

## Code Style

- Use ES6+ syntax
- Follow existing patterns
- Add comments for complex logic
- Keep functions small and focused

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit PR with clear description
5. Wait for review

## Reporting Issues

Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment details
