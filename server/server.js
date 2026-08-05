const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const db = require('./db');

const app = express();
const PORT = 3000;

const WORKSPACE_DIR = __dirname;
const PROJECT_ROOT = path.resolve(WORKSPACE_DIR, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const PROGRESS_FILE = path.join(WORKSPACE_DIR, 'progress.json');
const TRACKER_FILE = path.join(PUBLIC_DIR, 'tracker.json');
const DESCRIPTIONS_FILE = path.join(WORKSPACE_DIR, 'descriptions.json');

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
    let insideTargetClass = false;
    
    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;
        
        if (currentIndent === 0 && line.startsWith("class ")) {
            if (!(line.startsWith("class ListNode") || line.startsWith("class TrieNode"))) {
                insideTargetClass = true;
            } else {
                insideTargetClass = false;
            }
            output.push(line);
            i++;
            continue;
        }
        
        if (currentIndent === 0 && stripped !== "" && !line.startsWith("class ")) {
            insideTargetClass = false;
        }
        
        if (insideTargetClass && currentIndent === 4 && stripped.startsWith("def ")) {
            output.push(line);
            i++;
            
            const docstringLines = [];
            if (i < lines.length && (lines[i].trim().startsWith('"""') || lines[i].trim().startsWith("'''"))) {
                const quoteType = lines[i].trim().startsWith('"""') ? '"""' : "'''";
                docstringLines.push(lines[i]);
                if (lines[i].trim().endsWith(quoteType) && lines[i].trim().length > 3) {
                    i++;
                } else {
                    i++;
                    while (i < lines.length) {
                        docstringLines.push(lines[i]);
                        if (lines[i].trim().endsWith(quoteType)) {
                            i++;
                            break;
                        }
                        i++;
                    }
                }
            }
            for (const dl of docstringLines) {
                output.push(dl);
            }
            output.push("        # Write your code here");
            output.push("        pass");
            
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                if (nextStripped !== "" && nextIndent <= 4) {
                    break;
                }
                i++;
            }
            continue;
        }
        
        if (currentIndent === 0 && stripped.startsWith("def ")) {
            output.push(line);
            i++;
            
            const docstringLines = [];
            if (i < lines.length && (lines[i].trim().startsWith('"""') || lines[i].trim().startsWith("'''"))) {
                const quoteType = lines[i].trim().startsWith('"""') ? '"""' : "'''";
                docstringLines.push(lines[i]);
                if (lines[i].trim().endsWith(quoteType) && lines[i].trim().length > 3) {
                    i++;
                } else {
                    i++;
                    while (i < lines.length) {
                        docstringLines.push(lines[i]);
                        if (lines[i].trim().endsWith(quoteType)) {
                            i++;
                            break;
                        }
                        i++;
                    }
                }
            }
            for (const dl of docstringLines) {
                output.push(dl);
            }
            output.push("    # Write your code here");
            output.push("    pass");
            
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                if (nextStripped !== "" && nextIndent === 0) {
                    break;
                }
                i++;
            }
            continue;
        }
        
        output.push(line);
        i++;
    }
    return output.join("\n");
}

function extractJsBoilerplate(codeContent) {
    const lines = codeContent.split(/\r?\n/);
    const output = [];
    let i = 0;
    let insideTargetClass = false;
    
    while (i < lines.length) {
        const line = lines[i];
        const stripped = line.trim();
        const currentIndent = line.length - line.trimStart().length;
        
        if (currentIndent === 0 && line.startsWith("class ")) {
            if (!(line.startsWith("class ListNode") || line.startsWith("class TrieNode"))) {
                insideTargetClass = true;
            } else {
                insideTargetClass = false;
            }
            output.push(line);
            i++;
            continue;
        }
        
        if (currentIndent === 0 && stripped !== "" && !line.startsWith("class ")) {
            insideTargetClass = false;
        }
        
        if (insideTargetClass && currentIndent === 4 && stripped.includes("(") && (stripped.includes("{") || (i + 1 < lines.length && lines[i+1].includes("{")))) {
            output.push(line);
            if (!stripped.includes("{")) {
                i++;
                output.push(lines[i]);
            }
            i++;
            
            output.push("        // Write your code here");
            output.push("    }");
            
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                if (nextStripped === "}" && nextIndent === 4) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }
        
        if (currentIndent === 0 && stripped.startsWith("function ")) {
            output.push(line);
            i++;
            
            output.push("    // Write your code here");
            output.push("}");
            
            while (i < lines.length) {
                const nextLine = lines[i];
                const nextStripped = nextLine.trim();
                const nextIndent = nextLine.length - nextLine.trimStart().length;
                if (nextStripped === "}" && nextIndent === 0) {
                    i++;
                    break;
                }
                i++;
            }
            continue;
        }
        
        output.push(line);
        i++;
    }
    return output.join("\n");
}

