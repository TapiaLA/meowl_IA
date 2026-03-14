#!/bin/bash

# Brújula para que no se pierda (Equivalente a cd /d "%~dp0")
cd "$(dirname "$0")"

# Códigos de color para que se vea pro (Equivalente a color 0b)
CYAN='\033[1;36m'
NC='\033[0m' # Sin color

clear
echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}    🐈🦉 BIENVENIDO AL INSTALADOR DE MEOWL IA${NC}"
echo -e "${CYAN}==================================================${NC}"
echo ""

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] No encontramos Node.js instalado."
    echo "Si estás en Termux (Android), instálalo primero con: pkg install nodejs"
    echo "Si estás en Linux, búscalo en: https://nodejs.org/"
    read -p "Presiona Enter para salir..."
    exit 1
fi

# 1.5 Verificar Python (Importante para Termux)
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "[ERROR] No encontramos Python instalado."
    echo "En Termux instálalo con: pkg install python"
    read -p "Presiona Enter para salir..."
    exit 1
fi

# 2. Instalar librerías del proyecto
echo "[1/5] Instalando dependencias de Meowl (La Antena)..."
npm install
echo ""

# 3. Instalar PM2 Globalmente
echo "[2/5] Instalando PM2 (Monitor de Procesos)..."
npm install -g pm2
echo ""

# 4. Instalar librerías de Python
echo "[3/5] Instalando dependencias de Python (El Cerebro)..."
pip install flask google-genai python-dotenv
echo ""

# 5. Configurar Entorno
echo "[4/5] Iniciando asistente de configuracion..."
echo ""
node configurar.js
echo ""

echo "[5/5] Todo listo."
echo ""
echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}   ✅ INSTALACION COMPLETADA${NC}"
echo -e "${CYAN}==================================================${NC}"
echo ""
echo "  > Para iniciar el monitor pro, usa: ./iniciar_pro.sh"
echo "  > Para el inicio normal, usa: ./iniciar.sh"
echo ""
echo -e "${CYAN}==================================================${NC}"

# Equivalente a "pause"
read -p "Presiona Enter para terminar..."