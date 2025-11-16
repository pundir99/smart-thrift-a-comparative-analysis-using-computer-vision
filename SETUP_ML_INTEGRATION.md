# Complete ML Integration Setup Guide

## 📋 Prerequisites

- Python 3.8, 3.9, 3.10, or 3.11 installed
- Node.js installed (for backend)
- Your pickle files (`embeddings.pkl` and `filenames.pkl`) from Google Colab

---

## 🚀 Step-by-Step Installation

### **Step 1: Download Pickle Files from Google Colab**

In your Google Colab notebook, run this code:

```python
from google.colab import files
import os

# Check if files exist in current directory
print("Files in current directory:")
print(os.listdir('.'))

# Download embeddings.pkl
if os.path.exists('embeddings.pkl'):
    print("\n✓ Found embeddings.pkl, downloading...")
    files.download('embeddings.pkl')
else:
    print("\n✗ embeddings.pkl not found in current directory")
    print("Checking Google Drive...")
    
    # If files are in Google Drive
    from google.colab import drive
    import shutil
    
    drive.mount('/content/drive')
    
    # Search for pickle files
    drive_path = '/content/drive/MyDrive'
    for root, dirs, files in os.walk(drive_path):
        for file in files:
            if 'embedding' in file.lower() and file.endswith('.pkl'):
                full_path = os.path.join(root, file)
                print(f"Found: {full_path}")
                shutil.copy(full_path, 'embeddings.pkl')
                files.download('embeddings.pkl')
                break

# Download filenames.pkl
if os.path.exists('filenames.pkl'):
    print("\n✓ Found filenames.pkl, downloading...")
    files.download('filenames.pkl')
else:
    print("\n✗ filenames.pkl not found")
    # Similar search for filenames.pkl...
```

**Alternative: If you know the exact path in Google Drive:**

```python
from google.colab import drive
import shutil
from google.colab import files

drive.mount('/content/drive')

# Update these paths to match your setup
EMBEDDINGS_DRIVE_PATH = '/content/drive/MyDrive/embeddings.pkl'
FILENAMES_DRIVE_PATH = '/content/drive/MyDrive/filenames.pkl'

# Copy to current directory
shutil.copy(EMBEDDINGS_DRIVE_PATH, 'embeddings.pkl')
shutil.copy(FILENAMES_DRIVE_PATH, 'filenames.pkl')

# Download
files.download('embeddings.pkl')
files.download('filenames.pkl')
```

---

### **Step 2: Place Pickle Files in Your Project**

