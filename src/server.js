/**
 * Server Entrypoint
 * 
 * Boots the HTTP server and verifies database initialization.
 */

require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('../database/init');
const { db } = require('../database/db');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Ensure database table exists and is seeded if newly created
    await initDatabase({ seed: true, force: false });

    const server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 Internship API Server is running in [${NODE_ENV}] mode`);
      console.log(`🌐 Base URL:          http://localhost:${PORT}`);
      console.log(`📚 Endpoints Root:     http://localhost:${PORT}/api/internships`);
      console.log(`💓 Health Check:       http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });

    // Handle graceful shutdown
    const handleShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(() => {
        db.close((err) => {
          if (err) console.error('Error closing database:', err.message);
          else console.log('📁 SQLite database connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
