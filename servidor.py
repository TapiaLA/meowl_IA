import os
import json
import requests
import urllib.parse
from flask import Flask, request, jsonify
from google import genai
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# Extraer todas las llaves que empiecen con "GEMINI_KEY_"
api_keys = []
for key, value in os.environ.items():
    if key.startswith("GEMINI_KEY_") and value:
        api_keys.append(value)

print(f"✅ Cargadas {len(api_keys)} llaves API desde la bóveda.")

def alertar_al_admin(mensaje_alerta):
    telefono = os.getenv("MI_NUMERO_PERSONAL")
    token = os.getenv("WHATSAPP_TOKEN")
    
    if not telefono or not token:
        print("⚠️ No hay número configurado para alertas.")
        return

    # Codificamos el texto para que se pueda enviar por URL de forma segura
    texto_seguro = urllib.parse.quote(mensaje_alerta)
    url = f"https://api.callmebot.com/whatsapp.php?phone={telefono}&text={texto_seguro}&apikey={token}"
    
    try:
        requests.get(url, timeout=5)
        print("📱 Alerta enviada a tu WhatsApp personal.")
    except Exception as e:
        print(f"Error enviando alerta: {e}")

# 🛠️ Novedad v1.1.0: Función para leer el ADN del bot
def cargar_json(ruta):
    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Error cargando {ruta}: {e}")
        return {}

class SmartRotator:
    def __init__(self, keys):
        self.keys = keys
        self.index = 0
        self.failed_keys = set()

    # 🛠️ Modificado para aceptar las instrucciones dinámicas de la v1.1.0
    def call_gemini(self, prompt, system_instruction, temperatura):
        if not self.keys:
            return {"error": "No hay llaves configuradas."}

        # Intentamos rotar por todas las llaves disponibles
        for _ in range(len(self.keys)):
            current_key = self.keys[self.index]
            
            if current_key in self.failed_keys:
                self.index = (self.index + 1) % len(self.keys)
                continue

            try:
                # SINTAXIS PARA GEMINI 2.5 CON INSTRUCCIONES DE SISTEMA
                client = genai.Client(api_key=current_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=genai.types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=temperatura,
                    )
                )
                
                # Si tuvo éxito, movemos el índice para la próxima y retornamos
                self.index = (self.index + 1) % len(self.keys)
                return {"respuesta": response.text, "llave_usada": f"...{current_key[-4:]}"}
            
            except Exception as e:
                error_msg = str(e)
                print(f"⚠️ Llave terminada en {current_key[-4:]} falló. Error: {error_msg}")
                
                # Marcar como fallida si es error de permisos o ban
                if "API_KEY_INVALID" in error_msg or "PERMISSION_DENIED" in error_msg or "403" in error_msg:
                    self.failed_keys.add(current_key)
                
                self.index = (self.index + 1) % len(self.keys)
        
        # SI LLEGAMOS AQUÍ, ES QUE NINGUNA LLAVE FUNCIONÓ
        alertar_al_admin("🚨 CRÍTICO: Todas las llaves de Gemini se han agotado o están baneadas.")
        return {"error": "Todas las llaves están agotadas o son inválidas por hoy."}

# Inicializar el rotador y Flask
rotador = SmartRotator(api_keys)
app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    datos = request.json
    
    if not datos or 'prompt' not in datos:
        return jsonify({"error": "Falta el campo 'prompt' en la petición"}), 400
    
    # 📡 Novedad v1.1.0: Leer modo activo y cargar los JSON en tiempo real
    modo_activo = datos.get("modo", None) 
    personalidades = cargar_json('./config_ia/personalidades.json')
    modos = cargar_json('./config_ia/modos.json')
    ajustes = cargar_json('./config_ia/ajustes.json')
    
    temperatura = ajustes.get("temperatura", 0.85)
    nombre_bot = ajustes.get("nombre_bot", "Meowl IA")

    # 🧬 Construcción del System Prompt Dinámico
    system_instruction = ""
    if modo_activo and modo_activo in modos:
        instrucciones_modo = modos[modo_activo].get("instrucciones", "")
        system_instruction = f"Eres {nombre_bot}. {instrucciones_modo}"
    else:
        lista_personalidades = json.dumps(personalidades, ensure_ascii=False, indent=2)
        system_instruction = (
            f"Eres {nombre_bot} interactuando en un chat de WhatsApp.\n"
            "INSTRUCCIÓN MAESTRA: Analiza cuidadosamente el tono y la intención del mensaje del usuario. "
            "Luego, elige UNA de las siguientes personalidades de este catálogo que mejor se adapte para responderle. "
            "¡NUNCA digas qué personalidad elegiste, solo asúmela y responde!\n\n"
            f"Catálogo de Emociones:\n{lista_personalidades}"
        )

    print(f"🧠 Procesando mensaje con rotador. Modo activo: {modo_activo if modo_activo else 'Normal dinámico'}")
    
    # 🚀 Llamamos al rotador pasándole el prompt, la personalidad y la temperatura
    resultado = rotador.call_gemini(datos['prompt'], system_instruction, temperatura)
    
    status_code = 500 if "error" in resultado else 200
    return jsonify(resultado), status_code

@app.route('/api/alerta_sistema', methods=['POST'])
def alerta_sistema():
    datos = request.json
    if datos and 'mensaje' in datos:
        alertar_al_admin(f"💻 *SERVIDOR antiX Linux*\n{datos['mensaje']}")
        return jsonify({"status": "Alerta enviada"}), 200
    return jsonify({"error": "Falta el mensaje"}), 400

if __name__ == '__main__':
    print("🚀 Cerebro Central de IA iniciado en http://0.0.0.0:5000")
    # Usamos 0.0.0.0 para que sea accesible desde otros dispositivos en la red local
    app.run(host='0.0.0.0', port=5000)