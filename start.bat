@echo off
echo ========================================
echo   Restaurant POS System Startup
echo ========================================
echo.

echo Starting Backend Server...
start "POS Backend" cmd /k "cd /d %~dp0 && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "POS Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
