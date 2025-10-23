// Tabs
document.querySelectorAll('.tablink').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tablink').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Mock inbox
const emails=[
  {from:'ventas@empresa.com', subject:'Cotización CDMX-MTY', ts:'2025-10-22 11:12'},
  {from:'rh@bimbo.com', subject:'Grupo 25 pax GDL→CDMX', ts:'2025-10-22 10:03'}
];
const was=[
  {from:'+52 55 1234 5678', text:'Cotiza 2 pax CDMX-CUN 15-18 Nov', ts:'09:41'},
  {from:'+52 56 4319 5153', text:'Necesito factura', ts:'08:22'}
];
function renderList(el, arr, fmt){
  const ul=document.getElementById(el);
  ul.innerHTML = arr.map(fmt).join('');
}
renderList('emailList', emails, e=>`<li><b>${e.subject}</b><br><small>${e.from} • ${e.ts}</small></li>`);
renderList('waList', was, w=>`<li><b>${w.text}</b><br><small>${w.from} • ${w.ts}</small></li>`);

// Parser (simple demo)
document.getElementById('btnParse').addEventListener('click', ()=>{
  const raw = document.getElementById('rawInput').value;
  const out = {
    origen: (raw.match(/CDMX|MEX|GDL|MTY|CUN/i)||[''])[0].toUpperCase(),
    destino: (raw.match(/CUN|MTY|GDL|MEX/i)||[''])[0].toUpperCase(),
    fechas: (raw.match(/\d{1,2}[-\/ ]?\w{3,}|\d{4}-\d{2}-\d{2}/gi)||[]),
    pax: (raw.match(/\b(\d{1,2})\s*(pax|personas)/i)||['', ''])[1] || 1,
    presupuesto: (raw.match(/\$\s?\d+[\d,\.]*/)||[''])[0]
  };
  document.getElementById('parsed').textContent = JSON.stringify(out,null,2);
});

// Quotes table (mock)
const headers=['Cliente','Ruta','Fechas','Pax','Precio','Estado'];
const data=[
  ['Bimbo','CDMX→MTY','12-14 Nov','25','$ 120,000','ENVIADA'],
  ['Público','GDL→CUN','15-18 Nov','2','$ 6,800','BORRADOR']
];
const table=document.getElementById('quoteTable');
table.innerHTML = `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>`+
                  `<tbody>${data.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;

// Charts (canvas)
function bar(canvasId, values, labels){
  const c=document.getElementById(canvasId);
  const ctx=c.getContext('2d');
  const w=c.width, h=c.height, pad=30;
  const max=Math.max(...values) || 1;
  const bw=(w-pad*2)/values.length - 10;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0b66c3';
  values.forEach((v,i)=>{
    const x=pad+i*(bw+10);
    const bh=(h-pad*2)*(v/max);
    ctx.fillRect(x, h-pad-bh, bw, bh);
    ctx.fillStyle='#334';
    ctx.fillText(labels[i], x, h-10);
    ctx.fillStyle='#0b66c3';
  });
}
bar('chart1', [4,8,6,12,9], ['Lun','Mar','Mié','Jue','Vie']);
bar('chart2', [2,3,1,5,4], ['Nuevas','Enviadas','Ajuste','Confirm','Entreg']);

// Theme
document.getElementById('btnSaveTheme').addEventListener('click',()=>{
  const primary = document.getElementById('colorPrimary').value;
  const bg = document.getElementById('colorBg').value;
  document.documentElement.style.setProperty('--bg', bg);
  document.documentElement.style.setProperty('--brand', primary);
  alert('Tema aplicado (local).');
});

// ======================
// Backend Integration
// ======================
async function postJSON(url, payload){
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok){ throw new Error(data?.error || ("Error " + res.status)); }
  return data;
}

async function registrarCotizacion(){
  const row = data?.[0] || ['Público','CDMX→MTY','12-14 Nov','2','$ 6,800','BORRADOR'];
  const payload = {
    cliente: row[0],
    ruta: row[1],
    fechas: row[2],
    pax: Number(String(row[3]).replace(/\D/g,'')) || 1,
    precio: row[4],
    estado: row[5]
  };
  const out = await postJSON("/api/sheets-upsertQuote", payload);
  console.log("Sheets upsert:", out);
  alert("✅ Cotización registrada en Sheets");
}

async function enviarCorreo(){
  const parsedBox = document.getElementById('parsed').textContent || "";
  let to = (parsedBox.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/) || ["cliente@empresa.com"])[0];
  const itinLink = document.getElementById('itinLink')?.value?.trim();
  const attachments = itinLink ? [{ filename:"itinerario.pdf", path: itinLink }] : undefined;
  const payload = { to, subject: "Cotización NeuralFlow", html: "<b>Adjunto tu cotización / itinerario.</b>", attachments };
  const out = await postJSON("/api/gmail-send", payload);
  console.log("Gmail send:", out);
  return out;
}

async function enviarWhatsApp(){
  const phoneGuess = (document.getElementById('rawInput').value.match(/\+?\d{2,3}[\s-]?\d{2,4}[\s-]?\d{4,}/) || ["+525541112233"])[0];
  const payload = { to: phoneGuess, text: "Hola 👋 aquí tienes tu cotización de NeuralFlow." };
  const out = await postJSON("/api/wa-send", payload);
  console.log("WA send:", out);
  return out;
}

document.getElementById("btnExportXLSX").addEventListener("click", async ()=>{
  try{ await registrarCotizacion(); }catch(e){ console.error(e); alert("❌ Error registrando en Sheets: " + e.message); }
});
document.getElementById("btnSend").addEventListener("click", async ()=>{
  try{
    await enviarCorreo();
    try{ await enviarWhatsApp(); alert("✅ Enviado por correo y WhatsApp"); }
    catch(eWA){ console.warn("WA falló:", eWA.message); alert("✅ Correo enviado. ⚠️ WhatsApp falló: " + eWA.message); }
  }catch(e){ console.error(e); alert("❌ Error enviando: " + e.message); }
});
