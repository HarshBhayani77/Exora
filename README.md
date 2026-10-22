# Exora — Luxury E-Commerce & Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary_All_Rights_Reserved-red)](#license)

**Exora** is a full-stack, enterprise-grade luxury e-commerce ecosystem architected as a modular monorepo. It features a high-performance customer storefront, an administrative back-office portal, RESTful API micro-services, and a containerized PostgreSQL database.

---

## Architecture Overview

Exora is organized as a unified monorepo divided into three distinct modules:

```
exora/
├── frontend/       # Customer-facing Next.js 16 storefront application (Port 3000)
├── backend/        # Administrative portal & Next.js REST API microservices (Port 3001)
├── docker/         # Containerized database & pgAdmin management services
├── .gitignore      # Comprehensive repository-wide sensitive file protection
├── LICENSE         # Proprietary All Rights Reserved license
└── README.md       # Primary project documentation
```

---

## Languages & Technologies Used

### Programming & Query Languages
- **TypeScript (v5)**: Strictly typed codebase across both frontend and backend for maximum reliability and type safety.
- **JavaScript (ESNext)**: Node.js runtime scripts and tooling.
- **SQL (PostgreSQL Dialect)**: Relational database queries, triggers, indexing, and sequence synchronization.
- **CSS3 / Modern Tailwind CSS (v4)**: Modern utility-first styling with custom typography, fluid responsive layouts, and CSS variables.
- **HTML5**: Semantic web markup with accessibility standards.
- **Shell / Bash**: Container entry points and local database automation scripts.

### Core Frameworks & Libraries
| Layer | Technologies |
| :--- | :--- |
| **Storefront (Frontend)** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Zustand 5 (Cart & Auth state), SWR (Data fetching & caching), Framer Motion (Micro-animations), Lucide React (Icons), Axios |
| **API & Admin (Backend)** | Next.js 16 Route Handlers, Prisma ORM 6, PostgreSQL, Bcryptjs (Password security), JSON Web Tokens (JWT Auth & Verification), AWS S3 SDK (Cloudflare R2 Storage integration) |
| **DevOps & Infrastructure** | Docker, Docker Compose, PostgreSQL 16 container, pgAdmin 4 container, Netlify deployment configuration |

---

## Core Feature Breakdown

### 1. Customer Storefront (`/frontend`)
- **Luxury Visual Identity**: Editorial-style typography, dark aesthetic, smooth transitions, and responsive navigation for mobile, tablet, and desktop screens.
- **Hero & Curated Collections**: Dynamic hero banners, category highlight carousels, and marquee announcement tickers.
- **Product Catalog & Filtering**:
  - Filter by category with instant client-side routing.
  - Sorting by price (low-to-high, high-to-low), latest additions, and featured status.
  - In-stock availability indicators and sale price badges.
- **Rich Product Detail Pages**: Multi-image galleries, detailed specifications, stock level indicators, quantity selectors, and related product recommendations.
- **Dynamic Shopping Cart**:
  - Persistent shopping bag powered by Zustand with local storage synchronization.
  - Real-time subtotal calculation.
  - Dynamic free-shipping progress tracker (Free shipping threshold: ₹2,500).
- **Checkout & Order Flow**:
  - Multi-field customer shipping and billing address capture.
  - Flexible payment method support (Cash on Delivery `COD`, Stripe, and Razorpay ready).
  - Instant server-side stock and price validation before order finalization.
  - Order confirmation screen with unique order tracking numbers.
- **Customer Authentication**:
  - Integrated modal dialog for seamless login, customer registration, and password recovery.
  - Session persistence via secure HTTP cookies and JWT tokens.
  - Customer order history tracking dashboard (`/account/orders`).
- **Brand Pages**: About story page (`/about`), Contact form with inquiry capture (`/contact`), and Editorial Blog (`/blog`).

---

### 2. Back-Office Admin Portal (`/backend/app/admin`)
- **Executive Analytics Dashboard (`/admin`)**:
  - Gross sales and revenue tracking.
  - Total completed and pending orders count.
  - Low stock warning notifications.
  - Recent orders overview.
- **Product Catalog Management (`/admin/products`)**:
  - Complete CRUD operations for products (Create, Read, Update, Delete).
  - Slug auto-generation from product title.
  - Direct image uploads to Cloudflare R2 / AWS S3 via pre-signed URLs.
  - Inventory management (stock status, quantity adjustment, featured item toggle).
- **Category Hierarchy (`/admin/categories`)**:
  - Create, edit, and organize product categories.
  - Custom display order indexing and banner image assignment.
- **Order Fulfillment Desk (`/admin/orders`)**:
  - Filter orders by status: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
  - Detailed line-item breakdown with customer contact details and shipping addresses.
  - Real-time order status and payment status updating.
- **Customer Directory (`/admin/customers`)**: Overview of registered customer accounts, order counts, and registration timestamps.
- **Inquiry Management (`/admin/inquiries`)**: Centralized inbox for customer queries submitted via the contact form.
- **Store Configuration (`/admin/settings`)**: Currency settings, free shipping thresholds, and operational flags.

---

### 3. Backend REST APIs (`/backend/app/api`)

