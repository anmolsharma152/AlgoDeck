const fs = require('fs');
const path = require('path');

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

// Startup directory sweep to unlink orphan scratch execution files older than 1 hour
function cleanOrphanScratchFiles(workspaceDir) {
    const scratchDir = path.join(workspaceDir, 'scratch');
    if (!fs.existsSync(scratchDir)) return;

    try {
        const files = fs.readdirSync(scratchDir);
        const now = Date.now();
        const maxAgeMs = 3600000; // 1 hour

        files.forEach(file => {
            if (file.startsWith('_temp_run_')) {
                const filePath = path.join(scratchDir, file);
                try {
                    const stat = fs.statSync(filePath);
                    if (now - stat.mtimeMs > maxAgeMs) {
                        fs.unlinkSync(filePath);
                    }
                } catch (e) {}
            }
        });
    } catch (err) {
        console.warn('⚠️ Could not sweep scratch directory:', err.message);
    }
}

module.exports = {
    rateLimiter,
    cleanOrphanScratchFiles
};
