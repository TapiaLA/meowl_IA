const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
// --- NOVEDAD v1.1.1: Reloj Biológico de Inicio ---
const botStartTime = Math.floor(Date.now() / 1000);

// ======================================================
// 1. CARGA DE CONFIGURACIONES Y LISTAS
// ======================================================
const cargarJSON = (archivo) => {
    try {
        return JSON.parse(fs.readFileSync(archivo, 'utf-8'));
    } catch (error) {
        console.error(`⚠️ Error cargando ${archivo}:`, error.message);
        return {}; 
    }
};

const cargarLista = (archivo) => {
    try {
        return JSON.parse(fs.readFileSync(archivo, 'utf-8'));
    } catch (error) {
        return [];
    }
};

const gruposVIP = cargarLista('./vip.json');
const listaNegra = cargarLista('./negra.json');

// --- NOVEDAD v1.1.0: Variables de Estado de la IA ---
const modosConfig = cargarJSON('./config_ia/modos.json');
const ajustesConfig = cargarJSON('./config_ia/ajustes.json');
let modoActivo = null; 
let temporizadorModo = null;

// ======================================================
// 2. LA ANTENA (Conexión al Cerebro Central Python)
// ======================================================
async function consultarCerebroIA(mensajeUsuario, modo) {
    const urlCerebro = "http://127.0.0.1:5000/api/chat";

    try {
        const respuesta = await fetch(urlCerebro, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: mensajeUsuario, modo: modo })
        });

        if (respuesta.ok) {
            const datos = await respuesta.json();
            return datos.respuesta;
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
// 3. CONFIGURACIÓN DE MEOWL Y WHATSAPP MULTIPLATAFORMA
// ======================================================
let rutaChrome = null;
if (fs.existsSync('/data/data/com.termux/files/usr/bin/chromium')) {
    rutaChrome = '/data/data/com.termux/files/usr/bin/chromium';
    console.log('📱 [Sistema] Modo Termux Activado - Usando Chromium nativo');
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: rutaChrome,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', () => {
    console.log('¡Meowl v1.1.0 está en línea exigiendo tributos! :3');
});

// ======================================================
// 4. SISTEMA DE COLA (Procesador Inteligente)
// ======================================================
const colaMensajes = [];
let procesandoCola = false;

