# Exora

Exora is a modern, high-performance luxury e-commerce platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Architecture

```
exora/
├── frontend/       # Next.js customer-facing storefront
├── backend/        # Next.js API server & Admin portal with Prisma ORM
└── docker/         # Docker infrastructure and database configurations
```

## Features

- **Storefront**: Responsive luxury design, product discovery, shopping cart, and seamless checkout experience.
- **Admin Dashboard**: Catalog management, order fulfillment, customer inquiries, and real-time sales metrics.
- **Backend APIs**: REST endpoints with JWT authentication, RBAC authorization, and order processing.
- **Database**: PostgreSQL with Prisma ORM migrations and database seeding.
- **Media Storage**: Cloudflare R2 / S3-compatible image hosting with pre-signed upload URLs.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run db:generate
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Configuration

- Backend: Copy `backend/.env.example` to `backend/.env` and update the required secrets and connection strings.
- Frontend: Copy or set environment variables in `frontend/.env.local`.

## License

Private and proprietary. All rights reserved.
