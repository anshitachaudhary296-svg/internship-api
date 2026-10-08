/**
 * Internship Controller
 * 
 * Implements CRUD business logic with SQLite persistence,
 * pagination, filtering, input validation, and standard HTTP responses.
 */

const { query } = require('../../database/db');

/**
 * GET /api/internships
 * Fetch paginated list of internships with optional filters (domain, type, search)
 */
async function getInternships(req, res, next) {
  try {
    // Parse pagination parameters
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Safeguard against excessive limit

    const offset = (page - 1) * limit;

    // Optional query filtering
    const { domain, type, search } = req.query;
    const conditions = [];
    const params = [];

    if (domain && domain.trim()) {
      conditions.push('LOWER(domain) = LOWER(?)');
      params.push(domain.trim());
    }

    if (type && type.trim()) {
      conditions.push('LOWER(type) = LOWER(?)');
      params.push(type.trim());
    }

    if (search && search.trim()) {
      conditions.push('(LOWER(title) LIKE LOWER(?) OR LOWER(company) LIKE LOWER(?) OR LOWER(skills) LIKE LOWER(?))');
      const searchWildcard = `%${search.trim()}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total matching records
    const countSql = `SELECT COUNT(*) AS total FROM internships ${whereClause};`;
    const countRow = await query.get(countSql, params);
    const totalRecords = countRow ? countRow.total : 0;

    // Fetch records with pagination
    const dataSql = `
      SELECT * FROM internships
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?;
    `;
    const queryParams = [...params, limit, offset];
    const internships = await query.all(dataSql, queryParams);

    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message: 'Internships retrieved successfully',
      pagination: {
        currentPage: page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      data: internships
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/internships/:id
 * Retrieve a single internship by its unique ID
 */
async function getInternshipById(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID. ID must be a positive integer.'
      });
    }

    const internship = await query.get('SELECT * FROM internships WHERE id = ?;', [parsedId]);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: `Internship with ID ${parsedId} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Internship retrieved successfully',
      data: internship
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/internships
 * Create a new internship record (payload validated by validateInternship middleware)
 */
async function createInternship(req, res, next) {
  try {
    const {
      title,
      company,
      domain,
      location,
      type,
      skills,
      description,
      stipend,
      duration
    } = req.body;

    const insertSql = `
      INSERT INTO internships (title, company, domain, location, type, skills, description, stipend, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const result = await query.run(insertSql, [
      title,
      company,
      domain,
      location,
      type,
      skills,
      description,
      stipend,
      duration
    ]);

    // Fetch the newly created record
    const newInternship = await query.get('SELECT * FROM internships WHERE id = ?;', [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: newInternship
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/internships/:id
 * Update an existing internship by ID
 */
async function updateInternship(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID. ID must be a positive integer.'
      });
    }

    // Check if record exists
    const existing = await query.get('SELECT * FROM internships WHERE id = ?;', [parsedId]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Internship with ID ${parsedId} not found`
      });
    }

    const {
      title,
      company,
      domain,
      location,
      type,
      skills,
      description,
      stipend,
      duration
    } = req.body;

    const updateSql = `
      UPDATE internships
      SET title = ?, company = ?, domain = ?, location = ?, type = ?, skills = ?, description = ?, stipend = ?, duration = ?
      WHERE id = ?;
    `;

    await query.run(updateSql, [
      title,
      company,
      domain,
      location,
      type,
      skills,
      description,
      stipend,
      duration,
      parsedId
    ]);

    const updatedInternship = await query.get('SELECT * FROM internships WHERE id = ?;', [parsedId]);

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: updatedInternship
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/internships/:id
 * Delete an internship by ID
 */
async function deleteInternship(req, res, next) {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid internship ID. ID must be a positive integer.'
      });
    }

    // Check if record exists
    const existing = await query.get('SELECT * FROM internships WHERE id = ?;', [parsedId]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Internship with ID ${parsedId} not found`
      });
    }

    await query.run('DELETE FROM internships WHERE id = ?;', [parsedId]);

    return res.status(200).json({
      success: true,
      message: `Internship with ID ${parsedId} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
};
