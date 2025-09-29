## Relevant Files

- `package.json` - Project dependencies, scripts, and tooling configuration.
- `app/layout.tsx` - Global layout, providers, and theme setup for the Next.js App Router.
- `app/(marketing)/page.tsx` - Landing page explaining the wine tasting scheduler value proposition.
- `app/(host)/events/new/page.tsx` - Host-facing event creation flow with multi-slot scheduling form.
- `app/(host)/events/[eventId]/manage/page.tsx` - Host dashboard to review poll responses, duplicate flags, and finalize the event.
- `app/(guest)/invite/[token]/page.tsx` - Guest invite page for availability responses and wine submissions via unique token.
- `app/(guest)/events/[eventId]/recap/page.tsx` - Public recap view summarizing attendance, wines, and ratings after the tasting.
- `app/api/events/route.ts` - API handler for creating events and generating invite tokens.
- `app/api/events/[eventId]/availability/route.ts` - API handler for guest availability submissions.
- `app/api/events/[eventId]/wines/route.ts` - API handler for wine contribution CRUD and duplicate detection.
- `app/api/events/[eventId]/ratings/route.ts` - API handler for post-event rating submissions.
- `app/api/events/[eventId]/finalize/route.ts` - API endpoint to finalize the event and trigger notifications.
- `prisma/schema.prisma` - Prisma models for events, time options, invitees, wine contributions, duplicate flags, and ratings.
- `prisma/migrations/` - Generated migration files targeting Vercel Postgres.
- `lib/prisma.ts` - Prisma client singleton for server components and API routes.
- `lib/events/service.ts` - Domain logic for event creation, duplicate detection, and Vivino prep helpers.
- `lib/email/send-invite.ts` - Email utility to send poll invites and finalization notices.
- `lib/tokens.ts` - Generation and validation of guest participation tokens (no-auth flow).
- `components/ui/EventForm.tsx` - Reusable form components (ShadCN) for host event creation.
- `components/ui/AvailabilityPoll.tsx` - Guest poll UI with Framer Motion interactions.
- `components/ui/WineContributionCard.tsx` - Display and edit wine submissions with Lucide icons and duplicate flags.
- `components/ui/RatingSlider.tsx` - 0–100 rating input with animated feedback.
- `tests/e2e/event-flow.spec.ts` - End-to-end tests covering host creation, guest participation, and recap flow.
- `tests/unit/lib-events.spec.ts` - Unit tests for event service logic including duplicate detection.

### Notes

- Set environment variables for database (`DATABASE_URL`), email provider, and Vivino placeholders in `.env.local` and Vercel dashboard.
- Use `npx prisma migrate dev` locally and `npx prisma migrate deploy` in CI/CD before Vercel deployment.
- Run unit tests with `npx vitest` (or Jest) and e2e tests with `npx playwright test`; update scripts accordingly.
- Ensure accessibility for forms and interactive components; add axe checks during development.

## Tasks

- [x] 1.0 Establish project foundation, dependencies, and shared UI/UX scaffolding
  - [x] 1.1 Initialize Next.js App Router project, configure TypeScript strict mode, and prepare Vercel deployment settings.
  - [x] 1.2 Install and configure Tailwind CSS, ShadCN UI, Lucide icons, Framer Motion, and supporting tooling (ESLint, Prettier, testing libs).
  - [x] 1.3 Create global layout, theme tokens inspired by wine palette, and shared providers (Tailwind theme, motion config).
  - [x] 1.4 Build reusable base components (Button, Card, Dialog, Toast) via ShadCN and document usage guidelines.
  - [x] 1.5 Draft README setup notes covering environment variables, scripts, and development workflow.

- [x] 2.0 Design and implement Prisma data models plus persistence layer for events, wines, and tokens
  - [x] 2.1 Model Event, TimeOption, Invitee, WineContribution, DuplicateFlag, Rating, and VivinoReference tables in `schema.prisma` with relations and constraints.
  - [x] 2.2 Implement participation token strategy (signed UUIDs) and add database indexes to support lookups and duplicate detection.
  - [x] 2.3 Generate migrations, run against local Postgres, and validate schema with sample seed data.
  - [x] 2.4 Build `lib/events/service.ts` for CRUD operations, duplicate detection logic, participant cap enforcement (max 8), and Vivino placeholder hooks.
  - [x] 2.5 Write unit tests for event service utilities including duplicate flag calculations and token validation.

- [x] 3.0 Build host-facing flows for event creation, scheduling poll management, and finalization. Make the app available in Dutch language.
  - [x] 3.1 Implement event creation form with dynamic time slots, validation, and optimistic submission using server actions.
  - [x] 3.2 Generate shareable invite URLs and optional email invitation workflow with templated content and sendgrid/postmark integration.
  - [x] 3.3 Develop host management dashboard showing responses, wine list, duplicate alerts, and participant cap status.
  - [x] 3.4 Add controls to finalize the preferred time option, lock additional responses, and trigger finalization emails.
  - [x] 3.5 Create host analytics/overview components (attendance summary, wine stats) with responsive design and animations.


- [x] 4.0 Build guest participation experience for availability, wine submissions, and duplicate flagging
  - [x] 4.1 Develop invite landing page that recognizes participation tokens and displays event context without requiring login.
  - [x] 4.2 Build availability poll UI allowing guests to mark availability per time option with motion feedback.
  - [x] 4.3 Implement wine submission form capturing type, varietal, producer, region, vintage, price, notes, and Vivino search placeholder.
  - [x] 4.4 Integrate duplicate detection warnings in real time and allow guests to adjust submissions accordingly.
  - [x] 4.5 Enforce participant cap (max 8 plus or min 2) and handle edge cases (event finalized, already responded) with friendly messaging.

- [ ] 5.0 Deliver post-event rating workflow, recap sharing, email notifications, and QA/deployment readiness
  - [ ] 5.1 Create rating interface for 0–100 scoring with tasting notes, available after event finalization.
  - [ ] 5.2 Build recap page summarizing wines, ratings, duplicate flags, and attendance for sharing.
  - [ ] 5.3 Implement email notifications for reminders and recap links using the chosen provider.
  - [ ] 5.4 Add e2e tests covering host creation → guest participation → recap flow, plus accessibility checks.
  - [ ] 5.5 Prepare deployment pipeline (Vercel configuration, env setup, database migrations) and document feature toggles for future Vivino integration.
