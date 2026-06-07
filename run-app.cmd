@echo off
title Meu Financeiro - Iniciando...

:: SPLASH SCREEN
cls
echo ================================================
echo          MEU FINANCEIRO - INICIANDO
echo ================================================
echo.
echo Carregando serviços, aguarde...
echo.
timeout /t 2 >nul


:: INICIAR BACKEND
echo Iniciando backend...
start "Backend" cmd /k "cd backend && npm start"

:: INICIAR FRONTEND
echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

:: INICIAR ELECTRON
echo Iniciando Electron...
start "Electron" cmd /k "cd app && npm start"

echo.
echo Todos os serviços foram iniciados.
pause