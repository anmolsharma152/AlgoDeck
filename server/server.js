const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const db = require('./db');

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

// Boilerplate extractors
function extractPythonBoilerplate(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    const output = [];
    let i = 0;
    
    // Skip top-level module docstring
    if (i < lines.length && (lines[i].trim().startsWith('"""') || lines[i].trim().startsWith("'''"))) {
        const quoteType = lines[i].trim().substring(0, 3);
        if (lines[i].trim().endsWith(quoteType) && lines[i].trim().length > 3) {
            i++;
        } else {
            i++;
            while (i < lines.length && !lines[i].trim().endsWith(quoteType)) {
                i++;
            }
            if (i < lines.length) i++;
        }
    }

    let inHelperClass = false;
    let helperClassIndent = -1;

    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;

        if (stripped === "if __name__ == \"__main__\":" || stripped === "# Test Cases" || stripped.startsWith("if __name__ ==")) {
            break;
        }

        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode")) {
                inHelperClass = true;
                helperClassIndent = currentIndent;
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
                output.push(line);
                i++;
                continue;
            }
        }

        if (inHelperClass) {
            if (stripped === "" || currentIndent > helperClassIndent) {
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
            }
        }

        if (stripped.startsWith("def ")) {
            output.push(line);
            
            let placeholderIndent = currentIndent === 0 ? "    " : "        ";
            output.push(`${placeholderIndent}# Write your code here`);
            output.push(`${placeholderIndent}pass`);

            i++;
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                
                if (nextStripped === "if __name__ == \"__main__\":" || nextStripped === "# Test Cases" || nextStripped.startsWith("if __name__ ==")) {
                    break;
                }
                if (nextStripped !== "") {
                    if (currentIndent === 0 && nextIndent <= 0) break;
                    if (currentIndent === 4 && nextIndent <= 4) break;
                }
                i++;
            }
            continue;
        }

        if (stripped.startsWith('"""') || stripped.startsWith("'''")) {
            const quoteType = stripped.substring(0, 3);
            if (stripped.endsWith(quoteType) && stripped.length > 3) {
                i++;
                continue;
            }
            i++;
            while (i < lines.length && !lines[i].trim().endsWith(quoteType)) {
                i++;
            }
            if (i < lines.length) i++;
            continue;
        }

        output.push(line);
        i++;
    }

    while (output.length > 0 && output[0].trim() === "") {
        output.shift();
    }
    while (output.length > 0 && output[output.length - 1].trim() === "") {
        output.pop();
    }
    
    return output.join("\n") + "\n";
}

function extractJsBoilerplate(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    const output = [];
    let i = 0;
    
    if (i < lines.length && (lines[i].trim().startsWith("/**") || lines[i].trim().startsWith("/*"))) {
        if (lines[i].trim().endsWith("*/") && lines[i].trim().length > 2) {
            i++;
        } else {
            i++;
            while (i < lines.length && !lines[i].trim().endsWith("*/")) {
                i++;
            }
            if (i < lines.length) i++;
        }
    }

    let inHelperClass = false;

    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;

        if (stripped === "if (require.main === module) {" || stripped === "// Test Cases" || stripped.startsWith("if (require.main === module)")) {
            break;
        }

        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode")) {
                inHelperClass = true;
                output.push(line);
                i++;
                continue;
            } else {
                inHelperClass = false;
                output.push(line);
                i++;
                continue;
            }
        }

        if (inHelperClass) {
            if (stripped === "}" && currentIndent === 0) {
                inHelperClass = false;
            }
            output.push(line);
            i++;
            continue;
        }

        if (currentIndent === 0 && stripped.startsWith("function ")) {
            output.push(line);
            if (!stripped.includes("{")) {
                if (i + 1 < lines.length && lines[i+1].includes("{")) {
                    i++;
                    output.push(lines[i]);
                }
            }
            output.push("    // Write your code here");
            output.push("}");

            i++;
            while (i < lines.length) {
                const nextStripped = lines[i].trim();
                const nextIndent = lines[i].length - lines[i].trimStart().length;
                if (nextStripped === "if (require.main === module) {" || nextStripped === "// Test Cases" || nextStripped.startsWith("if (require.main === module)")) {
                    break;
                }
                if (nextStripped === "}" && nextIndent === 0) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }

        if (currentIndent === 4 && stripped !== "" && !stripped.startsWith("//") && (stripped.includes("(") && (stripped.includes(")") || stripped.includes("{")))) {
            output.push(line);
            if (!stripped.includes("{")) {
                if (i + 1 < lines.length && lines[i+1].includes("{")) {
                    i++;
                    output.push(lines[i]);
                }
            }
            output.push("        // Write your code here");
            output.push("    }");

            i++;
            while (i < lines.length) {
                const nextStripped = lines[i].trim();
                const nextIndent = lines[i].length - lines[i].trimStart().length;
                if (nextStripped === "}" && nextIndent === 4) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }

        if (stripped.startsWith("/**") || stripped.startsWith("/*")) {
            if (stripped.endsWith("*/") && stripped.length > 2) {
                i++;
                continue;
            }
            i++;
            while (i < lines.length && !lines[i].trim().endsWith("*/")) {
                i++;
            }
            if (i < lines.length) i++;
            continue;
        }

        output.push(line);
        i++;
    }

    while (output.length > 0 && output[0].trim() === "") {
        output.shift();
    }
    while (output.length > 0 && output[output.length - 1].trim() === "") {
        output.pop();
    }
    
    return output.join("\n") + "\n";
}

