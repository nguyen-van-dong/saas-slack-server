const axios = require('axios');

// Test the refresh token endpoint
async function testRefreshToken() {
  const baseURL = 'http://localhost:3000';
  
  try {
    // First, let's try to login to get a refresh token
    console.log('🔐 Testing login to get refresh token...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful:', loginResponse.data);
    const refreshToken = loginResponse.data.data.refreshToken;
    
    // Now test the refresh token endpoint
    console.log('\n🔄 Testing refresh token endpoint...');
    const refreshResponse = await axios.post(`${baseURL}/api/user/refresh-token`, {
      token: refreshToken
    });
    
    console.log('✅ Refresh token successful:', refreshResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test with invalid token
async function testInvalidRefreshToken() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('\n🚫 Testing with invalid refresh token...');
    const refreshResponse = await axios.post(`${baseURL}/api/user/refresh-token`, {
      token: 'invalid-token'
    });
    
    console.log('❌ This should have failed:', refreshResponse.data);
  } catch (error) {
    console.log('✅ Correctly rejected invalid token:', error.response?.data);
  }
}

// Run tests
testRefreshToken().then(() => {
  testInvalidRefreshToken();
});
