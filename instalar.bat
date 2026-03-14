@echo off
title Instalador de Meowl IA - Dev Niklan
color 0b

echo ==================================================
echo   🐈 BIENVENIDO AL INSTALADOR DE MEOWL IA
echo ==================================================
echo.

:: Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No encontramos Node.js instalado. 
    echo Descargalo en: https://nodejs.org/
    pause
    exit
)

echo [1/3] Instalando dependencias de Node.js...
call npm install

echo.
echo [2/3] Iniciando asistente de configuracion...
echo.
node configurar.js

echo.
echo [3/3] Todo listo. 
echo.
echo ==================================================
echo   Para iniciar el bot, usa: node meowl.js
echo ==================================================
pause
