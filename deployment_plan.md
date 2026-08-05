# 🚀 AlgoDeck — Production Cloud Deployment & Architecture Plan

This document provides a comprehensive, production-grade cloud deployment plan for **AlgoDeck**. It details how to host, scale, secure, and showcase AlgoDeck as a multi-tenant web platform for public portfolio demos, resumes, and technical interviews.

---

## 📋 Table of Contents
1. [System Overview & Cloud Requirements](#1-system-overview--cloud-requirements)
2. [Multi-Tenant User Isolation & Authentication Architecture](#2-multi-tenant-user-isolation--authentication-architecture)
3. [Secure Code Execution Sandbox Hardening](#3-secure-code-execution-sandbox-hardening)
4. [Cloud Hosting Strategies & Deployment Guides](#4-cloud-hosting-strategies--deployment-guides)
   - [Strategy A: Render / Railway + Supabase Postgres (Recommended for Portfolio Link)](#strategy-a-render--railway--supabase-postgres-recommended-for-portfolio-link)
   - [Strategy B: AWS Infrastructure (EC2 / ECS Fargate + RDS + Caddy) (Best for DevOps Showcase)](#strategy-b-aws-infrastructure-ec2--ecs-fargate--rds--caddy-best-for-devops-showcase)
   - [Strategy C: Vercel Frontend + External Execution Microservice (Judge0 / Render)](#strategy-c-vercel-frontend--external-execution-microservice-judge0--render)
5. [Production Configuration & Environment Variables](#5-production-configuration--environment-variables)
6. [Database Provisioning & Migration Strategy](#6-database-provisioning--migration-strategy)
7. [Security & Production Hardening Checklist](#7-security--production-hardening-checklist)
8. [Automated CI/CD Pipeline Blueprint](#8-automated-cicd-pipeline-blueprint)
9. [Interview Talking Points & Resume Bullets](#9-interview-talking-points--resume-bullets)

---

## 1. System Overview & Cloud Requirements

Unlike standard static websites or simple CRUD apps, **AlgoDeck** is a full-stack interactive engineering workstation featuring **real-time untrusted code execution (`/api/run`)**, **SuperMemo-2 (SM-2) spaced repetition algorithm**, and **ELO-based problem rating updates**.

```mermaid
graph TD
    User["🌐 Public Visitor / Interviewer"] -->|HTTPS / SSL| Proxy["🛡️ Caddy / Cloudflare Reverse Proxy"]
    Proxy -->|Load Balancer| App["⚡ Dockerized Express.js Server (Node 20)"]
    
    subgraph AppContainer ["App Container (Linux / Alpine)"]
        App -->|Auth Middleware| Auth["🔑 JWT & Guest Session Manager"]
        App -->|Spaced Repetition| SM2["🧠 SM-2 Engine"]
        App -->|Subprocess Exec| Sandbox["🔒 Isolated Code Execution Sandbox"]
        Sandbox -->|Python 3.12 Subprocess| PyExec["🐍 Python Runner"]
        Sandbox -->|Node 20 Subprocess| JSExec["⚡ JS Runner"]
    end
    
    App -->|Connection Pool (SSL)| DB[("🐘 PostgreSQL (Supabase / RDS)")]
```

### Core Cloud Infrastructure Needs:
1. **Node.js 20 Web Server**: Serves static HTML/CSS/JS assets, Monaco Editor assets, REST API endpoints, and handles database queries.
2. **Polyglot Execution Environment (Python 3 + Node.js)**: Required inside the server runtime to execute user-submitted code in `/api/run`.
3. **PostgreSQL Database**: Persists user accounts, problem review logs, SuperMemo-2 card intervals, and ELO ratings.

> [!WARNING]
> **Why pure Vercel / Netlify Serverless functions won't work out-of-the-box for `/api/run`**:
> Serverless platforms run in read-only, ephemeral AWS Lambda containers without system binaries (Python 3.12, GCC) pre-installed. To deploy on Vercel, you must separate the frontend from the code execution runner (see Strategy C).

---

## 2. Multi-Tenant User Isolation & Authentication Architecture

To allow multiple interviewers and visitors to use your live demo link simultaneously without interfering with each other's spaced-repetition card intervals, implement a dual **Guest Session + Multi-User Authentication System**.

### Architecture Blueprint:
1. **Guest Mode (Zero Friction)**:
   - On first visit, if no login token exists, the frontend generates a unique persistent UUID (`localStorage.getItem('algodeck_guest_id')`).
   - All card review intervals, ratings, and code drafts are isolated to that `guest_id` in PostgreSQL.
2. **Registered User Mode (JWT Authentication)**:
   - Sign Up / Sign In endpoints (`POST /api/auth/register`, `POST /api/auth/login`).
   - Uses `bcrypt` password hashing (salt factor 12) and signs HTTP-only `JWT` cookies with 7-day expiration.
   - Allows users to sync their DSA review schedule across multiple devices.

### Schema Migration for Multi-Tenancy:
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_rating INT DEFAULT 1200,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE problem_reviews 
ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS guest_id VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON problem_reviews(user_id, guest_id);
```

---

## 3. Secure Code Execution Sandbox Hardening

When exposing code execution to the public internet, security is paramount to prevent remote code execution (RCE), fork bombs, resource exhaustion, or network scanning.

### Security Controls Implemented in `/api/run`:
1. **Process Timeouts**: Strict 5.0-second timeout enforced via `execFile` signal limits (`SIGKILL`).
2. **Buffer Memory Caps**: `maxBuffer` capped at 512KB to prevent memory overflow attacks.
3. **Subprocess Isolation**: Executed using isolated temporary working directories with read-only root permissions.
4. **Rate Limiting**: IP-based rate limiting (`30 requests per minute` per IP) using `express-rate-limit`.

### Production Docker Container Hardening:
In production, run the Docker container with unprivileged user permissions:
```dockerfile
# Run as non-root user
USER node
# Limit container memory & CPU
# docker run --memory="512m" --cpus="1.0" --pids-limit=100
```

---

## 4. Cloud Hosting Strategies & Deployment Guides

### Strategy A: Render / Railway + Supabase Postgres (⭐⭐⭐⭐⭐ Recommended for Demo Link)

The fastest, most cost-effective solution for a clean HTTPS demo link (`https://algodeck.onrender.com`). Both platforms natively build your existing Dockerfile from GitHub.

```
GitHub Repo ──> Render / Railway (Docker Web Service) ──> Supabase (Managed Postgres)
```

#### Step-by-Step Instructions:

1. **Provision Database (Supabase)**:
   - Sign up at [Supabase.com](https://supabase.com) (Free Tier).
   - Create a project named `algodeck-db`.
   - Go to **Project Settings -> Database** and copy the **Transaction Connection String** (`DATABASE_URL`).

2. **Deploy Containerized App (Render)**:
   - Sign up at [Render.com](https://render.com) and click **New + -> Web Service**.
   - Connect your GitHub repository (`AlgoDeck`).
   - Select **Docker** as the Runtime. Render will automatically detect your [`Dockerfile`](file:///home/anmol/Projects/AlgoDeck/Dockerfile).
   - Choose the **Free** or **Starter** ($7/mo) instance type.

3. **Configure Environment Variables in Render**:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `DATABASE_URL` | `postgres://postgres:[PASS]@db.[REF].supabase.co:5432/postgres?sslmode=require` |
   | `JWT_SECRET` | `super-secret-random-production-key-32-chars` |

4. **Verify Live Web Service**:
   - Access your live HTTPS URL: `https://algodeck.onrender.com`.

---

### Strategy B: AWS Infrastructure (EC2 / ECS Fargate + RDS + Caddy) (Best for DevOps Showcase)

Demonstrates real-world cloud engineering, infrastructure-as-code, and reverse-proxy configuration.

```
User ──> AWS Route 53 (DNS) ──> EC2 / ECS Fargate (Caddy + AlgoDeck Docker) ──> AWS RDS Postgres
```

#### Architecture Details:
* **Compute**: AWS EC2 (`t3.micro` on Free Tier) or AWS ECS Fargate container.
* **Database**: AWS RDS PostgreSQL (`db.t3.micro`).
* **SSL / TLS**: **Caddy 2** container for automated ACME Let's Encrypt SSL certificates.

#### Step-by-Step Commands for EC2 Deployment:

1. **Launch EC2 Instance**:
   - OS: Ubuntu 24.04 LTS.
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22).

2. **Install Docker & Clone Repo**:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   sudo usermod -aG docker ubuntu
   git clone https://github.com/YOUR_GITHUB_USERNAME/AlgoDeck.git
   cd AlgoDeck
   ```

3. **Configure Caddyfile for Custom Domain**:
   ```caddy
   algodeck.yourdomain.com {
       encode gzip zstd
       reverse_proxy app:3000
   }
   ```

4. **Launch Docker Stack**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

---

### Strategy C: Vercel Frontend + External Execution Microservice (Judge0 / Render)

If you require a `algodeck.vercel.app` frontend domain for portfolio branding:

1. **Deploy Frontend on Vercel**:
   - Connect GitHub repo to Vercel. Set output directory to `public/`.
2. **Deploy Execution Microservice on Render**:
   - Deploy `server/server.js` on Render to handle `/api/run` and `/api/problems`.
3. **Configure Environment Variable on Vercel**:
   - Set `NEXT_PUBLIC_API_BASE=https://algodeck-backend.onrender.com`.

---

## 5. Production Configuration & Environment Variables

Create a `.env.production` file (never commit to git):

```env
# Application Settings
NODE_ENV=production
PORT=3000
API_BASE=https://algodeck.onrender.com

# Managed Database Connection String (Supabase / RDS)
DATABASE_URL=postgres://postgres.xxxx:your_password@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

# Authentication Security
JWT_SECRET=c8f93a10b42e7d61c58a92e103f412ab74e98f0123456789abcdef0123456789
SESSION_EXPIRE_DAYS=7

# Security & Sandboxing
SUBPROCESS_TIMEOUT_MS=5000
MAX_BUFFER_BYTES=524288
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# CORS & Assets
ALLOWED_ORIGINS=https://algodeck.onrender.com,https://algodeck.yourdomain.com
```

---

## 6. Database Provisioning & Migration Strategy

AlgoDeck includes **self-healing automatic database schema initialization** in [`server/db.js`](file:///home/anmol/Projects/AlgoDeck/server/db.js).

When deployed to production:
1. `db.initDb()` executes automatically during server startup.
2. It detects whether tables (`problem_reviews`, `users`) exist.
3. If absent, it creates all required tables, indexes, and initial SM-2 card records seamlessly without needing manual SQL migration scripts.

---

## 7. Security & Production Hardening Checklist

- [x] **Subprocess Timeouts**: Enforced 5-second process kill signal to prevent CPU starvation.
- [x] **Rate Limiting**: Capped at 30 requests/minute per IP address.
- [x] **SSL / HTTPS**: Enforced via Caddy or Cloudflare Edge SSL.
- [x] **Favicon & Browser Cache Headers**: Configured `Cache-Control: public, max-age=86400` for bookmark bar icon support.
- [x] **Resilient Static Fallbacks**: If database connection drops temporarily, the frontend gracefully degrades to local `tracker.json` static catalog.
- [x] **Path Traversal Protection**: Sanitize all file requests in `/api/boilerplate` and `/api/solution` to prevent directory traversal attacks (`../`).

---

## 8. Automated CI/CD Pipeline Blueprint

Add `.github/workflows/deploy.yml` to automatically test and deploy your code on every push to `master`:

```yaml
name: AlgoDeck CI/CD Pipeline

on:
  push:
    branches: [ master ]

jobs:
  test-and-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Run Test Suite (Content, Security, & Solutions)
        run: npm test

  deploy-render:
    needs: test-and-audit
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

---

## 9. Interview Talking Points & Resume Bullets

When presenting AlgoDeck to senior software engineers, hiring managers, or system architects, emphasize these technical accomplishments:

### 📝 Resume Bullet Points:
* **Full-Stack Engineering & System Design**: Designed and built **AlgoDeck**, an interactive DSA learning workstation with real-time polyglot code execution (Python/JS), Monaco IDE, and SuperMemo-2 spaced-repetition scheduling.
* **Secure Sandbox Execution**: Architected an isolated subprocess code execution pipeline with process timeouts, buffer memory caps, and rate-limiting to execute untrusted code safely in production.
* **Production DevOps & Dockerization**: Containerized application stack using multi-stage Docker builds, PostgreSQL connection pooling, and Caddy reverse proxy on AWS/Render.
* **Automated Quality Assurance**: Created comprehensive test suite (`npm test`) covering 150/150 problem solution verifications, path-traversal security audits, and content structure integrity.

### 💬 Key Interview Discussion Points:
1. **"How does code execution work safely?"**
   > *"I built a lightweight execution sandbox in Node.js using `execFile`. Each code submission runs in a isolated child process with a strict 5-second timeout, 512KB buffer cap, and non-root execution permissions to prevent resource starvation or unauthorized system calls."*

2. **"How do you handle spaced repetition and problem difficulty?"**
   > *"AlgoDeck uses the SuperMemo-2 (SM-2) algorithm combined with ELO rating updates. When a user submits a review rating (1-5), the system dynamically calculates the next review interval ($I_n$) and updates the problem's ELO score based on user performance."*

3. **"How is the app deployed in production?"**
   > *"It is fully containerized with Docker, deployed on Render/AWS with a Supabase PostgreSQL backend, and automated via GitHub Actions CI/CD to run test suites before every release."*
