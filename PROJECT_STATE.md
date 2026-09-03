# Project State

## Project Summary

AlgoDeck is a local-first DSA practice workstation: Node.js/Express backend (CommonJS, no build step) serving static HTML/CSS/JS with vendored Monaco, marked, and DOMPurify. It runs Python 3 and JavaScript in a subprocess sandbox, schedules reviews via SuperMemo-2 + ELO, and persists to PostgreSQL or JSON fallback. Catalog: 75 problems (150 twin Python/JS solutions) across 19 patterns.

## Current Development Phase

**Phase 1 (Hardening, Nudges, Tracker, Modular Refactor) is COMPLETE.** Every item in the T-101→T-110 matrix in `docs/MASTER_ROADMAP_AND_ARCHITECTURE.md` is verified implemented (due-filter toggle, brand titles, route aliases, AbortController, `solutionEditor.setValue("")`, due-pill + 24h snooze, `?mode=daily_deck`, `assistance_level` enum, scratch sweep, `starterHash`, `server/lib/*` split).

Next documented phases: **Phase 2** (polyglot gVisor/Cgroups sandboxing, C++/Java/Go/Rust), **Phase 3** (curriculum 75→150+), **Phase 4** (multi-tenant JWT + guest UUID, CI/CD, Caddy SSL, analytics). See the three `docs/*` roadmap files.

## Active Milestone

**Platform-Wide Mobile Overhaul & High-Contrast Light Mode is COMPLETE** (Commits `eef4782` & `1af29c0`, 2026-08-26):
- **Home Page (`index.html`)**: Developer avatar rotator stacked centered above full-width bio on mobile; clean vertical stacked footer; high-contrast light mode typography; disabled spotlight radial shader on touchscreens.
- **Documentation (`docs.html`)**: Responsive horizontal swipeable chip selector for docs; comfortable mobile text/table rendering.
- **Roadmap (`roadmap.html`)**: Responsive complexity matrix and curriculum progression on mobile viewports.
- **Playground (`playground.html`)**: Mobile study & SM-2 review mode with slide-out drawer problem catalog, full-width problem statement, reference solutions, and touch grading.
- **Dashboard (`dashboard.html`)**: High-density hero metrics + swipeable chips + responsive single-column cards.

## Current Status

- `npm test`: 150/150 solutions + content + security suites pass (100% green).
- Local: `npm start` / `npm run dev` = `node server/server.js` on :3000. Docker: `docker compose up -d --build` on :3095.
- Working tree clean; `AGENTS.md`, `PROJECT_STATE.md`, and `SESSION_HANDOFF.md` are tracked on `master`.

## Architecture References

- `ARCHITECTURE.md` — Authoritative system architecture, component deep-dives, and trade-offs specification.
- `TASKS.md` — Master operational task matrix, active workstreams, and roadmap from Phase 1 to Phase 4.
- `AGENTS.md` — commands, gotchas, problem-adding contract, security-audit constraints (read first).
- `server/lib/parser.js` — boilerplate extraction (strips test blocks, wraps top-level py funcs in `class Solution:`); `sandbox.js` (5s/512KB, `server/scratch/_temp_run_*`); `security.js` (rate limit 30/min, scratch sweep).
- `public/tracker.json` + `server/descriptions.json` + `content/` — the 3 data stores that must stay in sync.

## Core Constraints

- No linter, typecheck, CI, or build step. CommonJS + static assets, aggressive no-cache headers (except `/vendor`).
- `tests/security_tests.py` greps page source for exact strings (`problem_id: problem.id`, `checkbox.checked = isCurrentlySolved`, `ALLOWED_DOCS`, `/vendor/monaco-editor/vs/loader.js`, zero Monaco CDN). Renaming breaks the suite. FontAwesome from cdnjs is allowed.
- Solution files must be standalone-runnable, assert-only, and match the parser format contract (docstring → helper classes `ListNode`/`TreeNode`/`TrieNode` → functions → `# Test Cases` / `if __name__ == "__main__"` or `// Test Cases` / `if (require.main === module)`).
- `safeResolveContentPath` allows only real `.py`/`.js` inside `content/`.

## Implemented Features

All Phase 1 items (T-101→T-110, verified in code): due-filter toggle, `AlgoDeck | <Page>` titles, clean route aliases, AbortController fetch cancellation, stale-solution guard, navbar due-pill + 24h snooze, `?mode=daily_deck` review queue, `assistance_level` (`CLEAN`/`HINT_USED`/`SOLUTION_REVEALED`) + 5-tier activity matrix, starter-hash draft versioning, scratch cleanup, modular `server/lib/*`. Also: 75-problem catalog, dual exec sandbox, SM-2/ELO engines, collapsed 50px activity rail, 15-avatar profile loop, no-cache headers, vendored Monaco/marked/DOMPurify.

## Features In Progress

None. Phase 1 and the UI/mobile responsiveness overhaul are 100% complete. Ready for Phase 2 or Cloud Deployment.

## Pending Features

- **Phase 2 (Active Next)**: Polyglot runners (C++, Java, Go, Rust in `sandbox.js`), AST parser expansion for polyglot starter stubs in `parser.js`, Linux Cgroups/gVisor container resource quotas.
- **Phase 3**: Expand curriculum from 75 to 100–150 problems across 19 patterns with twin solutions and structured descriptions.
- **Phase 4**: Cloud deployment (Render + Supabase Postgres), JWT + guest UUID auth, CI/CD pipeline, and Caddy SSL.

## Recently Modified Areas

- `ARCHITECTURE.md` and `TASKS.md` created and committed to root.
- Terminal console text alignment fixed (`playground.html`).
- Platform-wide mobile responsiveness across `index.html`, `dashboard.html`, `playground.html`, `docs.html`, and `roadmap.html`.
- High-contrast light mode typography and card styling.
- Compact hero metrics bar and consolidated filter toolbar (`dashboard.html`).

## Technical Debt

- `server/descriptions.json` has orphan key `01-16` not present in `tracker.json` (76 vs 75) — stale removed-problem entry.
- `docker-compose.yml` has **no postgres service** and requires an external `homelab` network; README claims "App + PostgreSQL" — mismatch.
- `public/dsa-roadmap.png` ~20MB committed.
- README's "100% offline" claim conflicts with cdnjs FontAwesome dependency.
- `db_tests.py` relies on hardcoded default PG credentials when env vars are absent.

## Open Decisions for User

1. **Next Major Step**: Begin **Phase 2 (Polyglot C++ Runner & Parser)**, or prepare **Cloud Deployment (Render + Supabase)** so you can showcase AlgoDeck on your portfolio/resume immediately?
2. Clean up orphan key `01-16` in `server/descriptions.json` to keep catalog count perfectly aligned at 75?

## Next Recommended Tasks

1. **Phase 2 Spike (T-201)**: Implement C++ compilation & execution pipeline (`g++ -O3`) in `server/lib/sandbox.js` and starter boilerplate extractor in `server/lib/parser.js`.
2. **Cloud Deployment Blueprint**: Provision Render Web Service Docker container + free Supabase PostgreSQL database to get a live portfolio HTTPS link.
3. **Phase 3 Expansion (T-301)**: Expand catalog from 75 to 100+ problems starting with Arrays & Hashing (Top K Frequent, Product of Array Except Self).
