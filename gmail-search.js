
export default async function handler(_req,res){
  res.status(200).json({ ok:true, items:[{ id:'demo1', from:'ventas@empresa.com', subject:'Cotización CDMX-MTY', date:new Date().toISOString() }] });
}
