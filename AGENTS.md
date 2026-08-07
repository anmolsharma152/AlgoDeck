# AGENTS.md

AlgoDeck: local-first DSA practice / spaced-repetition app. Express backend + Monaco static frontend + 75 problem solutions (Python & JS) + Python test harness. No build step, no lint/typecheck config, no CI, single `master` branch.

## Commands

- `npm install` — only deps are `express`, `cors`, `pg`.
- `npm start` — runs `node server/server.js`; port **3000 is hardcoded** (ignore `PORT` env).
- `npm test` — runs `python3 tests/run_all_tests.py`.
- Focused checks (no server needed): `python3 tests/content_tests.py`; per-topic solution run: `python3 content/test_runner.py 01-arrays-and-hashing`.
- `python3 start.py` — starts server and opens a browser.
- `docker compose up -d --build` requires an **external `homelab` Docker network** (`networks.homelab.external: true`) — fails on machines that don't have it.

## Critical gotchas

- **`npm test` needs a running server.** `tests/security_tests.py` hits a live `http://localhost:3000` (path traversal, 5s timeout, rate limit). Start the server first; otherwise the security suite fails.
- **The rate-limit test poisons the server**: `/api/run` is limited to 30 req/min/IP in-memory, and the test fires 40. After running `npm test`, `POST /api/run` from localhost is throttled ~1 min.
- **Postgres is optional.** `server/db.js` only uses Postgres when `DATABASE_URL` or `POSTGRES_HOST` is set; otherwise it silently falls back to `server/progress.json`. Default local dev runs JSON-only.
- Runtime submission files go to `server/scratch/` (gitignored). Do not commit scratch output.

## Adding a problem (content pipeline)

Each problem needs exactly three coordinated changes, or `npm test` fails:

1. `content/<NN>-<slug>/<snake_case>.py` and `.js` — solution pair.
2. Entry in `public/tracker.json` (id `NN-NN`, `title`, `level` 1–5, `difficulty`, `platform`, urls, `pythonPath`, `jsPath`).
3. HTML description in `server/descriptions.json` keyed by id — must be ≥150 chars and contain `Example 1:` or `Input:` **and** `Constraints:` (enforced by `tests/content_tests.py`).

## Solution file format (do not change the pattern)

Each `.py`/`.js` is a **standalone runnable program**: function/class signature at top, assertions at bottom under `if __name__ == "__main__"` (Python) or `require.main === module` (JS). `content/test_runner.py` executes each file directly with `python3`/`node`; exit 0 passes, JS also fails on `Assertion failed` in stderr. Files prefixed `_` are skipped.

`server.js` `/api/boilerplate` regenerates starter code with heuristic extractors (`extractPythonBoilerplate`/`extractJsBoilerplate`) that strip test blocks by indentation — keep signatures clean and top-level (4-space method / 0-space function/class), or boilerplate generation breaks.

## Layout

- `public/` — static HTML/JS/CSS (Monaco via CDN), no build tooling. Pages: `index.html`, `dashboard.html`, `editor.html`, `roadmap.html`, `docs.html`; route fallbacks exist for `/`, `/dashboard`, `/docs`.
- `server/server.js` — Express app + `/api/problems`, `/api/boilerplate`, `/api/solution`, `/api/run` (sandboxed subprocess: 5s timeout, 512KB buffer), `/api/submit` (SM-2 + ELO).
- `server/db.js` — Postgres pool with auto-migrations, else JSON fallback.
- `content/` — 19 topic dirs (`NN-slug`) with `CONCEPT.md` + problem pairs; `content/ROADMAP.md`, `GEEKSFORGEEKS_BENCHMARKS.md` are plans, not generated docs.
- `tests/` — plain Python scripts; `run_all_tests.py` aggregates the three suites.
