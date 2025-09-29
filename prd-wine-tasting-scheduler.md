# Wine Tasting Scheduler PRD

## 1. Introduction / Overview
A web application that helps casual wine enthusiasts plan and run wine-tasting evenings. The tool allows a host to propose event details, gather availability from friends with a poll-style flow, collect the wines that guests plan to bring, prevent duplicate varietal/vintage selections, and capture post-event ratings. The experience favors low-friction participation (link and email invites without login) while laying groundwork to later enrich wine data via Vivino.

## 2. Goals
- Enable a host to create and share a wine-tasting event poll in under 5 minutes.
- Allow guests to confirm attendance, propose or select dates, and register the wine they will bring without needing an account.
- Provide the host with a consolidated list of confirmed attendees and wines, highlighting duplicates before the event.
- Capture 0–100 ratings and tasting notes per wine after the event to produce a recap the host can review and share.

## 3. User Stories
- As a host, I want to set up a tasting event with multiple date/time options so my friends can pick what works best.
- As a guest, I want to respond to the poll and indicate the wine I plan to bring so the group can avoid duplicates.
- As a host, I want to see a real-time overview of who is attending, what wines are coming, and any flagged duplicates so I can adjust invitations.
- As any attendee, I want to rate each wine on a 0–100 scale and leave optional tasting notes after the event so we remember our favorites.
- As a host, I want to share a recap link with participants after the tasting so everyone can review wines and scores.

## 4. Functional Requirements
1. The system must let a host create an event draft specifying title, description, location, and multiple proposed date/time options.
2. The system must generate a shareable event link and support optional email invitations without requiring guest authentication.
3. The system must allow guests to submit their availability across the proposed options and confirm attendance.
4. The system must let guests register the wine they plan to bring, including type, varietal, producer, region, vintage, and optional price/notes.
5. The system must automatically flag wines with matching varietal and vintage and surface alerts to the host.
6. The system must give the host controls to finalize the event date/time based on poll responses and notify participants.
7. The system must capture attendee ratings on a 0–100 scale for each wine after the event, along with optional tasting notes.
8. The system must compile a recap view summarizing attendance, wines, duplicate warnings, and ratings that can be shared via link.
9. The system must store all event, wine, and rating data using Prisma models backed by Vercel Postgres for deployment on Vercel.
10. The system should record timestamps and user identifiers (e.g., email or lightweight name token) to track who submitted each response while respecting the no-login flow.

## 5. Non-Goals (Out of Scope)
- Implementing full authentication, account management, or OAuth login flows.
- Building calendar integrations (Google, Outlook) or automated reminder emails beyond simple notifications.
- Implementing Vivino API calls; only the groundwork for future integration is required.
- Supporting professional sommelier or large public event workflows (focus is casual groups).
- Providing data export (CSV) or advanced analytics in the initial release.

## 6. Design Considerations
- Use ShadCN component library styled with Tailwind CSS; follow a minimal, modern aesthetic with a soft palette inspired by wine tones.
- Prioritize mobile-first layouts so guests can respond quickly via phones; ensure responsive components for polls, forms, and recap cards.
- Apply Lucide icons to reinforce status (e.g., duplicate alerts, confirmed availability) and Framer Motion micro-animations for on-hover/on-submit states.
- Include inline validation and progress indicators to keep the lightweight, friendly tone for non-technical users.

## 7. Technical Considerations
- Build on Next.js App Router to leverage server actions and API routes for poll submissions and wine management.
- Configure Prisma with Vercel Postgres; define models for Event, TimeOption, Invitee, WineContribution, Rating, and DuplicateFlag metadata.
- Store guest participation tokens as signed URLs or unique IDs embedded in invite links to avoid explicit authentication.
- Plan modular data access layer to abstract future Vivino integration (e.g., wine reference table storing Vivino IDs, placeholder service methods).
- Ensure optimistic UI updates for poll responses using React Query or Next.js server actions combined with Framer Motion feedback.
- Prepare feature flags or environment-driven toggles so Vivino integration can be turned on later without code changes to core flows.

## 8. Success Metrics
- ≥80% of invited guests complete the poll and log a wine within 48 hours of invite.
- 0 duplicate varietal/vintage conflicts go unresolved before the event (duplicate alerts acted upon).
- ≥70% of attendees submit post-event ratings within 3 days of the tasting.
- Host satisfaction collected via follow-up survey averages ≥4/5.

## 9. Open Questions
- What notification channel (email service, SMS, in-app) should be used for invite and finalization messages? Email. 
- Should hosts be able to lock certain time slots or participant caps per event? yes participant cap - max 8 people per event. 
- Are there compliance or legal considerations for storing tasting notes that reference alcohol for specific regions? No
- What level of moderation or edit control should hosts have over guest-submitted tasting notes post-event?n none. 
