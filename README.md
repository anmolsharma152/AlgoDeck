# 🌌 AlgoDeck: Spaced-Repetition CP & DSA Learning Workspace

AlgoDeck is a local-first, offline-validatable learning platform designed to take you from coding foundations to advanced competitive programming patterns.

---

## 📂 Project Architecture

```
AlgoDeck/
├── public/                 # Web frontend pages & static assets
│   ├── index.html          # Main Dashboard Visualizer
│   ├── editor.html         # Monaco Practice Playground
│   ├── roadmap.html        # Curriculum Roadmap Visualizer
│   ├── css/
│   │   └── global.css      # Design system stylesheet
│   ├── js/
│   │   ├── global.js       # Shared navigation & spotlight FX
│   │   └── tracker.js      # Problem metadata JS bundle
│   └── tracker.json        # Static problem metadata JSON
│
├── server/                 # Backend Node.js Express API
│   ├── server.js           # API server & static asset mount
│   ├── descriptions.json   # Markdown problem descriptions
│   └── progress.json       # User SR progress & rating store
│
├── content/                # The 19 DSA Pattern directories & solutions
│   ├── 01-arrays-and-hashing/
│   ├── 02-two-pointers/
│   ├── 03-sliding-window/
│   └── ... (04 through 19)
│   └── test_runner.py      # Batch test runner for Python & JS solutions
│
├── start.py                # Python launcher script
├── package.json            # Node dependency manifest
└── README.md
```

---

## 💻 Features & Capabilities

1. **Dashboard Visualizer (`public/index.html`)**: Summarizes progress across all **75 problems**, LeetCode / NeetCode 150 / Blind 75 sheets, and completed milestones.
2. **Practice Playground (`public/editor.html`)**: VS Code Monaco split-screen workspace with dynamic boilerplates, terminal output console, and reference solution tab.
3. **SuperMemo-2 (SM-2) Spaced Repetition**: Prompts self-evaluation after coding to schedule reviews dynamically.
4. **Chess-Style ELO Rating**: Computes expected results against problem difficulties (Easy: 1000, Medium: 1400, Hard: 1800) in real-time.
5. **Unit Test Suite (`content/test_runner.py`)**: Validates **150 solution files** (75 Python + 75 JavaScript) across all 19 topic patterns.

---

## 🚀 Quick Start

To launch the AlgoDeck workspace:

```bash
# Option 1: Using npm
npm start

# Option 2: Using Python launcher
python3 start.py
```

Then open **`http://localhost:3000`** in your browser. *(Press `Ctrl+C` in your terminal to shut down the server when done).*
