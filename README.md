# QuickBid CRM Sales Panel

Internal sales and communications dashboard for **QuickBid**, the tender and bid management platform. It is a
Next.js (App Router) front end that the sales team uses to work leads, demo and callback requests, the platform
waitlist, enterprise subscription requests, email campaigns (including GeM reseller and MSME outreach) and WhatsApp
conversations.

It is a **front end only**: the browser calls the QuickBid backend API; there are no API route handlers, database
schemas or server models here. Several screens are still prototypes running on sample data (marked below).

## Modules

Navigation is defined in [`src/components/layout/DashboardLayout.tsx`](src/components/layout/DashboardLayout.tsx);
menu items are filtered by the signed-in user's roles (`Administrator`, `sales`, `demonstrator`, `manager`).

| Route | What it does | Data source |
| --- | --- | --- |
| `/` | Redirects to `/dashboard` | n/a |
| `/login` | Email/password sign-in | Backend `/auth/login` |
| `/dashboard` | KPI cards, mini charts, recent activity feed | Waitlist count from the waitlist API; other figures are sample data |
| `/leads`, `/leads/[id]` | Lead list with status tabs, filters and assignment; lead detail with activity timeline, tags, states, requirements, tender count | Backend `/leads` |
| `/enterprise-dashboard` | Enterprise subscription requests: list, detail, status updates and history | Sample data in the page |
| `/enterprise-request` | Enterprise subscription request form | Submission is simulated (logged to console) |
| `/demo-requests`, `/demo-requests/[id]` | Product demo requests; notes, follow-ups, meeting links, completion | Backend `/api/demos`, `/api/demo-activities` |
| `/callback-requests`, `/callback-requests/[id]` | Callback requests and assignment to team members | Sample data |
| `/expert-consultation` | Expert consultation requests | Sample data |
| `/appointments` | Calendar and list of calls, demos and meetings | In-memory state |
| `/waitlist` | QuickBid platform waitlist | Waitlist API; falls back to sample data on error |
| `/communications/mailbox` | Mail client: SMTP/IMAP accounts (Gmail/Outlook presets), folders, tags, attachments, search | Backend `/email/...` |
| `/email-marketing` | Bulk email composer (TipTap editor), built-in templates, GeM/MSME recipient batches, attachments, Sent Emails tab | Backend `/marketing/email/...` |
| `/whatsapp-messaging` | WhatsApp contacts, chat history, text and template messages, webhook test/status | Backend `/whatsapp/...` |
| `/settings` | Tabs: User Management (users, roles, permissions), System, Email & Notifications (templates), Resources | Backend `/users`, `/roles`, `/marketing/templates`; System toggles are local state |
| `/admin/settings/resources` | Sales resource library with category/type/use-case filters | Sample data |
| `/notifications` | Notification centre with sound alerts and a test form | Browser `localStorage` |
| `/users`, `/auth-status` | User list; auth token diagnostics (cookie / `localStorage`) with a test API call | Backend `/users` |
| `/analytics`, `/team` | Team performance, lead source and monthly trend charts; sales team overview | Sample data |

`/users`, `/auth-status`, `/analytics`, `/team`, `/enterprise-request` and `/admin/settings/resources` are not in
the menu; open them by URL (the resource library is linked from Settings > Resources).

## Tech stack

Versions are the ranges declared in [`package.json`](package.json).

| Area | Packages |
| --- | --- |
| Framework | Next.js `15.2.4` (App Router, Turbopack in dev), React `^19.0.0`, TypeScript `^5.8.3` |
| UI | MUI `@mui/material ^6.4.12`, `@mui/icons-material ^7.1.1`, `@mui/x-date-pickers ^8.5.1`, Emotion `^11` |
| Styling | Tailwind CSS `^4` via `@tailwindcss/postcss` (imported in `src/app/globals.css`), MUI theme in `src/theme.ts` / `src/app/theme.tsx` |
| Charts, motion, toasts | Recharts `^2.15.1`, Framer Motion `^12.6.3`, react-hot-toast `^2.5.2` |
| Rich text | TipTap `^2.12` (`@tiptap/react`, starter kit, link, image, color, alignment and other extensions) |
| HTTP / state | Axios `^1.9.0`, `js-cookie ^3.0.5`, React Context (`AuthContext`, `NotificationContext`) |
| Dates | dayjs `^1.11.13`, date-fns `^4.1.0` |
| Tooling | ESLint `^9` with `eslint-config-next 15.2.4` |

