# Wine Tasting Scheduler

A Next.js application for coordinating wine tasting events with scheduling polls, wine contribution management, and post-event rating collection.

## Features

- **Event Creation**: Hosts create events with multiple time slot options
- **Availability Polling**: Guests indicate availability for proposed times
- **Wine Contributions**: Participants submit wines with duplicate detection
- **Event Finalization**: Hosts select final time and lock responses
- **Rating System**: Post-event 0-100 scoring with tasting notes
- **Recap Sharing**: Public event summaries with wines, ratings, and attendance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with wine-inspired theme palette
- **UI Components**: Radix UI primitives via ShadCN
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Prisma with Vercel Postgres
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Vercel Postgres)
- npm or pnpm

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wine_scheduler"

# Email Provider (Sendgrid or Postmark)
EMAIL_API_KEY=""
EMAIL_FROM="noreply@winetasting.app"

# Vivino API (placeholder for future integration)
VIVINO_API_KEY=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Development Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run unit tests (Vitest)
npm run test:e2e     # Run e2e tests (Playwright)

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev    # Create and run migrations (dev)
npx prisma migrate deploy # Run migrations (production)
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (host)/            # Host-facing routes
│   ├── (guest)/           # Guest-facing routes
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   └── providers/         # React context providers
├── lib/
│   ├── events/            # Event domain logic
│   ├── email/             # Email utilities
│   └── tokens.ts          # Token generation/validation
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Migration files
└── tests/
    ├── unit/              # Unit tests
    └── e2e/               # End-to-end tests
```

## UI Components

Reusable components are documented in `components/ui/README.md`. All components:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Follow accessibility best practices
- Support wine-themed color palette

## Database Schema

Key models:
- **Event**: Event details and status
- **TimeOption**: Proposed time slots
- **Invitee**: Guest participation tokens and responses
- **WineContribution**: Wine submissions with metadata
- **DuplicateFlag**: Duplicate wine detection
- **Rating**: Post-event ratings and notes

See `prisma/schema.prisma` for full schema details.

## Deployment

### Vercel Deployment (Recommended)

#### Initial Setup

1. **Connect Repository**
   - Connect your repository to Vercel via GitHub/GitLab/Bitbucket
   - Vercel will auto-detect Next.js configuration

2. **Configure Environment Variables**

   In Vercel dashboard, add these environment variables:
   ```
   DATABASE_URL=postgresql://...  (from Vercel Postgres)
   TOKEN_SECRET=<generate-random-secret>
   EMAIL_API_KEY=<sendgrid-or-postmark-key>
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   VIVINO_API_KEY=<optional-for-future>
   ```

3. **Database Setup**
   - Create Vercel Postgres database
   - Copy connection string to `DATABASE_URL`
   - Run migrations (see below)

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or manually deploy via Vercel dashboard

#### Database Migrations

Run migrations before each deployment:
```bash
npx prisma migrate deploy
```

For Vercel, add to build settings:
```json
{
  "buildCommand": "npx prisma migrate deploy && npm run build"
}
```

#### Post-Deployment

1. **Seed Database** (optional, for testing):
   ```bash
   npx prisma db seed
   ```

2. **Verify Deployment**:
   - Test event creation flow
   - Test invite URLs
   - Verify email sending
   - Check recap page

### Testing Before Deployment

#### Unit Tests
```bash
npm test                 # Run all unit tests
npm test -- --coverage   # With coverage report
```

#### E2E Tests
```bash
npm run test:e2e              # Run Playwright tests
npm run test:e2e -- --ui      # Run with UI mode
npm run test:e2e -- --headed  # Run in headed mode
```

#### Type Checking
```bash
npm run type-check  # Verify TypeScript types
```

#### Linting
```bash
npm run lint        # Check code quality
npm run format      # Auto-format code
```

### CI/CD Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### Manual Deployment (Alternative)

#### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t wine-scheduler .
docker run -p 3000:3000 --env-file .env wine-scheduler
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TOKEN_SECRET` | Yes | Secret for signing tokens (min 32 chars) |
| `EMAIL_API_KEY` | No | SendGrid or Postmark API key |
| `EMAIL_FROM` | No | From address for emails |
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL of deployed app |
| `VIVINO_API_KEY` | No | Future Vivino integration |

### Feature Flags

Future Vivino integration can be toggled via environment variable:

```bash
ENABLE_VIVINO=true  # Enable Vivino wine search
```

To implement:
```typescript
const ENABLE_VIVINO = process.env.ENABLE_VIVINO === 'true';

if (ENABLE_VIVINO) {
  // Call Vivino API
}
```

### Monitoring & Debugging

- **Vercel Logs**: View real-time logs in Vercel dashboard
- **Prisma Studio**: `npx prisma studio` to browse database
- **Error Tracking**: Consider adding Sentry or similar

### Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Email sending tested
- [ ] SSL certificate active (handled by Vercel)
- [ ] Custom domain configured (if applicable)
- [ ] All tests passing
- [ ] Type checking passes
- [ ] No console errors in production

### Rollback Strategy

If deployment fails:
1. Revert to previous deployment in Vercel dashboard
2. Or redeploy previous git commit
3. Check migration status: `npx prisma migrate status`

## Contributing

1. Follow TypeScript strict mode
2. Run `npm run format` before committing
3. Ensure `npm run type-check` passes
4. Write tests for new features
5. Follow component documentation guidelines
6. Run e2e tests for significant changes

## License

Proprietary