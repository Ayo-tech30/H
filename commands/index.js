const { database } = require('../firebase');
const { cardSystem } = require('../cardSystem');
const { economy } = require('../economy');
const { gambling } = require('../gambling');
const axios = require('axios');

const PREFIX = '.';

// ==================== MAIN MENU ====================
const menu = {
    execute: async ({ reply, senderId }) => {
        const user = await database.getUser(senderId);
        const userName = user?.name || 'User';
        
        const menuText = `╭━━𖣔 𝗡𝗘𝗫𝗢𝗥𝗔 𖣔━━╮
│  ✦ 𝙋𝙧𝙚𝙛𝙞𝙭   :  .
│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 :  𝗩𝗶𝗼𝗹𝗲𝘁
│  ✦ 𝙊𝙬𝙣𝙚𝙧    :  𝗞𝘆𝗻𝘅
│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨   :  𝙊𝙣𝙡𝙞𝙣𝙚 ✓
│  ✦ 𝘿𝘽        :  Firebase 🔥
╰━━━━━━━━━━━━━╯

⚙️ 𝙈𝘼𝙄𝙉 𝙈𝙀𝙉𝙐 ⚙️
━━━━━━━━━━━━━━
᯽ .𝙢𝙚𝙣𝙪
᯽ .𝙥𝙞𝙣𝙜
᯽ .𝙖𝙡𝙞𝙫𝙚
᯽ .𝙖𝙛𝙠
᯽ .𝙧𝙚𝙜𝙞𝙨𝙩𝙚𝙧 | .𝙧𝙚𝙜
᯽ .𝙡𝙚𝙖𝙙𝙚𝙧𝙗𝙤𝙖𝙧𝙙 | .𝙡𝙗
᯽ .𝙢𝙖𝙧𝙠𝙚𝙩
᯽ .𝙢𝙪𝙜𝙚𝙣
᯽ .𝙢𝙤𝙙𝙨

👤 𝙋𝙍𝙊𝙁𝙄𝙇𝙀 𝙈𝙀𝙉𝙐 👤
━━━━━━━━━━━━━━
᯽ .𝙥 | .𝙥𝙧𝙤𝙛𝙞𝙡𝙚 [@𝙪𝙨𝙚𝙧]
᯽ .𝙨𝙚𝙩𝙥𝙧𝙤𝙛𝙞𝙡𝙚 | .𝙨𝙚𝙩𝙥
᯽ .𝙨𝙚𝙩𝙥𝙧𝙤𝙛𝙞𝙡𝙚𝙦𝙪𝙤𝙩𝙚
᯽ .𝙨𝙚𝙩𝙖𝙜𝙚 <𝙣𝙪𝙢>
᯽ .𝙨𝙚𝙩𝙣𝙖𝙢𝙚 <𝙣𝙖𝙢𝙚>

🛡️ 𝙂𝙍𝙊𝙐𝙋 𝘼𝘿𝙈𝙄𝙉 🛡️
━━━━━━━━━━━━━━
᯽ .𝙥𝙧𝙤𝙢𝙤𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙙𝙚𝙢𝙤𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙢𝙪𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙪𝙣𝙢𝙪𝙩𝙚 @𝙪𝙨𝙚𝙧
᯽ .𝙬𝙖𝙧𝙣 @𝙪𝙨𝙚𝙧
᯽ .𝙬𝙖𝙧𝙣𝙘𝙤𝙪𝙣𝙩 @𝙪𝙨𝙚𝙧
᯽ .𝙧𝙚𝙨𝙚𝙩𝙬𝙖𝙧𝙣 @𝙪𝙨𝙚𝙧
᯽ .𝙠𝙞𝙘𝙠 @𝙪𝙨𝙚𝙧
᯽ .𝙙𝙚𝙡𝙚𝙩𝙚
᯽ .𝙩𝙖𝙜𝙖𝙡𝙡
᯽ .𝙝𝙞𝙙𝙚𝙩𝙖𝙜
᯽ .𝙬𝙚𝙡𝙘𝙤𝙢𝙚 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙜𝙤𝙤𝙙𝙗𝙮𝙚 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙖𝙣𝙩𝙞𝙡𝙞𝙣𝙠 <𝙤𝙣/𝙤𝙛𝙛>
᯽ .𝙜𝙧𝙤𝙪𝙥𝙞𝙣𝙛𝙤

🎴 𝘾𝘼𝙍𝘿𝙎 𝙈𝙀𝙉𝙐 🎴
━━━━━━━━━━━━━━
᯽ .𝙢𝙮𝙘𝙖𝙧𝙙𝙨
᯽ .𝙜𝙚𝙩 <𝙞𝙙>
᯽ .𝙙𝙚𝙘𝙠
᯽ .𝙜𝙞𝙫𝙚𝙘𝙖𝙧𝙙 @𝙪𝙨𝙚𝙧
᯽ .𝙨𝙚𝙡𝙡𝙘𝙖𝙧𝙙
᯽ .𝙖𝙪𝙘𝙩𝙞𝙤𝙣
᯽ .𝙗𝙞𝙙
᯽ .𝙧𝙤𝙡𝙡𝙘𝙖𝙧𝙙
᯽ .𝙘𝙖𝙧𝙙𝙨 <𝙤𝙣/𝙤𝙛𝙛>

💰 𝙀𝘾𝙊𝙉𝙊𝙈𝙔 𝙈𝙀𝙉𝙐 💰
━━━━━━━━━━━━━━
᯽ .𝙖𝙘𝙘𝙗𝙖𝙡 [@𝙪𝙨𝙚𝙧]
᯽ .𝙙𝙚𝙥𝙤𝙨𝙞𝙩 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙬𝙞𝙩𝙝𝙙𝙧𝙖𝙬 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙨𝙚𝙣𝙙 @𝙪𝙨𝙚𝙧 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙙𝙖𝙞𝙡𝙮
᯽ .𝙬𝙚𝙚𝙠𝙡𝙮
᯽ .𝙢𝙤𝙣𝙩𝙝𝙡𝙮
᯽ .𝙞𝙣𝙫
᯽ .𝙬𝙤𝙧𝙠
᯽ .𝙧𝙤𝙗 @𝙪𝙨𝙚𝙧

🎰 𝙂𝘼𝙈𝘽𝙇𝙄𝙉𝙂 𝙈𝙀𝙉𝙐 🎰
━━━━━━━━━━━━━━
᯽ .𝙜𝙖𝙢𝙗𝙡𝙚 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙨𝙡𝙤𝙩𝙨 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙧𝙤𝙪𝙡𝙚𝙩𝙩𝙚 <𝙗𝙚𝙩> <𝙘𝙤𝙡𝙤𝙧/𝙣𝙪𝙢𝙗𝙚𝙧>
᯽ .𝙗𝙡𝙖𝙘𝙠𝙟𝙖𝙘𝙠 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙘𝙤𝙞𝙣𝙛𝙡𝙞𝙥 <𝙖𝙢𝙤𝙪𝙣𝙩> <𝙝𝙚𝙖𝙙𝙨/𝙩𝙖𝙞𝙡𝙨>
᯽ .𝙙𝙞𝙘𝙚 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙡𝙤𝙩𝙩𝙚𝙧𝙮
᯽ .𝙟𝙖𝙘𝙠𝙥𝙤𝙩
᯽ .𝙘𝙧𝙖𝙨𝙝 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙧𝙖𝙘𝙚 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙬𝙝𝙚𝙚𝙡 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙥𝙤𝙠𝙚𝙧 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙢𝙞𝙣𝙚𝙨 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙥𝙡𝙞𝙣𝙠𝙤 <𝙖𝙢𝙤𝙪𝙣𝙩>
᯽ .𝙡𝙞𝙢𝙗𝙤 <𝙖𝙢𝙤𝙪𝙣𝙩> <𝙢𝙪𝙡𝙩𝙞𝙥𝙡𝙞𝙚𝙧>

🔍 𝙎𝙀𝘼𝙍𝘾𝙃 𝙈𝙀𝙉𝙐 🔍
━━━━━━━━━━━━━━
᯽ .𝙜𝙥𝙩 <𝙦𝙪𝙚𝙧𝙮>
᯽ .𝙖𝙞 <𝙦𝙪𝙚𝙧𝙮>
᯽ .𝙜𝙤𝙤𝙜𝙡𝙚 <𝙦𝙪𝙚𝙧𝙮>

🖼️ 𝙄𝙈𝘼𝙂𝙀 𝙈𝙀𝙉𝙐 🖼️
━━━━━━━━━━━━━━
᯽ .𝙨𝙩𝙞𝙘𝙠𝙚𝙧
᯽ .𝙗𝙡𝙪𝙧
᯽ .𝙧𝙚𝙢𝙤𝙫𝙚𝙗𝙜

🌟 𝙁𝙐𝙉 𝙈𝙀𝙉𝙐 🌟
━━━━━━━━━━━━━━
᯽ .𝙢𝙖𝙩𝙘𝙝 [@𝙪𝙨𝙚𝙧]
᯽ .𝙧𝙤𝙖𝙨𝙩 @𝙪𝙨𝙚𝙧
᯽ .𝙨𝙞𝙢𝙥 @𝙪𝙨𝙚𝙧

🪷 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙈𝙀𝙉𝙐 🪷
━━━━━━━━━━━━━━
᯽ .𝙥𝙡𝙖𝙮 <𝙨𝙤𝙣𝙜>
᯽ .𝙞𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢 <𝙪𝙧𝙡>
᯽ .𝙩𝙞𝙠𝙩𝙤𝙠 <𝙪𝙧𝙡>
━━━━━━━━━━━━━━

💜 𝗩𝗶𝗼𝗹𝗲𝘁 𝗕𝘆 𝗞𝘆𝗻𝘅`;

        await reply(menuText);
    }
};