`package.json` also lists packages not imported anywhere under `src/`, e.g. `@prisma/client`, `mongoose`, `express`,
`next-auth`, `googleapis`, `@azure/communication-email`, `antd`, `@tanstack/react-query`, `react-hook-form`, `zod`.

## Prerequisites

- Node.js 18.18 or newer (required by Next.js 15; `@types/node` targets 20, the Dockerfile uses `node:latest`)
- npm (both `package-lock.json` and `yarn.lock` are committed; the Dockerfile uses npm)
- Network access to the QuickBid backend API
- Optional: Python 3 with `pandas` and `openpyxl`, only for the GeM data scripts

## Getting started

```bash
git clone https://github.com/VIKAS-SOFTFIX/quickbid-crm.git
cd quickbid-crm
npm install                 # add --legacy-peer-deps if npm reports peer conflicts (the Dockerfile does)
# create .env.local (see below); there is no .env.example in the repo
npm run dev                 # http://localhost:3000

# production
npm run build               # next build --no-lint
npm start                   # next start, port 3000 unless PORT is set
```

Sign in at `/login` with an account that exists in the QuickBid backend. The token is stored in `localStorage`
and copied to an `auth_token` cookie by the API helpers.

## Environment variables

Define these in `.env.local` (all `.env*` files are git-ignored). Next.js exposes only `NEXT_PUBLIC_*` variables
to browser code, and most of this app runs in the browser.

| Variable | Purpose | Used in |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the QuickBid support API (defaults to `https://api.quickbid.co.in/support/api`) | `src/services/apiClient.ts`, `emailTemplateService.ts`, `whatsappService.ts` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the waitlist endpoint `/qb/users/v1/waitlist` | `src/services/waitlistService.ts` |
| `NEXT_PUBLIC_WEB_SIGNUP_URL` | Redirect target when the waitlist API returns 401 | `src/services/waitlistService.ts` |
| `ENCRYPTION_KEY` | AES-256 key used to decrypt encrypted waitlist responses | `src/services/EncryptionConfigManager.ts` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google OAuth settings (Analytics scopes) | `src/config/api.ts` |
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI`, `LINKEDIN_ACCESS_TOKEN` | LinkedIn API settings | `src/config/api.ts` |

Not every module reads `NEXT_PUBLIC_API_URL`: `src/lib/api.ts` (users, roles, leads), `src/services/apiService.ts`
and `src/hooks/useDemoDetail.ts` (demos), `src/contexts/AuthContext.tsx` (login), `src/components/AuthStatus.tsx`
and the mailbox's `services/emailApi.ts` use a fixed backend URL.

## npm scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev --turbopack` | Development server with Turbopack |
| `build` | `next build --no-lint` | Production build (ESLint skipped) |
| `start` | `next start` | Serve the production build |
| `lint` | `next lint` | Run ESLint (`next/core-web-vitals`, `next/typescript`) |

## Project structure

