const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const dbPath = process.env.DB_PATH
  ? (path.isAbsolute(process.env.DB_PATH)
    ? process.env.DB_PATH
    : path.resolve(__dirname, '..', process.env.DB_PATH))
  : path.resolve(__dirname, 'internships.db');


const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {

    db.run('PRAGMA foreign_keys = ON;');
    db.run('PRAGMA journal_mode = WAL;');
  }
});


const query = {
  /**
   * Run a query that returns multiple rows
   * @param {string} sql - SQL query string
   * @param {Array|any} params - Query parameters
   * @returns {Promise<Array>}
   */
  all: (sql, params = []) => {
    const safeParams = Array.isArray(params)
      ? params
      : (params !== undefined && params !== null ? [params] : []);
    return new Promise((resolve, reject) => {
      db.all(sql, safeParams, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  },

  /**
   * Run a query that returns a single row
   * @param {string} sql - SQL query string
   * @param {Array|any} params - Query parameters
   * @returns {Promise<Object|null>}
   */
  get: (sql, params = []) => {
    const safeParams = Array.isArray(params)
      ? params
      : (params !== undefined && params !== null ? [params] : []);
    return new Promise((resolve, reject) => {
      db.get(sql, safeParams, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  },

  /**
   * Run an INSERT / UPDATE / DELETE statement
   * @param {string} sql - SQL query string
   * @param {Array|any} params - Query parameters
   * @returns {Promise<{ lastID: number, changes: number }>}
   */
  run: (sql, params = []) => {
    const safeParams = Array.isArray(params)
      ? params
      : (params !== undefined && params !== null ? [params] : []);
    return new Promise((resolve, reject) => {
      db.run(sql, safeParams, function (err) {
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
