# 🚀 Quick Start Guide - ML Integration

This guide will help you get the ML recommendation service up and running quickly.

## ✅ Prerequisites Check

- [ ] Python 3.8-3.11 installed
- [ ] Node.js installed
- [ ] Pickle files (`embeddings.pkl` and `filenames.pkl`) downloaded from Google Colab

## 📦 Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

This will install `axios` which is needed for the ML service integration.

## 🐍 Step 2: Setup Python ML Service

### Option A: Using the startup script (Windows)

```powershell
cd ml-service
.\start.bat
```

This script will:
- Create virtual environment if needed
- Install dependencies
- Check for pickle files
- Start the ML service

### Option B: Manual setup

```powershell
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# If activation fails, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt

# Start the service
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

## 🎯 Step 3: Verify ML Service is Running

Open a new terminal and test:

```powershell
# Test health endpoint
curl http://localhost:8001/health

# Or visit in browser:
# http://localhost:8001/health
```

You should see:
```json
{
  "status": "healthy",
  "embeddings_loaded": true,
  "num_embeddings": 1000,
  "num_filenames": 1000
}
```

## 🔧 Step 4: Start Backend Server

```powershell
cd backend
npm start
```

The backend will start on `http://localhost:4000`

## 🧪 Step 5: Test the Integration

1. **Get recommendations for an item:**
   ```
   GET http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
   ```

2. **Or test in browser:**
   ```
   http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
   ```

## 📝 Running All Services

You need **3 terminal windows**:

**Terminal 1 - ML Service:**
```powershell
cd "E:\Food delivery- Tomato\ml-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Backend:**
```powershell
cd "E:\Food delivery- Tomato\backend"
npm start
```

**Terminal 3 - Frontend (if needed):**
```powershell
cd "E:\Food delivery- Tomato\frontend"
npm run dev
```

## ⚠️ Common Issues

### ML Service won't start
- **Error: "embeddings.pkl not found"**
  - Make sure `embeddings.pkl` and `filenames.pkl` are in `ml-service/` directory
  - Check file names are exact (case-sensitive)

- **Error: "Module not found: tensorflow"**
  - Activate virtual environment: `.\venv\Scripts\Activate.ps1`
  - Install: `pip install -r requirements.txt`

- **Error: Port 8001 already in use**
  ```powershell
  # Find and kill the process
  netstat -ano | findstr :8001
  taskkill /PID <PID> /F
  ```

### Backend can't connect to ML service
- Make sure ML service is running on port 8001
- Check: `curl http://localhost:8001/health`
- Verify `RECOMMENDER_SERVICE_URL` in backend `.env` (if using)

## ✅ Success Indicators

- ✅ ML service shows "✓ Recommender initialized successfully!"
- ✅ Health check returns `"status": "healthy"`
- ✅ Backend starts without errors
- ✅ Recommendations endpoint returns data

## 🎉 You're Done!

The ML recommendation system is now integrated. When users view items, they can get recommendations via:
```
GET /api/item/:itemId/recommendations
```

The system will:
1. Get the item image from your database
2. Send it to the ML service
3. Get similar items based on visual similarity
4. Return recommendations to the frontend

