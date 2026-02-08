const { database } = require('./firebase');
const commands = require('./commands');
const { cardSpawner } = require('./cardSystem');

async function handleMessage(sock, msg, botMode, botOwner) {
    try {
        // Ignore messages without content
        if (!msg.message) return;

        const messageType = Object.keys(msg.message)[0];
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        
        // Get message content
        let messageContent = '';
        if (msg.message.conversation) {
            messageContent = msg.message.conversation;
        } else if (msg.message.extendedTextMessage) {
            messageContent = msg.message.extendedTextMessage.text;
        } else if (msg.message.imageMessage && msg.message.imageMessage.caption) {
            messageContent = msg.message.imageMessage.caption;
        }

        // Check for card spawn in groups (when image is sent with card)
        if (isGroup && msg.message.imageMessage) {
            const groupData = await database.getGroup(msg.key.remoteJid);
            if (groupData?.cardsEnabled) {
                await cardSpawner.handleImageUpload(sock, msg);
                return;
            }
        }

        // Random card spawn in groups with card system enabled
        if (isGroup && messageContent && !messageContent.startsWith('.')) {
            const groupData = await database.getGroup(msg.key.remoteJid);
            if (groupData?.cardsEnabled) {
                await cardSpawner.randomSpawn(sock, msg.key.remoteJid);
            }
        }

        // Only process commands that start with '.'
        if (!messageContent.startsWith('.')) return;

        // Parse command
        const args = messageContent.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check bot mode - in private mode, only respond in groups when mentioned
        if (botMode === 'private' && isGroup) {
            // Check if bot is mentioned
            const botNumber = (await sock.user).id.split(':')[0];
            const isMentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(`${botNumber}@s.whatsapp.net`);
            
            if (!isMentioned) return;
        }

        // Get group metadata if in group
        let groupMetadata = null;
        let isAdmin = false;
        let isBotAdmin = false;

        if (isGroup) {
            try {
                groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
                const botNumber = (await sock.user).id.split(':')[0];
                
                // Check if sender is admin
                isAdmin = groupMetadata.participants.some(
                    p => p.id.split('@')[0] === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
                );

                // Check if bot is admin
                isBotAdmin = groupMetadata.participants.some(
                    p => p.id.split('@')[0] === botNumber && (p.admin === 'admin' || p.admin === 'superadmin')
                );
            } catch (error) {
                // Silent error
            }
        }

        // Check if sender is owner
        const isOwner = senderId === botOwner;

        // Context object
        const context = {
            sock,
            msg,
            args,
            sender,
            senderId,
            isGroup,
            isAdmin,
            isBotAdmin,
            isOwner,
            groupMetadata,
            reply: async (text) => {
                await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
            },
            react: async (emoji) => {
                await sock.sendMessage(msg.key.remoteJid, {
                    react: { text: emoji, key: msg.key }
                });
            }
        };

        // Execute command
        const command = commands[commandName];
        if (command) {
            await command.execute(context);
        }

    } catch (error) {
        // Silent error handling
    }
}

module.exports = { handleMessage };
