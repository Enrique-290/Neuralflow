
import nodemailer from 'nodemailer';
export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const { to, subject, html, attachments } = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const info = await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html, attachments });
    res.status(200).json({ ok:true, messageId: info.messageId });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error:e.message });
  }
}
