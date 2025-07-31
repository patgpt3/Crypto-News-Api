// Simple test script to verify Privy integration
const fetch = require('node-fetch');

async function testPrivyIntegration() {
  console.log('🧪 Testing Privy Integration...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch('http://localhost:3000/sync/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Server not running or health check failed:', error.message);
  }
  
  // Test 2: Test sync endpoint
  try {
    const testResponse = await fetch('http://localhost:3000/sync/test');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Sync test passed:', testData);
    } else {
      console.log('❌ Sync test failed:', testResponse.status);
    }
  } catch (error) {
    console.log('❌ Sync test failed:', error.message);
  }
  
  // Test 3: Test user creation
  try {
    const createResponse = await fetch('http://localhost:3000/sync/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        privyId: 'test-privy-id-' + Date.now(),
        username: 'testuser-' + Date.now()
      })
    });
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ User creation test passed:', createData);
    } else {
      const errorText = await createResponse.text();
      console.log('❌ User creation test failed:', createResponse.status, errorText);
    }
  } catch (error) {
    console.log('❌ User creation test failed:', error.message);
  }
  
  console.log('\n🔧 Environment Check:');
  console.log('PRIVY_API_KEY configured:', !!process.env.PRIVY_API_KEY);
  console.log('PRIVY_APP_ID configured:', !!process.env.PRIVY_APP_ID);
  console.log('MONGOURI configured:', !!process.env.MONGOURI);
}

// Run the test
testPrivyIntegration().catch(console.error); 