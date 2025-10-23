
import { google } from 'googleapis';
function getAuth(){
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY||'').replace(/\\n/g,'\n'),
    ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
  );
}
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const { cliente, ruta, fechas, pax, precio, estado } = req.body;
    const auth = getAuth();
    const sheets = google.sheets({ version:'v4', auth });
    const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
    const values = [[cliente, ruta, fechas, pax, precio, estado, new Date().toISOString()]];
    await sheets.spreadsheets.values.append({
      spreadsheetId, range:'Cotizaciones!A:G', valueInputOption:'USER_ENTERED', requestBody:{ values }
    });
    res.status(200).json({ ok:true });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error:e.message });
  }
}
