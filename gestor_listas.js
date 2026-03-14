const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', async () => {
    console.log('\n=============================================');
    console.log('  🐈🦉 GESTOR DE PERMISOS DE MEOWL IA');
    console.log('=============================================\n');
    console.log('Obteniendo tus chats recientes...\n');

    try {
        const chats = await client.getChats();
        // Quitamos el chat oficial de WhatsApp y mostramos los últimos 30
        const chatsUtiles = chats.filter(c => c.id._serialized !== '0@c.us').slice(0, 30);

        // Imprimimos el menú
        chatsUtiles.forEach((chat, index) => {
            const tipo = chat.isGroup ? '👥 Grupo' : '👤 Contacto';
            const nombre = chat.name || chat.pushname || chat.id.user;
            console.log(`[${index}] ${tipo}: ${nombre}`);
        });

        console.log('\n---------------------------------------------');
        
        // Pregunta 1: Lista VIP
        rl.question('> Escribe los NUMEROS para la lista VIP (separados por coma, ej. 0,3,4)\n> O da Enter para dejarla vacia: ', (respVIP) => {
            let idsVIP = [];
            if (respVIP.trim() !== '') {
                const indicesVIP = respVIP.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                idsVIP = indicesVIP.map(i => chatsUtiles[i]?.id._serialized).filter(id => id);
            }
            fs.writeFileSync('./vip.json', JSON.stringify(idsVIP, null, 2));
            console.log('✔️ Lista VIP guardada con exito.');

            // Pregunta 2: Lista Negra
            rl.question('\n> Escribe los NUMEROS para la LISTA NEGRA (Spam/Bots)\n> O da Enter para dejarla vacia: ', (respNegra) => {
                let idsNegra = [];
                if (respNegra.trim() !== '') {
                    const indicesNegra = respNegra.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                    idsNegra = indicesNegra.map(i => chatsUtiles[i]?.id._serialized).filter(id => id);
                }
                fs.writeFileSync('./negra.json', JSON.stringify(idsNegra, null, 2));
                console.log('✔️ Lista Negra guardada con exito.');
                
                console.log('\n=============================================');
                console.log('¡Todo listo! Ya puedes cerrar esta ventana.');
                console.log('=============================================');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Hubo un error:', error);
        process.exit(1);
    }
});

client.initialize();