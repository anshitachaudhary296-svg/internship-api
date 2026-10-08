/**
 * Validation Middleware for Internship Data
 * 
 * Validates request body fields for POST and PUT endpoints.
 * Returns HTTP 400 with a detailed error array if validation fails.
 */

function validateInternship(req, res, next) {
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

  const errors = [];

  // 1. Validate title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  // 2. Validate company
  if (!company || typeof company !== 'string' || company.trim() === '') {
    errors.push({ field: 'company', message: 'Company is required and must be a non-empty string' });
  }

  // 3. Validate domain
  if (!domain || typeof domain !== 'string' || domain.trim() === '') {
    errors.push({ field: 'domain', message: 'Domain is required and must be a non-empty string' });
  }

  // 4. Validate location
  if (!location || typeof location !== 'string' || location.trim() === '') {
    errors.push({ field: 'location', message: 'Location is required and must be a non-empty string' });
  }

  // 5. Validate type
  if (!type || typeof type !== 'string' || type.trim() === '') {
    errors.push({ field: 'type', message: 'Type is required (e.g., Remote, On-site, Hybrid)' });
  }

  // 6. Validate skills (allow array of strings or comma-separated string)
  if (!skills) {
    errors.push({ field: 'skills', message: 'Skills is required (e.g., "React, Node.js" or ["React", "Node.js"])' });
  } else if (Array.isArray(skills)) {
    if (skills.length === 0 || skills.some((s) => typeof s !== 'string' || s.trim() === '')) {
      errors.push({ field: 'skills', message: 'Skills array cannot be empty or contain invalid entries' });
    }
  } else if (typeof skills !== 'string' || skills.trim() === '') {
    errors.push({ field: 'skills', message: 'Skills must be a non-empty string or array of strings' });
  }

  // 7. Validate description
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required and must be a non-empty string' });
  }

  // 8. Validate stipend (must be a valid non-negative number)
  if (stipend === undefined || stipend === null || stipend === '') {
    errors.push({ field: 'stipend', message: 'Stipend is required' });
  } else {
    const numericStipend = Number(stipend);
    if (isNaN(numericStipend) || numericStipend < 0) {
      errors.push({ field: 'stipend', message: 'Stipend must be a valid non-negative number' });
    }
  }

  // 9. Validate duration
  if (!duration || typeof duration !== 'string' || duration.trim() === '') {
    errors.push({ field: 'duration', message: 'Duration is required (e.g., "3 Months", "6 Months")' });
  }

  // If any errors collected, return 400 Bad Request
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the specified fields.',
      errors
    });
  }

  // Sanitize and normalize inputs on req.body
  req.body.title = title.trim();
  req.body.company = company.trim();
  req.body.domain = domain.trim();
  req.body.location = location.trim();
  req.body.type = type.trim();
  req.body.skills = Array.isArray(skills)
    ? skills.map((s) => s.trim()).join(', ')
    : skills.trim();
  req.body.description = description.trim();
  req.body.stipend = Number(stipend);
  req.body.duration = duration.trim();

  next();
}

module.exports = { validateInternship };
