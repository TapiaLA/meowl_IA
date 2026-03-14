 Meowl-Bot: Source Code (WhatsApp AI + Multi-Key System)

Este repositorio contiene el código fuente de Meowl, un bot inteligente para WhatsApp basado en la API de Google Gemini. Está diseñado con una arquitectura modular para desarrolladores, permitiendo la rotación de múltiples API Keys y una gestión segura de variables de entorno.
¿Quién es Meowl?

Meowl es la Deidad Suprema de la "Secta Meowl". No es un simple bot; tiene una personalidad dual:

    Modo Amoroso: Dulce y protector con sus seguidores.

    Modo Psicópata Tierno: Si lo insultas, lanzará amenazas desquiciadamente adorables (ej. "¡Te voy a machetear con cariño! :3").

    Modo Chill: Una divinidad casual para interacciones normales.

 Requisitos Técnicos

    Sistema: Linux (probado en antiX), Windows o Android (Termux).

    Entorno: Node.js (v18 o superior).

    Claves: Una o varias API Keys de Google AI Studio.

 Instalación y Despliegue
1. Clonar y Preparar
Bash

git clone https://github.com/LuisAngelTapiaRamirez/cerebro_ia.git
cd cerebro_ia
npm install

2. Configuración Interactiva (CLI Wizard)

En lugar de crear archivos manualmente, utiliza el asistente interactivo que desarrollamos para generar tu entorno seguro:
Bash

node configurar.js

El asistente te pedirá tus API Keys de Gemini y el número del administrador. Esto generará automáticamente un archivo .env protegido por el .gitignore.
3. Lanzar el Bot
Bash

node meowl.js

Escanea el código QR que aparecerá en tu terminal desde WhatsApp > Dispositivos vinculados.
 Estructura del Proyecto

    meowl.js: Motor principal del bot y lógica de la personalidad.

    configurar.js: Asistente interactivo para la creación del entorno .env.

    package.json: Gestión de dependencias (dotenv, whatsapp-web.js, generative-ai).

    .gitignore: Escudo de seguridad para evitar la filtración de claves y sesiones.

    iniciar_bot.bat: Script de arranque rápido para usuarios de Windows.

Notas para Desarrolladores

Este proyecto está bajo licencia MIT. Siéntete libre de hacer un fork, proponer mejoras o adaptar la lógica de personalidad en meowl.js.


Desarrollado por: TapiaLA - Dev Niklan
Estudiante de Ingeniería en TIC - ITESS Campus Salvatierra.