async function procesarCola() {
    if (procesandoCola) return;
    procesandoCola = true;

    while (colaMensajes.length > 0) {
        const peticion = colaMensajes.shift();
        const { msg, chat, promptFinal, nombreUsuario } = peticion;

        try {
            await chat.sendStateTyping();
            
            // 🧠 Llamamos a la Antena
            const textoRespuesta = await consultarCerebroIA(promptFinal, modoActivo);
            
            // Retraso de Humanización
            const tiempoEspera = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
            await new Promise(resolve => setTimeout(resolve, tiempoEspera));
            
            console.log(`🐈 [RESPUESTA a ${nombreUsuario}]: ${textoRespuesta}\n`);
            await msg.reply(textoRespuesta + '\u200B');

            // 🎲 NOVEDAD v1.1.0: LANZADOR DE STICKERS RANDOM (AHORA SÍ EN SU LUGAR)
            const probabilidadSticker = ajustesConfig.probabilidad_sticker || 0.3; 
            
            if (Math.random() < probabilidadSticker) {
                const dirStickers = './stickers'; 
                
                if (fs.existsSync(dirStickers)) {
                    const archivos = fs.readdirSync(dirStickers).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
                    
                    if (archivos.length > 0) {
                        const stickerRandom = archivos[Math.floor(Math.random() * archivos.length)];
                        const mediaSticker = MessageMedia.fromFilePath(`${dirStickers}/${stickerRandom}`);
                        
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await chat.sendMessage(mediaSticker, { sendMediaAsSticker: true });
                        console.log(`🖼️ [STICKER ENVIADO]: ${stickerRandom}`);
                    }
                }
            }

        } catch (error) {
            console.error("Error en el cosmos procesando mensaje:", error.message);
            await msg.reply("Miau... Hubo una interferencia en el tejido del espacio-tiempo.");
        }

        // Retraso de 5 segundos entre cada mensaje de la fila
        if (colaMensajes.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    procesandoCola = false;
}

// ======================================================
// 5. RECEPCIÓN DE MENSAJES Y COMANDOS DE ADMIN
// ======================================================
client.on('message', async (msg) => {
    if (msg.from === 'status@broadcast' || msg.broadcast || !msg.body) return;
// 🛡️ ESCUDO ANTI-AVALANCHA: Ignorar mensajes de cuando estaba dormido
    if (msg.timestamp < botStartTime) {
        console.log('⏳ [Amnesia] Ignorando mensaje antiguo...');
        return;
    }
    // Escudo Anti-Bots y Lista VIP/Negra
    if (msg.body.includes('\u200B')) return;
    if (!gruposVIP.includes(msg.from)) return;

    const idRemitente = msg.author || msg.from;
    const esListaNegra = listaNegra.some(numeroNegro => idRemitente.includes(numeroNegro.replace('@c.us', '').replace('@g.us', '')));
    if (esListaNegra) return;

    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nombreUsuario = contact.pushname || "humano";

    // 🌿 NOVEDAD v1.1.0: INTERCEPTOR DE COMANDOS
    if (msg.body.startsWith('/')) {
        // CORRECCIÓN: Definimos "comando" ANTES de intentar usarlo
        const comando = msg.body.slice(1).toLowerCase().trim();
        
        // 🖼️ CREADOR DE STICKERS CON MARCA DE AGUA
        if (comando === 'sticker' || comando === 's') {
            let media = null;
            
            if (msg.hasMedia) {
                media = await msg.downloadMedia();
            } 
            else if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.hasMedia) {
                    media = await quotedMsg.downloadMedia();
                }
            }

            if (media && (media.mimetype.includes('image') || media.mimetype.includes('video'))) {
                console.log("🎨 Forjando nuevo sticker para la deidad...");
                await msg.reply(media, msg.from, {
                    sendMediaAsSticker: true,
                    stickerName: "Propiedad de Meowl 🐈", 
                    stickerAuthor: "Secta Yupiliana"      
                });
                return; 
            } else {
                return msg.reply("Miau... tienes que enviarme una imagen o responder a una con el comando /sticker.");
            }
        }
        
        // ACTIVACIÓN DE MODOS
        if (modosConfig[comando]) {
            modoActivo = comando;
            clearTimeout(temporizadorModo); 
            
            const configModo = modosConfig[comando];
            const duracionMs = (configModo.duracion_minutos || 15) * 60 * 1000;
            
            temporizadorModo = setTimeout(async () => {
                modoActivo = null;
                await client.sendMessage(msg.from, configModo.mensaje_fin || "✨ Regresé a la normalidad.");
                console.log(`⏰ El modo ${comando} ha terminado.`);
            }, duracionMs);

            console.log(`🟢 Modo activado: ${comando}`);
            return msg.reply(configModo.mensaje_inicio || `Modo ${comando} activado por ${configModo.duracion_minutos} min.`);
        } 
        
        // APAGAR MODO MANUALMENTE
        if (comando === 'normal' && modoActivo) {
            modoActivo = null;
            clearTimeout(temporizadorModo);
            return msg.reply("🧠 Modo normal restaurado manualmente.");
        }
    }

    // --- PROCESAMIENTO DE MENSAJES NORMALES ---
    let contextoPrevio = "";
    let esRespuestaAMeowl = false;

    if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.fromMe) {
            let textoCitado = quotedMsg.body.substring(0, 300);
            contextoPrevio = `(Contexto anterior: "${textoCitado}")\n`;
            esRespuestaAMeowl = true;
        }
    }

    const mencionaMeowl = msg.body.toLowerCase().includes('meowl');

    // Solo se encola si lo mencionan o le responden
    if (mencionaMeowl || esRespuestaAMeowl) {
        const promptFinal = `Mortal [${nombreUsuario}] dice:\n${contextoPrevio}${msg.body}`;
        console.log(`\n📥 [AÑADIDO A LA COLA de ${nombreUsuario}]: ${msg.body}`);
        colaMensajes.push({ msg, chat, promptFinal, nombreUsuario });
        procesarCola();
    }
});

client.initialize();
