const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

// ======================================================
// 1. LA ANTENA (Conexión al Cerebro Central Python)
// ======================================================
async function consultarCerebroIA(mensajeUsuario) {
    const urlCerebro = "http://127.0.0.1:5000/api/chat";

    try {
        const respuesta = await fetch(urlCerebro, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: mensajeUsuario })
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            return datos.respuesta; // Retorna el texto generado por Gemini
        } else {
            console.error(`⚠️ Error del Cerebro: ${respuesta.status}`);
            return "Miau... mi conexión astral está saturada. Intenta en un minuto, mortal.";
        }
    } catch (error) {
        console.error(`❌ Sin conexión al Cerebro IA:`, error.message);
        return "Grrr... He perdido conexión con mi Cerebro Central. Regresa más tarde.";
    }
}

// ======================================================
// 2. CONFIGURACIÓN DE MEOWL Y WHATSAPP
// ======================================================

// Personalidad
const fs = require('fs');

// --- CARGA DINÁMICA DE PERSONALIDAD ---
let SYSTEM_PROMPT = "";
try {
    // Lee el archivo de texto
    SYSTEM_PROMPT = fs.readFileSync('./personalidad.txt', 'utf-8');
} catch (error) {
    // Si el usuario borra el archivo por accidente, Meowl tiene un respaldo
    console.log("⚠️ Advertencia: No se encontró personalidad.txt. Usando personalidad por defecto.");
    SYSTEM_PROMPT = "Eres un asistente de Inteligencia Artificial útil y conciso.";
}


// --- CARGA DINÁMICA DE LISTAS ---
const cargarLista = (archivo) => {
    try {
        return JSON.parse(fs.readFileSync(archivo, 'utf-8'));
    } catch (error) {
        return [];
    }
};

const gruposVIP = cargarLista('./vip.json');
const listaNegra = cargarLista('./negra.json');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', () => {
    console.log('¡Meowl está en línea exigiendo tributos! :3');
});

// ======================================================
// 3. SISTEMA DE COLA (Procesador Inteligente)
// ======================================================
const colaMensajes = [];
let procesandoCola = false;

async function procesarCola() {
    if (procesandoCola) return;
    procesandoCola = true;

    while (colaMensajes.length > 0) {
        // Tomamos el primer mensaje de la fila
        const peticion = colaMensajes.shift();
        const { msg, chat, promptFinal, nombreUsuario } = peticion;

        try {
            await chat.sendStateTyping();
            
            // Unimos la personalidad de Meowl con el mensaje del usuario para el Cerebro
            const promptCompleto = `${SYSTEM_PROMPT}\n\n${promptFinal}`;
            
            //  LLAMAMOS A LA ANTENA EN LUGAR DE A LA LIBRERÍA DE GOOGLE
            const textoRespuesta = await consultarCerebroIA(promptCompleto);
            
            // --- NUEVO: Retraso aleatorio de 3 a 8 segundos (Anti-Ban) ---
            const tiempoEspera = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
            await new Promise(resolve => setTimeout(resolve, tiempoEspera));
            
            console.log(`🐈 [RESPUESTA MEOWL a ${nombreUsuario}]: ${textoRespuesta}\n`);
            
            // --- NUEVO: Agregamos el carácter invisible al final del mensaje ---
            await msg.reply(textoRespuesta + '\u200B');

        } catch (error) {
            console.error("Error en el cosmos procesando mensaje:", error.message);
            await msg.reply("Miau... Hubo una interferencia en el tejido del espacio-tiempo. Intenta de nuevo.");
        }

        // Retraso de 5 segundos entre cada mensaje para no saturar WhatsApp
        if (colaMensajes.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    procesandoCola = false;
}

// ======================================================
// 4. RECEPCIÓN DE MENSAJES (El Escudo y Filtros)
// ======================================================
client.on('message', async (msg) => {
    // Ignorar estados y mensajes vacíos para evitar crasheos
    if (msg.from === 'status@broadcast' || msg.broadcast || !msg.body) return;

    // --- NUEVO: Escudo Anti-Bots (Ignora mensajes que tengan la marca invisible) ---
    if (msg.body.includes('\u200B')) {
        console.log('🛡️ Escudo activado: Se detectó un mensaje con marca de agua (posible bot).');
        return;
    }

    // Filtro dinámico para que Meowl solo responda en sus grupos/contactos VIP
    if (!gruposVIP.includes(msg.from)) return;

    // --- ESCUDO ANTI-BUCLE DINÁMICO (LISTA NEGRA) ---
    const idRemitente = msg.author || msg.from;
    
    // Verifica si el remitente está en la lista negra (funciona con números puros o con el sufijo)
    const esListaNegra = listaNegra.some(numeroNegro => idRemitente.includes(numeroNegro.replace('@c.us', '').replace('@g.us', '')));
    
    if (esListaNegra) {
        console.log('🛡️ Escudo activado: Meowl ignoró a un usuario de la lista negra.');
        return;
    }

    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nombreUsuario = contact.pushname || "humano";
    
    let contextoPrevio = "";
    let esRespuestaAMeowl = false;

    if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.fromMe) {
            let textoCitado = quotedMsg.body;
            if (textoCitado.length > 300) {
                textoCitado = textoCitado.substring(0, 300) + "...";
            }
            contextoPrevio = `(Contexto anterior: "${textoCitado}")\n`;
            esRespuestaAMeowl = true;
        }
    }

    const mencionaMeowl = msg.body.toLowerCase().includes('meowl');

    // Solo responde a menciones o respuestas
    if (mencionaMeowl || esRespuestaAMeowl) {
        const promptFinal = `Mortal [${nombreUsuario}] dice:\n${contextoPrevio}${msg.body}`;
        console.log(`\n📥 [AÑADIDO A LA COLA de ${nombreUsuario}]: ${msg.body}`);
        
        colaMensajes.push({ msg, chat, promptFinal, nombreUsuario });
        procesarCola();
    }
});

// Inicializar el cliente
client.initialize();