#!/bin/bash
# Matar procesos viejos para no saturar el cel
pm2 delete all

# Encender los motores
pm2 start servidor.py --interpreter python --name "Cerebro-IA"
pm2 start meowl.js --name "Meowl-Bot"

# Mostrar el monitor
pm2 monit