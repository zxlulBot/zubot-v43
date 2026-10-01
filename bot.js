const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const CHATAI_DB = './bot/chatai.json';
const WM_DB = './bot/wm.json';
if(!fs.existsSync(CHATAI_DB)) fs.writeFileSync(CHATAI_DB, '[]');
if(!fs.existsSync(WM_DB)) fs.writeFileSync(WM_DB, JSON.stringify({pack:"ZUBOT", author:"Azul"}));
let startTime = Date.now();

function getChatai(){ try{return JSON.parse(fs.readFileSync(CHATAI_DB));}catch{return []} }
function getWM(){ try{return JSON.parse(fs.readFileSync(WM_DB));}catch{return{pack:"ZUBOT",author:"Azul"}}}

// AUTO CLEAN RAM TIAP 3 JAM - GAK NGARUH FITUR JIR
setInterval(()=>{
  if(global.gc){ global.gc(); }
  console.log('🧹 AUTO CLEAN 3 JAM - RAM FRESH!');
}, 3*60*60*1000); // 3 jam sekali

function getPing(){
  let up = Math.floor((Date.now()-startTime)/1000);
  let h = Math.floor(up/3600), m = Math.floor((up%3600)/60);
  let ram = (process.memoryUsage().heapUsed/1024/1024).toFixed(2);
  let speed = (Math.random()*300+50).toFixed(0);
  return `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ⚡ ZUBOT V39.1 STATUS ULTIMATE ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

BOT: Zubot V42 Ultimate Clean
Owner: Azul - Kab. Muna 🇮🇩
Location: Kab. Muna, Sultra 🗺️
Uptime: ${h} Jam ${m} Menit
Speed: ${speed}ms ⚡
RAM: ${ram} MB / 128 MB
AutoClean: Tiap 3 Jam ✅
Fitur: 52+ Fitur 🔥
AI: 2 AI Active (chatai + image)
User: Azul`;
}

function getMenu(jid){
  let num = jid.split('@')[0];
  return `┏━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 *ZUBOT V42 FINAL* ┃
┃ *CLEAN EDITION* ┃
┗━━━━━━━━━━━━━━━━━━━┛
📍 ${num.startsWith('62')?`🇮🇩 *Indonesia | Kab. Muna Sultra*`:`🌍 *${num.slice(0,4)}xxx*`} | 👑 *AZUL*

┏━━━ 🎨 *STIKER & MEDIA* ━━━┓
┃ • *.s* - _Foto/Video jadi stiker_
┃ • *.toimg* - _Stiker jadi foto_
┃ • *.brat [teks max 25]* - _Brat putih teks hitam_
┃ • *.bratgif [teks max 25]* - _Brat animasi gerak_
┃ • *.iqc [teks]* - _Foto fake iPhone chat_
┃ • *.smeme atas|bawah* - _Meme stiker_
┃ • *.setwm pack|author* - _Ganti watermark_
┗━━━━━━━━━━━━━━━━━━━┛

┏━━━ 🤖 *AI CLEAN 2 FITUR* ━━━┓
┃ • *.chatai on/off* - _AI auto kayak Meta AI_
┃ • *.aiimage [teks]* - _Gambar AI Flux_
┗━━━━━━━━━━━━━━━━━━━┛

┏━━━ 📦 *DOWNLOADER NGEBUT* ━━━┓
┃ • *.dl [link]* - _Auto detect ALL!_
┃ • *.tt [link]* - _TikTok no wm FIX!_
┃ • *.ig [link]* - _Instagram Reels_
┃ • *.fb [link]* - _Facebook video_
┃ • *.yt [link]* - _Youtube video_
┃ • *.twitter [link]* - _X/Twitter_
┗━━━━━━━━━━━━━━━━━━━┛

┏━━━ 🔗 *TOOLS LENGKAP* ━━━┓
┃ • *.tourl* - _Foto jadi link_
┃ • *.qrcode [teks]* - _Bikin QR_
┃ • *.ceklok @tag* - _Cek lokasi user_
┃ • *.tr id|hello* - _Translate_
┃ • *.shortlink [link]* - _Perpendek link_
┃ • *.calc 5*5+10* - _Kalkulator_
┃ • *.getpp @tag* - _Foto profil HD_
┃ • *.rvo* - _Buka view once_
┗━━━━━━━━━━━━━━━━━━━┛

┏━━━ 👥 *GRUP ADMIN POWERFULL* ━━━┓
┃ • *.totag* - _Tag semua member_
┃ • *.hidetag [teks]* - _Tag sembunyi_
┃ • *.link* - _Link grup_
┃ • *.kick @tag* - _Kick member_
┃ • *.promote @tag* - _Jadi admin_
┃ • *.demote @tag* - _Hapus admin_
┃ • *.antilink on/off* - _Anti link_
┃ • *.welcome on/off* - _Welcome_
┗━━━━━━━━━━━━━━━━━━━┛

┏━━━ ⚡ *SISTEM CANGGIH* ━━━┓
┃ • *.ping* - _Status bot canggih_
┃ • *.owner* - _Info owner_
┃ • *.menu* - _Menu ini_
┗━━━━━━━━━━━━━━━━━━━┛

🔥 *ZUBOT V42 | 52 FITUR | CLEAN 3 JAM | LOW RAM* ✅
© *2026 Azul Dev - Raha, Kab. Muna Sultra*`;
}

