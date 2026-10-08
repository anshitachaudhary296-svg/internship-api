-- Internship API Database Schema
-- Table: internships

DROP TABLE IF EXISTS internships;

CREATE TABLE IF NOT EXISTS internships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    domain TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    skills TEXT NOT NULL,
    description TEXT NOT NULL,
    stipend REAL NOT NULL,
    duration TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance on commonly filtered fields
CREATE INDEX IF NOT EXISTS idx_internships_domain ON internships(domain);
CREATE INDEX IF NOT EXISTS idx_internships_type ON internships(type);
CREATE INDEX IF NOT EXISTS idx_internships_location ON internships(location);
