# API Test Report & Documentation

This document records the automated and manual API testing results for the **Internship API** project. It includes test case summaries, HTTP methods, endpoints, expected and actual results, validation rules, and complete request/response examples.

---

## 1. Test Summary Table

| # | Test Case | Endpoint | Method | Expected Status | Actual Status | Result |
|---|-----------|----------|--------|-----------------|---------------|--------|
| 1 | Health Check Endpoint | `/api/health` | GET | `200 OK` | `200 OK` | PASS ✅ |
| 2 | List All Internships (Default Pagination) | `/api/internships` | GET | `200 OK` | `200 OK` | PASS ✅ |
| 3 | List Internships with Pagination (`page=1&limit=3`) | `/api/internships?page=1&limit=3` | GET | `200 OK` | `200 OK` | PASS ✅ |
| 4 | Get Internship by Valid ID | `/api/internships/1` | GET | `200 OK` | `200 OK` | PASS ✅ |
| 5 | Get Non-existent Internship (Not Found) | `/api/internships/9999` | GET | `404 Not Found` | `404 Not Found` | PASS ✅ |
| 6 | Create Internship - Missing Required Fields | `/api/internships` | POST | `400 Bad Request` | `400 Bad Request` | PASS ✅ |
| 7 | Create Internship - Invalid Negative Stipend | `/api/internships` | POST | `400 Bad Request` | `400 Bad Request` | PASS ✅ |
| 8 | Create Internship - Valid Payload | `/api/internships` | POST | `201 Created` | `201 Created` | PASS ✅ |
| 9 | Update Existing Internship | `/api/internships/11` | PUT | `200 OK` | `200 OK` | PASS ✅ |
| 10 | Update Non-existent Internship | `/api/internships/9999` | PUT | `404 Not Found` | `404 Not Found` | PASS ✅ |
| 11 | Delete Existing Internship | `/api/internships/11` | DELETE | `200 OK` | `200 OK` | PASS ✅ |
| 12 | Verify Deleted Internship Is Gone | `/api/internships/11` | GET | `404 Not Found` | `404 Not Found` | PASS ✅ |
| 13 | Delete Non-existent Internship | `/api/internships/9999` | DELETE | `404 Not Found` | `404 Not Found` | PASS ✅ |
| 14 | Catch Unmatched / Undefined Routes | `/api/unknown-endpoint` | GET | `404 Not Found` | `404 Not Found` | PASS ✅ |

---

## 2. Detailed Request & Response Examples

### Example 1: List Internships (with Pagination)

**Endpoint:** `GET /api/internships?page=1&limit=2`

#### Request (cURL):
```bash
curl -X GET "http://localhost:5000/api/internships?page=1&limit=2" \
     -H "Accept: application/json"
```

#### Response:
`Status: 200 OK`
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

### Example 2: Get Internship by ID

**Endpoint:** `GET /api/internships/1`

#### Request (cURL):
```bash
curl -X GET "http://localhost:5000/api/internships/1" \
     -H "Accept: application/json"
```

#### Response:
`Status: 200 OK`
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

### Example 3: Create Internship (Valid Payload)

**Endpoint:** `POST /api/internships`

#### Request (cURL):
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
       "description": "Join our agile engineering team to build scalable microservices and client portals.",
       "stipend": 27000,
       "duration": "6 Months"
     }'
```

#### Response:
`Status: 201 Created`
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
    "description": "Join our agile engineering team to build scalable microservices and client portals.",
    "stipend": 27000,
    "duration": "6 Months",
    "created_at": "2026-10-08 08:35:50"
  }
}
```

---

### Example 4: Update Internship

**Endpoint:** `PUT /api/internships/11`

#### Request (cURL):
```bash
curl -X PUT "http://localhost:5000/api/internships/11" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Senior Full Stack Engineer Intern",
       "company": "Apex Innovations Global",
       "domain": "Web Development",
       "location": "Mumbai, Maharashtra",
       "type": "Remote",
       "skills": "React, Node.js, Express, SQLite, Docker",
       "description": "Upgraded role working with distributed cloud architectures.",
       "stipend": 35000,
       "duration": "6 Months"
     }'
```

#### Response:
`Status: 200 OK`
```json
{
  "success": true,
  "message": "Internship updated successfully",
  "data": {
    "id": 11,
    "title": "Senior Full Stack Engineer Intern",
    "company": "Apex Innovations Global",
    "domain": "Web Development",
    "location": "Mumbai, Maharashtra",
    "type": "Remote",
    "skills": "React, Node.js, Express, SQLite, Docker",
    "description": "Upgraded role working with distributed cloud architectures.",
    "stipend": 35000,
    "duration": "6 Months",
    "created_at": "2026-10-08 08:35:50"
  }
}
```

---

### Example 5: Delete Internship

**Endpoint:** `DELETE /api/internships/11`

#### Request (cURL):
```bash
curl -X DELETE "http://localhost:5000/api/internships/11" \
     -H "Accept: application/json"
```

#### Response:
`Status: 200 OK`
```json
{
  "success": true,
  "message": "Internship with ID 11 deleted successfully"
}
```

---

### Example 6: Validation Failure Response

**Endpoint:** `POST /api/internships`

#### Request (cURL with invalid / missing payload):
```bash
curl -X POST "http://localhost:5000/api/internships" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "",
       "company": "Incomplete Labs",
       "stipend": -500
     }'
```

#### Response:
`Status: 400 Bad Request`
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

### Example 7: Not Found Response

**Endpoint:** `GET /api/internships/9999`

#### Request (cURL):
```bash
curl -X GET "http://localhost:5000/api/internships/9999" \
     -H "Accept: application/json"
```

#### Response:
`Status: 404 Not Found`
```json
{
  "success": false,
  "message": "Internship with ID 9999 not found"
}
```

---

## 3. How to Run the Automated Test Suite

To run the automated suite testing all 14 scenarios and generating this exact validation verification:

```bash
npm test
```
