@echo off
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
rmdir /S /Q .next\standalone 2>nul
npm run build