/**
 * Database Connection & Query Helper
 * 
 * Configures the SQLite database connection and provides
 * clean Promise-based helper functions for async/await usage.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Determine database file path from environment variable or fallback to default
const dbPath = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(__dirname, 'internships.db');

// Ensure the directory for the database file exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    // Enable Foreign Key support and WAL mode for better concurrency
    db.run('PRAGMA foreign_keys = ON;');
  }
});

/**
 * Promisified query helper object
 */
const query = {
  /**
   * Run a query that returns multiple rows
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>}
   */
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  },

  /**
   * Run a query that returns a single row
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<Object|null>}
   */
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  },

  /**
   * Run an INSERT / UPDATE / DELETE statement
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<{ lastID: number, changes: number }>}
   */
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  /**
   * Run raw SQL script containing multiple statements
   * @param {string} sql - Raw SQL statements
   * @returns {Promise<void>}
   */
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  /**
   * Gracefully close database connection
   * @returns {Promise<void>}
   */
  close: () => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = {
  db,
  query,
  dbPath
};
