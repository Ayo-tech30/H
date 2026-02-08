const { 
    default: makeWASocket, 
    DisconnectReason, 
    useMultiFileAuthState,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const { database } = require('./firebase');
const { handleMessage } = require('./messageHandler');

const logger = pino({ 
    level: process.env.LOG_LEVEL || 'fatal'
});

const store = makeInMemoryStore({ logger });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

let botMode = 'public'; // 'public' or 'private'
let botOwner = ''; // Will be set during pairing

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    // Check if already paired
    if (!state.creds.registered) {
        console.log('\n╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𝗕𝗢𝗧 𝗦𝗘𝗧𝗨𝗣 𖣔━━╮');
        console.log('│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 :  𝗩𝗶𝗼𝗹𝗲𝘁');
        console.log('│  ✦ 𝙊𝙬𝙣𝙚𝙧    :  𝗞𝘆𝗻𝘅');
        console.log('╰━━━━━━━━━━━━━━━━━━━━━━╯\n');
        
        const phoneNumber = await question('📱 Enter your WhatsApp number (with country code, e.g., 1234567890): ');
        botOwner = phoneNumber.replace(/[^0-9]/g, '');
        
        console.log('\n⏳ Requesting pairing code...\n');
    }

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        msgRetryCounterCache: {},
    });

    store.bind(sock.ev);

    // Handle pairing code
    if (!sock.authState.creds.registered && botOwner) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(botOwner);
                console.log('╭━━━━━━━━━━━━━━━━━━━╮');
                console.log(`│  🔑 PAIRING CODE: ${code}  │`);
                console.log('╰━━━━━━━━━━━━━━━━━━━╯\n');
                console.log('✅ Enter this code in WhatsApp > Linked Devices\n');
            } catch (error) {
                console.error('❌ Error requesting pairing code:', error.message);
            }
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            
            if (shouldReconnect) {
                console.log('🔄 Connection lost, reconnecting...');
                setTimeout(() => startBot(), 3000);
            } else {
                console.log('❌ Connection closed. Please delete auth_info folder and restart.');
                process.exit(0);
            }
        } else if (connection === 'open') {
            console.log('\n╭━━𖣔 𝗕𝗢𝗧 𝗢𝗡𝗟𝗜𝗡𝗘 𖣔━━╮');
            console.log('│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨   :  𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 ✓');
            console.log('│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 :  𝗩𝗶𝗼𝗹𝗲𝘁');
            console.log('│  ✦ 𝙊𝙬𝙣𝙚𝙧    :  𝗞𝘆𝗻𝘅');
            console.log('╰━━━━━━━━━━━━━━━━━╯\n');
        }
    });

    // Track processed messages to avoid processing old commands
    const processedMessages = new Set();
    const botStartTime = Date.now();

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            try {
                // Ignore messages from before bot started
                if (msg.messageTimestamp * 1000 < botStartTime) continue;

                // Avoid processing same message twice
                if (processedMessages.has(msg.key.id)) continue;
                processedMessages.add(msg.key.id);

                // Clean up old message IDs (keep last 1000)
                if (processedMessages.size > 1000) {
                    const toDelete = Array.from(processedMessages).slice(0, 500);
                    toDelete.forEach(id => processedMessages.delete(id));
                }

                await handleMessage(sock, msg, botMode, botOwner);
            } catch (error) {
                // Silently handle errors
            }
        }
    });

    // Mode change listener
    global.setBotMode = (mode) => {
        botMode = mode;
    };

    global.getBotMode = () => botMode;
}

// Start the bot
console.clear();
startBot().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});

// Keep process alive
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
