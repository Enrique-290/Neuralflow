
import axios from 'axios';
export default async function handler(req, res){
  if(req.method === 'GET'){
    const verifyToken = process.env.WA_VERIFY_TOKEN || 'neuralapps-verify';
    const {['hub.mode']:mode, ['hub.verify_token']:token, ['hub.challenge']:challenge} = req.query;
    if(mode === 'subscribe' && token === verifyToken){ return res.status(200).send(challenge); }
    return res.status(403).send('Forbidden');
  }
  if(req.method === 'POST'){
    try{
      console.log('[WA INBOUND]', JSON.stringify(req.body).slice(0,600));
      return res.status(200).json({ ok:true });
    }catch(e){
      console.error(e);
      return res.status(500).json({ ok:false, error:e.message });
    }
  }
  res.status(405).end();
}
