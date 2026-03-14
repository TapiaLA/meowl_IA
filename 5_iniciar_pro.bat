@echo off
cd /d "%~dp0"
title Meowl IA - Dashboard Pro
color 0b

:: ESTA ES LA LÍNEA MÁGICA PARA LOS EMOJIS
chcp 65001 > nul
set PYTHONIOENCODING=utf-8

echo ==================================================
echo   🚀 ENCENDIENDO SISTEMA MULTI-NÚCLEO (PM2)
echo ==================================================

:: 1. Encendemos el Cerebro (Python)
call pm2 start servidor.py --interpreter python --name "Cerebro-IA"

:: 2. Encendemos a Meowl (Bot WhatsApp)
call pm2 start meowl.js --name "Meowl-Bot"

:: 3. Abrimos el monitor
call pm2 monit