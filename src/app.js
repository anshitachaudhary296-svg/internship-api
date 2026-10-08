/**
 * Express Application Configuration
 * 
 * Sets up middleware, routing, CORS, logging, and error handlers.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const internshipRoutes = require('./routes/internshipRoutes');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// 1. CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Request Logging (skip during automated tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Internship REST API 🚀',
    documentation: {
      endpoints: {
        list: 'GET /api/internships?page=1&limit=5',
        getById: 'GET /api/internships/:id',
        create: 'POST /api/internships',
        update: 'PUT /api/internships/:id',
        delete: 'DELETE /api/internships/:id',
        health: 'GET /api/health'
      }
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 5. Internship Resource API Routes
app.use('/api/internships', internshipRoutes);

// 6. 404 Route Catch-all Middleware
app.use(notFound);

// 7. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
