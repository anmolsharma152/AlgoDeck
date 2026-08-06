const fs = require('fs');
const path = require('path');

let pool = null;
let isPgAvailable = false;

function getDatabaseUrl() {
  return process.env.DATABASE_URL || (process.env.POSTGRES_HOST ? 
    `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'algodeck123'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'algodeck'}` : null);
}

function ensurePool() {
  const currentUrl = getDatabaseUrl();
  if (!currentUrl) {
    isPgAvailable = false;
    return null;
  }
  if (!pool) {
    try {
      const { Pool } = require('pg');
      pool = new Pool({
        connectionString: currentUrl,
        connectionTimeoutMillis: 5000
      });
      isPgAvailable = true;
      console.log('🐘 PostgreSQL configuration detected. Connecting to database...');
    } catch (err) {
      console.warn('⚠️ pg module not found or connection failed. Falling back to JSON file storage.');
      isPgAvailable = false;
      pool = null;
    }
  }
  return pool;
}

ensurePool();

async function initDb() {
  if (!isPgAvailable || !pool) return false;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INT PRIMARY KEY DEFAULT 1,
          user_rating INT NOT NULL DEFAULT 1200,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS spaced_repetition (
          problem_id VARCHAR(64) PRIMARY KEY,
          interval INT DEFAULT 0,
          ease_factor REAL DEFAULT 2.5,
          repetitions INT DEFAULT 0,
          next_review BIGINT DEFAULT 0,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS review_history (
          id SERIAL PRIMARY KEY,
          problem_id VARCHAR(64) NOT NULL,
          timestamp BIGINT NOT NULL,
          quality INT NOT NULL,
          rating_before INT NOT NULL,
          rating_after INT NOT NULL,
          elo_change INT NOT NULL
        );
      `);

      await client.query(`
        INSERT INTO user_progress (id, user_rating) 
        VALUES (1, 1200) 
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('✅ PostgreSQL database schema initialized successfully!');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Failed to initialize PostgreSQL tables:', err.message);
    isPgAvailable = false;
    return false;
  }
}

async function getProgress(progressFilePath) {
  if (isPgAvailable && pool) {
    try {
      const userRes = await pool.query('SELECT user_rating FROM user_progress WHERE id = 1');
      const userRating = userRes.rows.length > 0 ? userRes.rows[0].user_rating : 1200;

      const srRes = await pool.query('SELECT problem_id, interval, ease_factor, repetitions, next_review FROM spaced_repetition');
      const spaced_repetition = {};
      srRes.rows.forEach(row => {
        spaced_repetition[row.problem_id] = {
          interval: row.interval,
          ease_factor: row.ease_factor,
          repetitions: row.repetitions,
          next_review: Number(row.next_review)
        };
      });

      const histRes = await pool.query('SELECT problem_id, timestamp, quality, rating_before, rating_after, elo_change FROM review_history ORDER BY id ASC LIMIT 500');
      const history = histRes.rows.map(r => ({
        problem_id: r.problem_id,
        timestamp: Number(r.timestamp),
        quality: r.quality,
        rating_before: r.rating_before,
        rating_after: r.rating_after,
        elo_change: r.elo_change
      }));

      return {
        user_rating: userRating,
        spaced_repetition,
        history
      };
    } catch (err) {
      console.error('Error fetching progress from Postgres:', err.message);
    }
  }

  if (!fs.existsSync(progressFilePath)) {
    return { user_rating: 1200, spaced_repetition: {}, history: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(progressFilePath, 'utf-8'));
  } catch (err) {
    return { user_rating: 1200, spaced_repetition: {}, history: [] };
  }
}

async function saveProgress(progressFilePath, data, lastSubmittedProblemId = null) {
  try {
    fs.writeFileSync(progressFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing fallback json file:', err);
  }

  if (isPgAvailable && pool) {
    try {
      await pool.query('UPDATE user_progress SET user_rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1', [data.user_rating || 1200]);

      if (lastSubmittedProblemId && data.spaced_repetition[lastSubmittedProblemId]) {
        const sr = data.spaced_repetition[lastSubmittedProblemId];
        await pool.query(`
          INSERT INTO spaced_repetition (problem_id, interval, ease_factor, repetitions, next_review, updated_at)
          VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
          ON CONFLICT (problem_id) DO UPDATE SET
            interval = EXCLUDED.interval,
            ease_factor = EXCLUDED.ease_factor,
            repetitions = EXCLUDED.repetitions,
            next_review = EXCLUDED.next_review,
            updated_at = CURRENT_TIMESTAMP;
        `, [lastSubmittedProblemId, sr.interval, sr.ease_factor, sr.repetitions, sr.next_review]);
      }

      if (data.history && data.history.length > 0) {
        const lastHist = data.history[data.history.length - 1];
        await pool.query(`
          INSERT INTO review_history (problem_id, timestamp, quality, rating_before, rating_after, elo_change)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [lastHist.problem_id, lastHist.timestamp, lastHist.quality, lastHist.rating_before, lastHist.rating_after, lastHist.elo_change]);
      }
    } catch (err) {
      console.error('Error saving progress to Postgres:', err.message);
    }
  }
}

module.exports = {
  initDb,
  getProgress,
  saveProgress,
  isPgAvailable: () => isPgAvailable,
  getPool: () => pool,
  closePool: async () => {
    if (pool) {
      await pool.end();
      pool = null;
    }
  }
};
