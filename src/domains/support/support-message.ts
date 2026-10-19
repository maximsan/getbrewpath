import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254;

/** Why a field was refused; the form maps each to a sentence. */
export type FieldError = 'email' | 'message' | 'messageTooLong';

const supportMessageSchema = z.object({
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL_LENGTH)
    .pipe(z.email({ error: 'email' })),
  message: z
    .string()
    .trim()
    .min(1, { error: 'message' })
    .max(MAX_MESSAGE_LENGTH, { error: 'messageTooLong' }),
  /** A field people never see. A bot that fills it in gets a quiet "sent" and nothing is emailed. */
  website: z.string().optional(),
});

export type SupportMessage = Omit<z.infer<typeof supportMessageSchema>, 'website'>;

export type ParsedSupportMessage =
  | { kind: 'valid'; message: SupportMessage }
  | { kind: 'spam' }
  | { kind: 'invalid'; errors: Partial<Record<'email' | 'message', FieldError>> };

export function parseSupportMessage(input: Record<string, unknown>): ParsedSupportMessage {
  const result = supportMessageSchema.safeParse(input);
  if (!result.success) {
    const errors: Partial<Record<'email' | 'message', FieldError>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === 'email' || field === 'message') errors[field] ??= issue.message as FieldError;
    }
    return { kind: 'invalid', errors };
  }
  if (result.data.website) return { kind: 'spam' };
  return { kind: 'valid', message: { email: result.data.email, message: result.data.message } };
}
