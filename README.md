# 🌌 AlgoDeck — Visual DSA Practice & Spaced-Repetition Workstation

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Monaco-IDE-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Monaco Editor" />
</p>

> **AlgoDeck** is a full-stack Data Structures & Algorithms (DSA) learning workstation and adaptive practice engine. It combines real-time polyglot code execution (Python 3 & JavaScript), SuperMemo-2 (SM-2) spaced-repetition scheduling, ELO problem difficulty ratings, interactive progress dashboards, and a VS Code Monaco IDE workspace.

---

## 🌟 Key Features & Web Pages

* **📊 Interactive Problem Dashboard (`dashboard.html`)**: Central progress hub displaying total solved stats, current ELO rating, SM-2 due review alerts (`🔔 Due Today`), difficulty/level filters (L1 Linear through L5 CP), and problem activity tracking.
* **💻 Monaco IDE Coding Playground (`playground.html`)**: Dual-pane Monaco workspace with custom syntax highlighting, starter code stub reset, solution lock overlays, font zoom ($10px \leftrightarrow 28px$), word-wrap toggles, and `AbortController` fetch cancellation.
* **🧠 Cognitive Spaced Repetition (SuperMemo-2 Engine)**: Dynamically calculates optimal review intervals ($I_n$) and Ease Factors ($EF$) based on performance ratings ($q \in [0..5]$) to maximize long-term memory retention.
* **♟️ ELO Rating System**: Dynamically adjusts user rating ($R_{user}$) and problem difficulty ratings ($R_{prob}$) after every practice submission using expected probability calculations.
* **🔒 Subprocess Code Execution Sandbox**: Runs Python 3 and JavaScript code in real-time with 5-second execution timeouts, memory caps, and 512KB buffer shielding.
* **🗺️ Curriculum Roadmap (`roadmap.html`)**: Interactive 19-topic pattern visualizer mapping **75 curated DSA problems** (150 dual Python/JS solutions) aligned with Blind 75 and NeetCode 150.
* **📖 Technical Documentation Viewer (`docs.html`)**: Built-in in-app markdown reader powered by vendored DOMPurify and marked.js for secure offline document browsing.
* **🗄️ Dual-Mode Persistence Layer**: Hybrid database layer — PostgreSQL 16 (via `pg` connection pool with auto-migrations) falling back to zero-dependency local JSON (`server/progress.json`).
* **🧪 100% Automated Test Suite**: Integrated test harness (`npm test`) validating 150 problem solutions, security path-traversal shields, and content integrity.

---

## 🌐 Operating & Distribution Modes

