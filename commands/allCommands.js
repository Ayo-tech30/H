const { database } = require('../firebase');
const { economy } = require('../economy');
const { gambling } = require('../gambling');
const { cardSystem, cardDatabase } = require('../cardSystem');
const axios = require('axios');

// Load all command modules
const mainCommands = require('./index');
const profileCommands = require('./profile');
const groupAdminCommands = require('./groupAdmin');

// ==================== ECONOMY COMMANDS ====================
const accbal = {
    execute: async ({ reply, senderId, msg }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const targetId = mentioned?.[0]?.split('@')[0] || senderId;
        
        const user = await database.getUser(targetId);
        const name = user?.name || 'User';
        const wallet = user?.wallet || 0;
        const bank = user?.bank || 0;
        const total = wallet + bank;

        const response = `╭━━𖣔 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𖣔━━╮
│  
│  👤 ${name}
│  
╰━━━━━━━━━━━━━━━╯

💰 𝙁𝙄𝙉𝘼𝙉𝘾𝙀𝙎
━━━━━━━━━━━━━━━
᯽ 💵 𝙒𝙖𝙡𝙡𝙚𝙩: $${wallet.toLocaleString()}
᯽ 🏦 𝘽𝙖𝙣𝙠: $${bank.toLocaleString()}
᯽ 💎 𝙏𝙤𝙩𝙖𝙡: $${total.toLocaleString()}
━━━━━━━━━━━━━━━`;

        await reply(response);
    }
};

const deposit = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Please specify a valid amount!');
        }

        const user = await database.getUser(senderId);
        if ((user?.wallet || 0) < amount) {
            return await reply('❌ Insufficient funds in wallet!');
        }

        await database.updateUser(senderId, {
            wallet: (user.wallet || 0) - amount,
            bank: (user.bank || 0) + amount
        });

        const response = `╭━━𖣔 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𖣔━━╮
│  
│  ✅ 𝘿𝙚𝙥𝙤𝙨𝙞𝙩𝙚𝙙: $${amount.toLocaleString()}
│  
│  💵 𝙉𝙚𝙬 𝙒𝙖𝙡𝙡𝙚𝙩: $${((user.wallet || 0) - amount).toLocaleString()}
│  🏦 𝙉𝙚𝙬 𝘽𝙖𝙣𝙠: $${((user.bank || 0) + amount).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const withdraw = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Please specify a valid amount!');
        }

        const user = await database.getUser(senderId);
        if ((user?.bank || 0) < amount) {
            return await reply('❌ Insufficient funds in bank!');
        }

        await database.updateUser(senderId, {
            wallet: (user.wallet || 0) + amount,
            bank: (user.bank || 0) - amount
        });

        const response = `╭━━𖣔 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪 𖣔━━╮