```
.
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Login page
│   │   ├── (dashboard)/           # All dashboard routes (see Modules) + layout.tsx
│   │   │   ├── communications/mailbox/  # Mail client: components/, hooks/, services/emailApi.ts, types.ts
│   │   │   ├── email-marketing/   # Composer, sent-emails.tsx, templates/, gem-mock-data.ts
│   │   │   └── settings/components/     # User management, system, email templates, resources tabs
│   │   └── layout.tsx             # Root layout (MUI theme + Providers; document.tsx = Emotion registry)
│   ├── components/                # DashboardLayout, enterprise/*, AppointmentCalendar, UsersList, providers
│   ├── config/api.ts              # Google, Meta / WhatsApp Business and LinkedIn settings (API_CONFIG)
│   ├── contexts/                  # AuthContext (login, roles), NotificationContext (toasts, sounds)
│   ├── hooks/                     # useEmailMarketing, useEmailTemplates, useWhatsApp, useDemoDetail, ...
│   ├── lib/api.ts                 # Users, roles, permissions, leads and lead activities API
│   ├── services/                  # Axios clients and per-domain services (demo, waitlist, whatsapp, email)
│   ├── types/lead.ts              # Lead-related types
│   └── middleware.ts              # Route matcher (auth redirect is currently commented out)
├── public/sounds/                 # Notification sounds (+ public/sound-test.html)
├── *.py, GeM_Resellers.xlsx       # GeM / MSME data scripts and their source spreadsheet
├── Dockerfile                     # Multi-stage container build
└── azure-pipelines.prod.yml       # Azure DevOps build and deploy pipeline
```

## API routes

There is no `src/app/api` directory, so the app defines **no Next.js route handlers**. It consumes these backend
endpoints (relative to the support API base unless noted):

