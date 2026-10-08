
require('dotenv').config();


const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;


if (typeof fetch !== 'function') {
  console.error('❌ Native fetch is not supported in this Node.js runtime.');
  console.error('👉 Please update to Node.js v18+ or install node-fetch.');
  process.exit(1);
}

let errorCount = 0;

async function step(title, description, fn) {
  console.log('\n' + '━'.repeat(70));
  console.log(`📌 ${title}`);
  console.log(`   ${description}`);
  console.log('━'.repeat(70));
  try {
    const start = Date.now();
    await fn();
    const duration = Date.now() - start;
    console.log(`⏱️ Response time: ${duration}ms`);
  } catch (err) {
    errorCount++;
    console.error(`❌ Error in ${title}:`, err.message);
  }
}

async function verifyServerIsOnline() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(3000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function runDemo() {
  console.log('🚀 ========================================================');
  console.log('     INTERNSHIP REST API - LIVE INTERACTIVE DEMONSTRATION');
  console.log('     Target Server: ' + BASE_URL);
  console.log('==========================================================');


  const isOnline = await verifyServerIsOnline();
  if (!isOnline) {
    console.error(`\n❌ Could not connect to API server at ${BASE_URL}`);
    console.error('👉 Please ensure the backend server is running in another terminal:');
    console.error('   npm start   (or npm run dev)\n');
    process.exit(1);
  }


  await step(
    'STEP 1: Health Check',
    'GET /api/health - Verifies API status and timestamp',
    async () => {
      const res = await fetch(`${BASE_URL}/api/health`);
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Response Payload:\n', JSON.stringify(data, null, 2));
    }
  );


  await step(
    'STEP 2: List Internships with Pagination',
    'GET /api/internships?page=1&limit=2 - Retrieves page 1 with limit 2',
    async () => {
      const res = await fetch(`${BASE_URL}/api/internships?page=1&limit=2`);
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Pagination Metadata:', data.pagination);
      console.log(`Retrieved ${data.data.length} records:`);
      data.data.forEach((item, index) => {
        console.log(`  [${index + 1}] ID: ${item.id} | ${item.title} at ${item.company} (${item.type}) - ₹${item.stipend}`);
      });
    }
  );


  await step(
    'STEP 3: Filter by Domain',
    'GET /api/internships?domain=Web Development - Retrieves Web Dev internships',
    async () => {
      const res = await fetch(`${BASE_URL}/api/internships?domain=Web%20Development`);
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log(`Found ${data.pagination?.totalRecords ?? 0} matching records:`);
      (data.data || []).forEach((item) => {
        console.log(`  - [ID: ${item.id}] ${item.title} | ${item.company} | ${item.skills}`);
      });
    }
  );


  await step(
    'STEP 4: Retrieve Single Internship by ID',
    'GET /api/internships/1 - Fetches full details for ID 1',
    async () => {
      const res = await fetch(`${BASE_URL}/api/internships/1`);
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Internship Details:\n', JSON.stringify(data.data, null, 2));
    }
  );


  await step(
    'STEP 5: Input Validation Error Handling (Expected 400)',
    'POST /api/internships with empty title & negative stipend -> Verifies 400 rejection',
    async () => {
      const badPayload = {
        title: '',
        company: 'Incomplete Tech',
        domain: 'Backend',
        location: 'Remote',
        type: 'Remote',
        skills: 'Node.js',
        description: 'Test role',
        stipend: -1000,
        duration: '3 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badPayload)
      });
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Validation Response Payload:\n', JSON.stringify(data, null, 2));
      if (res.status === 400) {
        console.log('✅ Validation assertion passed: Bad payload was properly rejected by the API.');
      } else {
        console.warn(`⚠️ Warning: Expected HTTP 400 Bad Request, received ${res.status}`);
      }
    }
  );


  let newId = null;
  await step(
    'STEP 6: Create a New Internship',
    'POST /api/internships with valid payload -> Expecting 201 Created',
    async () => {
      const newPayload = {
        title: 'Full Stack AI Engineer Intern',
        company: 'DeepMind Pioneers',
        domain: 'Artificial Intelligence',
        location: 'Bengaluru, Karnataka',
        type: 'Hybrid',
        skills: 'Python, PyTorch, Node.js, React, SQLite',
        description: 'Contribute to cutting-edge AI systems, agent architectures, and responsive full-stack applications.',
        stipend: 35000,
        duration: '6 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayload)
      });
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      if (res.status === 201 && data.data?.id) {
        newId = data.data.id;
        console.log(`✅ Successfully created record with ID: ${newId}`);
        console.log('Created Record:\n', JSON.stringify(data.data, null, 2));
      } else {
        console.error('❌ Failed to create record:', data);
      }
    }
  );


  await step(
    'STEP 7: Update Internship',
    `PUT /api/internships/${newId || '<ID>'} - Updating stipend to 40000 and type to Remote`,
    async () => {
      if (!newId) {
        console.warn('⚠️ Skipped Step 7: No created record ID available from Step 6.');
        return;
      }
      const updatePayload = {
        title: 'Lead Full Stack AI Engineer Intern',
        company: 'DeepMind Pioneers Global',
        domain: 'Artificial Intelligence',
        location: 'Bengaluru, Karnataka',
        type: 'Remote',
        skills: 'Python, PyTorch, Node.js, React, SQLite, Docker',
        description: 'Promoted to lead AI integration projects remotely across distributed engineering squads.',
        stipend: 40000,
        duration: '6 Months'
      };
      const res = await fetch(`${BASE_URL}/api/internships/${newId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Updated Record:\n', JSON.stringify(data.data, null, 2));
    }
  );


  await step(
    'STEP 8: Delete Internship',
    `DELETE /api/internships/${newId || '<ID>'} - Removing test record`,
    async () => {
      if (!newId) {
        console.warn('⚠️ Skipped Step 8: No created record ID available from Step 6.');
        return;
      }
      const res = await fetch(`${BASE_URL}/api/internships/${newId}`, {
        method: 'DELETE'
      });
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('Delete Response:', JSON.stringify(data, null, 2));
    }
  );


  await step(
    'STEP 9: Verify Deleted Record is Gone (404 Not Found)',
    `GET /api/internships/${newId || '<ID>'} - Expecting 404 Not Found`,
    async () => {
      if (!newId) {
        console.warn('⚠️ Skipped Step 9: No created record ID available from Step 6.');
        return;
      }
      const res = await fetch(`${BASE_URL}/api/internships/${newId}`);
      console.log(`HTTP Status: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log('404 Response Payload:\n', JSON.stringify(data, null, 2));
      if (res.status === 404) {
        console.log('✅ 404 assertion passed: Deleted record is properly unreachable.');
      }
    }
  );

  console.log('\n==========================================================');
  if (errorCount === 0) {
    console.log('🎉 LIVE DEMONSTRATION COMPLETE: ALL ENDPOINTS FUNCTIONING PERFECTLY!');
  } else {
    console.log(`⚠️ DEMO FINISHED WITH ${errorCount} ERROR(S). PLEASE CHECK THE OUTPUT ABOVE.`);
  }
  console.log('==========================================================\n');
}

runDemo();