| Endpoint Route | Methods | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register new customer account with bcrypt password hashing |
| `/api/auth/login` | `POST` | Authenticate user credentials and return signed JWT token |
| `/api/auth/me` | `GET` | Retrieve authenticated user profile and roles |
| `/api/auth/logout` | `POST` | Invalidate authenticated session |
| `/api/auth/forgot-password` | `POST` | Generate single-use password reset token |
| `/api/auth/reset-password` | `POST` | Verify token and update customer password |
| `/api/products` | `GET`, `POST` | List filtered products / Admin product creation |
| `/api/products/[slug]` | `GET`, `PUT`, `DELETE` | Single product details / Update / Remove |
| `/api/categories` | `GET`, `POST` | Fetch catalog categories / Create new category |
| `/api/cart/validate` | `POST` | Validate cart items, prices, and available stock |
| `/api/checkout/create-order` | `POST` | Transactional order creation and inventory deduction |
| `/api/orders` | `GET` | Retrieve customer order history |
| `/api/orders/[id]` | `GET` | Retrieve individual order breakdown |
| `/api/admin/orders` | `GET` | Admin list of all orders with status filtering |
| `/api/admin/orders/[id]` | `PUT` | Update order status and fulfillment details |
| `/api/admin/stats` | `GET` | Real-time analytics metrics for admin dashboard |
| `/api/storage/presigned-url` | `POST` | Generate pre-signed S3/R2 image upload URL |
| `/api/wishlist` | `GET`, `POST`, `DELETE` | Customer wishlist management |
| `/api/contact` | `POST` | Handle contact inquiries from storefront |
| `/api/newsletter` | `POST` | Newsletter subscription capture |

---

### 4. Database Schema (Prisma & PostgreSQL)

The database schema (`backend/prisma/schema.prisma`) enforces strict relational integrity with the following models:
- **`User`**: Customer and Admin accounts, hashed passwords, roles (`CUSTOMER`, `ADMIN`).
- **`Category`**: Catalog departments, slugs, display orders, and cover images.
- **`Product`**: SKU pricing, sale prices, stock counts, availability states, and descriptions.
- **`ProductCategory`**: Many-to-many relationship linking products across multiple categories.
- **`ProductImage`**: Multi-image attachments per product with sort ordering.
- **`Order` & `OrderItem`**: Relational order tracking with JSON address snapshots, pricing, and gateway details.
- **`Wishlist`**: User-product bookmarking table.
- **`ContactInquiry`**: Customer service ticket records.
- **`NewsletterSubscriber`**: Unique subscriber list.
- **`PasswordResetToken`**: Time-limited cryptographic reset tokens.

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL**: Local instance or Docker installed

---

### Step 1: Database Setup (Docker or Local)

To run PostgreSQL and pgAdmin via Docker:
```bash
docker run --name exora-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=exora -p 5432:5432 -d postgres:16
```

---

### Step 2: Backend Configuration & Startup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
   *(Update `DATABASE_URL` and `JWT_SECRET` as required)*
4. Run Prisma database migrations and seed default data:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   Backend will start on **`http://localhost:3001`**.

---

### Step 3: Frontend Configuration & Startup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify `frontend/.env.local` contains:
   ```env
   NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
   NEXT_PUBLIC_CURRENCY="INR"
   NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will start on **`http://localhost:3000`**.

---

## Directory Structure

```text
exora/
├── backend/
│   ├── app/
│   │   ├── admin/                # Admin back-office subpages (orders, products, stats)
│   │   └── api/                  # Modular Next.js REST API route handlers
│   ├── prisma/
│   │   ├── migrations/           # Versioned SQL migration history
│   │   ├── schema.prisma         # Prisma data models & relational schema
│   │   └── seed.ts               # Database seed script for products & categories
│   ├── public/                   # Static assets & brand vectors
│   ├── src/
│   │   ├── components/           # Admin & UI components
│   │   └── lib/                  # JWT auth, S3/R2 client, Prisma client, email helpers
│   ├── .dockerignore
│   ├── .env.example              # Safe environment variable template
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── Dockerfile                # Backend containerization file
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── about/                # Brand story page
│   │   ├── blog/                 # Blog & article pages
│   │   ├── cart/                 # Shopping bag interface
│   │   ├── checkout/             # Order checkout & billing screen
│   │   ├── collection/           # Product collection & catalog pages
│   │   ├── contact/              # Customer contact & inquiry form
│   │   ├── order-confirmation/   # Post-purchase receipt screen
│   │   └── page.tsx              # Storefront landing page
│   ├── public/                   # Frontend images, logos, and media
│   ├── src/
│   │   ├── components/           # Navigation, Hero, Product cards, Cart modal, Auth modal
│   │   ├── lib/                  # SWR hooks, Zustand cart store, API client
│   │   └── types/                # Shared TypeScript models
│   ├── .dockerignore
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── Dockerfile                # Frontend containerization file
│   └── package.json
│
├── docker/
│   └── pgadmin/
│       └── servers.json          # Pre-configured pgAdmin database connection profile
├── .gitignore                    # Monorepo-wide security rules
├── LICENSE                       # Proprietary copyright license
└── README.md                     # Monorepo documentation
```

---

## Security & Privacy Compliance

- **Environment Separation**: All production secrets, database credentials, and cryptographic keys are strictly excluded from version control via `.gitignore`.
- **Password Security**: Passwords are never stored in plain text; all credentials are salted and hashed using `bcryptjs`.
- **JWT Authentication**: Administrative and customer routes are protected by cryptographically signed JWT tokens with expiration policies.
- **SQL Injection Prevention**: Prisma ORM executes parameterized queries for 100% protection against SQL injection attacks.

---

## License

**Proprietary and Confidential.**

Copyright © 2026 **Harsh Bhayani (HarshBhayani77)**. All Rights Reserved.

Unauthorized copying, distribution, modification, reverse engineering, or public deployment of this repository or any portion thereof is strictly prohibited without prior written permission from the copyright owner. See the full [LICENSE](file:///d:/web/exora/LICENSE) file for complete legal terms.