function extractPythonTests(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    let testIndex = -1;
    let lastTargetIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const stripped = lines[i].trim();
        if (stripped === "if __name__ == \"__main__\":" || stripped === "# Test Cases" || stripped.startsWith("if __name__ ==")) {
            testIndex = i;
            break;
        }
    }
    
    if (testIndex === -1) return "";
    
    for (let i = testIndex - 1; i >= 0; i--) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;
        
        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (!(stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode"))) {
                lastTargetIndex = i;
                break;
            }
        }
        
        if (currentIndent === 0 && stripped.startsWith("def ")) {
            if (!stripped.startsWith("def to_list") && !stripped.startsWith("def to_array") && !stripped.startsWith("def build_") && !stripped.startsWith("def print_") && !stripped.startsWith("def create_") && !stripped.startsWith("def tree_") && !stripped.startsWith("def compare_")) {
                lastTargetIndex = i;
                break;
            }
        }
    }
    
    let testsStartIndex = testIndex;
    if (lastTargetIndex !== -1) {
        let endOfTarget = lastTargetIndex + 1;
        while (endOfTarget < testIndex) {
            const nextLine = lines[endOfTarget];
            const nextStripped = nextLine.trim();
            const nextIndent = nextLine.length - nextLine.trimStart().length;
            if (nextStripped !== "" && nextIndent === 0 && nextStripped.startsWith("def ")) {
                testsStartIndex = endOfTarget;
                break;
            }
            endOfTarget++;
        }
    }
    
    return lines.slice(testsStartIndex).join("\n");
}

function extractJsTests(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    let testIndex = -1;
    let lastTargetIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const stripped = lines[i].trim();
        if (stripped === "if (require.main === module) {" || stripped === "// Test Cases" || stripped.startsWith("if (require.main === module)")) {
            testIndex = i;
            break;
        }
    }
    
    if (testIndex === -1) return "";
    
    for (let i = testIndex - 1; i >= 0; i--) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;
        
        if (currentIndent === 0 && stripped.startsWith("class ")) {
            if (!(stripped.startsWith("class ListNode") || stripped.startsWith("class TreeNode") || stripped.startsWith("class TrieNode"))) {
                lastTargetIndex = i;
                break;
            }
        }
        
        if (currentIndent === 0 && stripped.startsWith("function ")) {
            if (!stripped.startsWith("function toList") && !stripped.startsWith("function toArray") && !stripped.startsWith("function build") && !stripped.startsWith("function print") && !stripped.startsWith("function create") && !stripped.startsWith("function tree") && !stripped.startsWith("function compare")) {
                lastTargetIndex = i;
                break;
            }
        }
    }
    
    let testsStartIndex = testIndex;
    if (lastTargetIndex !== -1) {
        let endOfTarget = lastTargetIndex + 1;
        while (endOfTarget < testIndex) {
            const nextLine = lines[endOfTarget];
            const nextStripped = nextLine.trim();
            const nextIndent = nextLine.length - nextLine.trimStart().length;
            if (nextStripped !== "" && nextIndent === 0 && (nextStripped.startsWith("function ") || nextStripped.startsWith("class ") || nextStripped.startsWith("const ") || nextStripped.startsWith("let ") || nextStripped.startsWith("var "))) {
                testsStartIndex = endOfTarget;
                break;
            }
            endOfTarget++;
        }
    }
    
    return lines.slice(testsStartIndex).join("\n");
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

