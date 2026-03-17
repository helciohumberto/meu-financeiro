@echo off
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo Matando processo na porta 3001 (PID %%a)
    taskkill /PID %%a /F >nul 2>&1
)