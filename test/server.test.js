/**
 * Simple test script to verify the server is working correctly
 */

const http = require('http');
const assert = require('assert');

// Configuration
const HOST = 'localhost';
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

// Test endpoints
const endpoints = [
  { path: '/', expectedStatus: 200, description: 'Home page' },
  { path: '/api/bluesky', expectedStatus: 200, description: 'BlueSky API' },
  { path: '/nonexistent', expectedStatus: 404, description: '404 page' }
];

/**
 * Make an HTTP request to the specified URL
 * @param {string} url - The URL to request
 * @returns {Promise<Object>} - Response object with status and body
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting server tests...');
  console.log(`Testing server at ${BASE_URL}\n`);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const endpoint of endpoints) {
    const url = `${BASE_URL}${endpoint.path}`;
    console.log(`Testing: ${endpoint.description} (${url})`);
    
    try {
      const response = await makeRequest(url);
      
      // Check status code
      if (response.status === endpoint.expectedStatus) {
        console.log(`✅ Status code: ${response.status} (expected ${endpoint.expectedStatus})`);
        passedTests++;
      } else {
        console.log(`❌ Status code: ${response.status} (expected ${endpoint.expectedStatus})`);
        failedTests++;
      }
      
      // Additional checks for specific endpoints
      if (endpoint.path === '/api/bluesky' && response.status === 200) {
        try {
          const data = JSON.parse(response.body);
          if (Array.isArray(data) && data.length > 0) {
            console.log(`✅ BlueSky API returned ${data.length} posts`);
          } else {
            console.log('⚠️ BlueSky API returned an empty or invalid response');
          }
        } catch (e) {
          console.log('❌ BlueSky API returned invalid JSON');
          failedTests++;
        }
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failedTests++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Print summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${endpoints.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if server is running before starting tests
const serverCheckUrl = `${BASE_URL}`;
makeRequest(serverCheckUrl)
  .then(() => {
    console.log('Server is running. Starting tests...');
    runTests();
  })
  .catch((error) => {
    console.error(`Error: Server is not running at ${BASE_URL}`);
    console.error('Please start the server before running tests.');
    console.error(`Technical details: ${error.message}`);
    process.exit(1);
  });