1. **💻 Local On-Device Workstation (Current v1.0)**: 100% offline-capable workstation running locally via Node.js or `docker compose` with zero external API dependencies. Operates under a **Trusted Local Machine** execution model.
2. **☁️ Multi-Tenant Cloud SaaS (Roadmap Phase 2 & 3)**: Cloud-hosted architecture incorporating gVisor container sandboxing, multi-tenant JWT user authentication, and managed PostgreSQL storage (see [`docs/MASTER_ROADMAP_AND_ARCHITECTURE.md`](file:///home/anmol/Projects/AlgoDeck/docs/MASTER_ROADMAP_AND_ARCHITECTURE.md)).

### ⚙️ Environment Variables & Deployment Configuration
- `PORT`: Server listening port (default: `3000`).
- `TRUST_PROXY`: Configures Express proxy IP trust evaluation (default: `loopback` / `false` for bare local runs; set to explicit proxy IP or bridge subnet e.g. `loopback,172.18.0.0/16` when deployed behind reverse proxies like Caddy).
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: PostgreSQL connection credentials (falls back to local `progress.json` if unconfigured).

*For third-party library licenses and versions (`marked` v11.1.1, `DOMPurify` v3.0.8), see [`THIRD_PARTY_NOTICES.md`](file:///home/anmol/Projects/AlgoDeck/THIRD_PARTY_NOTICES.md).*

---

## 🏗️ System Architecture

```mermaid
graph TD
    User["🌐 Browser Client (Monaco IDE & Dashboard)"] -->|HTTPS / algodeck.localhost| Caddy["🛡️ Caddy Reverse Proxy"]
    Caddy -->|Reverse Proxy :3000| Server["⚡ Node.js Express App Server"]
    
    subgraph AppServer ["Express App Microservices"]
        Server -->|Subprocess Exec| Sandbox["🔒 Isolated Code Execution Sandbox"]
        Server -->|SM-2 & ELO Engine| Cognitive["🧠 Spaced Repetition Engine"]
        Server -->|Security Shield| RateLimiter["🛡️ Rate Limiter & Path Shield"]
    end
    
    subgraph DataStore ["Persistence Layer"]
        Server -->|Connection Pool| DB[("🐘 PostgreSQL 16 Database")]
        Server -->|Local Fallback| JSONStore["📁 progress.json Store"]
    end

    Sandbox -->|Subprocess Output| Server
```

---

## 🚀 Quick Start

### Mode 1: Using Docker Compose (Recommended)

```bash
# 1. Clone Repository
git clone https://github.com/anmolsharma152/AlgoDeck.git
cd AlgoDeck

# 2. Launch Stack (App + PostgreSQL)
docker compose up -d --build

# 3. Open in Browser
# Access http://localhost:3095 or https://algodeck.localhost
```

### Mode 2: Local Node.js & Python

```bash
# 1. Install Dependencies
npm install

# 2. Run Test Harness
npm test

# 3. Start Server
npm start
```

---

## 📂 Project Directory Structure

```text
AlgoDeck/
├── public/                 # Frontend Web Application & Assets
│   ├── index.html          # Station Landing & Overview Entrypoint
│   ├── dashboard.html      # Problem Dashboard, ELO & Progress Metrics
│   ├── playground.html     # Dual-Pane Monaco Coding Playground
│   ├── roadmap.html        # Interactive 19-Pattern Curriculum Map
│   ├── docs.html           # In-App Technical Documentation Viewer
│   ├── css/global.css      # Design System Stylesheet
│   ├── js/global.js        # Shared UX, Theme & Navigation Modules
│   └── tracker.json        # Static Problem Catalog Metadata
│
├── server/                 # Express API Backend & Engines
│   ├── server.js           # REST API Server, Routes & Subprocess Runner
│   ├── db.js               # PostgreSQL Connection Pool & Migrations
│   ├── descriptions.json   # HTML LeetCode Problem Statements
│   └── progress.json       # Fallback Local Progress Store
│
├── content/                # 19 DSA Pattern Solution Repositories
│   ├── 01-arrays-and-hashing/
│   ├── 02-two-pointers/
│   ├── ... (03 through 19)
│   └── test_runner.py      # Batch Solution Assertion Harness
│
├── tests/                  # Automated Test Suites
│   ├── content_tests.py    # Problem Structure & Boilerplate Audit
│   ├── security_tests.py   # Path Traversal & Rate Limiter Tests
│   └── run_all_tests.py    # Master Test Runner (npm test)
│
├── docs/                   # System Architecture & Roadmap Specs
│   ├── MASTER_ROADMAP_AND_ARCHITECTURE.md # Comprehensive Architectural Blueprint
│   ├── architecture.md     # SM-2 Math & ELO Formulation Documentation
│   ├── deployment_plan.md  # Production Hosting & Reverse Proxy Guide
│   └── distribution_plan.md# Desktop vs Cloud SaaS Distribution Blueprint
│
├── docker-compose.yml      # Multi-Container Compose Manifest
├── Dockerfile              # Node 20 + Python 3 Container Build
└── LICENSE                 # MIT License Notice
```

---

## 📚 Technical Documentation

- 🏛️ **[Master Architecture & Roadmap (`docs/MASTER_ROADMAP_AND_ARCHITECTURE.md`)](file:///home/anmol/Projects/AlgoDeck/docs/MASTER_ROADMAP_AND_ARCHITECTURE.md)** — Master technical specifications, SM-2 pure mathematical formulations, assistance tagging, and Phase 1-3 expansion blueprints.
- 📐 **[System Architecture Guide (`docs/architecture.md`)](file:///home/anmol/Projects/AlgoDeck/docs/architecture.md)** — Deep dive into SM-2 math equations, ELO rating logistic functions, Monaco AST parsing, and security layers.
- 🚀 **[Cloud Deployment Blueprint (`docs/deployment_plan.md`)](file:///home/anmol/Projects/AlgoDeck/docs/deployment_plan.md)** — Step-by-step production hosting guide for Render, AWS EC2/ECS, Supabase PostgreSQL, and Caddy reverse proxies.
- 🌐 **[Distribution & SaaS Strategy (`docs/distribution_plan.md`)](file:///home/anmol/Projects/AlgoDeck/docs/distribution_plan.md)** — Strategy for online SaaS vs local offline desktop workstation, and feature roadmap for LeetCode/NeetCode parity.

---

## 🧪 Running Automated Tests

AlgoDeck includes a 3-tier automated test harness:

```bash
npm test
```

* **Content Audit**: Verifies all 75 problems have complete HTML descriptions, solution files, and starter code extractors.
* **Security Penetration Tests**: Verifies path-traversal shielding (`../`), 5-second process execution timeouts, and rate-limiting limits.
* **Solution Runner**: Executes all 150 Python & JavaScript solutions against test assertion inputs.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
