#!/bin/bash

echo "╭━━𖣔 𝗩𝗜𝗢𝗟𝗘𝗧 𝗕𝗢𝗧 𖣔━━╮"
echo "│  Starting bot...      │"
echo "╰━━━━━━━━━━━━━━━━━━━━━╯"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the bot
node index.js
