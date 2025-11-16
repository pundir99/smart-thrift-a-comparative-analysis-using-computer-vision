# Fashion Recommender ML Service

This service provides fashion item recommendations using a ResNet50-based deep learning model trained on your dataset.

## 📁 File Structure

```
ml-service/
├── models/                    # Place your pickle files here
│   ├── embeddings.pkl         # ← Download from Google Colab
│   └── filenames.pkl          # ← Download from Google Colab
├── src/
│   ├── recommender.py         # Core ML logic
│   └── service.py             # FastAPI service
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🚀 Installation Steps

### Step 1: Download Pickle Files from Google Colab

1. **In your Google Colab notebook**, after running the code that generates the pickle files:

```python
from google.colab import files
import os

# Check if files exist
if os.path.exists('embeddings.pkl'):
    print("Downloading embeddings.pkl...")
    files.download('embeddings.pkl')
else:
    print("File not found! Files in current directory:", os.listdir('.'))

if os.path.exists('filenames.pkl'):
    print("Downloading filenames.pkl...")
    files.download('filenames.pkl')
else:
    print("File not found!")
```

2. **If files are in Google Drive:**

```python
from google.colab import drive
import shutil
import os

drive.mount('/content/drive')

# Find your pickle files
# Adjust the path to where your files are saved
drive_path = '/content/drive/MyDrive'

# Search for pickle files
for root, dirs, files in os.walk(drive_path):
    for file in files:
        if file.endswith('.pkl'):
            print(f"Found: {os.path.join(root, file)}")

# Copy to current directory and download
if os.path.exists('/content/drive/MyDrive/embeddings.pkl'):
    shutil.copy('/content/drive/MyDrive/embeddings.pkl', 'embeddings.pkl')
    files.download('embeddings.pkl')
    
if os.path.exists('/content/drive/MyDrive/filenames.pkl'):
    shutil.copy('/content/drive/MyDrive/filenames.pkl', 'filenames.pkl')
    files.download('filenames.pkl')
```

### Step 2: Place Pickle Files in Project

1. Copy the downloaded `embeddings.pkl` and `filenames.pkl` files
2. Place them in: `E:\Food delivery- Tomato\ml-service\models\`
3. Create the `models` folder if it doesn't exist

### Step 3: Install Python Dependencies

**Windows PowerShell:**
```powershell
# Navigate to ml-service directory
cd "E:\Food delivery- Tomato\ml-service"

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If activation fails, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt
```

**Windows CMD:**
```cmd
cd "E:\Food delivery- Tomato\ml-service"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Mac/Linux:**
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Verify Installation

```bash
# Check Python version (should be 3.8-3.11)
python --version

# Check if packages are installed
pip list | grep tensorflow
pip list | grep fastapi
```

### Step 5: Run the ML Service

```bash
# Make sure you're in ml-service directory and venv is activated
cd "E:\Food delivery- Tomato\ml-service"
.\venv\Scripts\Activate.ps1  # or: venv\Scripts\activate on CMD

# Run the service
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
```

You should see:
```
INFO:     Started server process
Loading ResNet50 model...
✓ Model loaded successfully!
Loading embeddings from ...
✓ Loaded X embeddings and Y filenames
✓ Recommender initialized successfully!
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### Step 6: Test the Service

Open a new terminal and test:

```bash
# Health check
curl http://localhost:8001/health

# Or visit in browser:
# http://localhost:8001/health
```

## 🔧 Troubleshooting

### Error: "embeddings.pkl not found"
- Make sure pickle files are in `ml-service/models/` directory
- Check file names are exactly: `embeddings.pkl` and `filenames.pkl`

### Error: "Module not found"
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall: `pip install -r requirements.txt`

### Error: TensorFlow import error
- Install specific version: `pip install tensorflow==2.15.0`
- Check Python version: Should be 3.8-3.11

### Error: Out of memory
- Close other applications
- Reduce dataset size for testing
- Use a machine with 8GB+ RAM

### ML Service won't start
- Check if port 8001 is available: `netstat -ano | findstr :8001`
- Kill process if needed
- Try a different port: Change `--port 8001` to `--port 8002`

## 📡 API Endpoints

- `GET /` - Service status
- `GET /health` - Health check with embedding count
- `POST /recommend` - Get recommendations
  ```json
  {
    "image_url": "http://localhost:4000/images/item_image.png",
    "top_k": 5
  }
  ```

## 🔗 Integration with Backend

The Node.js backend automatically calls this service when you request recommendations:
```
GET http://localhost:4000/api/item/:itemId/recommendations
```

Make sure both services are running:
1. ML Service: `http://localhost:8001`
2. Backend: `http://localhost:4000`


