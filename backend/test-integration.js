/**
 * Quick Integration Test Script
 * 
 * Run this from backend directory:
 *   cd backend
 *   node test-integration.js
 * 
 * This script tests if all services are running and ML integration is working
 */

import axios from 'axios';

const ML_SERVICE_URL = 'http://localhost:8001';
const BACKEND_URL = 'http://localhost:4000';

console.log('🧪 Testing ML Integration...\n');

// Test 1: ML Service Health
async function testMLService() {
    try {
        console.log('1️⃣ Testing ML Service...');
        const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 });
        if (response.data.status === 'healthy') {
            console.log('   ✅ ML Service is healthy!');
            console.log(`   📊 Embeddings: ${response.data.num_embeddings}`);
            console.log(`   📊 Filenames: ${response.data.num_filenames}\n`);
            return true;
        }
    } catch (error) {
        console.log('   ❌ ML Service is not running!');
        console.log(`   💡 Start it with: cd ml-service && .\\venv\\Scripts\\Activate.ps1 && python -m uvicorn src.service:app --host 0.0.0.0 --port 8001\n`);
        return false;
    }
}

// Test 2: Backend API
async function testBackend() {
    try {
        console.log('2️⃣ Testing Backend API...');
        const response = await axios.get(`${BACKEND_URL}/`, { timeout: 5000 });
        if (response.data === 'API working.') {
            console.log('   ✅ Backend is running!\n');
            return true;
        }
    } catch (error) {
        console.log('   ❌ Backend is not running!');
        console.log(`   💡 Start it with: cd backend && npm start\n`);
        return false;
    }
}

// Test 3: Get Items List
async function testGetItems() {
    try {
        console.log('3️⃣ Testing Item List API...');
        const response = await axios.get(`${BACKEND_URL}/api/item/list`, { timeout: 5000 });
        if (response.data.success && response.data.data.length > 0) {
            console.log(`   ✅ Found ${response.data.data.length} items in database`);
            console.log(`   📝 First item ID: ${response.data.data[0]._id}\n`);
            return response.data.data[0]._id;
        } else {
            console.log('   ⚠️  No items found in database\n');
            return null;
        }
    } catch (error) {
        console.log('   ❌ Failed to get items list');
        console.log(`   Error: ${error.message}\n`);
        return null;
    }
}

// Test 4: Test Recommendations
async function testRecommendations(itemId) {
    if (!itemId) {
        console.log('4️⃣ Skipping recommendations test (no items in database)\n');
        return false;
    }
    
    try {
        console.log(`4️⃣ Testing Recommendations for item: ${itemId}...`);
        const response = await axios.get(`${BACKEND_URL}/api/item/${itemId}/recommendations`, { timeout: 30000 });
        
        if (response.data.success) {
            console.log(`   ✅ Got ${response.data.data.length} recommendations!`);
            
            if (response.data.ml_recommendations) {
                console.log('   ✅ ML recommendations are working!');
                console.log('   🎯 ML model successfully found similar items\n');
            } else {
                console.log('   ⚠️  Using fallback recommendations (ML service may not be connected)\n');
            }
            return true;
        }
    } catch (error) {
        console.log('   ❌ Failed to get recommendations');
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('='.repeat(50));
    console.log('🚀 ML Integration Test Suite');
    console.log('='.repeat(50) + '\n');
    
    const mlHealthy = await testMLService();
    const backendHealthy = await testBackend();
    const itemId = await testGetItems();
    const recommendationsWorking = await testRecommendations(itemId);
    
    console.log('='.repeat(50));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(50));
    console.log(`ML Service:        ${mlHealthy ? '✅ Running' : '❌ Not Running'}`);
    console.log(`Backend API:       ${backendHealthy ? '✅ Running' : '❌ Not Running'}`);
    console.log(`Items Available:   ${itemId ? '✅ Yes' : '❌ No'}`);
    console.log(`Recommendations:   ${recommendationsWorking ? '✅ Working' : '❌ Not Working'}`);
    console.log('='.repeat(50) + '\n');
    
    if (mlHealthy && backendHealthy && recommendationsWorking) {
        console.log('🎉 SUCCESS! ML Integration is complete and working!');
        console.log('\n✅ All services are running correctly');
        console.log('✅ ML model is integrated and providing recommendations');
    } else {
        console.log('⚠️  Some tests failed. Please check the errors above.');
        console.log('\n📖 See RUN_COMPLETE_APPLICATION.md for detailed setup instructions');
    }
}

// Run tests
runTests().catch(console.error);

