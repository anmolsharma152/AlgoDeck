const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const db = require('./db');
const { computeHash, extractPythonBoilerplate, extractJsBoilerplate, safeResolveContentPath } = require('./lib/parser');
const { runSubprocessCode } = require('./lib/sandbox');
const { rateLimiter, cleanOrphanScratchFiles } = require('./lib/security');

const app = express();
const PORT = process.env.PORT || 3000;
const TRUST_PROXY_SETTING = process.env.TRUST_PROXY ? process.env.TRUST_PROXY.split(',').map(s => s.trim()) : false;
app.set('trust proxy', TRUST_PROXY_SETTING);

const WORKSPACE_DIR = __dirname;
const PROJECT_ROOT = path.resolve(WORKSPACE_DIR, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const REAL_CONTENT_DIR = fs.existsSync(CONTENT_DIR) ? fs.realpathSync(CONTENT_DIR) : CONTENT_DIR;
const PROGRESS_FILE = path.join(WORKSPACE_DIR, 'progress.json');
const TRACKER_FILE = path.join(PUBLIC_DIR, 'tracker.json');
const DESCRIPTIONS_FILE = path.join(WORKSPACE_DIR, 'descriptions.json');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');

app.use(cors());
app.use(express.json());

// Disable browser caching for all API routes
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Helper JSON readers/writers
function readJsonFile(filePath, defaultVal) {
    if (!fs.existsSync(filePath)) return defaultVal;
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
        return defaultVal;
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing json file ${filePath}:`, err);
    }
}

// Spaced Repetition (SM-2) & ELO scoring
function updateSm2(q, interval, easeFactor, repetitions) {
    if (q >= 3) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);
    return { interval, easeFactor, repetitions };
}

function calculateElo(userRating, problemRating, q) {
    const expected = 1 / (1 + Math.pow(10, (problemRating - userRating) / 400.0));
    const actual = q / 5.0;
    const kFactor = 32;
    const delta = Math.round(kFactor * (actual - expected));
    const newRating = Math.max(100, userRating + delta);
    return { newRating, delta };
}

// API: Get merged problems
app.get('/api/problems', async (req, res) => {
    const tracker = readJsonFile(TRACKER_FILE, []);
    const progress = await db.getProgress(PROGRESS_FILE);
    const descriptions = readJsonFile(DESCRIPTIONS_FILE, {});
    
    const userRating = progress.user_rating || 1200;
    const now = Math.floor(Date.now() / 1000);
    
    const mergedProblems = tracker.map(p => {
        const srInfo = progress.spaced_repetition[p.id] || { interval: 0, ease_factor: 2.5, repetitions: 0, next_review: 0 };
        const nextReview = srInfo.next_review || 0;
        
        return {
            ...p,
            next_review: nextReview,
            interval: srInfo.interval || 0,
            repetitions: srInfo.repetitions || 0,
            is_due: nextReview > 0 ? nextReview <= now : false,
            description: descriptions[p.id] || ""
        };
    });
    
    res.json({
        user_rating: userRating,
        problems: mergedProblems
    });
});

// API: Get starter code stub for a problem
app.get('/api/boilerplate', (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("Missing path parameter");

    const fullPath = safeResolveContentPath(filePath, CONTENT_DIR, REAL_CONTENT_DIR);
    if (!fullPath || !fs.existsSync(fullPath)) {
        return res.status(404).send("File not found or invalid path");
    }

    try {
        const codeContent = fs.readFileSync(fullPath, 'utf-8');
        let boilerplate = codeContent;
        if (filePath.endsWith('.py')) {
            boilerplate = extractPythonBoilerplate(codeContent);
        } else if (filePath.endsWith('.js')) {
            boilerplate = extractJsBoilerplate(codeContent);
        }

        const starterHash = computeHash(boilerplate);
        res.setHeader('X-Starter-Hash', starterHash);
        res.type('text/plain').send(boilerplate);
    } catch (err) {
        res.status(500).send(`Error processing file: ${err.message}`);
    }
});

// API: Get complete solution code
app.get('/api/solution', (req, res) => {
    const { path: filePath } = req.query;
    if (!filePath) return res.status(400).send("Missing path parameter");

    const fullPath = safeResolveContentPath(filePath, CONTENT_DIR, REAL_CONTENT_DIR);
    if (!fullPath || !fs.existsSync(fullPath)) {
        return res.status(404).send("File not found or invalid path");
    }

    try {
        const codeContent = fs.readFileSync(fullPath, 'utf-8');
        res.type('text/plain').send(codeContent);
    } catch (err) {
        res.status(500).send(`Error reading solution: ${err.message}`);
    }
});

// API: Run submission stubs in subprocesses with rate limiting
app.post('/api/run', rateLimiter(30), (req, res) => {
    let { code, language, problem_path } = req.body;
    if (!code || !language) return res.status(400).send("Missing code or language parameter");

    if (problem_path) {
        const fullPath = safeResolveContentPath(problem_path, CONTENT_DIR, REAL_CONTENT_DIR);
        if (fullPath && fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            let tests = "";
            if (language === 'python') {
                tests = extractPythonBoilerplate(content);
            } else if (language === 'javascript') {
                tests = extractJsBoilerplate(content);
            }
        }
    }

    runSubprocessCode(language, code, WORKSPACE_DIR, (err, result) => {
        if (err) return res.status(500).send(`Subprocess setup failed: ${err.message}`);
        res.json(result);
    });
});

// API: Submit quality rating
app.post('/api/submit', async (req, res) => {
    const { problem_id, quality } = req.body;
    if (!problem_id || quality === undefined) {
        return res.status(400).send("Missing problem_id or quality parameters");
    }
    
    const q = parseInt(quality, 10);
    if (isNaN(q) || q < 0 || q > 5) {
        return res.status(400).send("Quality must be an integer between 0 and 5");
    }
    
    const tracker = readJsonFile(TRACKER_FILE, []);
    const progress = await db.getProgress(PROGRESS_FILE);
    
    const problem = tracker.find(p => p.id === problem_id);
    if (!problem) return res.status(404).send("Problem not found");
    
    const difficultyRatings = { "Easy": 1000, "Medium": 1400, "Hard": 1800 };
    const problemRating = difficultyRatings[problem.difficulty] || 1200;
    const userRating = progress.user_rating || 1200;
    
    const srInfo = progress.spaced_repetition[problem_id] || { interval: 0, ease_factor: 2.5, repetitions: 0 };
    const interval = srInfo.interval || 0;
    const easeFactor = srInfo.ease_factor || 2.5;
    const repetitions = srInfo.repetitions || 0;
    
    const now = Math.floor(Date.now() / 1000);
    let newInterval, newEaseFactor, newRepetitions, nextReview;
    let newRating, eloChange;
    
    if (q === 0) {
        newInterval = 0;
        newEaseFactor = 2.5;
        newRepetitions = 0;
        nextReview = 0;
        newRating = userRating;
        eloChange = 0;
    } else {
        const update = updateSm2(q, interval, easeFactor, repetitions);
        newInterval = update.interval;
        newEaseFactor = update.easeFactor;
        newRepetitions = update.repetitions;
        nextReview = now + (newInterval * 86400);
        
        const elo = calculateElo(userRating, problemRating, q);
        newRating = elo.newRating;
        eloChange = elo.delta;
    }
    
    const validAssistance = ['CLEAN', 'HINT_USED', 'SOLUTION_REVEALED'];
    const assistanceLevel = validAssistance.includes(req.body.assistance_level) ? req.body.assistance_level : 'CLEAN';

    progress.user_rating = newRating;
    progress.spaced_repetition[problem_id] = {
        interval: newInterval,
        ease_factor: newEaseFactor,
        repetitions: newRepetitions,
        next_review: nextReview,
        assistance_level: assistanceLevel
    };
    
    progress.history.push({
        timestamp: now,
        problem_id,
        quality: q,
        rating_before: userRating,
        rating_after: newRating,
        elo_change: eloChange,
        assistance_level: assistanceLevel
    });
    
    await db.saveProgress(PROGRESS_FILE, progress, problem_id);
    
    res.json({
        user_rating: newRating,
        elo_change: eloChange,
        next_review: nextReview,
        assistance_level: assistanceLevel
    });
});

// Long-term static caching for vendored JS/CSS libraries (Monaco, Marked, DOMPurify)
app.use('/vendor', express.static(path.join(PUBLIC_DIR, 'vendor'), { maxAge: '30d' }));

// Allow long-term caching for favicons so browser bookmark managers store the icon
const faviconFiles = ['/favicon.ico', '/favicon.svg', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png'];
faviconFiles.forEach(file => {
    app.get(file, (req, res) => {
        const targetPath = path.join(PUBLIC_DIR, file.replace('/', ''));
        if (fs.existsSync(targetPath)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.sendFile(targetPath);
        } else {
            res.status(404).send('Not found');
        }
    });
});

// Disable browser disk caching for dynamic HTML routes during development
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Serve static assets from public, content, & docs folders
app.use(express.static(PUBLIC_DIR));
app.use(express.static(CONTENT_DIR));
app.use('/content', express.static(CONTENT_DIR));
app.use('/docs', express.static(DOCS_DIR));

// Direct clean page route fallbacks
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get(['/playground', '/playground.html', '/editor', '/editor.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'playground.html')));
app.get(['/dashboard', '/dashboard.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html')));
app.get(['/roadmap', '/roadmap.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'roadmap.html')));
app.get(['/docs', '/docs.html'], (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'docs.html')));

app.use((req, res) => {
    res.status(404).send("File not found");
});

async function startServer() {
    cleanOrphanScratchFiles(WORKSPACE_DIR);
    if (db.isPgAvailable()) {
        await db.initDb();
    }
    app.listen(PORT, () => {
        console.log(`🚀 AlgoDeck server running at http://localhost:${PORT}`);
    });
}

startServer();
