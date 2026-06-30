import type { Attachment } from 'nodemailer/lib/mailer';
import { getTransporter } from '~/configs/mail.config';
import { env } from '~/configs/env';
import { renderTemplate } from '~/utils/template';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Attachment[];
  template?: string;
  data?: Record<string, unknown>;
}

const sendEmail = async (options: SendMailOptions) => {
  const transporter = getTransporter();

  let html = options.html;
  if (options.template) {
    html = renderTemplate(options.template, options.data ?? {});
  }

  await transporter.sendMail({
    from: `ITAM <${env.SMTP_FROM}>`,
    to: options.to,
    subject: options.subject,
    html,
    text: options.text,
    cc: options.cc,
    bcc: options.bcc,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
};

const verifyConnection = async () => {
  const transporter = getTransporter();

  try {
    await transporter.verify();
    console.log('✅ Mail server connected');
  } catch {
    console.warn('⚠️  Mail server unavailable, emails may fail');
  }
};

export const mailService = { sendEmail, verifyConnection };
