const { economy } = require('./economy');

const gambling = {
    async gamble(userId, amount) {
        const success = await economy.removeMoney(userId, amount, 'wallet');
        if (!success) return { success: false, message: 'Insufficient funds!' };

        const win = Math.random() > 0.5;
        if (win) {
            await economy.addMoney(userId, amount * 2, 'wallet');
            return { success: true, win: true, amount: amount * 2 };
        }
        return { success: true, win: false, amount: 0 };
    },

    async slots(userId, amount) {
        const success = await economy.removeMoney(userId, amount, 'wallet');
        if (!success) return { success: false, message: 'Insufficient funds!' };

        const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
        const results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let multiplier = 0;
        if (results[0] === results[1] && results[1] === results[2]) {
            multiplier = results[0] === '7️⃣' ? 10 : results[0] === '💎' ? 5 : 3;
        } else if (results[0] === results[1] || results[1] === results[2]) {
            multiplier = 1.5;
        }

        const winAmount = Math.floor(amount * multiplier);
        if (winAmount > 0) {
            await economy.addMoney(userId, winAmount, 'wallet');
        }

        return { success: true, results, winAmount, multiplier };
    },

    async coinflip(userId, amount, choice) {
        const success = await economy.removeMoney(userId, amount, 'wallet');
        if (!success) return { success: false, message: 'Insufficient funds!' };

        const result = Math.random() > 0.5 ? 'heads' : 'tails';
        const win = result === choice.toLowerCase();

        if (win) {
            await economy.addMoney(userId, amount * 2, 'wallet');
            return { success: true, win: true, result, amount: amount * 2 };
        }

        return { success: true, win: false, result, amount: 0 };
    },

    async roulette(userId, amount, bet) {
        const success = await economy.removeMoney(userId, amount, 'wallet');
        if (!success) return { success: false, message: 'Insufficient funds!' };

        const number = Math.floor(Math.random() * 37); // 0-36
        const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number);
        const isBlack = number > 0 && !isRed;

        let win = false;
        let multiplier = 0;

        if (bet === 'red' && isRed) {
            win = true;
            multiplier = 2;
        } else if (bet === 'black' && isBlack) {
            win = true;
            multiplier = 2;
        } else if (parseInt(bet) === number) {
            win = true;
            multiplier = 35;
        }

        const winAmount = Math.floor(amount * multiplier);
        if (winAmount > 0) {
            await economy.addMoney(userId, winAmount, 'wallet');
        }

        return { success: true, win, number, winAmount, multiplier };
    },

    async dice(userId, amount) {
        const success = await economy.removeMoney(userId, amount, 'wallet');
        if (!success) return { success: false, message: 'Insufficient funds!' };

        const playerRoll = Math.floor(Math.random() * 6) + 1;
        const houseRoll = Math.floor(Math.random() * 6) + 1;

        const win = playerRoll > houseRoll;
        const tie = playerRoll === houseRoll;

        if (win) {
            await economy.addMoney(userId, amount * 2, 'wallet');
            return { success: true, win: true, playerRoll, houseRoll, amount: amount * 2 };
        } else if (tie) {
            await economy.addMoney(userId, amount, 'wallet');
            return { success: true, win: false, tie: true, playerRoll, houseRoll, amount };
        }

        return { success: true, win: false, playerRoll, houseRoll, amount: 0 };
    }
};

module.exports = { gambling };
