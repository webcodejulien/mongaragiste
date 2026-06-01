const BREVO_API = 'https://api.brevo.com/v3/smtp/email'
const API_KEY   = process.env.BREVO_API_KEY
const SENDER    = process.env.BREVO_SENDER ?? 'noreply@mongaragiste.app'
const SENDER_NAME = 'MonGaragiste'

interface SendEmailParams {
  to:       { email: string; name?: string }[]
  subject:  string
  html:     string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!API_KEY) {
    console.log('[email] BREVO_API_KEY non configurée — email ignoré')
    return
  }
  try {
    const res = await fetch(BREVO_API, {
      method:  'POST',
      headers: {
        'api-key':      API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender:  { name: SENDER_NAME, email: SENDER },
        to,
        subject,
        htmlContent: html,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Brevo error:', err)
    }
  } catch (err) {
    console.error('[email] fetch error:', err)
  }
}

/* ── Templates ───────────────────────────────────────────── */

export function tplBookingRequest({
  clientName, garageName, serviceName, date, time, garageEmail,
}: {
  clientName: string; garageName: string; serviceName: string
  date: string; time: string; garageEmail: string
}) {
  return {
    // Au client
    client: {
      subject: `Demande de RDV reçue — ${garageName}`,
      html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
          <strong style="font-size:16px">MonGaragiste</strong>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Demande envoyée ✓</h1>
        <p style="color:#555;margin:0 0 24px">Bonjour ${clientName}, votre demande de rendez-vous a bien été reçue.</p>
        <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px">
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Garage</span><br><strong>${garageName}</strong></div>
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Service</span><br><strong>${serviceName}</strong></div>
          <div><span style="color:#888;font-size:12px">Date & heure</span><br><strong>${date} à ${time}</strong></div>
        </div>
        <p style="color:#555;font-size:13px">Le garage va confirmer votre RDV très prochainement. Vous recevrez un email de confirmation dès validation.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
      </div>`,
    },
    // Au garagiste
    garage: {
      subject: `🔔 Nouveau RDV — ${clientName} · ${serviceName}`,
      html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <div style="margin-bottom:24px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
          <strong style="font-size:16px">MonGaragiste</strong>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Nouvelle demande de RDV</h1>
        <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin:16px 0 24px">
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Client</span><br><strong>${clientName}</strong></div>
          <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Service demandé</span><br><strong>${serviceName}</strong></div>
          <div><span style="color:#888;font-size:12px">Date & heure souhaitées</span><br><strong>${date} à ${time}</strong></div>
        </div>
        <a href="${process.env.NEXTAUTH_URL ?? 'https://mongaragiste-app.vercel.app'}/garage/appointments"
          style="display:inline-block;background:#1D9E75;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">
          Voir et confirmer le RDV →
        </a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#aaa;font-size:11px">MonGaragiste · Tableau de bord garagiste</p>
      </div>`,
    },
  }
}

export function tplBookingConfirmed({
  clientName, garageName, serviceName, date, time, garagePhone,
}: {
  clientName: string; garageName: string; serviceName: string
  date: string; time: string; garagePhone?: string
}) {
  return {
    subject: `RDV confirmé ✓ — ${garageName} · ${date}`,
    html: `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
      <div style="margin-bottom:24px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
        <strong style="font-size:16px">MonGaragiste</strong>
      </div>
      <div style="background:#E1F5EE;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px">
        <div style="font-size:32px;margin-bottom:8px">✅</div>
        <h1 style="font-size:20px;font-weight:700;margin:0 0 4px;color:#085041">RDV confirmé !</h1>
        <p style="color:#1D9E75;margin:0;font-size:14px">${date} à ${time}</p>
      </div>
      <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px">
        <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Garage</span><br><strong>${garageName}</strong></div>
        <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Service</span><br><strong>${serviceName}</strong></div>
        ${garagePhone ? `<div><span style="color:#888;font-size:12px">Contact</span><br><strong>${garagePhone}</strong></div>` : ''}
      </div>
      <p style="color:#555;font-size:13px">Pensez à arriver 5 minutes avant l'heure prévue. En cas d'empêchement, annulez depuis votre espace client.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
    </div>`,
  }
}

export function tplBookingCancelled({
  clientName, garageName, serviceName, date, time,
}: {
  clientName: string; garageName: string; serviceName: string
  date: string; time: string
}) {
  return {
    subject: `RDV annulé — ${garageName} · ${date}`,
    html: `
    <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
      <div style="margin-bottom:24px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:8px"></span>
        <strong style="font-size:16px">MonGaragiste</strong>
      </div>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">RDV annulé</h1>
      <p style="color:#555;margin:0 0 20px">Bonjour ${clientName}, votre rendez-vous a été annulé.</p>
      <div style="background:#F7F8FA;border-radius:10px;padding:20px;margin-bottom:24px">
        <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Garage</span><br><strong>${garageName}</strong></div>
        <div style="margin-bottom:10px"><span style="color:#888;font-size:12px">Service</span><br><strong>${serviceName}</strong></div>
        <div><span style="color:#888;font-size:12px">Date annulée</span><br><strong>${date} à ${time}</strong></div>
      </div>
      <p style="color:#555;font-size:13px">Vous pouvez reprendre rendez-vous à tout moment depuis la page du garage.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#aaa;font-size:11px">MonGaragiste · Votre garagiste à portée de clic</p>
    </div>`,
  }
}
