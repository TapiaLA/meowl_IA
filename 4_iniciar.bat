@echo off
cd /d "%~dp0"
chcp 65001 > nul
set PYTHONIOENCODING=utf-8

title Meowl IA - Online (Modo Normal)
color 0b

echo ==================================================
echo      🐈🦉 INICIANDO SERVIDORES DE MEOWL IA
echo ==================================================
echo.

:: 1. Verificaciones
if not exist "node_modules\" (
    echo [ERROR] No encontramos las librerias. 
    echo Por favor, ejecuta primero: 1_instalar.bat
    pause
    exit
)

:: 2. Encendido del Cerebro en una ventana paralela
echo [INFO] Despertando al Cerebro (servidor.py)...
start "Cerebro IA Central" cmd /c "python servidor.py"

:: 3. Encendido de la Antena (WhatsApp)
echo [INFO] Conectando con WhatsApp...
echo [TIP]  Presiona Ctrl + C para apagar el bot.
echo --------------------------------------------------
echo.

node meowl.js

echo.
echo --------------------------------------------------
echo [ALERTA] El servidor se ha detenido.
pause