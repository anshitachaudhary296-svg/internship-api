/**
 * Automated API Test Runner
 * 
 * Tests all endpoints, status codes, pagination, CRUD operations,
 * and error responses using Node.js native fetch.
 */

const http = require('http');
const app = require('../src/app');
const { initDatabase } = require('../database/init');
const { db } = require('../database/db');

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Test accumulator
const testResults = [];

function recordResult(testName, method, endpoint, expectedStatus, actualStatus, pass, details = '') {
  testResults.push({
    testCase: testName,
    method,
    endpoint,
    expected: expectedStatus,
    actual: actualStatus,
    status: pass ? 'PASS ✅' : 'FAIL ❌',
    details
  });
}

async function runTests() {
  console.log('🧪 Starting API Test Suite...');
  process.env.NODE_ENV = 'test';

  // Ensure DB is initialized and seeded
  await initDatabase({ seed: true, force: true });

  // Spin up test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  console.log(`📡 Test server running on ${BASE_URL}\n`);

  let createdId = null;

  try {
    // 1. Health check
    {
      const res = await fetch(`${BASE_URL}/api/health`);
      const body = await res.json();
      const pass = res.status === 200 && body.status === 'healthy';
      recordResult('Health check', 'GET', '/api/health', 200, res.status, pass);
    }

    // 2. List all internships (default pagination)
    {
      const res = await fetch(`${BASE_URL}/api/internships`);
      const body = await res.json();
      const pass = res.status === 200 &&
                   body.success === true &&
                   Array.isArray(body.data) &&
                   body.pagination.totalRecords >= 8;
      recordResult('List internships (default)', 'GET', '/api/internships', 200, res.status, pass, `Found ${body.pagination?.totalRecords} records`);
    }

    // 3. List with pagination (page=1, limit=3)
    {
      const res = await fetch(`${BASE_URL}/api/internships?page=1&limit=3`);
      const body = await res.json();
      const pass = res.status === 200 &&
                   body.data.length === 3 &&
                   body.pagination.limit === 3 &&
                   body.pagination.currentPage === 1 &&
                   body.pagination.hasNextPage === true;
      recordResult('List internships with pagination', 'GET', '/api/internships?page=1&limit=3', 200, res.status, pass, `Returned ${body.data?.length} items`);
    }

    // 4. Get internship by valid ID
    {
      const res = await fetch(`${BASE_URL}/api/internships/1`);
      const body = await res.json();
      const pass = res.status === 200 &&
                   body.success === true &&
                   body.data.id === 1 &&
                   typeof body.data.title === 'string';
      recordResult('Get internship by valid ID', 'GET', '/api/internships/1', 200, res.status, pass, `Title: "${body.data?.title}"`);
    }

    // 5. Get internship by non-existent ID (404)
    {
      const res = await fetch(`${BASE_URL}/api/internships/9999`);
      const body = await res.json();
      const pass = res.status === 404 && body.success === false;
      recordResult('Get non-existent internship (404)', 'GET', '/api/internships/9999', 404, res.status, pass, body.message);
    }

    // 6. Validation Failure on POST (Missing required fields)
    {
      const invalidPayload = {
        title: '',
        company: 'Incomplete Corp'
        // Missing required fields
      };
      const res = await fetch(`${BASE_URL}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload)
      });
      const body = await res.json();
      const pass = res.status === 400 &&
                   body.success === false &&
                   Array.isArray(body.errors) &&
                   body.errors.length > 0;
      recordResult('Validation failure on empty POST (400)', 'POST', '/api/internships', 400, res.status, pass, `${body.errors?.length} validation errors flagged`);
    }

    // 7. Validation Failure on invalid stipend
    {
      const invalidStipendPayload = {
        title: 'Software Intern',
        company: 'Tech Corp',
        domain: 'Engineering',
        location: 'Remote',
        type: 'Remote',
        skills: 'Node.js',
        description: 'Great internship role',
        stipend: -5000, // Invalid negative number
        duration: '3 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidStipendPayload)
      });
      const body = await res.json();
      const pass = res.status === 400 &&
                   body.errors?.some((e) => e.field === 'stipend');
      recordResult('Validation failure on negative stipend (400)', 'POST', '/api/internships', 400, res.status, pass);
    }

    // 8. Create new internship with valid payload (201)
    {
      const validPayload = {
        title: 'Full Stack Engineer Intern',
        company: 'Apex Innovations',
        domain: 'Web Development',
        location: 'Mumbai, Maharashtra',
        type: 'Hybrid',
        skills: 'React, Node.js, Express, SQLite',
        description: 'Join our agile core engineering team to build scalable microservices and customer portals.',
        stipend: 27000,
        duration: '6 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      });
      const body = await res.json();
      const pass = res.status === 201 &&
                   body.success === true &&
                   body.data.id !== undefined &&
                   body.data.title === validPayload.title;
      createdId = body.data?.id;
      recordResult('Create valid internship (201)', 'POST', '/api/internships', 201, res.status, pass, `Created with ID: ${createdId}`);
    }

    // 9. Update existing internship (200)
    {
      const updatePayload = {
        title: 'Senior Full Stack Engineer Intern',
        company: 'Apex Innovations Global',
        domain: 'Web Development',
        location: 'Mumbai, Maharashtra',
        type: 'Remote',
        skills: 'React, Node.js, Express, SQLite, Docker',
        description: 'Upgraded role working with distributed cloud architectures.',
        stipend: 35000,
        duration: '6 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const body = await res.json();
      const pass = res.status === 200 &&
                   body.success === true &&
                   body.data.stipend === 35000 &&
                   body.data.type === 'Remote';
      recordResult('Update existing internship (200)', 'PUT', `/api/internships/${createdId}`, 200, res.status, pass, `Stipend updated to 35000`);
    }

    // 10. Update non-existent internship (404)
    {
      const updatePayload = {
        title: 'Ghost Role',
        company: 'Ghost Co',
        domain: 'DevOps',
        location: 'Remote',
        type: 'Remote',
        skills: 'Linux',
        description: 'Does not exist',
        stipend: 10000,
        duration: '1 Month'
      };
      const res = await fetch(`${BASE_URL}/api/internships/9999`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const body = await res.json();
      const pass = res.status === 404 && body.success === false;
      recordResult('Update non-existent internship (404)', 'PUT', '/api/internships/9999', 404, res.status, pass);
    }

    // 11. Delete created internship (200)
    {
      const res = await fetch(`${BASE_URL}/api/internships/${createdId}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true;
      recordResult('Delete internship (200)', 'DELETE', `/api/internships/${createdId}`, 200, res.status, pass, body.message);
    }

    // 12. Verify deleted internship no longer exists (404)
    {
      const res = await fetch(`${BASE_URL}/api/internships/${createdId}`);
      const body = await res.json();
      const pass = res.status === 404 && body.success === false;
      recordResult('Verify deleted internship is gone (404)', 'GET', `/api/internships/${createdId}`, 404, res.status, pass);
    }

    // 13. Delete non-existent internship (404)
    {
      const res = await fetch(`${BASE_URL}/api/internships/9999`, {
        method: 'DELETE'
      });
      const body = await res.json();
      const pass = res.status === 404 && body.success === false;
      recordResult('Delete non-existent internship (404)', 'DELETE', '/api/internships/9999', 404, res.status, pass);
    }

    // 14. Unmatched route (404)
    {
      const res = await fetch(`${BASE_URL}/api/unknown-endpoint`);
      const body = await res.json();
      const pass = res.status === 404 && body.success === false;
      recordResult('Undefined route catch-all (404)', 'GET', '/api/unknown-endpoint', 404, res.status, pass);
    }

  } finally {
    // Teardown test server & database
    server.close();
    await new Promise((resolve) => db.close(resolve));
  }

  // Print results summary
  console.log('='.repeat(90));
  console.log(
    '| ' +
    'Method'.padEnd(7) +
    ' | ' +
    'Endpoint'.padEnd(34) +
    ' | ' +
    'Expected'.padEnd(8) +
    ' | ' +
    'Actual'.padEnd(6) +
    ' | ' +
    'Status'.padEnd(9) +
    ' |'
  );
  console.log('='.repeat(90));

  let allPassed = true;
  for (const item of testResults) {
    if (!item.status.includes('PASS')) allPassed = false;
    console.log(
      '| ' +
      item.method.padEnd(7) +
      ' | ' +
      item.endpoint.padEnd(34) +
      ' | ' +
      String(item.expected).padEnd(8) +
      ' | ' +
      String(item.actual).padEnd(6) +
      ' | ' +
      item.status.padEnd(9) +
      ' |'
    );
  }
  console.log('='.repeat(90));

  if (allPassed) {
    console.log(`\n🎉 ALL ${testResults.length} TEST CASES PASSED SUCCESSFULLY!\n`);
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