│  
│  ✅ 𝙒𝙞𝙩𝙝𝙙𝙧𝙖𝙬𝙣: $${amount.toLocaleString()}
│  
│  💵 𝙉𝙚𝙬 𝙒𝙖𝙡𝙡𝙚𝙩: $${((user.wallet || 0) + amount).toLocaleString()}
│  🏦 𝙉𝙚𝙬 𝘽𝙖𝙣𝙠: $${((user.bank || 0) - amount).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const send = {
    execute: async ({ reply, senderId, msg, args }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to send money to!');
        }

        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Please specify a valid amount!');
        }

        const targetId = mentioned[0].split('@')[0];
        const user = await database.getUser(senderId);

        if ((user?.wallet || 0) < amount) {
            return await reply('❌ Insufficient funds!');
        }

        await database.updateUser(senderId, {
            wallet: (user.wallet || 0) - amount
        });

        const target = await database.getUser(targetId);
        await database.updateUser(targetId, {
            wallet: (target?.wallet || 0) + amount
        });

        const response = `╭━━𖣔 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘 𖣔━━╮
│  
│  ✅ 𝙎𝙚𝙣𝙩: $${amount.toLocaleString()}
│  👤 𝙏𝙤: @${targetId}
│  
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const daily = {
    execute: async ({ reply, senderId }) => {
        const user = await database.getUser(senderId);
        const now = Date.now();
        const lastClaim = user?.dailyClaimed || 0;
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        if (now - lastClaim < cooldown) {
            const timeLeft = cooldown - (now - lastClaim);
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            
            return await reply(`❌ Daily already claimed! Come back in ${hours}h ${minutes}m`);
        }

        const reward = 1000;
        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) + reward,
            dailyClaimed: now
        });

        const response = `╭━━𖣔 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│  
│  ✅ 𝘾𝙡𝙖𝙞𝙢𝙚𝙙: $${reward.toLocaleString()}
│  
│  💰 𝙉𝙚𝙬 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $${((user?.wallet || 0) + reward).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const weekly = {
    execute: async ({ reply, senderId }) => {
        const user = await database.getUser(senderId);
        const now = Date.now();
        const lastClaim = user?.weeklyClaimed || 0;
        const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 days

        if (now - lastClaim < cooldown) {
            const timeLeft = cooldown - (now - lastClaim);
            const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
            const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            
            return await reply(`❌ Weekly already claimed! Come back in ${days}d ${hours}h`);
        }

        const reward = 7500;
        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) + reward,
            weeklyClaimed: now
        });

        const response = `╭━━𖣔 𝗪𝗘𝗘𝗞𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│  
│  ✅ 𝘾𝙡𝙖𝙞𝙢𝙚𝙙: $${reward.toLocaleString()}
│  
│  💰 𝙉𝙚𝙬 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $${((user?.wallet || 0) + reward).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const monthly = {
    execute: async ({ reply, senderId }) => {
        const user = await database.getUser(senderId);
        const now = Date.now();
        const lastClaim = user?.monthlyClaimed || 0;
        const cooldown = 30 * 24 * 60 * 60 * 1000; // 30 days

        if (now - lastClaim < cooldown) {
            const timeLeft = cooldown - (now - lastClaim);
            const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
            
            return await reply(`❌ Monthly already claimed! Come back in ${days} days`);
        }

        const reward = 50000;
        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) + reward,
            monthlyClaimed: now
        });

        const response = `╭━━𖣔 𝗠𝗢𝗡𝗧𝗛𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𖣔━━╮
│  
│  ✅ 𝘾𝙡𝙖𝙞𝙢𝙚𝙙: $${reward.toLocaleString()}
│  
│  💰 𝙉𝙚𝙬 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $${((user?.wallet || 0) + reward).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const work = {
    execute: async ({ reply, senderId }) => {
        const jobs = [
            { name: 'Developer', min: 500, max: 2000 },
            { name: 'Teacher', min: 300, max: 1000 },
            { name: 'Doctor', min: 1000, max: 3000 },
            { name: 'Chef', min: 400, max: 1500 },
            { name: 'Artist', min: 200, max: 1200 }
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        const user = await database.getUser(senderId);
        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) + earned
        });

        const response = `╭━━𖣔 𝗪𝗢𝗥𝗞 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘 𖣔━━╮
│  
│  💼 𝙅𝙤𝙗: ${job.name}
│  💰 𝙀𝙖𝙧𝙣𝙚𝙙: $${earned.toLocaleString()}
│  
│  💵 𝙉𝙚𝙬 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $${((user?.wallet || 0) + earned).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const rob = {
    execute: async ({ reply, senderId, msg }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to rob!');
        }

        const targetId = mentioned[0].split('@')[0];
        const target = await database.getUser(targetId);
        const targetWallet = target?.wallet || 0;

        if (targetWallet < 100) {
            return await reply('❌ Target doesn\'t have enough money to rob!');
        }

        const success = Math.random() > 0.5;
        if (success) {
            const stolen = Math.floor(targetWallet * (Math.random() * 0.3 + 0.1)); // 10-40%
            
            const user = await database.getUser(senderId);
            await database.updateUser(senderId, {
                wallet: (user?.wallet || 0) + stolen
            });
            await database.updateUser(targetId, {
                wallet: targetWallet - stolen
            });

            return await reply(`╭━━𖣔 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 𖣔━━╮
│  
│  ✅ 𝙎𝙩𝙤𝙡𝙚: $${stolen.toLocaleString()}
│  
│  💰 𝙔𝙤𝙪𝙧 𝘽𝙖𝙡𝙖𝙣𝙘𝙚: $${((user?.wallet || 0) + stolen).toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━━╯`);
        } else {
            const fine = Math.floor(Math.random() * 500 + 200);
            const user = await database.getUser(senderId);
            await database.updateUser(senderId, {
                wallet: Math.max(0, (user?.wallet || 0) - fine)
            });

            return await reply(`╭━━𖣔 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗙𝗔𝗜𝗟𝗘𝗗 𖣔━━╮
│  
│  ❌ 𝙔𝙤𝙪 𝙜𝙤𝙩 𝙘𝙖𝙪𝙜𝙝𝙩!
│  
│  💸 𝙁𝙞𝙣𝙚: $${fine.toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`);
        }
    }
};

const inv = {
    execute: async ({ reply, senderId }) => {
        const cards = await cardSystem.getUserCards(senderId);
        
        if (cards.length === 0) {
            return await reply('❌ Your inventory is empty!');
        }

        let invText = `╭━━𖣔 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬 𖣔━━╮
│  
│  🎒 𝙔𝙤𝙪𝙧 𝙄𝙩𝙚𝙢𝙨
│  
╰━━━━━━━━━━━━━━━━━╯

🎴 𝘾𝘼𝙍𝘿𝙎 (${cards.length})
━━━━━━━━━━━━━━━
`;

        cards.slice(0, 10).forEach((card, i) => {
            invText += `᯽ ${card.name} (${card.rarity})\n`;
        });

        if (cards.length > 10) {
            invText += `᯽ ...and ${cards.length - 10} more\n`;
        }

        invText += `━━━━━━━━━━━━━━━`;

        await reply(invText);
    }
};

// ==================== GAMBLING COMMANDS ====================
const gambleCmd = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Usage: .gamble <amount>');
        }

        const result = await gambling.gamble(senderId, amount);
        if (!result.success) {
            return await reply(`❌ ${result.message}`);
        }

        const response = `╭━━𖣔 𝗚𝗔𝗠𝗕𝗟𝗘 𝗥𝗘𝗦𝗨𝗟𝗧 𖣔━━╮
│  
│  🎲 ${result.win ? '✅ 𝙒𝙄𝙉!' : '❌ 𝙇𝙊𝙎𝙏!'}
│  
│  💰 ${result.win ? `𝙒𝙤𝙣: $${result.amount.toLocaleString()}` : `𝙇𝙤𝙨𝙩: $${amount.toLocaleString()}`}
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const slots = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Usage: .slots <amount>');
        }

        const result = await gambling.slots(senderId, amount);
        if (!result.success) {
            return await reply(`❌ ${result.message}`);
        }

        const response = `╭━━𖣔 𝗦𝗟𝗢𝗧𝗦 𖣔━━╮
│  
│  ${result.results.join(' | ')}
│  
│  ${result.winAmount > 0 ? `✅ 𝙒𝙄𝙉! ${result.multiplier}x` : '❌ 𝙇𝙊𝙎𝙏!'}
│  ${result.winAmount > 0 ? `💰 $${result.winAmount.toLocaleString()}` : ''}
│  
╰━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const coinflip = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();
        
        if (!amount || amount <= 0 || !['heads', 'tails'].includes(choice)) {
            return await reply('❌ Usage: .coinflip <amount> <heads/tails>');
        }

        const result = await gambling.coinflip(senderId, amount, choice);
        if (!result.success) {
            return await reply(`❌ ${result.message}`);
        }

        const response = `╭━━𖣔 𝗖𝗢𝗜𝗡𝗙𝗟𝗜𝗣 𖣔━━╮
│  
│  🪙 ${result.result.toUpperCase()}
│  
│  ${result.win ? '✅ 𝙒𝙄𝙉!' : '❌ 𝙇𝙊𝙎𝙏!'}
│  ${result.win ? `💰 $${result.amount.toLocaleString()}` : ''}
│  
╰━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const roulette = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        const bet = args[1]?.toLowerCase();
        
        if (!amount || amount <= 0 || !bet) {
            return await reply('❌ Usage: .roulette <amount> <red/black/number>');
        }

        const result = await gambling.roulette(senderId, amount, bet);
        if (!result.success) {
            return await reply(`❌ ${result.message}`);
        }

        const response = `╭━━𖣔 𝗥𝗢𝗨𝗟𝗘𝗧𝗧𝗘 𖣔━━╮
│  
│  🎯 𝙍𝙚𝙨𝙪𝙡𝙩: ${result.number}
│  
│  ${result.win ? `✅ 𝙒𝙄𝙉! ${result.multiplier}x` : '❌ 𝙇𝙊𝙎𝙏!'}
│  ${result.win ? `💰 $${result.winAmount.toLocaleString()}` : ''}
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const dice = {
    execute: async ({ reply, senderId, args }) => {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) {
            return await reply('❌ Usage: .dice <amount>');
        }

        const result = await gambling.dice(senderId, amount);
        if (!result.success) {
            return await reply(`❌ ${result.message}`);
        }

        const response = `╭━━𖣔 𝗗𝗜𝗖𝗘 𖣔━━╮
│  
│  🎲 𝙔𝙤𝙪: ${result.playerRoll}
│  🎲 𝙃𝙤𝙪𝙨𝙚: ${result.houseRoll}
│  
│  ${result.tie ? '🤝 𝙏𝙄𝙀!' : result.win ? '✅ 𝙒𝙄𝙉!' : '❌ 𝙇𝙊𝙎𝙏!'}
│  ${result.amount > 0 ? `💰 $${result.amount.toLocaleString()}` : ''}
│  
╰━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

// Stub commands for remaining gambling games
const lottery = { execute: async ({ reply }) => await reply('🎫 Lottery feature coming soon!') };
const jackpot = { execute: async ({ reply }) => await reply('💎 Jackpot feature coming soon!') };
const crash = { execute: async ({ reply }) => await reply('📉 Crash game coming soon!') };
const race = { execute: async ({ reply }) => await reply('🏁 Race feature coming soon!') };
const wheel = { execute: async ({ reply }) => await reply('🎡 Wheel feature coming soon!') };
const poker = { execute: async ({ reply }) => await reply('🃏 Poker feature coming soon!') };
const mines = { execute: async ({ reply }) => await reply('💣 Mines game coming soon!') };
const plinko = { execute: async ({ reply }) => await reply('📍 Plinko game coming soon!') };
const limbo = { execute: async ({ reply }) => await reply('🎯 Limbo game coming soon!') };
const blackjack = { execute: async ({ reply }) => await reply('🃏 Blackjack coming soon!') };

// ==================== CARD COMMANDS ====================
const mycards = {
    execute: async ({ reply, senderId }) => {
        const cards = await cardSystem.getUserCards(senderId);
        
        if (cards.length === 0) {
            return await reply('❌ You don\'t have any cards yet!');
        }

        let cardText = `╭━━𖣔 𝗠𝗬 𝗖𝗔𝗥𝗗𝗦 𖣔━━╮
│  
│  🎴 𝙔𝙤𝙪𝙧 𝘾𝙤𝙡𝙡𝙚𝙘𝙩𝙞𝙤𝙣
│  
╰━━━━━━━━━━━━━━━━━━╯

📊 𝙏𝙊𝙏𝘼𝙇: ${cards.length} 𝘾𝙖𝙧𝙙𝙨
━━━━━━━━━━━━━━━
`;

        cards.forEach((card, i) => {
            const rarityEmoji = { Legendary: '🌟', Epic: '💎', Rare: '💠', Common: '⚪' };
            cardText += `᯽ ${rarityEmoji[card.rarity]} ${card.name} (ID: ${card.id})\n`;
        });

        cardText += `━━━━━━━━━━━━━━━`;

        await reply(cardText);
    }
};

const get = {
    execute: async ({ reply, senderId, args }) => {
        const cardId = parseInt(args[0]);
        if (!cardId) {
            return await reply('❌ Usage: .get <card_id>');
        }

        const card = cardDatabase.getCardById(cardId);
        if (!card) {
            return await reply('❌ Invalid card ID!');
        }

        await cardSystem.addCard(senderId, card);

        const response = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗖𝗟𝗔𝗜𝗠𝗘𝗗 𖣔━━╮
│  
│  ✅ 𝘾𝙡𝙖𝙞𝙢𝙚𝙙: ${card.name}
│  
│  💎 ${card.rarity}
│  💰 𝙑𝙖𝙡𝙪𝙚: $${card.value.toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const deck = {
    execute: async ({ reply }) => {
        let deckText = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗗𝗘𝗖𝗞 𖣔━━╮
│  
│  🎴 𝘼𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚 𝘾𝙖𝙧𝙙𝙨
│  
╰━━━━━━━━━━━━━━━━━━╯

`;

        const rarities = ['Legendary', 'Epic', 'Rare', 'Common'];
        for (const rarity of rarities) {
            const cards = cardDatabase.cards.filter(c => c.rarity === rarity);
            const emoji = { Legendary: '🌟', Epic: '💎', Rare: '💠', Common: '⚪' };
            
            deckText += `\n${emoji[rarity]} ${rarity.toUpperCase()}\n━━━━━━━━━━━━━━━\n`;
            cards.forEach(card => {
                deckText += `᯽ ${card.name} - $${card.value.toLocaleString()}\n`;
            });
        }

        await reply(deckText);
    }
};

const givecard = {
    execute: async ({ reply, senderId, msg, args }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to give a card to!');
        }

        const cardId = parseInt(args[0]);
        if (!cardId) {
            return await reply('❌ Usage: .givecard @user <card_id>');
        }

        const targetId = mentioned[0].split('@')[0];
        const success = await cardSystem.transferCard(senderId, targetId, cardId);
        
        if (!success) {
            return await reply('❌ You don\'t have this card!');
        }

        const card = cardDatabase.getCardById(cardId);
        await reply(`╭━━𖣔 𝗖𝗔𝗥𝗗 𝗚𝗜𝗩𝗘𝗡 𖣔━━╮
│  
│  ✅ 𝙂𝙖𝙫𝙚: ${card.name}
│  👤 𝙏𝙤: @${targetId}
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

const sellcard = {
    execute: async ({ reply, senderId, args }) => {
        const cardId = parseInt(args[0]);
        if (!cardId) {
            return await reply('❌ Usage: .sellcard <card_id>');
        }

        const card = cardDatabase.getCardById(cardId);
        if (!card) {
            return await reply('❌ Invalid card ID!');
        }

        const success = await cardSystem.removeCard(senderId, cardId);
        if (!success) {
            return await reply('❌ You don\'t have this card!');
        }

        const user = await database.getUser(senderId);
        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) + card.value
        });

        const response = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗦𝗢𝗟𝗗 𖣔━━╮
│  
│  ✅ 𝙎𝙤𝙡𝙙: ${card.name}
│  💰 𝙀𝙖𝙧𝙣𝙚𝙙: $${card.value.toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const rollcard = {
    execute: async ({ reply, senderId }) => {
        const user = await database.getUser(senderId);
        const cost = 500;

        if ((user?.wallet || 0) < cost) {
            return await reply('❌ You need $500 to roll a card!');
        }

        await database.updateUser(senderId, {
            wallet: (user?.wallet || 0) - cost
        });

        const card = cardDatabase.getRandomCard();
        await cardSystem.addCard(senderId, card);

        const rarityEmoji = { Legendary: '🌟', Epic: '💎', Rare: '💠', Common: '⚪' };
        const response = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗥𝗢𝗟𝗟 𖣔━━╮
│  
│  🎲 𝙔𝙤𝙪 𝙧𝙤𝙡𝙡𝙚𝙙...
│  
│  ${rarityEmoji[card.rarity]} ${card.name}
│  💎 ${card.rarity}
│  💰 $${card.value.toLocaleString()}
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        await reply(response);
    }
};

const cards = {
    execute: async ({ reply, isGroup, isAdmin, args, msg }) => {
        if (!isGroup) return await reply('❌ This command is only for groups!');
        if (!isAdmin) return await reply('❌ Only admins can use this command!');

        const state = args[0]?.toLowerCase();
        if (state !== 'on' && state !== 'off') {
            return await reply('❌ Usage: .cards <on/off>');
        }

        await database.updateGroup(msg.key.remoteJid, { cardsEnabled: state === 'on' });

        await reply(`╭━━𖣔 𝗖𝗔𝗥𝗗𝗦 𝗦𝗬𝗦𝗧𝗘𝗠 𖣔━━╮
│  
│  ✅ 𝘾𝙖𝙧𝙙 𝙨𝙮𝙨𝙩𝙚𝙢 ${state === 'on' ? '𝙚𝙣𝙖𝙗𝙡𝙚𝙙' : '𝙙𝙞𝙨𝙖𝙗𝙡𝙚𝙙'}!
│  
╰━━━━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

const auction = { execute: async ({ reply }) => await reply('🔨 Auction feature coming soon!') };
const bid = { execute: async ({ reply }) => await reply('💰 Bid feature coming soon!') };

// ==================== SEARCH/AI COMMANDS ====================
const gpt = {
    execute: async ({ reply, args }) => {
        const query = args.join(' ');
        if (!query) {
            return await reply('❌ Usage: .gpt <query>');
        }

        // Placeholder - integrate your AI API here
        await reply(`╭━━𖣔 𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 𖣔━━╮
│  
│  🤖 𝙌𝙪𝙚𝙧𝙮: ${query}
│  
│  This feature requires an AI API.
│  Please integrate your preferred AI service.
│  
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`);
    }
};

const ai = gpt;

const google = {
    execute: async ({ reply, args }) => {
        const query = args.join(' ');
        if (!query) {
            return await reply('❌ Usage: .google <query>');
        }

        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        await reply(`🔍 Search results for: ${query}\n\n${url}`);
    }
};

// ==================== IMAGE COMMANDS ====================
const sticker = {
    execute: async ({ reply, msg, sock }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.imageMessage) {
            return await reply('❌ Reply to an image to convert it to a sticker!');
        }

        await reply('🎨 Converting to sticker...');
        // Implement sticker conversion here
    }
};

const blur = {
    execute: async ({ reply, msg }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.imageMessage) {
            return await reply('❌ Reply to an image to blur it!');
        }

        await reply('🎨 Feature coming soon!');
    }
};

const removebg = {
    execute: async ({ reply, msg }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted?.imageMessage) {
            return await reply('❌ Reply to an image to remove background!');
        }

        await reply('🎨 Feature coming soon!');
    }
};

// ==================== FUN COMMANDS ====================
const match = {
    execute: async ({ reply, msg, senderId }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const targetId = mentioned?.[0]?.split('@')[0] || 'someone';
        
        const percentage = Math.floor(Math.random() * 101);
        const bars = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

        await reply(`╭━━𖣔 𝗠𝗔𝗧𝗖𝗛 𖣔━━╮
│  
│  💕 𝙈𝙖𝙩𝙘𝙝 𝙍𝙖𝙩𝙚
│  
│  [${bars}] ${percentage}%
│  
╰━━━━━━━━━━━━━━━╯`);
    }
};

const roast = {
    execute: async ({ reply, msg }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user to roast!');
        }

        const roasts = [
            "I'd agree with you, but then we'd both be wrong! 🔥",
            "You bring everyone so much joy... when you leave the room! 💀",
            "I'm not saying you're dumb, but you have bad luck when it comes to thinking! 😅",
            "If I wanted to kill myself, I'd climb your ego and jump to your IQ! 🎯"
        ];

        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        await reply(`╭━━𖣔 𝗥𝗢𝗔𝗦𝗧 𖣔━━╮
│  
│  ${roast}
│  
╰━━━━━━━━━━━━━━━╯`);
    }
};

const simp = {
    execute: async ({ reply, msg }) => {
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return await reply('❌ Please mention a user!');
        }

        const percentage = Math.floor(Math.random() * 101);
        const bars = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

        await reply(`╭━━𖣔 𝗦𝗜𝗠𝗣 𝗠𝗘𝗧𝗘𝗥 𖣔━━╮
│  
│  💝 𝙎𝙞𝙢𝙥 𝙇𝙚𝙫𝙚𝙡
│  
│  [${bars}] ${percentage}%
│  
╰━━━━━━━━━━━━━━━━━━━╯`);
    }
};

// ==================== DOWNLOAD COMMANDS ====================
const play = {
    execute: async ({ reply, args }) => {
        const song = args.join(' ');
        if (!song) {
            return await reply('❌ Usage: .play <song name>');
        }

        await reply(`🎵 Searching for: ${song}\n\nDownload feature coming soon!`);
    }
};

const instagram = {
    execute: async ({ reply, args }) => {
        const url = args[0];
        if (!url || !url.includes('instagram.com')) {
            return await reply('❌ Please provide a valid Instagram URL!');
        }

        await reply('📥 Instagram downloader coming soon!');
    }
};

const tiktok = {
    execute: async ({ reply, args }) => {
        const url = args[0];
        if (!url || !url.includes('tiktok.com')) {
            return await reply('❌ Please provide a valid TikTok URL!');
        }

        await reply('📥 TikTok downloader coming soon!');
    }
};

// ==================== EXPORT ALL COMMANDS ====================
module.exports = {
    ...mainCommands,
    ...profileCommands,
    ...groupAdminCommands,
    // Economy
    accbal,
    deposit,
    withdraw,
    send,
    daily,
    weekly,
    monthly,
    inv,
    work,
    rob,
    // Gambling
    gamble: gambleCmd,
    slots,
    roulette,
    blackjack,
    coinflip,
    dice,
    lottery,
    jackpot,
    crash,
    race,
    wheel,
    poker,
    mines,
    plinko,
    limbo,
    // Cards
    mycards,
    get,
    deck,
    givecard,
    sellcard,
    auction,
    bid,
    rollcard,
    cards,
    // Search/AI
    gpt,
    ai,
    google,
    // Image
    sticker,
    blur,
    removebg,
    // Fun
    match,
    roast,
    simp,
    // Download
    play,
    instagram,
    tiktok
};