| Area | Endpoints | Client code |
| --- | --- | --- |
| Auth | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` | `contexts/AuthContext.tsx`, `services/authService.ts` |
| Users and roles | `/users`, `/users/:id`, `/roles`, `/roles/:id`, `/roles/permissions`, `/roles/:id/permissions` | `lib/api.ts` |
| Leads | `/leads`, `/leads/:id`, `/leads/counts`, `/leads/:id/activities`, `/leads/activities`, `/leads/schedule-activity` | `lib/api.ts` |
| Demos | `/api/demos`, `/api/demos/:id`, `/api/demo-activities/`, `/api/demo-activities/demo/:demoId` (under `/support`) | `services/demoService.ts`, `demoActivityService.ts` |
| Email marketing | `/marketing/email/send`, `/marketing/email/test`, `/marketing/email/sent`, `/marketing/templates[/:id]` | `services/emailMarketingService.ts`, `emailTemplateService.ts` |
| Mailbox | `/email/accounts[/:id]`, `/email/:accountId/messages`, `/email/:accountId/folders`, `/email/tags`, `/email/:accountId/search` | `communications/mailbox/services/emailApi.ts` |
| WhatsApp | `/whatsapp/send`, `/whatsapp/send-template`, `/whatsapp/templates`, `/whatsapp/contacts[/:waId/messages]`, `/whatsapp/webhook/test`, `/whatsapp/webhook/status` | `services/whatsappService.ts` |
| Waitlist | `GET /qb/users/v1/waitlist` on `NEXT_PUBLIC_API_BASE_URL` (responses may be AES-256-CBC encrypted) | `services/waitlistService.ts` |

## Data models

There is no Prisma schema and there are no Mongoose models in this repository. Data shapes exist only as
TypeScript interfaces for API payloads: `LeadData` / `LeadActivityData` (`src/lib/api.ts`), `Lead`, `Activity`,
`LeadNote` (`src/types/lead.ts`), `DemoRequest` / `DemoActivity` (`src/services/demo*.ts`), `WhatsAppContact` /
`WhatsAppMessage` / `WhatsAppTemplate` (`whatsappService.ts`), `EmailTemplate` (`emailTemplateService.ts`),
`EmailAccount` / `Email` / `Folder` / `Tag` (mailbox `types.ts`), `EnterpriseRequestData`
(`components/enterprise/EnterpriseRequestForm.tsx`) and `AppUser` (`contexts/AuthContext.tsx`).

## External integrations

- **Email marketing**: the composer sends through the backend's `/marketing/email/*` endpoints. Recipients can be
  picked from GeM reseller batches or MSME test addresses in `gem-mock-data.ts`; built-in templates live in
  `email-marketing/templates/index.ts`. Azure Communication Services setup: [README-EMAIL-SETUP.md](README-EMAIL-SETUP.md).
- **Mailbox**: users add SMTP/IMAP accounts (Gmail and Outlook server presets) and read/send mail via the
  backend's `/email/*` endpoints.
- **WhatsApp (Meta)**: the messaging page talks only to the backend's `/whatsapp/*` endpoints. Meta and webhook
  setup: [README-WHATSAPP-SETUP.md](README-WHATSAPP-SETUP.md). Note that the `/api/webhook/whatsapp` route and the
  Meta/Azure variables named in the two setup guides are not referenced in this repository's code.
- **Google, Meta and LinkedIn settings**: `API_CONFIG` in `src/config/api.ts` groups Google OAuth (Analytics
  scopes), Meta / WhatsApp Business and LinkedIn settings. It is not imported by any module yet.

## Python data scripts

Run from the repository root (paths are relative to it). Background notes:
[gem-implementation-summary.md](gem-implementation-summary.md), [gem_batches_summary.md](gem_batches_summary.md).

| Script | What it does |
| --- | --- |
| [`read_gem_data.py`](read_gem_data.py) | Prints columns, first rows and row count of `GeM_Resellers.xlsx` |
| [`analyze_gem_excel.py`](analyze_gem_excel.py) | Analyses company names and email domains in the spreadsheet and prints candidate batch criteria |
| [`generate_gem_mock_data.py`](generate_gem_mock_data.py) | Builds states, categories, districts, products and a 100-email batch; **overwrites** `gem-mock-data.ts` |
| [`create_excel_based_batches.py`](create_excel_based_batches.py) | Segments valid emails by company type and email domain into batches; **overwrites** `gem-mock-data.ts` (the committed file has 5 batches from this script) |
| [`gem_data_summary.py`](gem_data_summary.py) | Reads `gem-mock-data.ts` and prints a summary and preview |
| [`update_msme_emails.py`](update_msme_emails.py) | Replaces `MSME_TEST_EMAILS` in `gem-mock-data.ts` with the address set at the bottom of the script |

## Docker and deployment

- **[`Dockerfile`](Dockerfile)**: two-stage build on `node:latest`; runs `npm install --legacy-peer-deps` and
  `npm run build`, exposes port `4101` and starts with `npm start`.
- **[`azure-pipelines.prod.yml`](azure-pipelines.prod.yml)**: builds the image, pushes it to Azure Container
  Registry, then deploys over SSH to two VMs in sequence (Docker/disk check, then `docker run` mapping host port
  3000 to container port 4101). Registry credentials come from a pipeline variable group.

Things to verify before relying on the container:
- `next start` listens on 3000 unless `PORT` is set, while the image exposes 4101; set `PORT=4101` or align ports.
- The builder uses `/usr/src/app/crm`, the production stage `/usr/src/app`; check `npm start` finds `package.json`.
- The pipeline triggers on `main`; this repository's branch is `master`.

## Testing

There are no automated tests (no test files, test framework or `test` script). `npm run lint` is the only check,
and `npm run build` skips it.

## Notes for developers

- **Auth**: `src/middleware.ts` matches all page routes, but its redirect-to-login logic is commented out. The
  dashboard layout hides menu items by role; it does not block direct URLs.
- **Token handling**: `src/lib/api.ts` builds its `Authorization` header from `localStorage` when the module is
  first loaded; if lead/user calls return 401 right after signing in, reload the page. `/auth-status` helps debug.
- **Sample data**: pages marked as sample, simulated or in-memory above (enterprise, callbacks, consultations,
  team, analytics, resources, appointments) are not wired to the backend yet.
- **Unused code**: `components/layout/Sidebar.tsx` holds an older copy of the menu (the live one is in
  `DashboardLayout.tsx`); `ApiDebugger.tsx`, `WaitlistSummary.tsx`, `hooks/useLeads.ts`, `hooks/useAuth.ts` and
  `services/enterpriseService.ts` are not used by any page.
- **Next config**: both `next.config.js` (allows remote images from `images.unsplash.com`) and an empty
  `next.config.ts` exist; keep a single config file.
- **Secrets**: keep credentials in environment variables (`.env.local`) rather than in source files.
- **License**: no LICENSE file is included; `package.json` declares `"license": "ISC"`.
