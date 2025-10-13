# Reveel - Competitive Intelligence Agent

**Automated competitor tracking and actionable market intelligence for modern businesses.**

Reveel is an AI-powered SaaS platform that monitors competitor activities across the web—tracking pricing changes, advertising campaigns, and content updates—and delivers real-time insights to help businesses stay ahead in their market.

## Project Status

**Current Phase:** MVP Development (Phase 1)  
**Focus:** Building the core scraping engine and alerting system

## What is Reveel?

Reveel is a competitive intelligence automation tool designed for B2B and e-commerce businesses. Instead of manually checking competitor websites, Reveel's automated agents continuously monitor your competitors and alert you to significant changes that could impact your business strategy.

### Core Value Proposition

- **Automated Monitoring**: Set it and forget it. Reveel watches your competitors 24/7.
- **Real-Time Alerts**: Get notified immediately when competitors change pricing, launch campaigns, or publish new content.
- **Actionable Insights**: Understand what competitor moves mean for your business with AI-powered analysis.

## MVP Features (Phase 1)

The current MVP focuses on proving the core data-gathering and notification loop:

1. **User Authentication**  
   Secure email/password signup and login system.

2. **Dashboard Interface**  
   Simple UI for adding competitor product URLs and CSS selectors to track pricing.

3. **Scraping Engine**  
   Scheduled background jobs that periodically scrape tracked URLs, extract prices, and detect changes.

4. **Alert System**  
   Email notifications sent automatically when price changes are detected.

## Tech Stack

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js & Express** - Server runtime and REST API framework
- **TypeScript** - Full-stack type safety
- **PostgreSQL** - Relational database
- **Prisma** - Modern database ORM

### Infrastructure & Tools
- **Puppeteer** - Headless browser for web scraping
- **node-cron** - Job scheduling for automated scraping
- **Resend** - Transactional email service

### Deployment (Week 8)
- **Docker** - Containerization for production
- **Railway/DigitalOcean** - Cloud hosting platforms

## Project Structure

```
reveel-ct/
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── jobs/
│   └── prisma/
├── frontend/         # Next.js application
│   ├── app/
│   ├── src/
│   └── assets/
└── docker/          # Docker configuration
```

## Getting Started

Detailed setup and development instructions can be found in [BUILDING.md](./BUILDING.md).

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd reveel-ct

# Set up backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Set up frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

## Future Vision (Phase 2)

The roadmap includes transforming the MVP into a full multi-tenant SaaS product:

- **Subscription Billing**: Stripe integration with tiered pricing plans
- **Advanced Tracking Agents**: Monitor Google Ads, blog posts, social media, and more
- **AI-Powered Insights**: Automated competitive analysis and strategic recommendations
- **Professional Dashboard**: Rich data visualizations and historical trend analysis
- **Team Collaboration**: Multi-user accounts with role-based permissions
- **Integrations**: Slack, email, webhooks, and third-party tools

### Planned Tech Upgrades

- **NestJS**: Replace Express for better modularity and scalability
- **Redis & BullMQ**: Robust job queue system for handling scraping at scale
- **Stripe**: Payment processing and subscription management

## Learning Objectives

This project serves as a comprehensive learning platform for modern full-stack development:

- **API Development**: Building production-ready REST APIs with Express
- **Type Safety**: End-to-end TypeScript implementation
- **Database Design**: Relational modeling with PostgreSQL and Prisma
- **Authentication**: JWT-based security implementation
- **Web Scraping**: Practical Puppeteer skills for data extraction
- **Job Automation**: Scheduled background tasks with node-cron
- **DevOps**: Docker containerization and cloud deployment

## Architecture Philosophy

Reveel is built as a **Systems Builder** project—a complete, production-grade system architected for real-world business use. Every architectural decision considers:

1. **Scalability**: Can this handle 1,000 users? 10,000?
2. **Maintainability**: Is the code organized and documented for long-term development?
3. **Production-Ready**: Is this secure, reliable, and deployable?

## Contributing

This is currently a learning and portfolio project. Contributions and feedback are welcome as the project evolves.

## License

[To be determined]

## Contact

For questions or collaboration inquiries, please open an issue in this repository.

---

**Built with the philosophy that learning projects should be production-grade systems, not toys.**

