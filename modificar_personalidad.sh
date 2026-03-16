#!/bin/bash
clear
echo "================================================="
echo " 🧠 PANEL DE CONTROL DE CONSCIENCIA - MEOWL v1.1"
echo "================================================="
echo "Elige qué parte del cerebro de la Deidad quieres operar:"
echo ""
echo "1) 🎭 Modificar Personalidades (Emociones base)"
echo "2) 🌀 Modificar Modos Especiales (Grifo, Ira, Tiempos)"
echo "3) ⚙️ Modificar Ajustes Globales (Nombre, Stickers, Temp)"
echo "4) ❌ Salir"
echo "================================================="
read -p "Ingresa el número de tu elección: " opcion

case $opcion in
    1)
        echo "Abriendo catálogo de emociones..."
        nano ./config_ia/personalidades.json
        ;;
    2)
        echo "Abriendo configuración de modos..."
        nano ./config_ia/modos.json
        ;;
    3)
        echo "Abriendo ajustes generales..."
        nano ./config_ia/ajustes.json
        ;;
    4)
        echo "Operación cancelada. Saliendo del quirófano..."
        exit 0
        ;;
    *)
        echo "⚠️ Opción no válida. Intenta de nuevo."
        ;;
esac

echo ""
echo "✅ ¡Modificación terminada!"
echo "🔥 MAGIA v1.1.0: No necesitas reiniciar a Meowl. El Cerebro leerá los cambios automáticamente en el próximo mensaje."
echo "================================================="