const ping = {
    execute: async ({ reply, react }) => {
        const start = Date.now();
        await react('🏓');
        const end = Date.now();
        
        const response = `╭━━𖣔 𝗣𝗜𝗡𝗚 𖣔━━╮
│  
│  ⚡ 𝙎𝙥𝙚𝙚𝙙: ${end - start}ms
│  🤖 𝙎𝙩𝙖𝙩𝙪𝙨: 𝙊𝙣𝙡𝙞𝙣𝙚 ✓
│  
╰━━━━━━━━━━━━━╯`;
        
        await reply(response);
    }
};

const alive = {
    execute: async ({ reply }) => {
        const response = `╭━━𖣔 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 𖣔━━╮
│  
│  ✦ 𝘽𝙤𝙩 𝙉𝙖𝙢𝙚 :  𝗩𝗶𝗼𝗹𝗲𝘁
│  ✦ 𝙊𝙬𝙣𝙚𝙧    :  𝗞𝘆𝗻𝘅
│  ✦ 𝙎𝙩𝙖𝙩𝙪𝙨   :  𝘼𝙡𝙞𝙫𝙚 & 𝙍𝙪𝙣𝙣𝙞𝙣𝙜 ✓
│  ✦ 𝙋𝙧𝙚𝙛𝙞𝙭   :  .
│  ✦ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣  :  1.0.0
│  
╰━━━━━━━━━━━━━━━━━━╯`;
        
        await reply(response);
    }
};

