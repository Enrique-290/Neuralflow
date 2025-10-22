
export default async function handler(_req,res){
  // TODO: Gmail API - listar mensajes reales
  res.status(200).json({ ok:true, items:[{ id:'demo1', from:'ventas@empresa.com', subject:'Cotización CDMX-MTY', date:new Date().toISOString() }] });
}
