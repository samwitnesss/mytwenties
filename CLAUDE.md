# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build (runs tsc + next build)
npm run lint       # eslint
npx tsc --noEmit   # type-check only, no output — run this after any changes
```

No test suite exists. Verify changes with `npx tsc --noEmit` before committing.

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Supabase · Anthropic Claude API · Stripe · Recharts

### User flow
```
/ (landing) → /start (collect name/email, create user) → /begin (age gate)
→ /assessment (75 questions, 8 sections) → /generating (calls Claude, polls status)
→ /report/ready/[id] (interstitial) → /report/[id] (free report + $29 upsell)
→ /login (returning users, lookup by email)
```

### Data model (Supabase)
- `mytwenties_users` — id, first_name, email
- `mytwenties_responses` — user_id, question_id, response_type, response_value
- `mytwenties_reports` — id, user_id, report_data (jsonb), status ('pending'|'ready'), report_type ('free'|'paid')

User identity is stored in `localStorage` only (`mt_user_id`, `mt_first_name`, `mt_email`). There is no auth session — users are looked up by email on `/login`.

### Report generation (`app/api/reports/generate/route.ts`)
- Reads all responses for a user, formats them by section, sends to `claude-sonnet-4-6` with an 8000-token limit
- Returns a large JSON object matching a strict schema (archetypes, strengths, blind spots, directions, dream day, premium sections, etc.)
- Strips markdown fences before `JSON.parse()` — wrapped in try/catch
- `maxDuration = 300` (Vercel Pro limit for serverless)
- On success, inserts into `mytwenties_reports` with `status: 'ready'`, `report_type: 'free'`

### Styling conventions
- **All styles are inline** — no Tailwind classes used at runtime except `.gradient-btn` and `.gradient-text` (defined in `globals.css`)
- Color palette: `#2563eb → #06b6d4` (blue-to-teal gradient), `#0f172a` text, `#ffffff` backgrounds
- No CSS modules, no component library
- Responsive sizing uses `clamp()` for font sizes; mobile-specific logic uses a `useIsMobile()` pattern or conditional inline values

### Supabase clients
- `createClient()` — cookie-based SSR client for server components/routes that need auth context
- `createAdminClient()` — service role client for all DB writes in API routes (bypasses RLS)

### Stripe flow
- `/api/checkout` creates a Checkout Session with `metadata: { reportId, userId }` and `allow_promotion_codes: true`
- `/api/checkout/success` retrieves the session and updates `report_type → 'paid'` in Supabase
- `/api/webhooks/stripe` handles `checkout.session.completed` as a reliability backup
- No subscription — one-time payment only

### Assessment questions (`lib/questions.ts`)
- Questions are defined in `SECTIONS` — 8 sections, 75 questions total
- Question types: `scale` (1–5), `multiselect`, `text`, `select`
- `q66` has a hardcoded dependency on `q65` (dynamic options)
- The `QUESTION_MAP` in the generate route builds a flat lookup from SECTIONS for prompt formatting
