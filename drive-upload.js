
import { google } from 'googleapis';
function getAuth(){
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY||'').replace(/\\n/g,'\n'),
    ['https://www.googleapis.com/auth/drive']
  );
}
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const { fileName, fileBase64 } = req.body;
    const buffer = Buffer.from(fileBase64, 'base64');
    const drive = google.drive({ version:'v3', auth: getAuth() });
    const fileMetadata = { name: fileName, parents: process.env.DRIVE_FOLDER_ID ? [process.env.DRIVE_FOLDER_ID] : undefined };
    const media = { mimeType: 'application/octet-stream', body: Buffer.from(buffer) };
    const { data } = await drive.files.create({ requestBody:fileMetadata, media, fields:'id,webViewLink,webContentLink' });
    await drive.permissions.create({ fileId:data.id, requestBody:{ role:'reader', type:'anyone' } });
    res.status(200).json({ ok:true, id:data.id, view:data.webViewLink, download:data.webContentLink });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error:e.message });
  }
}