// Redirect root to dashboard.html
app.get('/', (req, res) => {
    res.redirect('/dashboard.html');
});

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

// API: Get Boilerplate
app.get('/api/boilerplate', (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("Missing path parameter");
    
    const fullPath = path.join(CONTENT_DIR, filePath);
    if (!fs.existsSync(fullPath) || !fullPath.startsWith(CONTENT_DIR)) {
        return res.status(404).send("File not found");
    }
    
    try {
        const codeContent = fs.readFileSync(fullPath, 'utf-8');
        let boilerplate = codeContent;
        if (filePath.endsWith('.py')) {
            boilerplate = extractPythonBoilerplate(codeContent);
        } else if (filePath.endsWith('.js')) {
            boilerplate = extractJsBoilerplate(codeContent);
        }
        res.type('text/plain').send(boilerplate);
    } catch (err) {
        res.status(500).send(`Error processing file: ${err.message}`);
    }
});

// API: Get Solution
app.get('/api/solution', (req, res) => {
    const filePath = req.query.path;
    if (!filePath) return res.status(400).send("Missing path parameter");
    
    const fullPath = path.join(CONTENT_DIR, filePath);
    if (!fs.existsSync(fullPath) || !fullPath.startsWith(CONTENT_DIR)) {
        return res.status(404).send("File not found");
    }
    
    try {
        const codeContent = fs.readFileSync(fullPath, 'utf-8');
        res.type('text/plain').send(codeContent);
    } catch (err) {
        res.status(500).send(`Error reading solution: ${err.message}`);
    }
});

// API: Run submission stubs in subprocesses
app.post('/api/run', (req, res) => {
    const { code, language } = req.body;
    if (!code || !language) return res.status(400).send("Missing code or language parameter");
    
    const scratchDir = path.join(WORKSPACE_DIR, 'scratch');
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
    
    const ext = language === 'python' ? '.py' : '.js';
    const tempFile = path.join(scratchDir, `_temp_run${ext}`);
    
    try {
        fs.writeFileSync(tempFile, code, 'utf-8');
        
        let runnerBin = language === 'python' ? 'python3' : 'node';
        
        // Execute inside subprocess with a 5 second timeout limit
        const child = execFile(runnerBin, [tempFile], { timeout: 5000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            // Check assertion errors for JS
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
    
    progress.user_rating = newRating;
    progress.spaced_repetition[problem_id] = {
        interval: newInterval,
        ease_factor: newEaseFactor,
        repetitions: newRepetitions,
        next_review: nextReview
    };
    
    progress.history.push({
        timestamp: now,
        problem_id,
        quality: q,
        rating_before: userRating,
        rating_after: newRating,
        elo_change: eloChange
    });
    
    await db.saveProgress(PROGRESS_FILE, progress, problem_id);
    
    res.json({
        user_rating: newRating,
        elo_change: eloChange,
        next_review: nextReview
    });
});

// Disable browser disk caching for all static files & routes during development
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Serve static assets from public folder
app.use(express.static(PUBLIC_DIR));
app.use('/playground', express.static(PUBLIC_DIR));
app.use('/roadmap', express.static(PUBLIC_DIR));

// Direct clean page route fallbacks
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/editor.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'editor.html')));
app.get('/roadmap.html', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'roadmap.html')));

app.use((req, res) => {
    res.status(404).send("File not found");
});

app.listen(PORT, () => {
    console.log(`🚀 AlgoDeck server running at http://localhost:${PORT}`);
});
