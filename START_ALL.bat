@echo off
echo ========================================
echo Starting Complete Application
echo ========================================
echo.
echo This script will help you start all services.
echo You need to run each service in a separate terminal.
echo.
echo.

echo [1/3] Checking ML Service setup...
cd ml-service
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
if not exist "embeddings.pkl" (
    if not exist "models\embeddings.pkl" (
        echo.
        echo ERROR: embeddings.pkl not found!
        echo Please place embeddings.pkl in ml-service\ directory
        echo.
        pause
        exit /b 1
    )
)
cd ..

echo.
echo [2/3] Checking Backend setup...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
cd ..

echo.
echo [3/3] Checking Frontend setup...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Now you need to start 3 services in separate terminals:
echo.
echo TERMINAL 1 - ML Service:
echo   cd ml-service
echo   .\venv\Scripts\Activate.ps1
echo   python -m uvicorn src.service:app --host 0.0.0.0 --port 8001
echo.
echo TERMINAL 2 - Backend:
echo   cd backend
echo   npm start
echo.
echo TERMINAL 3 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo ========================================
echo.
echo After starting all services, run this to test:
echo   node test-integration.js
echo.
echo Or see RUN_COMPLETE_APPLICATION.md for detailed instructions.
echo.
pause

