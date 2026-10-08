
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const internshipRoutes = require('./routes/internshipRoutes');
const { notFound } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();


const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);


if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/dashboard', express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {

  const accept = req.headers.accept || '';
  if (accept.includes('text/html') && !accept.includes('application/json')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }

  res.status(200).json({
    success: true,
    message: 'Welcome to the Internship REST API 🚀',
    dashboard: 'http://localhost:5000/dashboard',
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

app.use('/api/internships', internshipRoutes);

app.use(notFound);


app.use(errorHandler);

module.exports = app;
