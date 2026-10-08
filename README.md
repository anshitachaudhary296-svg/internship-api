# 💼 Internship REST API

> A clean, production-ready, beginner-friendly REST API for managing internship opportunities, built with **Node.js**, **Express.js**, and **SQLite** persistent storage.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Folder Structure](#-project-architecture--folder-structure)
- [Database Design](#-database-design)
- [Prerequisites](#-prerequisites)
- [Installation Instructions](#-installation-instructions)
- [Environment Configuration](#-environment-configuration)
- [Database Setup & Seeding](#-database-setup--seeding)
- [Running the Application](#-running-the-application)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Request & Response Examples](#-request--response-examples)
- [Validation & Error Handling](#-validation--error-handling)
- [Testing Instructions](#-testing-instructions)
- [Pushing to GitHub Guide](#-pushing-to-github-guide)
- [License](#-license)

---

## 🌟 Project Overview

**Internship API** is a full-featured backend RESTful service developed as part of a Full Stack Development internship evaluation. It demonstrates best practices in modern backend development:
- **Persistent SQLite storage** without heavy external database servers or MongoDB.
- **Strict input validation** ensuring data integrity across all operations.
- **Standard HTTP status codes** and predictable JSON responses.
- **Server-side pagination** with metadata for frontend consumption.
- **Centralized error handling** and modular architecture.
- **Zero hardcoded credentials** using environment variables.

---

## 🚀 Key Features

- **Full CRUD Support**: Create, Read, Update, and Delete internship records.
- **Server-side Pagination**: Dynamic `page` and `limit` query parameters with complete pagination metadata (`totalPages`, `totalRecords`, `hasNextPage`, `hasPrevPage`).
- **Flexible Filtering**: Query by `domain`, work `type` (Remote/Hybrid/On-site), or full-text `search`.
- **Field Validation**: Robust middleware verifying non-empty strings, positive stipend values, and formatting before hitting the database.
- **Centralized Error Handling**: Standardized error responses with appropriate HTTP status codes (200, 201, 400, 404, 500).
- **CORS Configured**: Cross-Origin Resource Sharing enabled for modern frontend apps (React, Next.js, Vue, etc.).
- **Auto-Initialization**: Database schema and realistic seed data are automatically set up on first launch.
- **Automated Test Suite**: Built-in test runner with 14 automated test assertions covering happy paths and edge cases.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** (v18+) | JavaScript runtime environment |
| **Express.js** (v5) | Web application framework for routing and middleware |
| **SQLite3** | Lightweight, serverless, file-based relational database |
| **dotenv** | Environment configuration management |
| **CORS** | Cross-Origin Resource Sharing support |
| **Morgan** | HTTP request logger middleware |
| **Nodemon** | Development live-reload utility |

---

## 📁 Project Architecture & Folder Structure

The project follows a clean MVC-inspired modular architecture:

```
internship-api/
├── .env.example                     # Environment template file
├── .env                             # Local environment variables (gitignored)
├── .gitignore                       # Git ignore configuration
├── package.json                     # Project manifest and scripts
├── README.md                        # Project documentation
│
├── database/
│   ├── schema.sql                   # Table DDL & index definitions
│   ├── seed.sql                     # 10 realistic initial internship records
│   ├── db.js                        # SQLite connection & Promisified helpers
│   └── init.js                      # DB creation and migration CLI runner
│
├── src/
│   ├── server.js                    # Entry point: starts server & connects DB
│   ├── app.js                       # Express app configuration & middleware
│   ├── controllers/
│   │   └── internshipController.js  # CRUD controller business logic
│   ├── middlewares/
│   │   ├── validateInternship.js    # Request body validator
│   │   ├── errorHandler.js          # Centralized error handler
│   │   └── notFound.js              # 404 handler for invalid routes
│   └── routes/
│       └── internshipRoutes.js      # REST API route definitions
│
└── tests/
    ├── api-tests.md                 # Test report & markdown documentation
    └── run-tests.js                 # Automated API test suite
```

---

## 🗄️ Database Design

### Internship Entity Fields

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INTEGER` | Primary Key, Auto-increment | Unique identifier |
| `title` | `TEXT` | NOT NULL | Job role / internship title |
| `company` | `TEXT` | NOT NULL | Hiring company name |
| `domain` | `TEXT` | NOT NULL | Domain (e.g. Web Development, AI, Data Science) |
| `location` | `TEXT` | NOT NULL | City, Country, or Remote |
| `type` | `TEXT` | NOT NULL | Remote, Hybrid, or On-site |
| `skills` | `TEXT` | NOT NULL | Comma-separated required skills |
| `description` | `TEXT` | NOT NULL | Detailed description of the role |
| `stipend` | `REAL` | NOT NULL | Monthly stipend amount (numeric >= 0) |
| `duration` | `TEXT` | NOT NULL | Length of internship (e.g., "6 Months") |
| `created_at` | `DATETIME` | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |

Indexes have also been added to `domain`, `type`, and `location` for optimized filtering.

---

## ⚙️ Prerequisites

Make sure you have installed on your computer:
- [Node.js](https://nodejs.org/) (Version 18.x, 20.x, 22.x, or 24.x)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)

Verify installation:
```bash
node -v
npm -v
git --version
```

---

## 📦 Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/internship-api.git
   cd internship-api
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

---

## 🔐 Environment Configuration

1. Create your local `.env` file from the provided `.env.example`:
   ```bash
   # On Windows (PowerShell):
   Copy-Item .env.example .env

   # On Linux/macOS:
   cp .env.example .env
   ```

2. Inspect or modify `.env` variables if desired:
   ```env
   # Server Port
   PORT=5000

   # Environment
   NODE_ENV=development

   # SQLite database file path
   DB_PATH=./database/internships.db

   # CORS Allowed Origin (* allows all)
   CORS_ORIGIN=*
   ```

> **Security Note:** `.env` and `*.db` files are explicitly listed in `.gitignore` to prevent leaking configurations and runtime data into GitHub.

---

## 🗃️ Database Setup & Seeding

The server **automatically initializes and seeds** the database if it doesn't already exist when you run `npm start` or `npm run dev`.

However, you can also run manual database operations at any time:

### Reset & Seed with 10 Realistic Records:
```bash
npm run db:seed
```

### Apply Schema Only (Empty Database):
```bash
npm run db:init
```

The seed script adds **10 realistic records** representing different domains:
- Full Stack Web Developer (TechNova Solutions)
- Frontend Engineer (PixelCraft Studios)
- Backend API Engineer (CloudScale Systems)
- Mobile App Developer (AppVenture Labs)
- Data Science & Analytics (InsightEdge Analytics)
- Cloud & DevOps Engineer (InfraCore Networks)
- UI/UX Design & Frontend (DesignSphere Digital)
- Cybersecurity Analyst (SecureGuard Defense)
- QA & Automation Testing (TestFlow Technologies)
- Generative AI & NLP (CogniBot Labs)

---

## 🏃 Running the Application

### Development Mode (with live reload via nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Once started, the console will confirm:
```
====================================================
🚀 Internship API Server is running in [development] mode
🌐 Base URL:          http://localhost:5000
📚 Endpoints Root:     http://localhost:5000/api/internships
💓 Health Check:       http://localhost:5000/api/health
====================================================
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/` | API Welcome message & endpoint directory | `200` |
| `GET` | `/api/health` | Service health status check | `200` |
| `GET` | `/api/internships` | List internships with pagination & filters | `200`, `500` |
| `GET` | `/api/internships/:id` | Get single internship by ID | `200`, `400`, `404`, `500` |
| `POST` | `/api/internships` | Create new internship | `201`, `400`, `500` |
| `PUT` | `/api/internships/:id` | Update internship by ID | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/internships/:id` | Delete internship by ID | `200`, `400`, `404`, `500` |

---

## 💡 Request & Response Examples

### 1. List Internships (with Pagination)

#### Query Parameters:
- `page` (optional, default: `1`): Page number.
- `limit` (optional, default: `10`): Number of records per page.
- `domain` (optional): Filter by domain (e.g., `Web Development`).
- `type` (optional): Filter by type (`Remote`, `Hybrid`, `On-site`).
- `search` (optional): Keyword search in title, company, or skills.

#### Request:
```bash
curl -X GET "http://localhost:5000/api/internships?page=1&limit=2"
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Internships retrieved successfully",
  "pagination": {
    "currentPage": 1,
    "limit": 2,
    "totalRecords": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "data": [
    {
      "id": 10,
      "title": "Generative AI & NLP Intern",
      "company": "CogniBot Labs",
      "domain": "Artificial Intelligence",
      "location": "Bengaluru, Karnataka",
      "type": "Remote",
      "skills": "Python, LangChain, OpenAI API, HuggingFace, Vector Databases",
      "description": "Build conversational AI prototypes, fine-tune prompt templates for retrieval-augmented generation (RAG) pipelines, and integrate AI APIs into web apps.",
      "stipend": 32000,
      "duration": "6 Months",
      "created_at": "2026-10-08 08:32:00"
    },
    {
      "id": 9,
      "title": "QA & Automation Testing Intern",
      "company": "TestFlow Technologies",
      "domain": "Quality Assurance",
      "location": "Remote",
      "type": "Remote",
      "skills": "JavaScript, Cypress, Postman, Jest, API Testing",
      "description": "Write automated end-to-end and regression test scripts, perform rigorous API endpoint testing using Postman, and log defects in issue-tracking boards.",
      "stipend": 19000,
      "duration": "3 Months",
      "created_at": "2026-10-08 08:32:00"
    }
  ]
}
```

---

### 2. Get Single Internship by ID

#### Request:
```bash
curl -X GET "http://localhost:5000/api/internships/1"
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Internship retrieved successfully",
  "data": {
    "id": 1,
    "title": "Full Stack Web Developer Intern",
    "company": "TechNova Solutions",
    "domain": "Web Development",
    "location": "Bengaluru, Karnataka",
    "type": "Hybrid",
    "skills": "React, Node.js, Express, SQLite, Git",
    "description": "Work closely with senior engineers to build responsive web portals, develop RESTful microservices, and optimize database queries for client-facing applications.",
    "stipend": 25000,
    "duration": "6 Months",
    "created_at": "2026-10-08 08:32:00"
  }
}
```

---

### 3. Create a New Internship

#### Request:
```bash
curl -X POST "http://localhost:5000/api/internships" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Full Stack Engineer Intern",
       "company": "Apex Innovations",
       "domain": "Web Development",
       "location": "Mumbai, Maharashtra",
       "type": "Hybrid",
       "skills": "React, Node.js, Express, SQLite",
       "description": "Join our agile engineering team to build scalable microservices.",
       "stipend": 27000,
       "duration": "6 Months"
     }'
```

#### Response (`201 Created`):
```json
{
  "success": true,
  "message": "Internship created successfully",
  "data": {
    "id": 11,
    "title": "Full Stack Engineer Intern",
    "company": "Apex Innovations",
    "domain": "Web Development",
    "location": "Mumbai, Maharashtra",
    "type": "Hybrid",
    "skills": "React, Node.js, Express, SQLite",
    "description": "Join our agile engineering team to build scalable microservices.",
    "stipend": 27000,
    "duration": "6 Months",
    "created_at": "2026-10-08 08:35:50"
  }
}
```

---

### 4. Update an Internship

#### Request:
```bash
curl -X PUT "http://localhost:5000/api/internships/11" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Lead Full Stack Engineer Intern",
       "company": "Apex Innovations Global",
       "domain": "Web Development",
       "location": "Mumbai, Maharashtra",
       "type": "Remote",
       "skills": "React, Node.js, Express, SQLite, Docker",
       "description": "Leading microservice refactoring in cloud environment.",
       "stipend": 35000,
       "duration": "6 Months"
     }'
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Internship updated successfully",
  "data": {
    "id": 11,
    "title": "Lead Full Stack Engineer Intern",
    "company": "Apex Innovations Global",
    "domain": "Web Development",
    "location": "Mumbai, Maharashtra",
    "type": "Remote",
    "skills": "React, Node.js, Express, SQLite, Docker",
    "description": "Leading microservice refactoring in cloud environment.",
    "stipend": 35000,
    "duration": "6 Months",
    "created_at": "2026-10-08 08:35:50"
  }
}
```

---

### 5. Delete an Internship

#### Request:
```bash
curl -X DELETE "http://localhost:5000/api/internships/11"
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Internship with ID 11 deleted successfully"
}
```

---

### 6. Validation Failure Example

#### Request with missing fields & negative stipend:
```bash
curl -X POST "http://localhost:5000/api/internships" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "",
       "company": "Tech Corp",
       "stipend": -2000
     }'
```

#### Response (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Validation failed. Please correct the specified fields.",
  "errors": [
    {
      "field": "title",
      "message": "Title is required and must be a non-empty string"
    },
    {
      "field": "domain",
      "message": "Domain is required and must be a non-empty string"
    },
    {
      "field": "location",
      "message": "Location is required and must be a non-empty string"
    },
    {
      "field": "type",
      "message": "Type is required (e.g., Remote, On-site, Hybrid)"
    },
    {
      "field": "skills",
      "message": "Skills is required (e.g., \"React, Node.js\" or [\"React\", \"Node.js\"])"
    },
    {
      "field": "description",
      "message": "Description is required and must be a non-empty string"
    },
    {
      "field": "stipend",
      "message": "Stipend must be a valid non-negative number"
    },
    {
      "field": "duration",
      "message": "Duration is required (e.g., \"3 Months\", \"6 Months\")"
    }
  ]
}
```

---

### 7. Not Found Example

#### Request:
```bash
curl -X GET "http://localhost:5000/api/internships/9999"
```

#### Response (`404 Not Found`):
```json
{
  "success": false,
  "message": "Internship with ID 9999 not found"
}
```

---

## 🧪 Testing Instructions

The repository includes an automated test runner script that spins up a test server, initializes the database, and asserts all 14 endpoint behaviors.

Run the test suite:
```bash
npm test
```

### Test Results Breakdown:
- ✅ Health check (`GET /api/health` -> `200`)
- ✅ List internships (`GET /api/internships` -> `200`)
- ✅ Pagination limit & page test (`GET /api/internships?page=1&limit=3` -> `200`)
- ✅ Get single internship (`GET /api/internships/1` -> `200`)
- ✅ Get non-existent internship (`GET /api/internships/9999` -> `404`)
- ✅ POST validation with missing fields (`POST /api/internships` -> `400`)
- ✅ POST validation with invalid stipend (`POST /api/internships` -> `400`)
- ✅ Create internship with valid payload (`POST /api/internships` -> `201`)
- ✅ Update existing internship (`PUT /api/internships/:id` -> `200`)
- ✅ Update non-existent internship (`PUT /api/internships/9999` -> `404`)
- ✅ Delete existing internship (`DELETE /api/internships/:id` -> `200`)
- ✅ Verify deleted internship is removed (`GET /api/internships/:id` -> `404`)
- ✅ Delete non-existent internship (`DELETE /api/internships/9999` -> `404`)
- ✅ Catch unhandled routes (`GET /api/unknown-endpoint` -> `404`)

See [tests/api-tests.md](tests/api-tests.md) for full test reports.

---

## 🚀 Pushing to GitHub Guide

Follow these quick steps to push this project to your GitHub account:

1. **Initialize Git (if not already done):**
   ```bash
   git init
   ```

2. **Check tracked files to verify `.env` and `*.db` are ignored:**
   ```bash
   git status
   ```

3. **Stage all files:**
   ```bash
   git add .
   ```

4. **Commit changes:**
   ```bash
   git commit -m "feat: complete internship REST API with SQLite persistence, validation, and tests"
   ```

5. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `internship-api`
   - Description: `REST API for Internship Management using Express.js and SQLite`
   - Choose **Public**
   - Do **NOT** check "Initialize with README" or .gitignore (we already have them)
   - Click **Create repository**

6. **Link remote repository and push:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/internship-api.git
   git push -u origin main
   ```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
