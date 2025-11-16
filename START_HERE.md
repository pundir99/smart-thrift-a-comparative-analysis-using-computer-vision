# 🚀 START HERE - Run Complete Application with ML Integration

## Quick Start (3 Steps)

### **Step 1: Install Dependencies (One-time setup)**

Run this script to check and install everything:
```powershell
.\START_ALL.bat
```

Or manually:
```powershell
# Backend
cd backend
npm install

# Frontend  
cd ..\frontend
npm install

# ML Service
cd ..\ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

### **Step 2: Start All Services (3 Terminal Windows)**

#### **Terminal 1 - ML Service:**
```powershell
cd "E:\Food delivery- Tomato\ml-service"
.\venv\Scripts\Activate.ps1
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

**Wait for:** `✓ Recommender initialized successfully!`

#### **Terminal 2 - Backend:**
```powershell
cd "E:\Food delivery- Tomato\backend"
npm start
```

**Wait for:** `server running at port: http://localhost:4000`

#### **Terminal 3 - Frontend:**
```powershell
cd "E:\Food delivery- Tomato\frontend"
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

---

### **Step 3: Test the Integration**

#### Option A: Automated Test (Recommended)
```powershell
# From backend directory
cd backend
node test-integration.js
```

#### Option B: Manual Test

1. **Test ML Service:**
   - Open: http://localhost:8001/health
   - Should show: `{"status": "healthy", ...}`

2. **Test Backend:**
   - Open: http://localhost:4000/
   - Should show: `API working.`

3. **Test Recommendations:**
   - Get an item ID: http://localhost:4000/api/item/list
   - Test recommendations: http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
   - Should return similar items!

---

## ✅ Verification Checklist

- [ ] ML Service shows "✓ Recommender initialized successfully!"
- [ ] Backend shows "server running at port: http://localhost:4000"
- [ ] Frontend shows Vite server running
- [ ] Health check returns "healthy": http://localhost:8001/health
- [ ] Recommendations endpoint works: `/api/item/:id/recommendations`

---

## 🎯 What You Should See

### ML Service Terminal:
```
Loading ResNet50 model...
✓ Model loaded successfully!
Loading embeddings from ...
✓ Loaded X embeddings and Y filenames
✓ Recommender initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### Backend Terminal:
```
server running at port: http://localhost:4000
```

### When Testing Recommendations:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Similar Item",
      "price": 25,
      ...
    }
  ],
  "ml_recommendations": [...]
}
```

---

## 🐛 Quick Troubleshooting

**ML Service won't start?**
- Check pickle files exist: `dir ml-service\embeddings.pkl`
- Activate venv: `.\venv\Scripts\Activate.ps1`
- Reinstall: `pip install -r requirements.txt`

**Backend can't connect?**
- Make sure ML service is running first
- Check port 8001: `netstat -ano | findstr :8001`

**No recommendations?**
- Check ML service health: http://localhost:8001/health
- Verify item has an image
- Check backend terminal for errors

---

## 📚 More Details

- **Full Guide:** See `RUN_COMPLETE_APPLICATION.md`
- **Quick Start:** See `QUICK_START.md`
- **Setup Guide:** See `SETUP_ML_INTEGRATION.md`

---

## 🎉 Success!

If all services are running and the test passes, your ML integration is **complete**! 

The system will automatically:
- ✅ Use ML model to find visually similar items
- ✅ Return recommendations via API
- ✅ Fallback to category-based if ML unavailable

**You're all set!** 🚀

