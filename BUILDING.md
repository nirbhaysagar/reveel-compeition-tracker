# Building Reveel - Development Guide

This document provides comprehensive guidance for building the Reveel competitive intelligence platform. It covers architecture decisions, setup instructions, development workflows, and the learning path embedded in this project.

## Table of Contents

1. [Project Philosophy](#project-philosophy)
2. [Development Phases](#development-phases)
3. [Architecture Overview](#architecture-overview)
4. [Environment Setup](#environment-setup)
5. [Database Schema](#database-schema)
6. [Backend Development](#backend-development)
7. [Frontend Development](#frontend-development)
8. [Scraping Engine](#scraping-engine)
9. [Job Scheduling](#job-scheduling)
10. [Deployment](#deployment)
11. [Testing Strategy](#testing-strategy)
12. [Learning Resources](#learning-resources)

---

## Project Philosophy

Reveel is a **Systems Builder** project. This means:

- **Production-Grade Architecture**: Every component is designed as if it will serve real users at scale.
- **Learning Through Building**: The tech stack is chosen to provide hands-on mastery of modern full-stack development.
- **Future-Proof Design**: MVP decisions consider Phase 2 scalability requirements.

### Core Principles

1. **Type Safety First**: TypeScript everywhere to catch errors at compile time.
2. **Security by Design**: Authentication, input validation, and secure data handling from day one.
3. **Modularity**: Clean separation of concerns for easy testing and maintenance.
4. **Documentation**: Code and architecture decisions should be self-explanatory.

---

## Development Phases

### Phase 1: MVP - The Scraper & Alerter

**Timeline**: Weeks 1-8  
**Goal**: Build a functional single-user tool demonstrating the core value loop.

#### Week 1: Foundation & Backend
- [ ] Initialize project structure (backend and frontend folders)
- [ ] Set up Node.js + TypeScript + Express backend
- [ ] Configure Prisma with PostgreSQL (local instance)
- [ ] Design initial database schema (User, TrackedProduct, PriceHistory)
- [ ] Implement basic CRUD operations
- [ ] Create basic Express server with health check endpoint

#### Week 2: Authentication System
- [ ] JWT-based authentication
- [ ] Secure password hashing (bcrypt)
- [ ] Login and signup endpoints
- [ ] Auth middleware for protected routes

#### Week 3: Scraping Engine
- [ ] Puppeteer setup and configuration
- [ ] CSS selector-based data extraction
- [ ] Error handling and retry logic
- [ ] Price change detection algorithm

#### Week 4: Job Scheduling & Alerts
- [ ] node-cron configuration
- [ ] Background job runner
- [ ] Resend email integration
- [ ] Alert template design

#### Week 5-6: Frontend Dashboard
- [ ] Next.js project setup
- [ ] Authentication UI (login/signup)
- [ ] Dashboard for adding/managing tracked products
- [ ] Display price history and alerts

#### Week 7: Integration & Testing
- [ ] End-to-end testing of scraping loop
- [ ] API testing with Postman/Insomnia
- [ ] Bug fixes and edge case handling

#### Week 8: Deployment
- [ ] Dockerize application (containerization for production)
- [ ] Deploy to Railway or DigitalOcean
- [ ] Set up production database (managed PostgreSQL)
- [ ] Configure production environment variables
- [ ] Set up monitoring and logging

### Phase 2: Full SaaS Product

**Timeline**: Post-MVP  
**Goal**: Transform into a multi-tenant subscription-based platform.

- Multi-user support with team workspaces
- Stripe subscription billing
- Advanced tracking (ads, content, social media)
- AI-powered competitive insights
- Professional analytics dashboard
- Migration to NestJS + Redis/BullMQ

---

## Architecture Overview

### System Design

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ├─── Next.js Frontend (Port 3000)
       │         │
       │         ↓
       └─── Express API (Port 5000)
                 │
                 ├─── Prisma ORM
                 │         ↓
                 │    PostgreSQL DB
                 │
                 ├─── Puppeteer Scraper
                 │         │
                 │         └─── Target Websites
                 │
                 ├─── node-cron Scheduler
                 │         │
                 │         └─── Periodic Jobs
                 │
                 └─── Resend Email Service
```

### Data Flow: Price Change Detection

1. **Scheduler Trigger**: node-cron fires at configured interval (e.g., every 6 hours)
2. **Fetch Targets**: Query database for all active tracked products
3. **Scrape Data**: Puppeteer navigates to each URL and extracts price using CSS selector
4. **Compare**: Check if scraped price differs from last recorded price
5. **Update Database**: Store new price with timestamp
6. **Send Alert**: If change detected, trigger email via Resend
7. **Log Results**: Record scraping job status and any errors

### Project Structure

```
reveel-ct/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Server entry point
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # Authentication endpoints
│   │   │   ├── product.routes.ts    # Product tracking endpoints
│   │   │   └── user.routes.ts       # User profile endpoints
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── services/
│   │   │   ├── scraper.service.ts   # Puppeteer scraping logic
│   │   │   ├── email.service.ts     # Resend integration
│   │   │   └── auth.service.ts      # JWT generation/validation
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # Protect routes
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── jobs/
│   │   │   └── scraping.job.ts      # Scheduled scraping job
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript types
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── helpers.ts
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── lib/                     # API client, utilities
│   │   └── types/                   # TypeScript types
│   ├── assets/                      # Static assets
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── README.md
├── BUILDING.md
└── .gitignore
```

---

## Environment Setup

### Prerequisites

**Required for Local Development:**
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (comes with Node.js)
- **PostgreSQL**: v14+ (local installation recommended for development)
- **Git**: For version control

**Optional (for Production Deployment):**
- **Docker**: For containerized deployment (can be added later)

### Initial Setup

#### 1. Create Project Structure

```bash
mkdir reveel-ct
cd reveel-ct
mkdir backend frontend docker
```

#### 2. Initialize Backend

```bash
cd backend
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express ts-node nodemon
npm install prisma @prisma/client
npm install puppeteer
npm install node-cron @types/node-cron
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install resend
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

#### 3. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables

#### 4. Configure Environment Variables

Create `.env` in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reveel_db?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Create `.env.example` (commit this, not `.env`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/reveel_db"
PORT=5000
NODE_ENV=development
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d
RESEND_API_KEY=your_api_key
FRONTEND_URL=http://localhost:3000
```

#### 5. Initialize Frontend

```bash
cd ../frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src
npm install axios
npm install @headlessui/react @heroicons/react
```

---

## Database Schema

### Prisma Schema Definition

Edit `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  trackedProducts TrackedProduct[]
}

model TrackedProduct {
  id          String   @id @default(uuid())
  name        String   // User-friendly name for the product
  url         String   // Target website URL
  selector    String   // CSS selector for price element
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  priceHistory PriceHistory[]
  
  @@index([userId])
}

model PriceHistory {
  id        String   @id @default(uuid())
  price     Float    // Extracted price value
  currency  String   @default("USD")
  scrapedAt DateTime @default(now())
  
  productId String
  product   TrackedProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@index([productId, scrapedAt])
}
```

### Running Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Schema Design Rationale

- **UUID Primary Keys**: Better for distributed systems and privacy.
- **Cascade Deletes**: When a user is deleted, all their tracked products and price history are automatically removed.
- **Indexes**: Optimize queries for `userId` and `productId` lookups.
- **Timestamps**: Track when records are created and updated.
- **isActive Flag**: Allows users to pause tracking without deleting data.

---

## Backend Development

### Core Server Setup

Create `backend/src/index.ts`:

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startScrapingJob } from './jobs/scraping.job';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  
  // Start background scraping job
  startScrapingJob();
  console.log('⏰ Scraping job scheduled');
});
```

### Authentication Implementation

**Key Concepts to Master:**
- Password hashing with bcrypt
- JWT token generation and validation
- Middleware for route protection
- Secure session management

**Files to Create:**
- `src/services/auth.service.ts` - Core auth logic
- `src/controllers/auth.controller.ts` - Request handlers
- `src/routes/auth.routes.ts` - Route definitions
- `src/middleware/auth.middleware.ts` - Protected route middleware

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current user (protected)

#### Products
- `GET /api/products` - List user's tracked products (protected)
- `POST /api/products` - Add new product to track (protected)
- `GET /api/products/:id` - Get product details with price history (protected)
- `PATCH /api/products/:id` - Update product (name, selector, isActive) (protected)
- `DELETE /api/products/:id` - Delete tracked product (protected)

---

## Frontend Development

### Next.js App Router Structure

The frontend uses Next.js 13+ App Router for better performance and developer experience.

**Key Pages:**
- `/` - Landing page (public)
- `/login` - Authentication (public)
- `/signup` - Registration (public)
- `/dashboard` - Main app interface (protected)
- `/dashboard/products/[id]` - Product detail view (protected)

### Authentication Flow

1. User submits login form
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates and returns JWT
4. Frontend stores JWT in localStorage (or httpOnly cookie for better security)
5. All subsequent API requests include JWT in Authorization header
6. Backend middleware validates JWT before processing requests

### State Management

For MVP, use React Context API or simple prop drilling. Phase 2 can introduce Zustand or Redux if needed.

### Styling Guidelines

- Use Tailwind CSS utility classes
- Create reusable components in `src/components/`
- Professional, clean design (no emojis, modern color palette)
- Responsive design for mobile and desktop

---

## Scraping Engine

### Puppeteer Fundamentals

Create `backend/src/services/scraper.service.ts`:

```typescript
import puppeteer, { Browser } from 'puppeteer';

export class ScraperService {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrapePrice(url: string, selector: string): Promise<number | null> {
    if (!this.browser) {
      await this.initialize();
    }

    try {
      const page = await this.browser!.newPage();
      
      // Set user agent to avoid bot detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for selector and extract text
      await page.waitForSelector(selector, { timeout: 10000 });
      const priceText = await page.$eval(selector, el => el.textContent || '');
      
      await page.close();
      
      // Parse price from text (handle $, €, commas, etc.)
      return this.parsePrice(priceText);
    } catch (error) {
      console.error(`Scraping failed for ${url}:`, error);
      return null;
    }
  }

  private parsePrice(text: string): number | null {
    // Remove currency symbols, commas, spaces
    const cleaned = text.replace(/[$€£,\s]/g, '');
    const price = parseFloat(cleaned);
    return isNaN(price) ? null : price;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
```

### Error Handling

Common scraping challenges:
- **Timeouts**: Website slow to load or selector not found
- **Rate Limiting**: Too many requests trigger blocking
- **Dynamic Content**: JavaScript-rendered prices need proper wait conditions
- **Selector Changes**: Website updates break selectors

**Solutions:**
- Implement retry logic with exponential backoff
- Add delays between scrapes
- Use `waitForSelector` with appropriate timeouts
- Log errors for debugging
- Consider rotating user agents or proxies (Phase 2)

---

## Job Scheduling

Create `backend/src/jobs/scraping.job.ts`:

```typescript
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { ScraperService } from '../services/scraper.service';
import { sendPriceAlert } from '../services/email.service';

const prisma = new PrismaClient();
const scraper = new ScraperService();

export function startScrapingJob() {
  // Run every 6 hours: 0 */6 * * *
  // For testing, use every 5 minutes: */5 * * * *
  cron.schedule('0 */6 * * *', async () => {
    console.log('🔍 Starting scheduled scraping job...');
    
    try {
      // Fetch all active products
      const products = await prisma.trackedProduct.findMany({
        where: { isActive: true },
        include: { 
          user: true,
          priceHistory: { orderBy: { scrapedAt: 'desc' }, take: 1 }
        }
      });

      console.log(`Found ${products.length} products to scrape`);

      for (const product of products) {
        try {
          const currentPrice = await scraper.scrapePrice(product.url, product.selector);
          
          if (currentPrice === null) {
            console.warn(`Failed to scrape: ${product.name}`);
            continue;
          }

          // Save to database
          await prisma.priceHistory.create({
            data: {
              price: currentPrice,
              productId: product.id
            }
          });

          // Check if price changed
          const lastPrice = product.priceHistory[0]?.price;
          if (lastPrice && currentPrice !== lastPrice) {
            const change = ((currentPrice - lastPrice) / lastPrice) * 100;
            console.log(`💰 Price change detected for ${product.name}: ${change.toFixed(2)}%`);
            
            // Send alert email
            await sendPriceAlert({
              to: product.user.email,
              productName: product.name,
              oldPrice: lastPrice,
              newPrice: currentPrice,
              changePercent: change
            });
          }
        } catch (err) {
          console.error(`Error processing ${product.name}:`, err);
        }
        
        // Add delay between scrapes to be polite
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log('✅ Scraping job completed');
    } catch (error) {
      console.error('❌ Scraping job failed:', error);
    }
  });
}
```

### Cron Schedule Syntax

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

Examples:
- `*/5 * * * *` - Every 5 minutes (testing)
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 0 * * 0` - Weekly on Sunday at midnight

---

## Deployment

> **Note**: Docker is **optional for local development**. You can develop and test the entire application locally using Node.js and a local PostgreSQL instance. Docker becomes important when you're ready to deploy to production or want to ensure consistency across different environments.

### Docker Configuration

Create `docker/Dockerfile.backend`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Create `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: reveel
      POSTGRES_PASSWORD: reveel_password
      POSTGRES_DB: reveel_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://reveel:reveel_password@postgres:5432/reveel_db
      PORT: 5000
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Deployment Steps

#### Option 1: Railway

1. Create account at railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. Initialize: `railway init`
5. Add PostgreSQL: `railway add --plugin postgresql`
6. Deploy: `railway up`
7. Set environment variables in Railway dashboard

#### Option 2: DigitalOcean

1. Create Droplet (Ubuntu 22.04, 2GB RAM minimum)
2. SSH into server
3. Install Docker and Docker Compose
4. Clone repository
5. Configure `.env` files
6. Run: `docker-compose up -d`
7. Set up reverse proxy with Nginx
8. Configure SSL with Let's Encrypt

---

## Testing Strategy

### Unit Tests

Test individual functions and services:
- Auth service (token generation, validation)
- Scraper service (price extraction, parsing)
- Utility functions

**Tool**: Jest

### Integration Tests

Test API endpoints:
- Authentication flow
- CRUD operations on products
- Database interactions

**Tool**: Supertest

### End-to-End Tests

Test complete user workflows:
- Signup → Login → Add Product → Receive Alert

**Tool**: Playwright or Cypress

### Testing Checklist for MVP

- [ ] User can sign up with valid email/password
- [ ] User cannot sign up with duplicate email
- [ ] User can log in with correct credentials
- [ ] User cannot access protected routes without JWT
- [ ] User can add a product with URL and selector
- [ ] Scraper correctly extracts price from test URL
- [ ] Price history is saved to database
- [ ] Email alert is sent when price changes
- [ ] User can view price history for a product
- [ ] User can delete a tracked product

---

## Learning Resources

### Node.js & Express
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Data Modeling Guide](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)

### Puppeteer
- [Puppeteer Documentation](https://pptr.dev/)
- [Web Scraping Best Practices](https://www.scrapingbee.com/blog/web-scraping-best-practices/)

### Authentication
- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## Next Steps

### Week 1 Checklist

- [ ] Initialize project structure (backend, frontend, docker)
- [ ] Set up Node.js + TypeScript + Express backend
- [ ] Configure Prisma with PostgreSQL
- [ ] Design and migrate database schema
- [ ] Create basic Express server with health check endpoint
- [ ] Set up Git repository and `.gitignore`
- [ ] Document environment variables

### Key Decisions to Make

1. **Scraping Frequency**: How often to run jobs? (Recommend: Every 6 hours for MVP)
2. **Alert Threshold**: Alert on any change or only significant changes? (Recommend: Any change for MVP)
3. **Email Provider**: Resend vs. SendGrid vs. AWS SES? (Recommend: Resend for simplicity)
4. **Deployment Platform**: Railway vs. DigitalOcean? (Recommend: Railway for MVP, DigitalOcean for Phase 2)

---

## Troubleshooting

### Common Issues

**Issue**: Puppeteer fails to launch browser  
**Solution**: Install missing dependencies (Linux) or use Docker

**Issue**: Database connection fails  
**Solution**: Check `DATABASE_URL` format, ensure PostgreSQL is running

**Issue**: CORS errors in frontend  
**Solution**: Verify `FRONTEND_URL` in backend `.env` and CORS configuration

**Issue**: JWT validation fails  
**Solution**: Ensure `JWT_SECRET` matches between token creation and verification

**Issue**: Scraper returns null  
**Solution**: Test CSS selector in browser DevTools, check if site requires authentication

---

## Conclusion

Building Reveel is a comprehensive journey through modern full-stack development. By following this guide and maintaining the "Systems Builder" mindset, you'll create a production-grade application while mastering essential skills.

Remember: **This is not a toy project.** Every line of code should be written with the assumption that real users will depend on this system.

Happy building!

