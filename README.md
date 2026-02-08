# 𝗩𝗜𝗢𝗟𝗘𝗧 - Advanced WhatsApp Bot

![Bot Status](https://img.shields.io/badge/status-online-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 🌟 Features

### ⚙️ Main Features
- Pairing code authentication (no QR code needed!)
- Firebase database integration
- Public/Private mode
- Auto-ignore old messages when bot restarts
- Professional styled responses

### 🎴 Card System
- Collectible cards with rarities (Common, Rare, Epic, Legendary)
- Random card spawns in groups
- Upload custom cards with images
- Trade, sell, and auction cards
- Complete deck browser

### 💰 Economy System
- Wallet & Bank accounts
- Daily, Weekly, Monthly rewards
- Work & Rob commands
- Transfer money between users
- Complete inventory system

### 🎰 Gambling Games
- Gamble, Slots, Roulette
- Coinflip, Dice, Blackjack
- And many more!

### 🛡️ Group Administration
- Promote/Demote members
- Kick, Mute, Warn users
- Tagall with custom formatting
- Welcome/Goodbye messages
- Antilink protection

### 👤 Profile System
- Customizable profiles
- Set name, age, profile picture
- Profile quotes
- Stats tracking

## 📋 Prerequisites

- Node.js v18 or higher
- A WhatsApp account
- Firebase project with Firestore

## 🚀 Installation

1. **Extract the bot files**
   ```bash
   unzip whatsapp-bot.zip
   cd whatsapp-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Firestore Database
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Open `firebase.js` and replace the `serviceAccount` object with your downloaded key

4. **Start the bot**
   ```bash
   npm start
   ```

5. **Pairing Code Setup**
   - When prompted, enter your WhatsApp number (with country code, no + sign)
   - Example: 1234567890
   - You'll receive an 8-digit pairing code
   - Open WhatsApp > Linked Devices > Link a Device
   - Enter the pairing code

## 🔥 Firebase Setup

1. In `firebase.js`, replace the placeholder values:

```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
};
```

2. Update the database URL:
```javascript
databaseURL: "https://your-project-id.firebaseio.com"
```

## 📱 Commands

### Main Menu
```
.menu          - Display full menu
.ping          - Check bot response time
.alive         - Check bot status
.register      - Register your account
.leaderboard   - View top users
.mods          - View group moderators
.mode          - Toggle private/public mode (owner only)
```

### Profile Commands
```
.profile       - View your profile
.setname       - Set your name
.setage        - Set your age
.setprofile    - Set profile picture
.setprofilequote - Set profile quote
```

### Economy Commands
```
.accbal        - Check balance
.deposit       - Deposit to bank
.withdraw      - Withdraw from bank
.send          - Send money to user
.daily         - Claim daily reward ($1,000)
.weekly        - Claim weekly reward ($7,500)
.monthly       - Claim monthly reward ($50,000)
.work          - Work for money
.rob           - Rob a user (risky!)
```

### Card Commands
```
.mycards       - View your cards
.get <id>      - Claim spawned card
.deck          - View all available cards
.givecard      - Give card to user
.sellcard      - Sell a card
.rollcard      - Roll for random card ($500)
.cards on/off  - Enable/disable card spawning (admin)
```

### Gambling Commands
```
.gamble <amount>              - 50/50 chance to double
.slots <amount>               - Slot machine
.coinflip <amount> <h/t>      - Flip a coin
.roulette <amount> <bet>      - Roulette wheel
.dice <amount>                - Roll dice against house
```

### Group Admin Commands
```
.promote       - Promote to admin
.demote        - Demote from admin
.kick          - Remove user
.warn          - Warn a user
.mute          - Mute a user
.tagall        - Tag all members
.welcome on/off - Toggle welcome messages
.antilink on/off - Toggle antilink protection
```

### Fun Commands
```
.match         - Check compatibility
.roast         - Roast someone
.simp          - Simp meter
```

### AI/Search Commands
```
.gpt <query>   - AI response (requires API)
.ai <query>    - Same as GPT
.google <query> - Google search
```

### Download Commands
```
.play <song>   - Download music
.instagram <url> - Download Instagram content
.tiktok <url>  - Download TikTok videos
```

## 🎯 Bot Modes

### Public Mode (Default)
- Bot responds to all commands in groups

### Private Mode
- Bot only responds when mentioned in groups
- Use: `.mode private` (owner only)

## 💜 Bot Owner

The first phone number used for pairing automatically becomes the bot owner.

Owner privileges:
- Change bot mode
- Access to all administrative functions
- Full control over bot settings

## 🔧 Customization

### Change Bot Name
Edit in `messageHandler.js` and menu commands

### Change Prefix
Edit the `PREFIX` variable in `commands/allCommands.js`

### Add Custom Commands
1. Open `commands/allCommands.js`
2. Add your command following the existing pattern:
```javascript
const myCommand = {
    execute: async ({ reply, args, senderId }) => {
        await reply('Your response here');
    }
};
```
3. Export it in the module.exports section

### Add Custom Cards
Edit `cardDatabase.cards` array in `cardSystem.js`

## 🐛 Troubleshooting

### Bot doesn't respond
- Check if Firebase is configured correctly
- Verify the bot has admin rights (for admin commands)
- Check if message is recent (bot ignores old messages)

### Pairing code doesn't work
- Ensure you entered the number without '+' or spaces
- Try deleting `auth_info` folder and restart
- Check your internet connection

### Database errors
- Verify Firebase credentials are correct
- Check if Firestore is enabled in Firebase console
- Ensure your Firebase project has billing enabled (free tier works)

### Connection lost errors
- Normal on Replit due to connection resets
- Bot will automatically reconnect
- These errors are suppressed in console

## 📝 Notes

- Bot automatically ignores commands sent before it started
- Card spawns have 5% chance every minute in groups with cards enabled
- All currency values are in dollars ($)
- Warns reset automatically when user reaches 3 warns

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase setup
3. Verify all dependencies are installed

## 👨‍💻 Developer

**Owner:** Kynx  
**Bot Name:** Violet  
**Version:** 1.0.0  
**Database:** Firebase  

---

💜 **𝗩𝗶𝗼𝗹𝗲𝘁 𝗕𝘆 𝗞𝘆𝗻𝘅** 💜
