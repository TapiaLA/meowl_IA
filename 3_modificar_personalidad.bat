@echo off
cd /d "%~dp0"
title Editor de Personalidad - Meowl IA
color 0d

echo ==================================================
echo   🐈🦉 CREADOR DE PERSONALIDAD - MEOWL IA
echo ==================================================
echo.
echo [INFO] Abriendo el nucleo de personalidad...
echo.
echo INSTRUCCIONES:
echo 1. Se abrira el Bloc de Notas.
echo 2. Escribe como quieres que se comporte tu IA.
echo 3. Guarda los cambios (Archivo ^> Guardar).
echo 4. Cierra el Bloc de Notas.
echo.
echo NOTA: Si el bot esta encendido, tendras que 
echo reiniciarlo para que lea la nueva personalidad.
echo --------------------------------------------------

:: Si por alguna razón el archivo no existe, el .bat lo crea vacío para evitar errores
if not exist "personalidad.txt" (
    echo Escribe aqui como quieres que sea la personalidad de tu bot. > personalidad.txt
)

:: Este comando abre el archivo con el editor de texto de Windows
start notepad personalidad.txt

pause