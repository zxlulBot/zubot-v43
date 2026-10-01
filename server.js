const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const CONFIG_PATH = './bot/config.json';
if(!fs.existsSync(CONFIG_PATH)){
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({typing:true, doubleTick:true, mode:"both", botActive:true}, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));

function getConfig(){ try{ return JSON.parse(fs.readFileSync(CONFIG_PATH)); }catch{ return {typing:true, doubleTick:true, mode:"both", botActive:true}} }
function saveConfig(c){ fs.writeFileSync(CONFIG_PATH, JSON.stringify(c, null, 2)); }

app.get('/api/status', (req,res)=>{
  let cfg = getConfig();
  let mem = process.memoryUsage();
  res.json({
    bot: cfg.botActive ? 'online' : 'offline',
    ram: (mem.heapUsed/1024/1024).toFixed(1)+' MB',
    uptime: Math.floor((Date.now() - (global.start||Date.now()))/1000),
    config: cfg,
    location: 'Raha, Kab. Muna Sultra'
  });
});

app.post('/api/config', (req,res)=>{
  let cfg = getConfig();
  let newCfg = {...cfg, ...req.body};
  saveConfig(newCfg);
  res.json({ok:true, config:newCfg});
});

app.get('/', (req,res)=>{
  res.send(`<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZUBOT PANEL</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
</head>
<body class="bg-[#0a0e1a] text-white min-h-screen">
<div id="login" class="flex items-center justify-center min-h-screen p-4">
  <div class="bg-[#151a2b] p-8 rounded-3xl w-full max-w-sm shadow-2xl animate__animated animate__zoomIn border border-cyan-500/20">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black">Z</div>
      <h1 class="text-2xl font-black mt-3">ZUBOT PANEL</h1>
      <p class="text-gray-400 text-sm">V43 Pro - Muna Sultra</p>
    </div>
    <button onclick="googleLogin()" class="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
      <img src="https://www.google.com/favicon.ico" class="w-5"> Login dengan Google
    </button>
    <p class="text-[11px] text-gray-500 mt-3 text-center">Tanpa password, langsung masuk jir!</p>
  </div>
</div>

<div id="dash" class="hidden">
  <div class="bg-[#151a2b] p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-10">
    <div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-black">Z</div><div><b>ZUBOT V43</b><p class="text-xs text-gray-400">Kab. Muna Sultra 🇮🇩</p></div></div>
    <div id="botDot" class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs animate-pulse">● ONLINE</div>
  </div>

  <div class="p-4 grid gap-4 max-w-2xl mx-auto">
    <!-- QR & Pairing -->
    <div class="bg-[#151a2b] rounded-2xl p-5 border border-gray-800 animate__animated animate__fadeIn">
      <h2 class="font-bold mb-3">🔗 Hubungkan WhatsApp</h2>
      <div class="grid grid-cols-2 gap-3">
        <button onclick="showQR()" class="bg-cyan-600 py-3 rounded-xl font-bold">QR CODE</button>
        <button onclick="showPairing()" class="bg-blue-600 py-3 rounded-xl font-bold">PAIRING CODE</button>
      </div>
      <div id="qrBox" class="hidden mt-4 bg-white p-4 rounded-xl text-center text-black">
        <div id="qrContent">QR akan muncul disini jir<br><small>Scan di WA > Perangkat Tertaut</small></div>
        <input id="pairNum" placeholder="62xxxx (nomor WA)" class="w-full mt-3 p-2 border rounded text-black">
        <button onclick="genPair()" class="w-full mt-2 bg-black text-white py-2 rounded">Dapatkan Kode Pairing</button>
        <div id="pairCode" class="mt-2 font-mono text-2xl font-black tracking-widest"></div>
      </div>
    </div>

    <!-- Bot Control -->
    <div class="bg-[#151a2b] rounded-2xl p-5 border border-gray-800">
      <h2 class="font-bold mb-3">⚙️ Atur Bot</h2>
      <div class="space-y-3">
        <div class="flex justify-between items-center bg-[#0a0e1a] p-3 rounded-xl"><span>🤖 Bot Aktif / Off</span><input type="checkbox" id="botActive" class="w-6 h-6" onchange="save()"></div>
        <div class="flex justify-between items-center bg-[#0a0e1a] p-3 rounded-xl"><span>⌨️ Animasi Mengetik</span><input type="checkbox" id="typing" class="w-6 h-6" onchange="save()"></div>
        <div class="flex justify-between items-center bg-[#0a0e1a] p-3 rounded-xl"><span>✓✓ Auto Centang 2 Biru</span><input type="checkbox" id="doubleTick" class="w-6 h-6" onchange="save()"></div>
        <div class="bg-[#0a0e1a] p-3 rounded-xl"><label class="text-sm text-gray-400">Bot jalan di:</label><select id="mode" onchange="save()" class="w-full mt-1 bg-[#151a2b] p-2 rounded"><option value="both">Pribadi + Grup</option><option value="private">Pribadi aja</option><option value="group">Grup aja</option></select></div>
      </div>
      <p class="text-[11px] text-gray-500 mt-3">*Setting ini gak bikin bot off total jir, cuma ngatur perilaku. Bot tetep idup low RAM 30MB!</p>
    </div>

    <!-- Status -->
    <div class="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 animate__animated animate__pulse animate__infinite">
      <h2 class="font-bold">📊 Status Bot</h2>
      <div class="mt-2 text-sm"><div>RAM: <b id="ram">30MB</b> | Uptime: <b id="up">-</b></div><div>Mode: <b id="modeTxt">both</b> | Lokasi: Muna Sultra</div><div class="mt-2 w-full bg-black/30 h-2 rounded-full"><div class="h-2 bg-white rounded-full animate-[grow_3s_ease-in-out_infinite]" style="width:70%"></div></div></div>
    </div>
  </div>
</div>

<script>
let cfg={};
function googleLogin(){
  localStorage.setItem('zubot_google','ok');
  document.getElementById('login').classList.add('hidden');
  document.getElementById('dash').classList.remove('hidden');
  load();
}
if(localStorage.getItem('zubot_google')){ googleLogin(); }
function showQR(){ document.getElementById('qrBox').classList.remove('hidden'); document.getElementById('qrContent').innerHTML='<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZUBOT-MUNA-'+Date.now()+'" class="mx-auto"><p class="mt-2 text-sm">Scan ini di WA jir!</p>'; }
function showPairing(){ document.getElementById('qrBox').classList.remove('hidden'); document.getElementById('qrContent').innerHTML='Masukkan nomor WA lu di bawah jir'; }
function genPair(){
  let n=document.getElementById('pairNum').value;
  if(!n) return alert('Isi nomor dulu jir 62xxx');
  let code=Math.random().toString(36).substring(2,8).toUpperCase().replace(/(.{4})/,'$1-');
  document.getElementById('pairCode').innerText=code;
}
async function load(){
  let r=await fetch('/api/status'); let j=await r.json(); cfg=j.config;
  document.getElementById('botActive').checked=cfg.botActive;
  document.getElementById('typing').checked=cfg.typing;
  document.getElementById('doubleTick').checked=cfg.doubleTick;
  document.getElementById('mode').value=cfg.mode;
  document.getElementById('ram').innerText=j.ram;
  document.getElementById('up').innerText=j.uptime+'s';
  document.getElementById('modeTxt').innerText=cfg.mode;
  document.getElementById('botDot').innerHTML=cfg.botActive?'● ONLINE':'● OFFLINE';
  document.getElementById('botDot').className=cfg.botActive?'px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs animate-pulse':'px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs';
}
async function save(){
  let data={botActive:document.getElementById('botActive').checked, typing:document.getElementById('typing').checked, doubleTick:document.getElementById('doubleTick').checked, mode:document.getElementById('mode').value};
  await fetch('/api/config',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  load();
}
setInterval(load, 3000);
</script>
<style>@keyframes grow{0%,100%{width:40%}50%{width:80%}}</style>
</body></html>`);
});

global.start = Date.now();
app.listen(PORT, '0.0.0.0', ()=> console.log(`✅ WEB PRO AKTIF http://localhost:${PORT}`));
