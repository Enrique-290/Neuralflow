// Tabs
document.querySelectorAll('.tablink').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tablink').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Fake inbox data (mock)
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

// Charts (very small demo using Canvas API)
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
