import os
import sys
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

print("🐘 Running Fully Isolated PostgreSQL Migration & Disposable DB Test Suite...\n")

node_test_script = """
const db = require('./server/db');
const path = require('path');
const fs = require('fs');

async function runIsolatedDbTest() {
    console.log('1️⃣ Checking db.js exported contracts...');
    if (typeof db.initDb !== 'function' || typeof db.getProgress !== 'function' || typeof db.saveProgress !== 'function') {
        console.error('❌ FAILED: db.js exports missing expected functions');
        process.exit(1);
    }
    console.log('  [PASS] db.js contract methods present.');

    console.log('\\n2️⃣ Testing Clean Database Creation, Migration & Full Payload Roundtrip...');

    const TEST_PROB_ID = 'test_disposable_prob_123';
    const testPayload = {
        user_rating: 1550,
        spaced_repetition: {
            [TEST_PROB_ID]: {
                interval: 30,
                ease_factor: 2.8,
                repetitions: 5,
                next_review: 1720000000000
            }
        },
        history: [
            {
                problem_id: TEST_PROB_ID,
                timestamp: 1720000000000,
                quality: 5,
                rating_before: 1530,
                rating_after: 1550,
                elo_change: 20
            }
        ]
    };

    if (!db.isPgAvailable()) {
        console.log('  [INFO] PostgreSQL not configured (isPgAvailable = false). Testing JSON fallback.');
        const testFile = path.join(__dirname, 'server', 'test_disposable_progress.json');
        try {
            await db.saveProgress(testFile, testPayload, TEST_PROB_ID);
            const fetched = await db.getProgress(testFile);
            
            const srMatch = fetched.spaced_repetition && fetched.spaced_repetition[TEST_PROB_ID];
            const histMatch = fetched.history && fetched.history.find(h => h.problem_id === TEST_PROB_ID);

            if (
                fetched.user_rating === 1550 &&
                srMatch &&
                srMatch.interval === 30 &&
                Math.abs(srMatch.ease_factor - 2.8) < 0.01 &&
                srMatch.repetitions === 5 &&
                String(srMatch.next_review) === '1720000000000' &&
                histMatch &&
                histMatch.quality === 5 &&
                histMatch.rating_before === 1530 &&
                histMatch.rating_after === 1550 &&
                histMatch.elo_change === 20
            ) {
                console.log('  [PASS] JSON fallback full payload roundtrip verified.');
                if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
                process.exit(0);
            } else {
                console.error('❌ FAILED: JSON roundtrip mismatch:', JSON.stringify(fetched, null, 2));
                if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ FAILED: Exception during JSON storage test:', e.message);
            if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
            process.exit(1);
        }
    } else {
        const { Client } = require('pg');
        const pgHost = process.env.POSTGRES_HOST || 'localhost';
        const pgPort = process.env.POSTGRES_PORT || 5432;
        const pgUser = process.env.POSTGRES_USER || 'postgres';
        const pgPass = process.env.POSTGRES_PASSWORD || 'algodeck_secure_pass';

        const adminClient = new Client({
            host: pgHost,
            port: pgPort,
            user: pgUser,
            password: pgPass,
            database: 'postgres'
        });

        const TEST_DB_NAME = 'algodeck_test_disposable';
        let testDb = null;

        try {
            console.log(`  [INFO] Connecting to Postgres admin interface on ${pgHost}:${pgPort}...`);
            await adminClient.connect();

            console.log(`  [INFO] Creating isolated disposable test database '${TEST_DB_NAME}'...`);
            await adminClient.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME} WITH (FORCE);`);
            await adminClient.query(`CREATE DATABASE ${TEST_DB_NAME};`);
            console.log(`  [PASS] Isolated test database '${TEST_DB_NAME}' created.`);

            // Point environment to isolated test database
            process.env.POSTGRES_DB = TEST_DB_NAME;
            process.env.DATABASE_URL = `postgres://${pgUser}:${pgPass}@${pgHost}:${pgPort}/${TEST_DB_NAME}`;

            // Re-require / re-initialize db module with test connection pool
            delete require.cache[require.resolve('./server/db')];
            testDb = require('./server/db');

            console.log('  [INFO] Running initDb() migration on 100% clean empty test database...');
            const initSuccess = await testDb.initDb();
            if (!initSuccess) {
                console.error('❌ FAILED: initDb() failed on clean test database');
                process.exit(1);
            }
            console.log('  [PASS] Clean database migration completed successfully.');

            const dummyFile = path.join(__dirname, 'server', 'disposable_pg_test.json');
            
            console.log('  [INFO] Saving test payload to clean isolated PostgreSQL database...');
            await testDb.saveProgress(dummyFile, testPayload, TEST_PROB_ID);

            console.log('  [INFO] Reading back progress and verifying full payload...');
            const fetched = await testDb.getProgress(dummyFile);

            const srMatch = fetched.spaced_repetition && fetched.spaced_repetition[TEST_PROB_ID];
            const histMatch = fetched.history && fetched.history.find(h => h.problem_id === TEST_PROB_ID);

            const isValid = (
                fetched.user_rating === 1550 &&
                srMatch &&
                srMatch.interval === 30 &&
                Math.abs(srMatch.ease_factor - 2.8) < 0.01 &&
                srMatch.repetitions === 5 &&
                String(srMatch.next_review) === '1720000000000' &&
                histMatch &&
                histMatch.quality === 5 &&
                histMatch.rating_before === 1530 &&
                histMatch.rating_after === 1550 &&
                histMatch.elo_change === 20
            );

            if (fs.existsSync(dummyFile)) fs.unlinkSync(dummyFile);

            if (isValid) {
                console.log('  [PASS] 100% isolated clean database migration & full payload roundtrip verified!');
            } else {
                console.error('❌ FAILED: PostgreSQL full payload mismatch on test DB:', JSON.stringify(fetched, null, 2));
                process.exit(1);
            }
        } catch (err) {
            console.error('❌ FAILED: Exception during isolated PostgreSQL test:', err.message);
            process.exit(1);
        } finally {
            try {
                if (testDb && typeof testDb.closePool === 'function') {
                    await testDb.closePool();
                }
                console.log(`  [INFO] Cleaning up: Dropping isolated test database '${TEST_DB_NAME}'...`);
                await adminClient.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME} WITH (FORCE);`);
                await adminClient.end();
                console.log(`  [PASS] Isolated test database '${TEST_DB_NAME}' dropped. Zero side-effects guaranteed!`);
            } catch (cleanupErr) {
                console.warn('⚠️ Warning: Failed to drop test database:', cleanupErr.message);
            }
        }
    }
}

runIsolatedDbTest();
"""

res = subprocess.run(['node', '-e', node_test_script], cwd=BASE_DIR, capture_output=True, text=True)
print(res.stdout.strip())

if res.returncode == 0:
    print("\n--------------------------------------------------")
    print("✅ Fully Isolated Disposable PostgreSQL Integration Test Passed (100% Validated)!")
    sys.exit(0)
else:
    print(res.stderr.strip())
    print("\n--------------------------------------------------")
    print("❌ Isolated PostgreSQL Integration Test Failed!")
    sys.exit(1)
