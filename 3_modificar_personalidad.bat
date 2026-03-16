@echo off
cls
echo =================================================
echo  🧠 PANEL DE CONTROL DE CONSCIENCIA - MEOWL v1.1
echo =================================================
echo Elige que parte del cerebro de la Deidad quieres operar:
echo.
echo 1) 🎭 Modificar Personalidades (Emociones base)
echo 2) 🌀 Modificar Modos Especiales (Grifo, Ira, Tiempos)
echo 3) ⚙️ Modificar Ajustes Globales (Nombre, Stickers, Temp)
echo 4) ❌ Salir
echo =================================================
set /p opcion="Ingresa el numero de tu eleccion: "

if "%opcion%"=="1" goto personalidades
if "%opcion%"=="2" goto modos
if "%opcion%"=="3" goto ajustes
if "%opcion%"=="4" goto salir

echo ⚠️ Opcion no valida. Intenta de nuevo.
goto fin

:personalidades
echo Abriendo catalogo de emociones...
notepad .\config_ia\personalidades.json
goto fin

:modos
echo Abriendo configuracion de modos...
notepad .\config_ia\modos.json
goto fin

:ajustes
echo Abriendo ajustes generales...
notepad .\config_ia\ajustes.json
goto fin

:salir
echo Operacion cancelada. Saliendo del quirofano...
goto fin

:fin
echo.
echo ✅ ¡Modificacion terminada!
echo 🔥 MAGIA v1.1.0: No necesitas reiniciar a Meowl. El Cerebro leera los cambios automaticamente.
echo =================================================
pause