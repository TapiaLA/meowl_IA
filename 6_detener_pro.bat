@echo off
title Apagar Sistema - Modo Pro
color 0c

echo ==================================================
echo   🛑 APAGANDO MOTORES (CEREBRO Y MEOWL)
echo ==================================================
echo.

:: Le decimos a PM2 que apague y limpie todos los procesos
call pm2 delete all

echo.
echo --------------------------------------------------
echo [INFO] El Cerebro y Meowl se han desconectado.
echo --------------------------------------------------
pause