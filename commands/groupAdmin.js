const { database } = require('../firebase');

// Promote user to admin
const promote = {
    execute: async ({ sock, msg, isGroup, isAdmin, isBotAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');
        if (!isBotAdmin) return await reply('❌ I need to be an admin to promote users!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to promote!');
        }

        try {
            await sock.groupParticipantsUpdate(msg.key.remoteJid, mentioned, 'promote');
            await reply(`╭━━𖣔 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙐𝙨𝙚𝙧 𝙥𝙧𝙤𝙢𝙤𝙩𝙚𝙙 𝙩𝙤 𝙖𝙙𝙢𝙞𝙣!
│  
╰━━━━━━━━━━━━━━━━━━━╯`);
        } catch (error) {
            await reply('❌ Failed to promote user!');
        }
    }
};

// Demote user from admin
const demote = {
    execute: async ({ sock, msg, isGroup, isAdmin, isBotAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');
        if (!isBotAdmin) return await reply('❌ I need to be an admin to demote users!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to demote!');
        }

        try {
            await sock.groupParticipantsUpdate(msg.key.remoteJid, mentioned, 'demote');
            await reply(`╭━━𖣔 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙐𝙨𝙚𝙧 𝙙𝙚𝙢𝙤𝙩𝙚𝙙 𝙛𝙧𝙤𝙢 𝙖𝙙𝙢𝙞𝙣!
│  
╰━━━━━━━━━━━━━━━━━━╯`);
        } catch (error) {
            await reply('❌ Failed to demote user!');
        }
    }
};

// Kick user from group
const kick = {
    execute: async ({ sock, msg, isGroup, isAdmin, isBotAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');
        if (!isBotAdmin) return await reply('❌ I need to be an admin to kick users!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to kick!');
        }

        try {
            await sock.groupParticipantsUpdate(msg.key.remoteJid, mentioned, 'remove');
            await reply(`╭━━𖣔 𝗞𝗜𝗖𝗞𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙐𝙨𝙚𝙧 𝙧𝙚𝙢𝙤𝙫𝙚𝙙 𝙛𝙧𝙤𝙢 𝙜𝙧𝙤𝙪𝙥!
│  
╰━━━━━━━━━━━━━━━━━╯`);
        } catch (error) {
            await reply('❌ Failed to kick user!');
        }
    }
};

