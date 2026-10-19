import 'server-only';

import { Resend } from 'resend';

import { serverEnv } from '@config/env';

import type { SupportMessage } from './support-message';

/** Emails a support message to the team inbox, with the sender as the reply-to address. */
export async function sendSupportMessage({ email, message }: SupportMessage): Promise<boolean> {
  const env = serverEnv();
  if (!env.RESEND_API_KEY) {
    console.error('Support message not sent: RESEND_API_KEY is not set');
    return false;
  }
  const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
    from: env.SUPPORT_FROM_EMAIL,
    to: env.SUPPORT_TO_EMAIL,
    replyTo: email,
    subject: `Support message from ${email}`,
    text: message,
  });
  if (error) console.error('Support message not sent', error);
  return !error;
}
