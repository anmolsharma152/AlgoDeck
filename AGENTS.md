# AGENTS.md

Local-first DSA practice app: Node.js Express backend (CommonJS, no build step) + static HTML/CSS/JS frontend (Monaco, marked, DOMPurify vendored locally) + Python test harness. No linter, typecheck, or CI in this repo.

## Commands

- `npm start` and `npm run dev` are identical (`node server/server.js`); no watcher.
- `npm test` runs `python3 tests/run_all_tests.py`. It probes ports 3095/3000 for a running server and otherwise starts a temp one on 3000. **Run `npm install` first** — with `pg` missing, `tests/db_tests.py` fails with `MODULE_NOT_FOUND` even when Postgres isn't configured (the rest of the suite degrades gracefully, so this is easy to miss).
- Focused solution check: `python3 content/test_runner.py [topic-folder]` (e.g. `07-trees`). It walks all `content/` subdirs and runs every non-`_`-prefixed `.py`/`.js` as a standalone script.
- `python3 start.py` boots the server and opens the browser.
- `docker compose up -d --build` serves on http://localhost:3095. Gotchas: compose references an external `homelab` network that must already exist, and despite the README there is **no postgres service** — only `app`; the app falls back to JSON storage if Postgres isn't reachable.

## Adding a problem (keep 4 things in sync)

1. `public/tracker.json` — the static catalog (75 problems). Ids are `NN-XX`, each entry has `pythonPath`/`jsPath` relative to `content/`.
2. `server/descriptions.json` — HTML problem statement keyed by id; must be ≥150 chars with an Example and Constraints section.
3. Twin solution files `content/<NN-pattern>/<slug>.py` and `.js`.
4. Solution file format contract (enforced by `server/lib/parser.js` boilerplate extraction and `tests/content_tests.py`): docstring/JSDoc header → optional helper classes (only `ListNode`/`TreeNode`/`TrieNode` may be top-level) → solution function(s) → test block starting at `# Test Cases` + `if __name__ == "__main__":` (py) or `// Test Cases` + `if (require.main === module)` (js). The parser strips everything from the test marker onward and wraps top-level py functions in `class Solution:`. Files must be runnable standalone and assert-only; content tests also require a `def `/`function `/`class ` signature to survive extraction.

## Security tests are string-literal audits

`tests/security_tests.py` hits the live API AND greps page source for exact fragments. Renaming these breaks the suite: dashboard.html must contain `problem_id: problem.id`, `res.ok`, `checkbox.checked = isCurrentlySolved`, `data-id="${p.id}"`; docs.html needs `ALLOWED_DOCS` allowlist + vendored dompurify/marked + `textContent` fail-closed; playground.html must load Monaco from `/vendor/monaco-editor/vs/loader.js` with **zero** Monaco CDN refs. Font Awesome IS allowed from cdnjs (already in every page).

## Execution sandbox & paths

- `server/lib/sandbox.js` writes user code to `server/scratch/_temp_run_*` (gitignored, swept on startup) and runs `python3`/`node` with a 5s timeout and 512KB buffer. `/api/run` is rate-limited to 30/min/IP.
- Path traversal shield `safeResolveContentPath` only allows `.py`/`.js` files resolved inside the real `content/` dir.

## Persistence

`server/db.js` is dual-mode: PostgreSQL when `DATABASE_URL`/`POSTGRES_HOST` is set (auto-migrates tables), else `server/progress.json`. `db_tests.py` creates/drops disposable test DBs when Postgres is reachable, otherwise skips gracefully.

## Commits

Conventional-commit messages committed directly to `master`: `feat(ui):`, `fix(playground):`, `style(ui):`, `refactor(assets):`, etc.