// Path normalization, extension restriction, and safe containment check
function safeResolveContentPath(filePath) {
    if (!filePath || typeof filePath !== 'string') return null;
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.py' && ext !== '.js') return null;

    const normalized = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    const resolvedPath = path.resolve(CONTENT_DIR, normalized);

    let realPath, stat;
    try {
        realPath = fs.realpathSync(resolvedPath);
        stat = fs.statSync(realPath);
    } catch (e) {
        return null;
    }

    if (!stat.isFile()) return null;

    const rel = path.relative(REAL_CONTENT_DIR, realPath);
    if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) return null;

    return realPath;
}

// In-memory rate limiting middleware with periodic unref'd memory cleanup
const requestCounts = new Map();
const rateLimiterCleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
        if (now > record.resetTime) requestCounts.delete(ip);
    }
}, 600000);
rateLimiterCleanupTimer.unref();

function rateLimiter(maxRequestsPerMin = 30) {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        const now = Date.now();
        const windowMs = 60000;
        
        let record = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };
        if (now > record.resetTime) {
            record = { count: 0, resetTime: now + windowMs };
        }
        record.count++;
        requestCounts.set(ip, record);
        
        if (record.count > maxRequestsPerMin) {
            return res.status(429).json({ error: "Too many requests. Please wait a minute." });
        }
        next();
    };
}

function computeHash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
}

// API: Get Boilerplate
app.get('/api/boilerplate', (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("Missing path parameter");
    
    const fullPath = safeResolveContentPath(filePath);
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

// API: Get Solution
app.get('/api/solution', (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("Missing path parameter");
    
    const fullPath = safeResolveContentPath(filePath);
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
        const fullPath = safeResolveContentPath(problem_path);
        if (fullPath && fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            let tests = "";
            if (language === 'python') {
                tests = extractPythonTests(content);
            } else if (language === 'javascript') {
                tests = extractJsTests(content);
            }
            if (tests) {
                code = code + "\n\n" + tests;
            }
        }
    }
    
    const scratchDir = path.join(WORKSPACE_DIR, 'scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
    
    const ext = language === 'python' ? '.py' : '.js';
    const tempFile = path.join(scratchDir, `_temp_run_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);
    
    try {
        fs.writeFileSync(tempFile, code, 'utf-8');
        
        let runnerBin = language === 'python' ? 'python3' : 'node';
        
        // Execute inside subprocess with a 5 second timeout limit and max 512KB buffer
        const child = execFile(runnerBin, [tempFile], { 
            timeout: 5000, 
            maxBuffer: 512 * 1024,
            env: { PATH: process.env.PATH, HOME: process.env.HOME || '/tmp' }
        }, (error, stdout, stderr) => {
            let isAssertionError = false;
            if (language === 'javascript' && stderr.includes('Assertion failed')) {
                isAssertionError = true;
            }
            
            let exitCode = 0;
            if (error) {
                exitCode = error.code || 1;
                if (error.killed) {
                    stderr = "Execution Timeout: The code took longer than 5 seconds to run.";
                    exitCode = -1;
                }
            }
            if (isAssertionError) exitCode = 1;
            
            // Clean up temp file
            if (fs.existsSync(tempFile)) {
                try { fs.unlinkSync(tempFile); } catch (e) {}
            }
            
            res.json({
                stdout,
                stderr,
                exit_code: exitCode
            });
        });
    } catch (err) {
        res.status(500).send(`Subprocess setup failed: ${err.message}`);
    }
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
app.get('/docs.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'docs.html')));

app.use((req, res) => {
    res.status(404).send("File not found");
});

function cleanOrphanScratchFiles() {
    const scratchDir = path.join(WORKSPACE_DIR, 'scratch');
    if (fs.existsSync(scratchDir)) {
        const now = Date.now();
        try {
            const files = fs.readdirSync(scratchDir);
            files.forEach(file => {
                if (file.startsWith('_temp_run_')) {
                    const filePath = path.join(scratchDir, file);
                    try {
                        const stat = fs.statSync(filePath);
                        if (now - stat.mtimeMs > 3600000) {
                            fs.unlinkSync(filePath);
                        }
                    } catch (e) {}
                }
            });
        } catch (e) {}
    }
}

async function startServer() {
    cleanOrphanScratchFiles();
    if (db.isPgAvailable()) {
        await db.initDb();
    }
    app.listen(PORT, () => {
        console.log(`🚀 AlgoDeck server running at http://localhost:${PORT}`);
    });
}

startServer();
