const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 1. Inicializamos el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

// 2. Por si necesita escanear QR (aunque si usas LocalAuth ya debería estar guardada la sesión de Meowl)
client.on('qr', qr => qrcode.generate(qr, { small: true }));

// 3. Cuando esté listo, saca la lista de grupos
client.on('ready', async () => {
    console.log('¡Cliente listo! Obteniendo grupos de la Secta Meowl... :3\n');
   
    try {
        const chats = await client.getChats();
        const grupos = chats.filter(chat => chat.isGroup);

        console.log('--- LISTA DE GRUPOS ---');
        grupos.forEach(grupo => {
            console.log(`Nombre: ${grupo.name}`);
            console.log(`ID: ${grupo.id._serialized}`);
            console.log('--------------------------------');
        });
       
        console.log('\n¡Listo! Copia el ID que necesites. Ya puedes detener este script (Ctrl + C).');
       
    } catch (error) {
        console.error('Hubo un error al obtener los chats:', error);
    }
});

// 4. Arrancamos el cliente
client.initialize();
