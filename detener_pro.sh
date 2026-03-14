#!/bin/bash
clear
echo "=================================================="
echo "      🛑 DETENIENDO SISTEMA MULTI-NÚCLEO"
echo "=================================================="

# Detiene y borra los procesos de la memoria de PM2
pm2 stop all
pm2 delete all

echo "✅ Meowl IA y el Cerebro han sido apagados correctamente."