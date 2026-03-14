@echo off

:: Brújula para que no se pierda en System32

cd /d "%~dp0"



title Instalador de Meowl IA - Dev Niklan

color 0b



echo ==================================================

echo    🐈🦉 BIENVENIDO AL INSTALADOR DE MEOWL IA

echo ==================================================

echo.



:: 1. Verificar Node.js

node -v >nul 2>&1

if %errorlevel% neq 0 (

    echo [ERROR] No encontramos Node.js instalado.

    echo Descargalo en: https://nodejs.org/

    pause

    exit

)



:: 2. Instalar librerias del proyecto

echo [1/5] Instalando dependencias de Meowl...

call npm install



echo.

:: 3. Instalar PM2 Globalmente

echo [2/5] Instalando PM2 (Monitor de Procesos)...

call npm install -g pm2

echo.

:: NUEVO: Instalar librerías de Python

echo [3/5] Instalando dependencias de Python (El Cerebro)...

pip install flask google-genai python-dotenv

echo.

:: 4. Configurar Entorno

echo [4/5] Iniciando asistente de configuracion...

echo.

node configurar.js



echo.

echo [5/5] Todo listo.

echo.

echo ==================================================

echo   INSTALACION COMPLETADA

echo ==================================================

echo.

echo  > Para iniciar el monitor pro, usa: iniciar_pro.bat

echo  > Para el inicio normal, usa: iniciar.bat

echo.

echo ==================================================

pause