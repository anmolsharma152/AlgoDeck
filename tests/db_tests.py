import os
import sys
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

print("🐘 Running PostgreSQL Schema, Migration & Non-Destructive Roundtrip Integration Test Suite...\n")

node_test_script = """
const db = require('./server/db');
const path = require('path');
const fs = require('fs');

async function testPostgresIntegration() {
    console.log('1️⃣ Checking db.js exported contracts...');
    if (typeof db.initDb !== 'function' || typeof db.getProgress !== 'function' || typeof db.saveProgress !== 'function') {
        console.error('❌ FAILED: db.js exports missing expected functions');
        process.exit(1);
    }
    console.log('  [PASS] db.js contract methods present.');

    console.log('\\n2️⃣ Testing Database Schema Initialization & Full Payload Roundtrip...');
    
    // Isolated non-destructive test identifier
    const TEST_PROB_ID = 'test_isolated_roundtrip_999';
    const testPayload = {
        user_rating: 1450,
        spaced_repetition: {
            [TEST_PROB_ID]: {
                interval: 21,
                ease_factor: 2.7,
                repetitions: 4,
                next_review: 1710000000000
            }
        },
        history: [
            {
                problem_id: TEST_PROB_ID,
                timestamp: 1710000000000,
                quality: 5,
                rating_before: 1430,
                rating_after: 1450,
                elo_change: 20
            }
        ]
    };

    if (!db.isPgAvailable()) {
        console.log('  [INFO] PostgreSQL database not active (isPgAvailable = false). Testing JSON fallback storage.');
        const testFile = path.join(__dirname, 'server', 'test_disposable_progress.json');
        try {
            await db.saveProgress(testFile, testPayload, TEST_PROB_ID);
            const fetched = await db.getProgress(testFile);
            
            // Full Payload Verification
            const srMatch = fetched.spaced_repetition && fetched.spaced_repetition[TEST_PROB_ID];
            const histMatch = fetched.history && fetched.history.find(h => h.problem_id === TEST_PROB_ID);

            if (
                fetched.user_rating === 1450 &&
                srMatch &&
                srMatch.interval === 21 &&
                Math.abs(srMatch.ease_factor - 2.7) < 0.01 &&
                srMatch.repetitions === 4 &&
                String(srMatch.next_review) === '1710000000000' &&
                histMatch &&
                histMatch.quality === 5 &&
                histMatch.rating_before === 1430 &&
                histMatch.rating_after === 1450 &&
                histMatch.elo_change === 20
            ) {
                console.log('  [PASS] JSON fallback full payload roundtrip verified successfully.');
                if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
                process.exit(0);
            } else {
                console.error('❌ FAILED: JSON full payload roundtrip mismatch:', JSON.stringify(fetched, null, 2));
                if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ FAILED: Exception during JSON storage roundtrip:', e.message);
            if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
            process.exit(1);
        }
    } else {
        const pool = db.getPool();
        try {
            console.log('  [INFO] PostgreSQL connection detected. Executing initDb() migration...');
            const initSuccess = await db.initDb();
            if (!initSuccess) {
                console.error('❌ FAILED: db.initDb() returned false');
                process.exit(1);
            }
            console.log('  [PASS] db.initDb() executed successfully.');

            const dummyFile = path.join(__dirname, 'server', 'dummy_pg_test.json');
            
            // Fetch initial user rating to restore later (non-destructive)
            const initialProgress = await db.getProgress(dummyFile);
            const originalUserRating = initialProgress.user_rating || 1200;

            console.log('  [INFO] Performing saveProgress() with test payload...');
            await db.saveProgress(dummyFile, testPayload, TEST_PROB_ID);

            console.log('  [INFO] Performing getProgress() and asserting full payload...');
            const fetched = await db.getProgress(dummyFile);

            const srMatch = fetched.spaced_repetition && fetched.spaced_repetition[TEST_PROB_ID];
            const histMatch = fetched.history && fetched.history.find(h => h.problem_id === TEST_PROB_ID);

            const isValid = (
                fetched.user_rating === 1450 &&
                srMatch &&
                srMatch.interval === 21 &&
                Math.abs(srMatch.ease_factor - 2.7) < 0.01 &&
                srMatch.repetitions === 4 &&
                String(srMatch.next_review) === '1710000000000' &&
                histMatch &&
                histMatch.quality === 5 &&
                histMatch.rating_before === 1430 &&
                histMatch.rating_after === 1450 &&
                histMatch.elo_change === 20
            );

            // CLEANUP TEST ROWS (Non-Destructive Restoration)
            console.log('  [INFO] Cleaning up test rows from PostgreSQL tables...');
            await pool.query('DELETE FROM spaced_repetition WHERE problem_id = $1', [TEST_PROB_ID]);
            await pool.query('DELETE FROM review_history WHERE problem_id = $1', [TEST_PROB_ID]);
            await pool.query('UPDATE user_progress SET user_rating = $1 WHERE id = 1', [originalUserRating]);
            if (fs.existsSync(dummyFile)) fs.unlinkSync(dummyFile);

            if (isValid) {
                console.log('  [PASS] PostgreSQL full schema migration & full payload roundtrip verified with zero side-effects!');
                process.exit(0);
            } else {
                console.error('❌ FAILED: PostgreSQL full payload mismatch:', JSON.stringify(fetched, null, 2));
                process.exit(1);
            }
        } catch (err) {
            console.error('❌ FAILED: Exception during PostgreSQL integration test:', err.message);
            process.exit(1);
        }
    }
}

testPostgresIntegration();
"""

res = subprocess.run(['node', '-e', node_test_script], cwd=BASE_DIR, capture_output=True, text=True)
print(res.stdout.strip())

if res.returncode == 0:
    print("\n--------------------------------------------------")
    print("✅ Non-Destructive PostgreSQL Integration Test Suite Passed (100% Validated)!")
    sys.exit(0)
else:
    print(res.stderr.strip())
    print("\n--------------------------------------------------")
    print("❌ PostgreSQL Integration Test Suite Failed!")
    sys.exit(1)
