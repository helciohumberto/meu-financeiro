@echo off
title Meu Financeiro - Iniciando...

cls
echo ================================================
echo          MEU FINANCEIRO - INICIANDO
echo ================================================
echo.
echo Carregando serviços, aguarde...
echo.
timeout /t 2 >nul

:: INICIAR FRONTEND (dev server do Vite)
echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

:: Aguarda o Vite estar pronto antes do Electron carregar
timeout /t 3 >nul

:: INICIAR ELECTRON (já inicia o backend internamente)
echo Iniciando Electron...
start "Electron" cmd /k "cd app && npm start"

echo.
echo Serviços iniciados. O backend é gerido pelo Electron.
pause