import os
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

class SmartRotator:
    def __init__(self, keys):
        self.keys = keys
        self.index = 0
        self.failed_keys = set()

    def call_gemini(self, prompt):
        if not self.keys:
            return {"error": "No hay llaves configuradas."}

        # Intentamos rotar por todas las llaves disponibles
        for _ in range(len(self.keys)):
            current_key = self.keys[self.index]
            
            if current_key in self.failed_keys:
                self.index = (self.index + 1) % len(self.keys)
                continue

            try:
                # SINTAXIS PARA GEMINI 2.5
                client = genai.Client(api_key=current_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
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
    
    print(f"Recibiendo petición de un bot...")
    resultado = rotador.call_gemini(datos['prompt'])
    
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
    print("🚀 Cerebro Central de IA iniciado en http://localhost:5000")
    # Usamos 0.0.0.0 para que sea accesible desde otros dispositivos en tu red local
    app.run(host='0.0.0.0', port=5000)