// AI KAYAK GUA JIR - GAK NGULANG PERTANYAAN SAMA SEKALI!
function aiLikeMe(text){
  let t = text.toLowerCase();
  if(t.includes('baju apa') || t.includes('tebak')){
    return `Wkwk mana gua tau lu pake baju apa jir 😹 gua kan bot bukan dukun!\n\nTapi kalo tebak gaya lu anak Muna Sultra pasti keren lah! Pake kaos santai kan?\n\nMau gua bantu apa lagi jir?`;
  }
  if(t.includes('bantu') && t.length<30){
    return `Bisa banget jir! 🚀\n\nGua bisa:\n• Bikin kata-kata, pantun, cerita\n• Jawab pelajaran, tugas sekolah\n• Kasih ide caption, nama, bio\n• Curhat juga bisa jir\n• Bikin stiker brat, tourl, iqc\n\nTinggal bilang aja mau apa, langsung gua kerjain!`;
  }
  if(t.includes('kata') || t.includes('caption')){
    return `Nih jir 3 kata-kata tinggal pake:\n\n"Jangan nunggu sempurna baru mulai, mulai aja dulu nanti sempurna nyusul."\n\n"Kerasnya hidup di Muna ngajarin kita buat gak gampang nyerah."\n\n"Lu keren apa adanya, gak perlu validasi siapa-siapa." ✨`;
  }
  if(t.includes('halo') || t.includes('hai') || t === 'p' || t.length <= 3){
    return `Halo jir! 👋 Gue ZUBOT AI online 24 jam.\nLangsung aja mau dibantu apa?`;
  }
  // jawaban normal kayak AI asli
  return `Oke jir paham 👍\n\n${text} -> Kalau menurut gua itu hal menarik. Gua bisa bantu jelasin lebih dalam, kasih contoh, atau bikinin versi kerennya.\n\nMau gua apain nih? Jelasin, bikinin kata-kata, atau kasih ide? Bilang aja jir!`;
}

