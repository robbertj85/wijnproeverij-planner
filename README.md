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

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set `DATABASE_URL` to your Vercel Postgres connection string
4. Deploy

The app is configured for Vercel deployment via `vercel.json`.

### Database Migrations

Run migrations before each deployment:
```bash
npx prisma migrate deploy
```

## Contributing

1. Follow TypeScript strict mode
2. Run `npm run format` before committing
3. Ensure `npm run type-check` passes
4. Write tests for new features
5. Follow component documentation guidelines

## License

Proprietary