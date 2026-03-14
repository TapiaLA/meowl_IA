const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const hacerPregunta = (texto) => new Promise(resolve => readline.question(texto, resolve));

async function iniciarConfiguracion() {
    console.log("=========================================");
    console.log(" Asistente de Configuración (Multi-Key)");
    console.log("=========================================");

    if (fs.existsSync('.env')) {
        console.log("⚠️ El archivo .env ya existe.");
        readline.close();
        return;
    }

    let contenidoEnv = ""; // Aquí iremos acumulando las líneas del archivo
    let contador = 1;

    console.log("Ingresa tus API Keys. Presiona ENTER sin escribir nada para terminar.\n");

    while (true) {
        const key = await hacerPregunta(` Ingresa la GEMINI_KEY_${contador}: `);
        
        if (key.trim() === '') break; 
        
        // Guardamos cada clave con su propio nombre: GEMINI_KEY_1, GEMINI_KEY_2, etc.
        contenidoEnv += `GEMINI_KEY_${contador}="${key.trim()}"\n`;
        contador++;
    }

    // Agregamos cualquier otra variable fija que ocupe tu servidor.py
    const numAdmin = await hacerPregunta('\n Número de WhatsApp Administrador con  còdigo de paìs y su numero sin espacios ejemplo   +521234567890: ');
    contenidoEnv += `MI_NUMERO_PERSONAL="${numAdmin.trim()}"\n`;

    // Escribimos el archivo final
    fs.writeFileSync('.env', contenidoEnv);
    
    console.log("\n✅ ¡Éxito! Tu .env se ve así ahora:");
    console.log("-----------------------------------------");
    console.log(contenidoEnv);
    console.log("-----------------------------------------");
    
    readline.close();
}

iniciarConfiguracion();
