import nodemailer from 'nodemailer';

export function createMailTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    console.warn(
      'Email env vars missing (EMAIL_HOST, EMAIL_USER, EMAIL_PASS). OTP emails will not send.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendOtpEmail(to, code) {
  const transporter = createMailTransporter();
  if (!transporter) {
    console.log(`[DEV] OTP for ${to}: ${code}`);
    return;
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to,
    subject: 'Verify your email — Smart Student Solution',
    text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`,
    html: `<p>Your verification code is:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>`,
  });
}