// Warn user
const warn = {
    execute: async ({ msg, isGroup, isAdmin, reply, senderId }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to warn!');
        }

        const targetId = mentioned[0].split('@')[0];
        const user = await database.getUser(targetId);
        const warns = (user?.warns || 0) + 1;

        await database.updateUser(targetId, { warns });

        await reply(`╭━━𖣔 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 𖣔━━╮
│  
│  ⚠️ 𝙐𝙨𝙚𝙧 𝙬𝙖𝙧𝙣𝙚𝙙!
│  
│  📊 𝙒𝙖𝙧𝙣𝙞𝙣𝙜𝙨: ${warns}/3
│  ${warns >= 3 ? '❌ 𝙐𝙨𝙚𝙧 𝙧𝙚𝙖𝙘𝙝𝙚𝙙 𝙢𝙖𝙭 𝙬𝙖𝙧𝙣𝙨!' : ''}
│  
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Check warn count
const warncount = {
    execute: async ({ msg, isGroup, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user!');
        }

        const targetId = mentioned[0].split('@')[0];
        const user = await database.getUser(targetId);
        const warns = user?.warns || 0;

        await reply(`╭━━𖣔 𝗪𝗔𝗥𝗡 𝗖𝗢𝗨𝗡𝗧 𖣔━━╮
│  
│  📊 𝙒𝙖𝙧𝙣𝙞𝙣𝙜𝙨: ${warns}/3
│  
╰━━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Reset warns
const resetwarn = {
    execute: async ({ msg, isGroup, isAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user!');
        }

        const targetId = mentioned[0].split('@')[0];
        await database.updateUser(targetId, { warns: 0 });

        await reply(`╭━━𖣔 𝗪𝗔𝗥𝗡 𝗥𝗘𝗦𝗘𝗧 𖣔━━╮
│  
│  ✅ 𝙒𝙖𝙧𝙣𝙞𝙣𝙜𝙨 𝙧𝙚𝙨𝙚𝙩!
│  
╰━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Delete message
const deleteMsg = {
    execute: async ({ sock, msg, isGroup, isAdmin, isBotAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');
        if (!isBotAdmin) return await reply('❌ I need to be an admin to delete messages!');

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) {
            return await reply('❌ Reply to a message to delete it!');
        }

        try {
            const key = msg.message.extendedTextMessage.contextInfo.stanzaId;
            await sock.sendMessage(msg.key.remoteJid, { delete: { ...msg.key, id: key } });
        } catch (error) {
            await reply('❌ Failed to delete message!');
        }
    }
};

// Tag all members
const tagall = {
    execute: async ({ sock, msg, isGroup, isAdmin, groupMetadata, reply, args }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const message = args.join(' ') || 'No message';
        const members = groupMetadata.participants.map(p => p.id);

        let tagText = `╭━━𖣔 𝙂𝙍𝙊𝙐𝙋 𝙏𝘼𝙂 𖣔━━╮
│                       
│  📢 𝘼𝙉𝙉𝙊𝙐𝙉𝘾𝙀𝙈𝙀𝙉𝙏
│  
│  💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙚:
│  ${message}
│
╰━━━━━━━━━━━━━━━━━━━╯

👥 𝙏𝘼𝙂𝙂𝙀𝘿 𝙈𝙀𝙈𝘽𝙀𝙍𝙎
━━━━━━━━━━━━━━━
`;

        members.forEach((member, index) => {
            tagText += `᯽ @${member.split('@')[0]}\n`;
        });

        tagText += `━━━━━━━━━━━━━━━

💜 𝙏𝙤𝙩𝙖𝙡: ${members.length} 𝙈𝙚𝙢𝙗𝙚𝙧𝙨 𝙏𝙖𝙜𝙜𝙚𝙙`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: tagText, 
            mentions: members 
        });
    }
};

// Hidetag - tag all without showing tags
const hidetag = {
    execute: async ({ sock, msg, isGroup, isAdmin, groupMetadata, reply, args }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const message = args.join(' ') || 'Hidden tag message';
        const members = groupMetadata.participants.map(p => p.id);

        await sock.sendMessage(msg.key.remoteJid, { 
            text: message, 
            mentions: members 
        });
    }
};

// Toggle welcome messages
const welcome = {
    execute: async ({ msg, isGroup, isAdmin, reply, args }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return await reply('❌ Usage: .welcome <on/off>');
        }

        await database.updateGroup(msg.key.remoteJid, { welcomeEnabled: state === 'on' });

        await reply(`╭━━𖣔 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𖣔━━╮
│  
│  ✅ 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚𝙨 ${state === 'on' ? '𝙚𝙣𝙖𝙗𝙡𝙚𝙙' : '𝙙𝙞𝙨𝙖𝙗𝙡𝙚𝙙'}!
│  
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Toggle goodbye messages
const goodbye = {
    execute: async ({ msg, isGroup, isAdmin, reply, args }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return await reply('❌ Usage: .goodbye <on/off>');
        }

        await database.updateGroup(msg.key.remoteJid, { goodbyeEnabled: state === 'on' });

        await reply(`╭━━𖣔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 𖣔━━╮
│  
│  ✅ 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚𝙨 ${state === 'on' ? '𝙚𝙣𝙖𝙗𝙡𝙚𝙙' : '𝙙𝙞𝙨𝙖𝙗𝙡𝙚𝙙'}!
│  
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Toggle antilink
const antilink = {
    execute: async ({ msg, isGroup, isAdmin, reply, args }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return await reply('❌ Usage: .antilink <on/off>');
        }

        await database.updateGroup(msg.key.remoteJid, { antilinkEnabled: state === 'on' });

        await reply(`╭━━𖣔 𝗔𝗡𝗧𝗜𝗟𝗜𝗡𝗞 𖣔━━╮
│  
│  ✅ 𝘼𝙣𝙩𝙞𝙡𝙞𝙣𝙠 ${state === 'on' ? '𝙚𝙣𝙖𝙗𝙡𝙚𝙙' : '𝙙𝙞𝙨𝙖𝙗𝙡𝙚𝙙'}!
│  
╰━━━━━━━━━━━━━━━━━━╯`);
    }
};

// Group info
const groupinfo = {
    execute: async ({ msg, isGroup, groupMetadata, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');

        const admins = groupMetadata.participants.filter(
            p => p.admin === 'admin' || p.admin === 'superadmin'
        );

        const response = `╭━━𖣔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 𖣔━━╮
│  
│  📋 ${groupMetadata.subject}
│  
╰━━━━━━━━━━━━━━━━━━━━━╯

📊 𝙎𝙏𝘼𝙏𝙄𝙎𝙏𝙄𝘾𝙎
━━━━━━━━━━━━━━━
᯽ 👥 𝙈𝙚𝙢𝙗𝙚𝙧𝙨: ${groupMetadata.participants.length}
᯽ 👑 𝘼𝙙𝙢𝙞𝙣𝙨: ${admins.length}
᯽ 🆔 𝙂𝙧𝙤𝙪𝙥 𝙄𝘿: ${msg.key.remoteJid.split('@')[0]}
━━━━━━━━━━━━━━━`;

        await reply(response);
    }
};

// Mute user (stub - track in database)
const mute = {
    execute: async ({ msg, isGroup, isAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to mute!');
        }

        const targetId = mentioned[0].split('@')[0];
        await database.updateUser(targetId, { muted: true });

        await reply(`╭━━𖣔 𝗠𝗨𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙐𝙨𝙚𝙧 𝙢𝙪𝙩𝙚𝙙!
│  
╰━━━━━━━━━━━━━━━━╯`);
    }
};

// Unmute user
const unmute = {
    execute: async ({ msg, isGroup, isAdmin, reply }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to unmute!');
        }

        const targetId = mentioned[0].split('@')[0];
        await database.updateUser(targetId, { muted: false });

        await reply(`╭━━𖣔 𝗨𝗡𝗠𝗨𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙐𝙨𝙚𝙧 𝙪𝙣𝙢𝙪𝙩𝙚𝙙!
│  
╰━━━━━━━━━━━━━━━━━━╯`);
    }
};

module.exports = {
    promote,
    demote,
    kick,
    warn,
    warncount,
    resetwarn,
    delete: deleteMsg,
    tagall,
    hidetag,
    welcome,
    goodbye,
    antilink,
    groupinfo,
    mute,
    unmute
};