const afk = {
    execute: async ({ reply, senderId, args }) => {
        const reason = args.join(' ') || 'No reason';
        
        await database.setUser(senderId, {
            afk: true,
            afkReason: reason,
            afkTime: Date.now()
        });

        const response = `╭━━𖣔 𝗔𝗙𝗞 𝗠𝗢𝗗𝗘 𖣔━━╮
│  
│  ⏸️ 𝙔𝙤𝙪 𝙖𝙧𝙚 𝙣𝙤𝙬 𝘼𝙁𝙆
│  
│  💬 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}
│  
╰━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const register = {
    execute: async ({ reply, senderId, args }) => {
        const user = await database.getUser(senderId);
        
        if (user?.registered) {
            return await reply(`╭━━𖣔 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 𖣔━━╮
│  
│  ❌ 𝙔𝙤𝙪 𝙖𝙧𝙚 𝙖𝙡𝙧𝙚𝙖𝙙𝙮 𝙧𝙚𝙜𝙞𝙨𝙩𝙚𝙧𝙚𝙙!
│  
╰━━━━━━━━━━━━━━━━━━━━╯`);
        }

        const name = args.join(' ') || 'User';
        
        await database.setUser(senderId, {
            registered: true,
            name: name,
            wallet: 0,
            bank: 1000,
            cards: [],
            registerDate: Date.now(),
            level: 1,
            xp: 0,
            age: 0,
            profileQuote: '✨ New to Nexora',
            dailyClaimed: 0,
            weeklyClaimed: 0,
            monthlyClaimed: 0
        });

        const response = `╭━━𖣔 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 𖣔━━╮
│  
│  ✅ 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙉𝙚𝙭𝙤𝙧𝙖!
│  
│  👤 𝙉𝙖𝙢𝙚: ${name}
│  💰 𝙎𝙩𝙖𝙧𝙩𝙞𝙣𝙜 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $1000
│  ⭐ 𝙇𝙚𝙫𝙚𝙡: 1
│  
╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const leaderboard = {
    execute: async ({ reply }) => {
        const allUsers = await database.getAllUsers();
        
        // Sort by total money (bank + wallet)
        const sorted = allUsers
            .filter(u => u.registered)
            .map(u => ({
                ...u,
                total: (u.bank || 0) + (u.wallet || 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        let leaderboardText = `╭━━𖣔 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 𖣔━━╮
│  
│  🏆 𝙏𝙤𝙥 10 𝙍𝙞𝙘𝙝𝙚𝙨𝙩 𝙐𝙨𝙚𝙧𝙨
│  
╰━━━━━━━━━━━━━━━━━━━╯

`;

        sorted.forEach((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '᯽';
            leaderboardText += `${medal} #${index + 1} ${user.name || 'User'}
   💰 $${user.total.toLocaleString()}\n\n`;
        });

        leaderboardText += `━━━━━━━━━━━━━━━`;

        await reply(leaderboardText);
    }
};

const market = {
    execute: async ({ reply }) => {
        const response = `╭━━𖣔 𝗠𝗔𝗥𝗞𝗘𝗧 𖣔━━╮
│  
│  🏪 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙈𝙖𝙧𝙠𝙚𝙩!
│  
╰━━━━━━━━━━━━━━━━━╯

💎 𝘼𝙑𝘼𝙄𝙇𝘼𝘽𝙇𝙀 𝙄𝙏𝙀𝙈𝙎
━━━━━━━━━━━━━━━
᯽ 𝘾𝙖𝙧𝙙 𝙋𝙖𝙘𝙠 - $500
᯽ 𝙇𝙪𝙘𝙠𝙮 𝘾𝙝𝙖𝙧𝙢 - $1000
᯽ 𝙓𝙋 𝘽𝙤𝙤𝙨𝙩 - $750
᯽ 𝙂𝙤𝙡𝙙 𝙏𝙞𝙘𝙠𝙚𝙩 - $2000
━━━━━━━━━━━━━━━`;

        await reply(response);
    }
};

const mugen = {
    execute: async ({ reply }) => {
        const response = `╭━━𖣔 𝗠𝗨𝗚𝗘𝗡 𖣔━━╮
│  
│  ♾️ 𝙈𝙪𝙜𝙚𝙣 𝙎𝙮𝙨𝙩𝙚𝙢
│  
│  🎴 𝘾𝙤𝙡𝙡𝙚𝙘𝙩 𝙘𝙖𝙧𝙙𝙨
│  ⚔️ 𝘽𝙖𝙩𝙩𝙡𝙚 𝙤𝙩𝙝𝙚𝙧𝙨
│  🏆 𝘽𝙚𝙘𝙤𝙢𝙚 𝙘𝙝𝙖𝙢𝙥𝙞𝙤𝙣
│  
╰━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const mods = {
    execute: async ({ reply, isGroup, groupMetadata }) => {
        if (!isGroup) {
            return await reply('❌ This command is only for groups!');
        }

        const admins = groupMetadata.participants.filter(
            p => p.admin === 'admin' || p.admin === 'superadmin'
        );

        let modText = `╭━━𖣔 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥𝗦 𖣔━━╮
│  
│  👑 𝙂𝙧𝙤𝙪𝙥 𝘼𝙙𝙢𝙞𝙣𝙨
│  
╰━━━━━━━━━━━━━━━━━━━╯

🛡️ 𝘼𝘿𝙈𝙄𝙉 𝙇𝙄𝙎𝙏
━━━━━━━━━━━━━━━
`;

        admins.forEach((admin, index) => {
            const icon = admin.admin === 'superadmin' ? '👑' : '🛡️';
            modText += `${icon} @${admin.id.split('@')[0]}\n`;
        });

        modText += `━━━━━━━━━━━━━━━

💜 𝙏𝙤𝙩𝙖𝙡: ${admins.length} 𝘼𝙙𝙢𝙞𝙣${admins.length !== 1 ? 's' : ''}`;

        await reply(modText);
    }
};

const mode = {
    execute: async ({ reply, args, isOwner }) => {
        if (!isOwner) {
            return await reply('❌ Only the owner can change bot mode!');
        }

        const newMode = args[0]?.toLowerCase();
        
        if (newMode !== 'private' && newMode !== 'public') {
            return await reply('❌ Usage: .mode <private/public>');
        }

        global.setBotMode(newMode);

        const response = `╭━━𖣔 𝗕𝗢𝗧 𝗠𝗢𝗗𝗘 𖣔━━╮
│  
│  ✅ 𝙈𝙤𝙙𝙚 𝙘𝙝𝙖𝙣𝙜𝙚𝙙 𝙩𝙤: ${newMode.toUpperCase()}
│  
│  ${newMode === 'private' ? '🔒 𝘽𝙤𝙩 𝙬𝙞𝙡𝙡 𝙤𝙣𝙡𝙮 𝙧𝙚𝙨𝙥𝙤𝙣𝙙 𝙬𝙝𝙚𝙣 𝙢𝙚𝙣𝙩𝙞𝙤𝙣𝙚𝙙' : '🔓 𝘽𝙤𝙩 𝙬𝙞𝙡𝙡 𝙧𝙚𝙨𝙥𝙤𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙢𝙢𝙖𝙣𝙙𝙨'}
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

// Export all commands from allCommands.js
const allCommands = require('./allCommands');
module.exports = allCommands;
