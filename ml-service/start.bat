@echo off
echo ====================================
echo Starting Fashion Recommender Service
echo ====================================
echo.

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if requirements are installed
echo Checking dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

REM Check if pickle files exist (check both root and models directory)
if not exist "embeddings.pkl" (
    if not exist "models\embeddings.pkl" (
        echo.
        echo ERROR: embeddings.pkl not found!
        echo Please place embeddings.pkl in the ml-service\ directory or models\ directory
        echo.
        pause
        exit /b 1
    )
)

if not exist "filenames.pkl" (
    if not exist "models\filenames.pkl" (
        echo.
        echo ERROR: filenames.pkl not found!
        echo Please place filenames.pkl in the ml-service\ directory or models\ directory
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Starting ML Service on port 8001...
echo Press Ctrl+C to stop
echo.

REM Start the service
python -m uvicorn src.service:app --host 0.0.0.0 --port 8001

pause


