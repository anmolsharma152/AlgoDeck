# Project State

## Project Summary

AlgoDeck is a local-first DSA practice workstation: Node.js/Express backend (CommonJS, no build step) serving static HTML/CSS/JS with vendored Monaco, marked, and DOMPurify. It runs Python 3 and JavaScript in a subprocess sandbox, schedules reviews via SuperMemo-2 + ELO, and persists to PostgreSQL or JSON fallback. Catalog: 75 problems (150 twin Python/JS solutions) across 19 patterns.

## Current Development Phase

**Phase 1 (Hardening, Nudges, Tracker, Modular Refactor) is COMPLETE.** Every item in the T-101→T-110 matrix in `docs/MASTER_ROADMAP_AND_ARCHITECTURE.md` is verified implemented (due-filter toggle, brand titles, route aliases, AbortController, `solutionEditor.setValue("")`, due-pill + 24h snooze, `?mode=daily_deck`, `assistance_level` enum, scratch sweep, `starterHash`, `server/lib/*` split).

Next documented phases: **Phase 2** (polyglot gVisor/Cgroups sandboxing, C++/Java/Go/Rust), **Phase 3** (curriculum 75→150+), **Phase 4** (multi-tenant JWT + guest UUID, CI/CD, Caddy SSL, analytics). See the three `docs/*` roadmap files.

## Active Milestone

UI polish era (sidebar mini-rail, avatar loop, dashboard indicators) wrapped at commit `9a2241c` (2026-08-14). The next agreed-but-unstarted work is a **dashboard redesign** (denser progress/ELO header, consolidated search+filters, tighter cards). No code changes since 2026-08-14.

## Current Status

- `npm test`: 150/150 solutions + content + security suites pass (requires `npm install` first — `pg` missing breaks `tests/db_tests.py`).
- Local: `npm start` / `npm run dev` = `node server/server.js` on :3000. Docker: `docker compose up -d --build` on :3095.
- Working tree clean; `AGENTS.md` is present but untracked.

## Architecture References

- `AGENTS.md` — commands, gotchas, problem-adding contract, security-audit constraints (read first).
- `server/lib/parser.js` — boilerplate extraction (strips test blocks, wraps top-level py funcs in `class Solution:`); `sandbox.js` (5s/512KB, `server/scratch/_temp_run_*`); `security.js` (rate limit 30/min, scratch sweep).
- `docs/architecture.md` — SM-2/ELO math, schema, sandbox design.
- `docs/MASTER_ROADMAP_AND_ARCHITECTURE.md` — phase roadmap + task matrix.
- `public/tracker.json` + `server/descriptions.json` + `content/` — the 3 data stores that must stay in sync.

## Core Constraints

- No linter, typecheck, CI, or build step. CommonJS + static assets, aggressive no-cache headers (except `/vendor`).
- `tests/security_tests.py` greps page source for exact strings (`problem_id: problem.id`, `checkbox.checked = isCurrentlySolved`, `ALLOWED_DOCS`, `/vendor/monaco-editor/vs/loader.js`, zero Monaco CDN). Renaming breaks the suite. FontAwesome from cdnjs is allowed.
- Solution files must be standalone-runnable, assert-only, and match the parser format contract (docstring → helper classes `ListNode`/`TreeNode`/`TrieNode` → functions → `# Test Cases` / `if __name__ == "__main__"` or `// Test Cases` / `if (require.main === module)`).
- `safeResolveContentPath` allows only real `.py`/`.js` inside `content/`.

## Implemented Features

All Phase 1 items (T-101→T-110, verified in code): due-filter toggle, `AlgoDeck | <Page>` titles, clean route aliases, AbortController fetch cancellation, stale-solution guard, navbar due-pill + 24h snooze, `?mode=daily_deck` review queue, `assistance_level` (`CLEAN`/`HINT_USED`/`SOLUTION_REVEALED`) + 5-tier activity matrix, starter-hash draft versioning, scratch cleanup, modular `server/lib/*`. Also: 75-problem catalog, dual exec sandbox, SM-2/ELO engines, collapsed 50px activity rail, 15-avatar profile loop, no-cache headers, vendored Monaco/marked/DOMPurify.

## Features In Progress

None code-wise. In design discussion: **dashboard redesign** (agreed next UI work); **scoped mobile review mode** (recommended: review-only, defer until SaaS); **desktop engagement engines** (recommended: adaptive next-problem queue + focus sessions).

## Pending Features

Phase 2: polyglot runners (C++/Java/Go/Rust), parser extension for foreign signatures, gVisor/Cgroups isolation (`--network none`, RAM/CPU/PID caps). Phase 3: expand to 100–150 problems with twin multi-language solutions. Phase 4: JWT + guest UUID auth, CI/CD, Caddy SSL, `/api/health` + `/api/metrics`, OpenAPI docs, GitHub-style heatmaps, leaderboards, execution timing/"beats %", Tauri/Electron desktop wrapper.

## Recently Modified Areas

Sidebar collapsed activity rail + spacing (`playground.html`), avatar consolidation to `/public/images/` + rotation loop (`index.html`), dashboard status indicators + matrix filters (`dashboard.html`), DP pattern title shortening, light-mode indicators (`global.css`), no-cache headers (`server.js`), draft-version bump 3.5.

## Technical Debt

- `server/descriptions.json` has orphan key `01-16` not present in `tracker.json` (76 vs 75) — stale removed-problem entry.
- `docker-compose.yml` has **no postgres service** and requires an external `homelab` network; README claims "App + PostgreSQL" — mismatch.
- `public/dsa-roadmap.png` ~20MB committed.
- README's "100% offline" claim conflicts with cdnjs FontAwesome dependency.
- `db_tests.py` relies on hardcoded default PG credentials when env vars are absent.
- `AGENTS.md` untracked (add it in the next commit).

## Open Questions

1. Execute dashboard redesign first, or begin Phase 2/3 expansion?
2. Was `01-16` intentionally removed from the catalog?
3. Scope of mobile support (recommended: review-only, post-SaaS)?

## Next Three Recommended Tasks

1. Dashboard redesign — condense ELO/stats into a 1-row header, merge search + filters into one control bar, tighten cards.
2. Phase 2 spike — add one foreign runner (e.g. C++) to `sandbox.js` + parser boilerplate extraction, gated behind language availability.
3. Phase 3 — expand catalog toward 100 problems (NeetCode 150 subset) keeping tracker/descriptions/solution-file sync + content tests green.
