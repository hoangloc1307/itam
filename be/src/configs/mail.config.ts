import { createTransport, type Transporter } from 'nodemailer';
import { env } from '~/configs/env';

let transporter: Transporter;

export function getTransporter() {
  if (transporter) return transporter;

  transporter = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });

  return transporter;
}
