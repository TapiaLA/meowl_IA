@echo off
cd /d "%~dp0"
title Gestor de API Keys - Meowl IA
color 0b

echo ==================================================
echo      🔑 GESTOR DE API KEYS DE GEMINI
echo ==================================================
echo.
echo 💡 INSTRUCCIONES:
echo 1. Se abrira el bloc de notas.
echo 2. Agrega, modifica o elimina tus llaves en la variable GEMINI_API_KEY.
echo 3. Si usas multiples llaves, separalas por comas sin espacios.
echo 4. Guarda el archivo (CTRL + G) y cierralo.
echo.
echo Abriendo escudo de seguridad .env en 3 segundos...
timeout /t 3 /nobreak >nul

:: Abre el archivo .env en el bloc de notas
notepad .env

echo.
echo ✅ Archivo cerrado. Recuerda reiniciar a Meowl para aplicar los cambios.
pause