# Expense Tracker

**Live:** https://dsh410.github.io · **Stack:** React · TypeScript · RTK Query · Supabase

A personal finance tracker built to work with real data at real volume: CSV import,
a sortable and filterable transaction table over 10k+ rows, category budgeting, and
spending charts — with authentication, row-level data isolation, and full keyboard
operability.

<!--
  This README is read before the code. Every section below exists because it
  answers a question an interviewer will ask. Fill each one in as you finish the
  phase that produces it — not at the end.
-->

---

## What it does

- Email/password auth with protected routes and session persistence across refresh
- Per-user data isolation enforced at the database level (Postgres row-level security)
- CSV import with schema validation and per-row error reporting
- Transaction table: sorting, multi-filter, column resizing, virtualized to stay
  smooth past 10k rows
- Filter state synced to the URL, so any view is shareable and the back button works
- Category editing with optimistic updates and rollback on failure
- Spending charts with date-range filtering

---

## Running locally

```bash
git clone <repo-url>
cd expense-tracker
npm install
cp .env.example .env.local   # add your Supabase URL and anon key
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run test` | Vitest + React Testing Library |
| `npm run test:e2e` | Playwright |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

Only `VITE_`-prefixed variables reach the client bundle. The Supabase anon key is
safe to expose because access is enforced by row-level security policies, not by
key secrecy.

---

## Deployment

Hosted on GitHub Pages, deployed from `main` via GitHub Actions. Static hosting is
sufficient because Supabase handles auth and data directly from the client.

Static hosting does impose three constraints worth documenting, since none of them
are obvious and all three break silently:

**SPA routing.** Pages is a plain file server with no rewrite rules, so a direct
visit to `/transactions?category=food` would 404 — there's no file at that path.
The build copies `index.html` to `404.html`; Pages serves it for unknown paths while
preserving the URL, and React Router takes over from there. This preserves real
paths rather than falling back to `HashRouter`, which matters because shareable,
back-button-correct URLs are a deliberate part of this app's state model.

```json
"build": "tsc -b && vite build && cp dist/index.html dist/404.html"
```

**Base path.** Served from the domain root, so `base` stays `/`.
<!--
  If you move this to a project repo (dsh410.github.io/expense-tracker/), set
  base: '/expense-tracker/' in vite.config.ts and pass
  basename={import.meta.env.BASE_URL} to BrowserRouter. Assets 404 in production
  otherwise, while dev keeps working — an easy hour to lose.
-->


**Environment variables.** No runtime injection on static hosting, so Supabase
credentials are baked in at build time from GitHub Actions secrets
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). The workflow runs lint and tests
before building, so a failing test blocks the deploy.

The Pages origin is registered in Supabase's allowed redirect URLs, without which
email confirmation and password reset links redirect to localhost.

---

## Stack, and why

| Concern | Choice | Reasoning |
|---|---|---|
| Build | Vite | <!-- TODO --> |
| Language | TypeScript (`strict`) | <!-- TODO --> |
| Server state | RTK Query | <!-- TODO: why not React Query — answer this properly --> |
| Client state | Redux Toolkit slice | <!-- TODO: name what actually lives here --> |
| Backend | Supabase | <!-- TODO --> |
| Forms | React Hook Form + Zod | <!-- TODO: mention sharing the schema with the CSV importer --> |
| Table | TanStack Table + Virtual | <!-- TODO --> |
| Testing | Vitest + RTL + MSW | <!-- TODO --> |
| E2E | Playwright | <!-- TODO --> |
| Hosting | GitHub Pages + Actions | <!-- TODO: static hosting is enough because Supabase is the backend --> |

---

## Architecture

<!--
  Phase 9. A short diagram or bullet flow, then prose. Cover:
  UI components → RTK Query hooks → custom baseQuery → Supabase client → Postgres
-->

### Where state lives

The core decision in this app was placing each piece of state deliberately rather
than defaulting everything into the store.

| State | Lives in | Why |
|---|---|---|
| Transactions, categories, accounts | RTK Query cache | <!-- TODO --> |
| Active filters and date range | URL search params | <!-- TODO: shareable, back-button-correct --> |
| Form values | React Hook Form | <!-- TODO --> |
| UI preferences (density, theme) | RTK slice | <!-- TODO --> |

### The custom `baseQuery`

<!--
  Phase 5. RTK Query expects an HTTP-shaped fetch layer; Supabase gives you a
  client SDK. Explain the adapter you wrote, and how you mapped Supabase errors
  onto RTK Query's error shape.
-->

### Cache invalidation

<!--
  Phase 5. Name your tags, describe which mutations invalidate what, and explain
  the optimistic update on category edit including how rollback works.
  This is the single most likely follow-up question in an interview.
-->

---

## Accessibility

<!-- Phase 7. Do not write "it's accessible." Write what you did and what you tested with. -->

**Implemented**
- Semantic HTML first; ARIA only where a native element couldn't do the job
- Modal focus trap with focus returned to the trigger on close
- Skip link to main content
- Table headers correctly associated; sort state announced
- Live region for async status ("Transaction saved")
- Form errors tied to inputs via `aria-describedby`
- Visible focus indicators; contrast meets WCAG AA

**Tested with**
- Full session keyboard-only, no mouse
- <!-- TODO: VoiceOver or NVDA — say which, and on which flow -->
- axe DevTools

**Known gaps**
- <!-- TODO: be honest here. One or two real items reads better than a clean sweep. -->

---

## Testing

<!-- Phase 8. -->

- **Unit** — pure domain logic: totals, date-range filtering, currency formatting
- **Integration** — RTL against real component trees, MSW intercepting Supabase
  calls at the network layer. Tests assert on what a user sees, never on component
  internals.
- **Async edge cases** — loading, empty, error, and the race condition on rapid
  filter changes
- **E2E** — Playwright covering: sign up → add transaction → see it in list;
  CSV import; filter and share URL

Coverage: <!-- TODO -->

---

## Performance

<!-- Phase 9. Numbers, not adjectives. Measure before you optimize so you have a "before." -->

| Metric | Before | After |
|---|---|---|
| Bundle (gzipped) | <!-- TODO --> | <!-- TODO --> |
| LCP | <!-- TODO --> | <!-- TODO --> |
| INP | <!-- TODO --> | <!-- TODO --> |
| CLS | <!-- TODO --> | <!-- TODO --> |
| Lighthouse (perf) | <!-- TODO --> | <!-- TODO --> |

**What changed**
- Route-based code splitting with `React.lazy`
- Row virtualization on the transaction table
- <!-- TODO: the dependency you found in bundle analysis and removed -->
- <!-- TODO: the one interaction you profiled and fixed, and what the profiler showed -->

---

## Tradeoffs I'd revisit

<!--
  Phase 9, and the most-read section after the intro. Pick 2–3 real ones and be
  specific about the alternative. Vague self-criticism reads worse than none.
-->

1. **<!-- TODO -->** — what I did, why, and what I'd do with more time
2. **<!-- TODO -->**

---

## Roadmap

- [ ] Phase 0 — scaffold, Actions workflow, 404.html fallback, live on Pages
- [ ] Phase 1 — typed domain model and pure functions
- [ ] Phase 2 — static shell, responsive
- [ ] Phase 3 — interactive with local state
- [ ] Phase 4 — Supabase auth, RLS, protected routes
- [ ] Phase 5 — RTK Query, custom baseQuery, cache invalidation
- [ ] Phase 6 — CSV import, table, virtualization, URL state, charts
- [ ] Phase 7 — accessibility
- [ ] Phase 8 — RTL, MSW, Playwright
- [ ] Phase 9 — performance and this README