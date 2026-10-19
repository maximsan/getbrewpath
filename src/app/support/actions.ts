'use server';

import { headers } from 'next/headers';

import { sendSupportMessage } from '@domains/support/send-support-message';
import { parseSupportMessage, type SupportFieldErrors } from '@domains/support/support-message';
import { createRateLimiter } from '@shared/rate-limit';

export type SupportFormState =
  | { status: 'idle' }
  | { status: 'sent'; email: string }
  | { status: 'invalid'; errors: SupportFieldErrors }
  | { status: 'failed' }
  | { status: 'rate-limited' };

const MESSAGES_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const allowSender = createRateLimiter({ limit: MESSAGES_PER_WINDOW, windowMs: WINDOW_MS });

/** The sender's IP as the host reports it; Vercel sets `x-real-ip` itself, so a client cannot forge it. */
const clientIp = async () => (await headers()).get('x-real-ip');

export async function submitSupportMessage(
  _previous: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const parsed = parseSupportMessage(Object.fromEntries(formData));
  if (parsed.kind === 'invalid') return { status: 'invalid', errors: parsed.errors };
  if (parsed.kind === 'spam') return { status: 'sent', email: String(formData.get('email')) };

  const ip = await clientIp();
  if (ip && !allowSender(ip)) return { status: 'rate-limited' };
  const sent = await sendSupportMessage(parsed.message);
  return sent ? { status: 'sent', email: parsed.message.email } : { status: 'failed' };
}
