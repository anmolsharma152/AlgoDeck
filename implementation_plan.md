# 🏗️ AlgoDeck — Production Readiness & System Design Implementation Plan

This implementation plan outlines the engineering roadmap to evolve **AlgoDeck** from a local-first DSA workstation into an **enterprise-grade, production-hardened cloud platform**. It unifies multi-tenant user authentication, gVisor container sandboxing, cloud deployment automation, and portfolio interview showcase assets.

---

## 🎯 Goal & Key Objectives

1. **Multi-Tenant User Authentication & Data Isolation**:
   - Transition from single-tenant local state to a secure dual-mode system: **JWT Auth** for registered users and **UUID Guest Isolation** for instant portfolio visitors.
2. **Production Code Execution Sandbox Hardening**:
   - Upgrade the `/api/run` execution engine with strict process limits, memory caps, non-root container isolation, and resource quotas.
3. **Automated Cloud Infrastructure & CI/CD Pipeline**:
   - Add production Docker Compose stack, Caddy reverse-proxy auto-HTTPS, and GitHub Actions CI/CD workflows for automated build, test, and cloud deployment.
4. **Interview & Portfolio Showcase Enhancements**:
   - Add system health & performance metrics endpoints (`/api/health`), OpenAPI 3.0 API documentation, and an interactive system design walkthrough.

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Authentication Strategy**:
> Registered users will use HTTP-only JWT cookies (7-day expiry), while guest visitors will automatically receive a client-side UUID stored in `localStorage` so multiple interviewers testing your live demo won't overwrite each other's card reviews or problem ratings.

> [!NOTE]
> **Cloud Provider Choice**:
> The plan supports both **Render + Supabase** (instant free portfolio link) and **AWS EC2/ECS + RDS** (for deep DevOps interview discussions).

---

## 🛠️ Proposed Changes

---

### Component 1: Multi-Tenant Database & User Authentication

#### [MODIFY] [`server/db.js`](file:///home/anmol/Projects/AlgoDeck/server/db.js)
- Extend auto-migration schema to create `users` table and update `problem_reviews` and `user_progress` with `user_id` and `guest_id` columns.
- Add database index `idx_reviews_tenant ON problem_reviews (user_id, guest_id)`.

#### [NEW] [`server/auth.js`](file:///home/anmol/Projects/AlgoDeck/server/auth.js)
- Implement `bcrypt` password hashing (12 rounds) for user registration (`/api/auth/register`) and login (`/api/auth/login`).
- Implement JWT token signing and verification middleware (`verifyToken`).
- Fallback to `x-guest-id` header when no JWT token is present.

---

### Component 2: Secure Code Execution Engine Hardening

#### [MODIFY] [`server/server.js`](file:///home/anmol/Projects/AlgoDeck/server/server.js)
- Refactor `/api/run` endpoint to enforce strict isolated temporary working directories (`/tmp/algodeck_run_<uuid>`).
- Enforce process timeout limits (`5000ms`), STDOUT/STDERR output buffer caps (`512KB`), and maximum concurrent process queues.
- Add clean-up hooks (`finally`) to remove temporary run scripts immediately after execution.
- Add `/api/health` and `/api/metrics` endpoints reporting system uptime, active DB connections, total problem executions, and memory usage.

---

### Component 3: Production Docker & Cloud Infrastructure

#### [NEW] [`Dockerfile.prod`](file:///home/anmol/Projects/AlgoDeck/Dockerfile.prod)
- Multi-stage Docker build utilizing `node:20-alpine`.
- Strip unnecessary build tools in final production stage.
- Run node process under unprivileged `node` user (`USER node`).

#### [NEW] [`docker-compose.prod.yml`](file:///home/anmol/Projects/AlgoDeck/docker-compose.prod.yml)
- Production orchestration linking `algodeck_app` container, `algodeck_db` PostgreSQL container, and `caddy` reverse proxy.
- Enable automatic health checks, restart policies (`restart: unless-stopped`), and resource memory/CPU limits.

#### [NEW] [`Caddyfile.prod`](file:///home/anmol/Projects/AlgoDeck/Caddyfile.prod)
- Production reverse-proxy configuration with automatic ACME Let's Encrypt SSL/TLS certificates and gzip/zstd compression.

---

### Component 4: Automated CI/CD Pipeline

#### [NEW] [`.github/workflows/ci-cd.yml`](file:///home/anmol/Projects/AlgoDeck/.github/workflows/ci-cd.yml)
- Automated GitHub Actions workflow triggering on every push to `master`.
- **Job 1 (Test & Audit)**: Installs Node.js 20 & Python 3.12, runs `npm test` (security audits, content checks, solution runner).
- **Job 2 (Deploy)**: Automatically triggers Render or AWS deployment hook upon clean test suite completion.

---

### Component 5: API Documentation & Portfolio Showcase

#### [NEW] [`public/api-docs.html`](file:///home/anmol/Projects/AlgoDeck/public/api-docs.html)
- Interactive OpenAPI / Swagger UI page documenting all REST API endpoints (`/api/problems`, `/api/run`, `/api/review`, `/api/health`).

---

## 🧪 Verification Plan

### Automated Tests
- **`npm test`**:
  - Run master test suite (`tests/run_all_tests.py`).
  - Verify 100% pass rate across solution tests (150/150), security penetration tests (timeouts, path traversal), and content audits.

### Production Verification
- **Database Multi-Tenancy**:
  - Verify guest sessions and registered users receive isolated SM-2 card intervals.
- **Code Runner Sandbox**:
  - Test timeout protection with an infinite loop snippet (`while True: pass`). Confirm process terminates safely at 5.0 seconds with `Execution Timeout`.
- **Cloud SSL & Reverse Proxy**:
  - Verify `curl -I https://algodeck.localhost` returns `HTTP/2 200` with valid SSL headers and gzip compression.
