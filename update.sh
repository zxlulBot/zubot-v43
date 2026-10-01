#!/data/data/com.termux/files/usr/bin/bash
echo "🔄 Update ZUBOT..."
pm2 delete all
git pull 2>/dev/null
npm i sharp express axios form-data --no-audit
pm2 start bot.js --name zubot --node-args="--max-old-space-size=128 --expose-gc"
pm2 start server.js --name webpanel
pm2 save
termux-wake-lock
echo "✅ SELESAI! Bot & Web idup lagi!"
pm2 list
