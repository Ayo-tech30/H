const { database } = require('../firebase');

// Profile command
const profile = {
    execute: async ({ reply, senderId, msg, sock }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const targetId = mentioned?.[0]?.split('@')[0] || senderId;
        
        const user = await database.getUser(targetId);
        
        if (!user?.registered) {
            return await reply('❌ User not registered! Use .register <name>');
        }

        const response = `╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𖣔━━╮
│  
│  👤 ${user.name || 'User'}
│  
╰━━━━━━━━━━━━━━━━╯

💬 ${user.profileQuote || '✨ No quote set'}

📊 𝙎𝙏𝘼𝙏𝙎
━━━━━━━━━━━━━━━
᯽ ⭐ 𝙇𝙚𝙫𝙚𝙡: ${user.level || 1}
᯽ ✨ 𝙓𝙋: ${user.xp || 0}
᯽ 🎂 𝘼𝙜𝙚: ${user.age || 'Not set'}
᯽ 💰 𝙒𝙖𝙡𝙡𝙚𝙩: $${(user.wallet || 0).toLocaleString()}
᯽ 🏦 𝘽𝙖𝙣𝙠: $${(user.bank || 0).toLocaleString()}
᯽ 🎴 𝘾𝙖𝙧𝙙𝙨: ${user.cards?.length || 0}
━━━━━━━━━━━━━━━`;

        await reply(response);
    }
};

const setprofile = {
    execute: async ({ reply, senderId, msg, sock }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted?.imageMessage) {
            return await reply('❌ Please reply to an image with this command!');
        }

        const response = `╭━━𖣔 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙋𝙧𝙤𝙛𝙞𝙡𝙚 𝙥𝙞𝙘𝙩𝙪𝙧𝙚 𝙨𝙖𝙫𝙚𝙙!
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const setprofilequote = {
    execute: async ({ reply, senderId, args }) => {
        const quote = args.join(' ');
        
        if (!quote) {
            return await reply('❌ Usage: .setprofilequote <your quote>');
        }

        await database.updateUser(senderId, { profileQuote: quote });

        const response = `╭━━𖣔 𝗤𝗨𝗢𝗧𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙋𝙧𝙤𝙛𝙞𝙡𝙚 𝙦𝙪𝙤𝙩𝙚 𝙪𝙥𝙙𝙖𝙩𝙚𝙙!
│  
│  💬 "${quote}"
│  
╰━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const setage = {
    execute: async ({ reply, senderId, args }) => {
        const age = parseInt(args[0]);
        
        if (!age || age < 1 || age > 120) {
            return await reply('❌ Please provide a valid age (1-120)');
        }

        await database.updateUser(senderId, { age });

        const response = `╭━━𖣔 𝗔𝗚𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝘼𝙜𝙚 𝙨𝙚𝙩 𝙩𝙤: ${age}
│  
╰━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const setname = {
    execute: async ({ reply, senderId, args }) => {
        const name = args.join(' ');
        
        if (!name) {
            return await reply('❌ Usage: .setname <your name>');
        }

        await database.updateUser(senderId, { name });

        const response = `╭━━𖣔 𝗡𝗔𝗠𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝙉𝙖𝙢𝙚 𝙨𝙚𝙩 𝙩𝙤: ${name}
│  
╰━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

module.exports = {
    profile,
    p: profile,
    setprofile,
    setp: setprofile,
    setprofilequote,
    setage,
    setname
};
