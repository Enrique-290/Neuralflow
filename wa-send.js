
import axios from 'axios';
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const { to, text } = req.body;
    const token = process.env.WA_TOKEN;
    const phoneId = process.env.WA_PHONE_ID;
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } };
    const { data } = await axios.post(url, body, { headers });
    res.status(200).json({ ok:true, data });
  }catch(e){
    console.error(e?.response?.data || e.message);
    res.status(500).json({ ok:false, error:e?.response?.data || e.message });
  }
}
