# 🚀 Complete Application Startup Guide

This guide will help you run the entire application with ML integration and verify everything is working.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [x] Python 3.8-3.11 installed
- [x] Node.js installed
- [x] `embeddings.pkl` and `filenames.pkl` in `ml-service/` directory
- [x] MongoDB running (if using database)

---

## 🎯 Step-by-Step Startup

### **Step 1: Install All Dependencies**

#### Install Backend Dependencies
```powershell
cd "E:\Food delivery- Tomato\backend"
npm install
```

#### Install Frontend Dependencies
```powershell
cd "E:\Food delivery- Tomato\frontend"
npm install
```

#### Setup ML Service (First Time Only)
```powershell
cd "E:\Food delivery- Tomato\ml-service"

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If activation fails, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Python dependencies
pip install -r requirements.txt
```

**Note:** TensorFlow installation may take 5-10 minutes. Be patient!

---

## 🖥️ Running All Services

You need **3 separate terminal/PowerShell windows** to run all services simultaneously.

### **Terminal 1: ML Service (Port 8001)**

```powershell
cd "E:\Food delivery- Tomato\ml-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

**✅ Success indicators:**
```
INFO:     Started server process
Loading ResNet50 model...
✓ Model loaded successfully!
Loading embeddings from ...
✓ Loaded X embeddings and Y filenames
Initializing NearestNeighbors...
✓ Recommender initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8001
```

**Keep this terminal open!**

---

### **Terminal 2: Backend Server (Port 4000)**

```powershell
cd "E:\Food delivery- Tomato\backend"
npm start
```

**✅ Success indicators:**
```
server running at port: http://localhost:4000
```

**Keep this terminal open!**

---

### **Terminal 3: Frontend (Port 5173 or similar)**

```powershell
cd "E:\Food delivery- Tomato\frontend"
npm run dev
```

**✅ Success indicators:**
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

## 🧪 Testing the Integration

### **Test 1: ML Service Health Check**

Open browser or use curl:
```
http://localhost:8001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "embeddings_loaded": true,
  "num_embeddings": 1000,
  "num_filenames": 1000
}
```

✅ If you see this, ML service is working!

---

### **Test 2: Backend API Check**

Open browser:
```
http://localhost:4000/
```

**Expected Response:**
```
API working.
```

✅ Backend is running!

---

### **Test 3: Get Item List**

Open browser:
```
http://localhost:4000/api/item/list
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Item Name",
      "price": 25,
      "category": "Category",
      "image": "image_filename.png",
      ...
    },
    ...
  ]
}
```

✅ Backend can access database!

**Note:** Copy an `_id` from the response for the next test.

---

### **Test 4: Test ML Recommendations Endpoint**

Replace `YOUR_ITEM_ID` with an actual item ID from Test 3:

```
http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Similar Item 1",
      "price": 30,
      "image": "...",
      ...
    },
    ...
  ],
  "ml_recommendations": [...]
}
```

✅ **ML Integration is working!** The system found similar items using the ML model.

---

### **Test 5: Frontend Integration**

1. Open frontend in browser: `http://localhost:5173/`
2. Navigate to an item detail page (if you have one)
3. Check browser console (F12) for any errors
4. Look for recommendations section

---

## 🔍 Verification Checklist

Use this checklist to verify everything is integrated:

- [ ] **ML Service Running**
  - Terminal 1 shows "✓ Recommender initialized successfully!"
  - Health check at `http://localhost:8001/health` returns "healthy"

- [ ] **Backend Running**
  - Terminal 2 shows "server running at port: http://localhost:4000"
  - Can access `http://localhost:4000/api/item/list`

- [ ] **Frontend Running**
  - Terminal 3 shows Vite server running
  - Can access frontend in browser

- [ ] **ML Integration Working**
  - Recommendations endpoint returns data: `/api/item/:id/recommendations`
  - Response includes `ml_recommendations` field
  - Similar items are returned based on visual similarity

- [ ] **No Connection Errors**
  - Backend terminal shows no "ECONNREFUSED" errors
  - Frontend console shows no API errors

---

## 🐛 Troubleshooting

### **Problem: ML Service won't start**

**Error: "embeddings.pkl not found"**
```powershell
# Check if files exist
cd "E:\Food delivery- Tomato\ml-service"
dir embeddings.pkl
dir filenames.pkl

# If missing, make sure they're in ml-service/ directory
```

**Error: "Module not found: tensorflow"**
```powershell
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: "Port 8001 already in use"**
```powershell
# Find and kill the process
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Or use different port (update backend/.env if needed)
python -m uvicorn src.service:app --host 0.0.0.0 --port 8002
```

---

### **Problem: Backend can't connect to ML service**

**Error: "ECONNREFUSED" in backend terminal**
- Make sure ML service is running (Terminal 1)
- Check ML service is on port 8001
- Test: `curl http://localhost:8001/health`

**Error: "axios is not defined"**
```powershell
cd backend
npm install axios
```

---

### **Problem: Recommendations return empty array**

**Possible causes:**
1. ML service not running
2. Image URL not accessible
3. No matching items in database

**Check:**
- ML service health: `http://localhost:8001/health`
- Backend logs for errors
- Item has valid image URL

---

## 📊 Quick Status Check

Run these commands to check all services:

```powershell
# Check ML Service
curl http://localhost:8001/health

# Check Backend
curl http://localhost:4000/

# Check if ports are in use
netstat -ano | findstr ":8001"
netstat -ano | findstr ":4000"
netstat -ano | findstr ":5173"
```

---

## 🎉 Success!

If all tests pass, your ML integration is complete! The system will:

1. ✅ Load the ResNet50 model on startup
2. ✅ Process item images through the ML model
3. ✅ Find visually similar items
4. ✅ Return recommendations via the API
5. ✅ Fallback to category-based recommendations if ML fails

---

## 📝 Quick Reference Commands

**Start ML Service:**
```powershell
cd ml-service
.\venv\Scripts\Activate.ps1
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

**Start Backend:**
```powershell
cd backend
npm start
```

**Start Frontend:**
```powershell
cd frontend
npm run dev
```

**Test Recommendations:**
```
http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
```

---

## 🔗 Service URLs

- **ML Service:** http://localhost:8001
- **Backend API:** http://localhost:4000
- **Frontend:** http://localhost:5173 (or port shown in terminal)

---

**Need help?** Check the error messages in each terminal window for specific issues.