1. **Create the models directory** (if it doesn't exist):
   ```
   E:\Food delivery- Tomato\ml-service\models\
   ```

2. **Copy the downloaded files** to:
   ```
   E:\Food delivery- Tomato\ml-service\models\
     ├── embeddings.pkl
     └── filenames.pkl
   ```

---

### **Step 3: Install Python Dependencies**

**Open PowerShell/CMD in the project root:**

```powershell
# Navigate to ml-service directory
cd "E:\Food delivery- Tomato\ml-service"

# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# If activation fails in PowerShell, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# For CMD, use:
# venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

**Expected output:**
```
Collecting fastapi==0.104.1
Collecting uvicorn[standard]==0.24.0
Collecting tensorflow==2.15.0
...
Successfully installed fastapi-0.104.1 tensorflow-2.15.0 ...
```

**Note:** TensorFlow installation may take 5-10 minutes depending on your internet speed.

---

### **Step 4: Verify Installation**

```powershell
# Check Python version (should be 3.8-3.11)
python --version

# Check if key packages are installed
pip list | Select-String "tensorflow"
pip list | Select-String "fastapi"
pip list | Select-String "uvicorn"
```

---

### **Step 5: Verify Pickle Files Are in Place**

```powershell
# Check if pickle files exist
dir "models\*.pkl"

# Should show:
# embeddings.pkl
# filenames.pkl
```

---

### **Step 6: Start the ML Service**

```powershell
# Make sure you're in ml-service directory and venv is activated
cd "E:\Food delivery- Tomato\ml-service"
.\venv\Scripts\Activate.ps1

# Start the service
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

**You should see:**
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

**Keep this terminal window open!**

---

### **Step 7: Test the ML Service**

**Open a new terminal/PowerShell window:**

```powershell
# Test health endpoint
curl http://localhost:8001/health

# Or visit in browser:
# http://localhost:8001/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "embeddings_loaded": true,
  "num_embeddings": 1000,
  "num_filenames": 1000
}
```

---

### **Step 8: Install Backend Dependencies (if needed)**

The backend should already have `axios` installed, but verify:

```powershell
# Navigate to backend
cd "E:\Food delivery- Tomato\backend"

# Check if axios is installed
npm list axios

# If not installed:
npm install axios
```

---

### **Step 9: Start the Backend**

```powershell
# In backend directory
cd "E:\Food delivery- Tomato\backend"
npm start
```

**Keep this terminal open too!**

---

### **Step 10: Test the Complete Integration**

1. **Get recommendations for an item:**
   ```powershell
   # Replace ITEM_ID with an actual item ID from your database
   curl http://localhost:4000/api/item/ITEM_ID/recommendations
   ```

2. **Or test in browser:**
   ```
   http://localhost:4000/api/item/YOUR_ITEM_ID/recommendations
   ```

---

## 🎯 Quick Start Commands

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

---

## 🔧 Troubleshooting

### ❌ Error: "embeddings.pkl not found"

**Solution:**
1. Check file location: `ml-service\models\embeddings.pkl`
2. Verify file names are exact: `embeddings.pkl` and `filenames.pkl` (case-sensitive)
3. Make sure you're running from `ml-service` directory

### ❌ Error: "Module not found: tensorflow"

**Solution:**
```powershell
# Activate venv first
.\venv\Scripts\Activate.ps1

# Install tensorflow
pip install tensorflow==2.15.0
```

### ❌ Error: "Python version not supported"

**Solution:**
- TensorFlow 2.15 requires Python 3.8-3.11
- Check: `python --version`
- If needed, install Python 3.11 from python.org

### ❌ Error: "Port 8001 already in use"

**Solution:**
```powershell
# Find process using port 8001
netstat -ano | findstr :8001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port:
python -m uvicorn src.service:app --host 0.0.0.0 --port 8002
# Then update backend/.env: RECOMMENDER_SERVICE_URL=http://localhost:8002
```

### ❌ Error: "ECONNREFUSED" in backend

**Solution:**
- Make sure ML service is running on port 8001
- Check: `curl http://localhost:8001/health`
- Verify backend can reach the ML service

### ❌ Error: Out of Memory

**Solution:**
- Close other applications
- Reduce dataset size for testing
- Ensure you have at least 8GB RAM
- Consider using a machine with more RAM

---

## 📁 Final Directory Structure

```
E:\Food delivery- Tomato\
├── ml-service\
│   ├── models\
│   │   ├── embeddings.pkl      ← Your file from Colab
│   │   └── filenames.pkl        ← Your file from Colab
│   ├── src\
│   │   ├── recommender.py
│   │   └── service.py
│   ├── venv\                    ← Virtual environment
│   ├── requirements.txt
│   └── README.md
├── backend\
│   ├── services\
│   │   └── recommenderService.js
│   ├── controllers\
│   │   └── itemController.js
│   └── routes\
│       └── itemRoute.js
└── frontend\
```

---

## ✅ Verification Checklist

- [ ] Pickle files downloaded from Google Colab
- [ ] Pickle files placed in `ml-service/models/`
- [ ] Python virtual environment created and activated
- [ ] All Python dependencies installed
- [ ] ML service starts without errors
- [ ] Health check returns "healthy"
- [ ] Backend can connect to ML service
- [ ] Recommendations endpoint works

---

## 🎉 Success!

If all steps completed successfully, you can now:
1. View items in your frontend
2. Click on any item to see ML-powered recommendations
3. The system will show 5 similar items based on visual similarity

**API Endpoint:**
```
GET /api/item/:itemId/recommendations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Similar Item 1",
      "price": 25,
      "image": "...",
      ...
    },
    ...
  ]
}
```

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error messages carefully
2. Verify all file paths are correct
3. Make sure all services are running
4. Check the console logs for detailed error messages


