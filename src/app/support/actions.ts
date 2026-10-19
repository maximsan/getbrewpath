'use server';

import { headers } from 'next/headers';

import { sendSupportMessage } from '@domains/support/send-support-message';
import { type FieldError, parseSupportMessage } from '@domains/support/support-message';
import { createRateLimiter } from '@shared/rate-limit';

export type SupportFormState =
  | { status: 'idle' }
  | { status: 'sent'; email: string }
  | { status: 'invalid'; errors: Partial<Record<'email' | 'message', FieldError>> }
  | { status: 'failed' }
  | { status: 'rate-limited' };

const MESSAGES_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const allowSender = createRateLimiter({ limit: MESSAGES_PER_WINDOW, windowMs: WINDOW_MS });

const senderKey = async () => {
  const requestHeaders = await headers();
  return requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
};

export async function submitSupportMessage(
  _previous: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const parsed = parseSupportMessage(Object.fromEntries(formData));
  if (parsed.kind === 'invalid') return { status: 'invalid', errors: parsed.errors };
  if (parsed.kind === 'spam') return { status: 'sent', email: String(formData.get('email')) };

  if (!allowSender(await senderKey())) return { status: 'rate-limited' };
  const sent = await sendSupportMessage(parsed.message);
  return sent ? { status: 'sent', email: parsed.message.email } : { status: 'failed' };
}
