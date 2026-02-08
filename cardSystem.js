const { database } = require('./firebase');

const cardDatabase = {
    cards: [
        { id: 1, name: 'Fire Dragon', rarity: 'Legendary', value: 5000 },
        { id: 2, name: 'Ice Phoenix', rarity: 'Legendary', value: 4800 },
        { id: 3, name: 'Thunder Wolf', rarity: 'Epic', value: 2500 },
        { id: 4, name: 'Shadow Panther', rarity: 'Epic', value: 2300 },
        { id: 5, name: 'Wind Eagle', rarity: 'Rare', value: 1000 },
        { id: 6, name: 'Earth Bear', rarity: 'Rare', value: 950 },
        { id: 7, name: 'Light Dove', rarity: 'Common', value: 300 },
        { id: 8, name: 'Dark Crow', rarity: 'Common', value: 280 },
        { id: 9, name: 'Mystic Unicorn', rarity: 'Legendary', value: 6000 },
        { id: 10, name: 'Crystal Serpent', rarity: 'Epic', value: 2700 },
    ],

    getRandomCard() {
        const rand = Math.random();
        let rarity;
        
        if (rand < 0.01) rarity = 'Legendary';      // 1%
        else if (rand < 0.10) rarity = 'Epic';      // 9%
        else if (rand < 0.30) rarity = 'Rare';      // 20%
        else rarity = 'Common';                      // 70%

        const filtered = this.cards.filter(c => c.rarity === rarity);
        return filtered[Math.floor(Math.random() * filtered.length)];
    },

    getCardById(id) {
        return this.cards.find(c => c.id === id);
    }
};

const cardSystem = {
    async getUserCards(userId) {
        return await database.getCards(userId);
    },

    async addCard(userId, card) {
        const cards = await this.getUserCards(userId);
        cards.push({ ...card, obtainedAt: Date.now() });
        await database.setCards(userId, cards);
        return card;
    },

    async removeCard(userId, cardId) {
        const cards = await this.getUserCards(userId);
        const index = cards.findIndex(c => c.id === cardId);
        if (index === -1) return false;
        
        cards.splice(index, 1);
        await database.setCards(userId, cards);
        return true;
    },

    async transferCard(fromUserId, toUserId, cardId) {
        const success = await this.removeCard(fromUserId, cardId);
        if (!success) return false;
        
        const card = cardDatabase.getCardById(cardId);
        await this.addCard(toUserId, card);
        return true;
    }
};

const cardSpawner = {
    lastSpawn: {},
    spawnCooldown: 60000, // 1 minute

    async randomSpawn(sock, groupId) {
        const now = Date.now();
        const lastTime = this.lastSpawn[groupId] || 0;
        
        if (now - lastTime < this.spawnCooldown) return;
        
        // 5% chance to spawn
        if (Math.random() > 0.05) return;

        this.lastSpawn[groupId] = now;
        const card = cardDatabase.getRandomCard();

        const rarityEmoji = {
            'Legendary': '🌟',
            'Epic': '💎',
            'Rare': '💠',
            'Common': '⚪'
        };

        const spawnMessage = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗦𝗣𝗔𝗪𝗡𝗘𝗗 𖣔━━╮
│  
│  🎴 ${card.name}
│  ${rarityEmoji[card.rarity]} ${card.rarity}
│  💰 Value: $${card.value.toLocaleString()}
│  
│  Use .get ${card.id} to claim!
│  
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(groupId, { text: spawnMessage });
    },

    async handleImageUpload(sock, msg) {
        // When someone uploads an image with a card, spawn it
        const caption = msg.message.imageMessage?.caption || '';
        
        // Check if it's a card upload (admin/owner only)
        if (caption.startsWith('.spawncard')) {
            const card = cardDatabase.getRandomCard();
            
            const response = `╭━━𖣔 𝗖𝗔𝗥𝗗 𝗦𝗣𝗔𝗪𝗡𝗘𝗗 𖣔━━╮
│  
│  🎴 ${card.name}
│  💎 ${card.rarity}
│  
│  First to use .get ${card.id} wins!
│  
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

            await sock.sendMessage(msg.key.remoteJid, { text: response });
        }
    }
};

module.exports = { cardSystem, cardDatabase, cardSpawner };
