// Built-in fetch is used (Node 18+)

const BASE_URL = 'http://localhost:5001/api';

// UPDATE THESE WITH REAL VALUES AFTER LOGGING IN
const STUDENT_EMAIL = 'test@example.com'; 
const STUDENT_PASSWORD = 'Password@123';

async function runTest() {
  console.log("🚀 Starting Backend API Test...");

  try {
    // 1. Login to get token
    console.log("\n1. Attempting Login...");
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: STUDENT_EMAIL, password: STUDENT_PASSWORD })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error("❌ Login failed:", loginData.message);
      console.log("NOTE: Please make sure you have a student account with the email/password above.");
      return;
    }
    
    const token = loginData.token;
    console.log("✅ Login successful! Token received.");

    // 2. Save Foundational Test Results
    console.log("\n2. Saving Foundational Test Results...");
    const saveRes = await fetch(`${BASE_URL}/student/test-results`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        testType: 'foundational',
        scores: { aptitude: 10, reasoning: 8, communication: 9 }
      })
    });
    
    const saveData = await saveRes.json();
    console.log("Result:", saveData.success ? "✅ SUCCESS" : "❌ FAILED", saveData.message || saveData.error || "");

    // 3. Save Core Test Results
    console.log("\n3. Saving Core Technical Test Results...");
    const saveCoreRes = await fetch(`${BASE_URL}/student/test-results`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        testType: 'core',
        scores: { coreTechnical: 85 }
      })
    });
    
    const saveCoreData = await saveCoreRes.json();
    console.log("Result:", saveCoreData.success ? "✅ SUCCESS" : "❌ FAILED", saveCoreData.message || saveCoreData.error || "");

    console.log("\n✨ Test sequence completed.");

  } catch (error) {
    console.error("\n❌ Error during test:", error.message);
  }
}

runTest();
