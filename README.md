
# NeuralFlow Backend – Vercel (Serverless)

Versión para **Vercel Functions** sin Express. Endpoints en `/api/*`:

- `GET  /api/health` → ping
- `GET  /api/whatsapp` → verificación webhook (Meta `hub.challenge`)
- `POST /api/whatsapp` → mensajes entrantes (log)
- `POST /api/wa-send` → WhatsApp saliente (Meta Cloud API)
- `POST /api/gmail-send` → envío SMTP rápido (Nodemailer)
- `GET  /api/gmail-search` → placeholder
- `POST /api/sheets-upsertQuote` → agrega fila a `Cotizaciones!A:G`
- `POST /api/drive-upload` → sube archivo a Drive **(base64)**

## Variables de entorno (Vercel → Project Settings → Environment Variables)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

WA_TOKEN=
WA_PHONE_ID=
WA_VERIFY_TOKEN=neuralapps-verify

GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=   # con \n escapadas
SHEETS_SPREADSHEET_ID=
DRIVE_FOLDER_ID=
```

## Notas
- `drive-upload` espera JSON `{ "fileName": "itinerario.pdf", "fileBase64": "<base64>" }` (evitamos multipart para simplificar en serverless).
- Ajusta permisos de Drive si necesitas link público.
