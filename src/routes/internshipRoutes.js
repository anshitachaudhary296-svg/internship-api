/**
 * Internship Routes
 * 
 * Defines routing for /api/internships endpoints
 */

const express = require('express');
const router = express.Router();

const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');

const { validateInternship } = require('../middlewares/validateInternship');

// GET /api/internships - List all with pagination & optional filtering
router.get('/', getInternships);

// GET /api/internships/:id - Get single internship
router.get('/:id', getInternshipById);

// POST /api/internships - Create new internship (validated)
router.post('/', validateInternship, createInternship);

// PUT /api/internships/:id - Update existing internship (validated)
router.put('/:id', validateInternship, updateInternship);

// DELETE /api/internships/:id - Delete an internship
router.delete('/:id', deleteInternship);

module.exports = router;
