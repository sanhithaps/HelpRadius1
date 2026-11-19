@echo off
echo ===================================================
echo   HelpRadius - Quick Start Demo Script
echo ===================================================
echo.
echo Installing dependencies and starting backend (Port 5000)...
start "HelpRadius Backend" cmd /k "cd backend && npm install && node src/server.js"

echo Installing dependencies and starting frontend (Port 5173)...
start "HelpRadius Frontend" cmd /k "cd frontend && npm install && npm run dev -- --host --port 5173"

echo.
echo ===================================================
echo   HelpRadius is launching!
echo   Requester Link: http://localhost:5173
echo   Presentation Guide: Check PRESENTATION_GUIDE.md
echo ===================================================
pause