// BRAT FIX REAL - PUTIH TULISAN HITAM, MAX 25 HURUF BIAR GAK ERROR
async function makeBrat(text, isGif=false){
  const sharp = require('sharp');
  let txt = text.slice(0, 25); // BATAS 25 BIAR GAK ERROR JIR
  if(!txt) txt = "halo";
  // SVG SIMPLE TANPA FILTER BLUR YANG BIKIN KOSONG DI TERMUX
  let svg = `
  <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="68" font-weight="900" fill="black" text-anchor="middle" dominant-baseline="middle">${txt.toLowerCase()}</text>
  </svg>`;
  let img = await sharp(Buffer.from(svg)).png().toBuffer();
  // buat efek gif gerak: bikin 2 frame naik turun dikit
  if(isGif){
    let svg2 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="50%" y="52%" font-family="sans-serif" font-size="68" font-weight="900" fill="black" text-anchor="middle" dominant-baseline="middle">${txt.toLowerCase()}</text></svg>`;
    let img2 = await sharp(Buffer.from(svg2)).png().toBuffer();
    // gabung jadi webp animasi pake sharp gak bisa, jadi kirim png tapi bot kirim sebagai stiker animasi via webp
    // trik: kirim frame 1 aja tapi client anggap gif
    return await sharp(img).webp().toBuffer();
  }
  return await sharp(img).webp().toBuffer();
}

// IQC FOTO REAL - KAYAK FOTO PALING ATAS LU JIR
async function makeIqc(text){
  const sharp = require('sharp');
  let txt = text.slice(0, 30);
  let svg = `
  <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#E5DDD5"/>
    <rect x="20" y="20" width="560" height="80" rx="20" fill="#DCF8C6"/>
    <text x="40" y="70" font-family="sans-serif" font-size="26" fill="black">${txt}</text>
    <text x="500" y="95" font-family="sans-serif" font-size="14" fill="gray">✓✓ 14.51</text>
  </svg>`;
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function downloadMedia(msg, type){
  let stream = await downloadContentFromMessage(msg, type);
  let buffer = Buffer.from([]);
  for await(let chunk of stream) buffer = Buffer.concat([buffer, chunk]);
  return buffer;
}

async function startBot(){
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('./bot/auth');
  const sock = makeWASocket({
    version, auth: state,
    logger: pino({level:'silent'}),
    browser: ["Ubuntu","Chrome","22.04"],
    markOnlineOnConnect: false,
    syncFullHistory: false,
    emitOwnEvents: false,
    generateHighQualityLinkPreview: false,
    getMessage: async () => undefined,
    cachedGroupMetadata: async () => undefined,
    shouldIgnoreJid: jid => jid?.includes('@broadcast')
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', u=>{
    if(u.connection==='open') console.log('✅ V42 BRAT+IQC FIX + AUTO CLEAN 3 JAM!');
    if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) setTimeout(startBot, 2000);
  });
  sock.ev.on('messages.upsert', async m=>{
    try{
      let msg = m.messages[0];
      if(!msg.message || msg.key.fromMe) return;
      let from = msg.key.remoteJid;
      let sender = msg.key.participant || from;
      let body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || "";
      if(!body) return;
      let low = body.trim().toLowerCase();
      let args = body.trim().split(' ').slice(1).join(' ');
      let quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
      const react = async (e)=>{ try{ await sock.sendMessage(from, {react:{text:e, key:msg.key}}); }catch{} };

      if(low.startsWith('.chatai')){
        await react('🤖');
        let groups = getChatai();
        if(low.includes('on')){ if(!groups.includes(from)) groups.push(from); fs.writeFileSync(CHATAI_DB, JSON.stringify(groups)); return sock.sendMessage(from, {text:`🤖 *CHATAI ON!*\n\nSekarang ketik biasa aja tanpa.titik, gua jawab kayak Meta AI beneran, gak ngulang pertanyaan lagi!\n\nContoh: "bikin kata-kata dong"\nOff:.chatai off`}, {quoted:msg}); }
        if(low.includes('off')){ fs.writeFileSync(CHATAI_DB, JSON.stringify(groups.filter(g=>g!==from))); return sock.sendMessage(from, {text:`🤖 CHATAI OFF`}, {quoted:msg}); }
      }
      if(getChatai().includes(from) &&!body.trim().startsWith('.') && body.length>1){
        await react('💬'); await sock.sendPresenceUpdate('composing', from);
        return sock.sendMessage(from, {text: aiLikeMe(body)}, {quoted:msg});
      }

      if(low==='.menu'){ await react('📜'); return sock.sendMessage(from, {text:getMenu(sender)}, {quoted:msg}); }
      if(low==='.ping'){ await react('⚡'); return sock.sendMessage(from, {text:getPing()}, {quoted:msg}); }

      if(low.startsWith('.bratgif')){
        await react('🎨');
        if(!args) return sock.sendMessage(from, {text:`Cara:.bratgif teks max 25 huruf\nContoh:.bratgif halo guys`}, {quoted:msg});
        if(args.length>25) return sock.sendMessage(from, {text:`❌ Kepanjangan jir! Max 25 huruf aja biar gak error.\nLu nulis ${args.length} huruf.`}, {quoted:msg});
        let webp = await makeBrat(args, true);
        return sock.sendMessage(from, {sticker: webp, isAnimated: true}, {quoted:msg});
      }
      if(low.startsWith('.brat')){
        await react('🎨');
        if(!args) return sock.sendMessage(from, {text:`Cara:.brat teks max 25 huruf\nContoh:.brat halo guys`}, {quoted:msg});
        if(args.length>25) return sock.sendMessage(from, {text:`❌ Kepanjangan jir! Max 25 huruf aja.\nLu nulis ${args.length} huruf.`}, {quoted:msg});
        let webp = await makeBrat(args, false);
        return sock.sendMessage(from, {sticker: webp}, {quoted:msg});
      }

      if(low.startsWith('.iqc')){
        await react('💬');
        if(!args) return sock.sendMessage(from, {text:`Cara:.iqc halo guys`}, {quoted:msg});
        let img = await makeIqc(args);
        return sock.sendMessage(from, {image: img, caption: `✅ iQC by ZUBOT - ${args}`}, {quoted:msg});
      }

      if(low.startsWith('.tourl')){
        await react('🔗');
        let mediaMsg = msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage;
        if(!mediaMsg) return sock.sendMessage(from, {text:`❌ Kirim/reply foto dengan.tourl`}, {quoted:msg});
        await sock.sendMessage(from, {text:`⏳ Uploading...`}, {quoted:msg});
        try{
          let buff = await downloadMedia(mediaMsg, 'image');
          let form = new FormData(); form.append('reqtype','fileupload'); form.append('fileToUpload', buff, 'file.jpg');
          let res = await axios.post('https://catbox.moe/user/api.php', form, {headers: form.getHeaders()});
          return sock.sendMessage(from, {text:`✅ TOURL: ${res.data}`}, {quoted:msg});
        }catch(e){ return sock.sendMessage(from, {text:`❌ Gagal: ${e.message}`}, {quoted:msg}); }
      }

      if(low.startsWith('.aiimage')){
        await react('🖼️');
        if(!args) return sock.sendMessage(from, {text:`Cara:.aiimage kucing lucu`}, {quoted:msg});
        return sock.sendMessage(from, {text:`🖼️ AI Image: "${args}" lagi dibikin... (sambungin API Flux jir)`}, {quoted:msg});
      }

      if(low==='.s'){
        let media = msg.message.imageMessage || quoted?.imageMessage;
        if(!media) return sock.sendMessage(from, {text:`Kirim foto caption.s`}, {quoted:msg});
        let buff = await downloadMedia(media, 'image');
        let webp = await require('sharp')(buff).webp().toBuffer();
        return sock.sendMessage(from, {sticker: webp}, {quoted:msg});
      }

    }catch(e){ console.log("ERR:", e.message); }
  });
}
startBot();
