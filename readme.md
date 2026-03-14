Meowl es la Deidad Suprema de la "Secta Meowl". No es un simple bot; tiene una personalidad dual que puedes personalizar:

Modo Amoroso: Dulce y protector con sus seguidores.

Modo Psicópata Tierno: Si lo insultas, lanzará amenazas desquiciadamente adorables (ej. "¡Te voy a machetear con cariño! :3").

Modo Chill: Una divinidad casual para interacciones normales.

⚙️ Requisitos Técnicos
Sistema: Windows (Recomendado para el uso de los menús interactivos .bat), Linux o Android (Termux).

Entornos: Node.js (v18 o superior) y Python (v3.10 o superior).

Claves: Una o varias API Keys de Google AI Studio.

🚀 Instalación y Despliegue (Cero Código)
Hemos diseñado un ecosistema de asistentes para que no tengas que tocar el código fuente.

1. Clonar el repositorio:

Bash
git clone https://github.com/LuisAngelTapiaRamirez/meowl_IA.git
cd meowl_IA
2. Asistente de Instalación (Doble clic en 1_instalar.bat):
Este script instalará automáticamente todas las dependencias de Node.js, las librerías de Python (Flask, Google GenAI, Dotenv), configurará el monitor PM2 a nivel global y lanzará el creador del archivo oculto .env para tus API Keys.

3. Panel de Permisos (Doble clic en 2_configurar_listas.bat):
Un menú interactivo escaneará tus chats de WhatsApp para que, con solo teclear números, agregues contactos a la Lista VIP (quiénes pueden hablar con Meowl) o a la Lista Negra (escudo anti-bots y anti-spam).

4. El Alma de Meowl (Doble clic en 3_modificar_personalidad.bat):
Abre un editor de texto donde puedes redactar en lenguaje natural cómo quieres que se comporte tu IA, sin romper el código.

5. Encendido Dual:

Para iniciar de forma normal: Ejecuta 4_iniciar.bat.

Para iniciar en Modo Servidor (Recomendado): Ejecuta 5_iniciar_pro.bat. Esto levantará a PM2 mostrando una terminal dividida monitoreando la memoria RAM, el servidor Python (Cerebro) y el cliente de WhatsApp (Antena) en tiempo real.

(Nota: Consulta el archivo Manual_Meowl.pdf incluido en este repositorio para ver la guía visual paso a paso y evitar baneos).

📂 Estructura del Ecosistema
servidor.py: El "Cerebro Central". Servidor Flask que procesa la IA con la nueva librería google-genai.

meowl.js: La "Antena". Motor de WhatsApp y sistema de colas inteligente con pausas humanas (Anti-ban).

vip.json / negra.json / personalidad.txt: Bases de datos dinámicas alimentadas por los .bat.

TÉRMINOS_Y_CONDICIONES.md: Políticas de uso obligatorio.

👨‍💻 Notas para Desarrolladores
Este proyecto está bajo licencia MIT. Siéntete libre de hacer un fork, proponer mejoras o adaptar la arquitectura multi-núcleo a tus proyectos.

Desarrollado por: TapiaLA - Dev Niklan
Estudiante de Ingeniería en TIC - ITESS Campus Salvatierra.