# Exora — Luxury E-Commerce & Operations Management Platform

[![Platform](https://img.shields.io/badge/Architecture-Full--Stack_Monorepo-black)](https://github.com/HarshBhayani77)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.8_(App_Router)-000000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0_(Strict_Typing)-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Cloud Storage](https://img.shields.io/badge/Storage-Cloudflare_R2_%2F_AWS_S3-F38020?logo=cloudflare)](https://www.cloudflare.com/)
[![Auth](https://img.shields.io/badge/Auth-JWT_%2B_Bcrypt-green)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-Proprietary_All_Rights_Reserved-red)](#intellectual-property--code-access)

---

## Executive Overview

**Exora** is an enterprise-grade luxury e-commerce and retail operations ecosystem. Designed specifically for high-end boutique brands, Exora combines an editorial, editorial-grade shopping storefront with a robust administrative back-office portal, modular REST micro-services, and relational transactional integrity.

### Primary Architectural Pillars
- **Sub-Second Performance**: Server-side rendering (SSR) and Incremental Static Regeneration (ISR) using Next.js 16 App Router.
- **Editorial Luxury Design**: Custom typography, sleek dark mode aesthetics, fluid micro-interactions, and mobile-first responsive viewports powered by Tailwind CSS v4.
- **Enterprise Operations**: Centralized administrative dashboard for multi-image product management, catalog indexing, order fulfillment pipelines, and customer relationship monitoring.
- **Transactional Integrity**: ACID-compliant PostgreSQL database managed via Prisma ORM 6 with parameterized SQL operations and foreign key cascade rules.
- **Decoupled Cloud Storage**: Direct-to-bucket media asset pipeline utilizing pre-signed URLs with Cloudflare R2 and AWS S3 SDK.

---

## Visual System Architecture

The following diagram illustrates the complete end-to-end data flow between clients, application gateways, security middleware, and persistent storage:

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        Storefront["Storefront (Customer Web App)<br/>Next.js 16 • React 19 • Tailwind v4"]
        AdminPortal["Admin Back-Office Dashboard<br/>Catalog • Orders • Analytics Desk"]
    end

    subgraph Gateway["Application & API Gateway"]
        Middleware["Security & Auth Middleware<br/>JWT Verification • RBAC Authorization"]
        APIRoutes["Next.js App Router REST API<br/>Modular Route Handlers (/api/*)"]
    end

    subgraph Services["Core Business Logic Services"]
        AuthService["Auth Service<br/>Bcrypt Salting • JWT Tokens"]
        CatalogService["Catalog & Inventory Service<br/>Slug Generation • Stock Checks"]
        OrderService["Order Processing Engine<br/>Price Validation • Atomic Transactions"]
        StorageService["Media Storage Service<br/>S3 SDK Pre-signed URL Generator"]
    end

    subgraph Data["Persistence & Cloud Layer"]
        Prisma["Prisma ORM 6<br/>Prepared Queries • Migration Locks"]
        Database[("PostgreSQL 16 Database<br/>Relational Schema • ACID Safety")]
        CloudflareR2["Cloudflare R2 / AWS S3<br/>Pre-signed Media Asset Bucket"]
    end

    Storefront -->|"HTTP / HTTPS Requests"| Middleware
    AdminPortal -->|"Admin JWT Requests"| Middleware
    Middleware --> APIRoutes
    APIRoutes --> AuthService
    APIRoutes --> CatalogService
    APIRoutes --> OrderService
    APIRoutes --> StorageService
    AuthService --> Prisma
    CatalogService --> Prisma
    OrderService --> Prisma
    StorageService -->|"Pre-signed PUT / GET"| CloudflareR2
    Prisma --> Database
```

---

## Order Fulfillment Lifecycle

To guarantee stock consistency and eliminate race conditions during high-traffic checkout events, Exora enforces an atomic multi-stage order workflow:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant Cart as Zustand Persistent Cart
    participant API as /api/checkout/create-order
    participant DB as PostgreSQL (Prisma Transaction)
    participant Admin as Admin Operations Desk

    Customer->>Cart: Add Products & Review Bag
    Customer->>API: Submit Order (Address + Payment Mode)
    Note over API,DB: Begin Database Transaction
    API->>DB: Verify Real-Time Stock Availability
    alt Insufficient Stock
        DB-->>API: Out of Stock Error
        API-->>Customer: Return Cart Validation Error
    else Stock Available
        API->>DB: Create Order Record with Unique OrderNumber
        API->>DB: Create OrderItem Line Items
        API->>DB: Atomically Deduct Product Inventory
        Note over API,DB: Commit Database Transaction
        DB-->>API: Order Confirmed
        API-->>Customer: Success (Redirect to Confirmation Screen)
        API->>Admin: Push Order to PENDING Queue
    end

    Note over Admin: Order Management Pipeline
    Admin->>Admin: Transition: PENDING ➔ PROCESSING
    Admin->>Admin: Transition: PROCESSING ➔ SHIPPED
    Admin->>Admin: Transition: SHIPPED ➔ DELIVERED
```

---

## Core Capabilities & Engineering Features

### 1. Customer-Facing Storefront
| Feature | Technical Implementation |
| :--- | :--- |
| **Luxury Visual Identity** | Editorial serif typography, balanced negative space, and custom dark accents tailored for luxury goods. |
| **Interactive Catalog** | Real-time category filtering, slug-based deep-linking, multi-criteria sorting (Price, Newest, Featured). |
| **Product Detail Experience** | Multi-perspective thumbnail galleries, stock status badges, dynamic pricing, and quantity modifiers. |
| **Persistent Cart Engine** | Client-side reactive state managed via **Zustand 5** with localStorage hydration and real-time subtotal computation. |
| **Free Shipping Tracker** | Dynamic threshold calculation notifying customers of remaining value required for complimentary delivery (₹2,500). |
| **Seamless Checkout Flow** | Multi-stage address capture, support for Cash on Delivery (COD) and online gateways (Stripe/Razorpay ready). |
| **Customer Auth Modal** | Dual-mode authentication modal supporting Login, Account Registration, and Password Reset without page reload. |

### 2. Back-Office Admin Control Center
| Feature | Technical Implementation |
| :--- | :--- |
| **Executive Metrics Desk** | Aggregated gross sales, pending/completed order volume, inventory deficit warnings, and customer growth trends. |
| **Product Lifecycle Management** | Full CRUD operations, automatic URL slugification, category multi-tagging, and stock quantity adjustments. |
| **Pre-Signed Asset Uploads** | Direct browser-to-bucket S3 uploads bypassing web server memory limits, eliminating server upload bottlenecks. |
| **Category Structure** | Custom category display ordering, hierarchy management, and cover banner asset management. |
| **Order Processing Terminal** | Comprehensive order inspector, line-item pricing breakdowns, customer contact data, and real-time status transitions. |
| **Inquiries & Communications** | Integrated message hub for direct customer support requests originating from the storefront contact form. |

---

## Database Relational Architecture

The relational schema is engineered in PostgreSQL using Prisma ORM to ensure strict data integrity and relational constraints:

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Wishlist : maintains
    Product ||--|{ ProductCategory : belongs_to
    Category ||--|{ ProductCategory : contains
    Product ||--o{ ProductImage : has
    Product ||--o{ OrderItem : included_in
    Product ||--o{ Wishlist : saved_as
    Order ||--|{ OrderItem : comprises

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        string role "CUSTOMER | ADMIN"
        string addresses "JSON"
        datetime createdAt
    }

    Product {
        int id PK
        string name
        string slug UK
        float price
        float regularPrice
        float salePrice
        boolean onSale
        string stockStatus
        int stockQuantity
        boolean featured
        datetime createdAt
    }

    Category {
        int id PK
        string name
        string slug UK
        int displayOrder
        string image
    }

    Order {
        string id PK
        string orderNumber UK
        string customerName
        string customerEmail
        float subtotal
        float shippingFee
        float total
        string status "PENDING | PROCESSING | SHIPPED | DELIVERED"
        string paymentStatus
        string paymentGateway "COD | STRIPE | RAZORPAY"
        datetime createdAt
    }

    OrderItem {
        int id PK
        string orderId FK
        int productId FK
        string productName
        float unitPrice
        int quantity
        float subtotal
    }
```

---

## REST API Specification

Exora implements a fully modular Next.js App Router API architecture:

| Endpoint | Method | Access Level | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Register customer account with bcrypt salted hashing |
| `/api/auth/login` | `POST` | Public | Authenticate credentials and issue secure signed JWT |
| `/api/auth/me` | `GET` | Authenticated | Fetch active user profile and authorization roles |
| `/api/auth/logout` | `POST` | Authenticated | Invalidate authentication session |
| `/api/auth/forgot-password` | `POST` | Public | Issue cryptographic time-expiring reset tokens |
| `/api/auth/reset-password` | `POST` | Public | Validate token signature and update password |
| `/api/products` | `GET` | Public | List products with pagination, search, and category filters |
| `/api/products` | `POST` | **Admin** | Create new catalog product record |
| `/api/products/[slug]` | `GET` | Public | Retrieve detailed product specifications and image set |
| `/api/products/[slug]` | `PUT` | **Admin** | Update product pricing, inventory, categories, and images |
| `/api/products/[slug]` | `DELETE` | **Admin** | Remove product and cascade relational cleanup |
| `/api/categories` | `GET` | Public | Retrieve catalog category hierarchy and ordering |
| `/api/cart/validate` | `POST` | Public | Real-time verification of bag prices and inventory limits |
| `/api/checkout/create-order`| `POST` | Public / Auth | Transactional order creation and atomic stock decrement |
| `/api/orders` | `GET` | Authenticated | Customer order history retrieval |
| `/api/orders/[id]` | `GET` | Authenticated | Detailed customer invoice and tracking summary |
| `/api/admin/orders` | `GET` | **Admin** | Master order pipeline filterable by status |
| `/api/admin/orders/[id]` | `PUT` | **Admin** | Update order fulfillment and payment status |
| `/api/admin/stats` | `GET` | **Admin** | Executive aggregate sales and inventory metrics |
| `/api/storage/presigned-url`| `POST` | **Admin** | Generate S3/Cloudflare R2 pre-signed upload credentials |
| `/api/wishlist` | `GET/POST` | Authenticated | Customer product bookmark management |
| `/api/contact` | `POST` | Public | Capture customer inquiry submissions |
| `/api/newsletter` | `POST` | Public | Storefront newsletter subscription capture |

---

## Technical Stack & Engineering Specifications

| Domain | Technology / Library | Role & Justification |
| :--- | :--- | :--- |
| **Storefront Architecture** | Next.js 16 (App Router) | High-performance React framework providing Hybrid SSR and ISR for SEO. |
| **Frontend Framework** | React 19 | Latest concurrent React engine with server/client component boundaries. |
| **Type Safety** | TypeScript 5 (Strict) | End-to-end interface contracts between API responses and UI state. |
| **Design System** | Tailwind CSS v4 | Next-generation CSS engine enabling fluid typography and theme tokens. |
| **State Management** | Zustand 5 | Minimalist, unopinionated client store with zero boilerplate and localStorage sync. |
| **Data Fetching** | SWR (Stale-While-Revalidate) | Automatic cache invalidation, optimistic updates, and background revalidation. |
| **Motion & Micro-interactions** | Framer Motion | Smooth page transitions, cart drawer animations, and hero carousels. |
| **Icons & Media** | Lucide React | Lightweight, tree-shakable SVG icon library. |
| **ORM & Query Engine** | Prisma 6.4.1 | Type-safe database client preventing SQL injection vulnerabilities. |
| **Database** | PostgreSQL 16 | Enterprise ACID-compliant relational database with foreign key cascading. |
| **Authentication & Cryptography** | JWT & Bcryptjs | Cryptographically signed JSON Web Tokens paired with salted password hashing. |
| **Cloud Object Storage** | Cloudflare R2 / AWS S3 SDK | High-availability asset storage with zero egress fees and pre-signed uploads. |
| **DevOps & Containerization** | Docker & pgAdmin 4 | Reproducible local PostgreSQL container environments. |

---

## Intellectual Property & Code Access

**Proprietary and Confidential.**

Copyright © 2026 **Harsh Bhayani (HarshBhayani77)**. All Rights Reserved.

> [!IMPORTANT]
> **Notice to Recruiters, Reviewers, and Hiring Teams:**  
> To protect proprietary client business logic and intellectual property, the production implementation source code is maintained in an exclusive private repository.  
> 
> Detailed architecture walkthroughs, system demonstrations, and code reviews can be arranged directly upon request.

---

## Author & Engineering Contact

**Harsh Bhayani**  
- **GitHub**: [@HarshBhayani77](https://github.com/HarshBhayani77)  
- **Email**: [harshbhayani77@gmail.com](mailto:harshbhayani77@gmail.com)  
- **Project**: Exora Luxury E-Commerce Platform
