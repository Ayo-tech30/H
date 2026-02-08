const { database } = require('./firebase');

const economy = {
    async getBalance(userId) {
        const user = await database.getUser(userId);
        return {
            wallet: user?.wallet || 0,
            bank: user?.bank || 0
        };
    },

    async addMoney(userId, amount, type = 'wallet') {
        const user = await database.getUser(userId);
        const current = user?.[type] || 0;
        await database.updateUser(userId, { [type]: current + amount });
        return current + amount;
    },

    async removeMoney(userId, amount, type = 'wallet') {
        const user = await database.getUser(userId);
        const current = user?.[type] || 0;
        if (current < amount) return false;
        await database.updateUser(userId, { [type]: current - amount });
        return true;
    },

    async transfer(from userId, toUserId, amount) {
        const success = await this.removeMoney(fromUserId, amount, 'wallet');
        if (!success) return false;
        await this.addMoney(toUserId, amount, 'wallet');
        return true;
    }
};

module.exports = { economy };
