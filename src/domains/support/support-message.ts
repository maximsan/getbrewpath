import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254;

/** Why a field was refused; the form maps each to a sentence. */
const FIELD_ERRORS = ['email', 'message', 'messageTooLong'] as const;
export type FieldError = (typeof FIELD_ERRORS)[number];

const isFieldError = (code: string): code is FieldError =>
  (FIELD_ERRORS as readonly string[]).includes(code);

const supportMessageSchema = z.object({
  email: z
    .string()
    .trim()
    .max(MAX_EMAIL_LENGTH, { error: 'email' })
    .pipe(z.email({ error: 'email' })),
  message: z
    .string()
    .trim()
    .min(1, { error: 'message' })
    .max(MAX_MESSAGE_LENGTH, { error: 'messageTooLong' }),
  /** A field people never see. A bot that fills it in gets a quiet "sent" and nothing is emailed. */
  website: z.string().optional(),
});

type SupportField = Exclude<keyof z.infer<typeof supportMessageSchema>, 'website'>;
const SUPPORT_FIELDS = supportMessageSchema.keyof().exclude(['website']);

export type SupportMessage = Pick<z.infer<typeof supportMessageSchema>, SupportField>;
export type SupportFieldErrors = Partial<Record<SupportField, FieldError>>;

export type ParsedSupportMessage =
  | { kind: 'valid'; message: SupportMessage }
  | { kind: 'spam' }
  | { kind: 'invalid'; errors: SupportFieldErrors };

export function parseSupportMessage(input: Record<string, unknown>): ParsedSupportMessage {
  const result = supportMessageSchema.safeParse(input);
  if (!result.success) {
    const errors: SupportFieldErrors = {};
    for (const issue of result.error.issues) {
      const field = SUPPORT_FIELDS.safeParse(issue.path[0]);
      if (field.success && isFieldError(issue.message)) errors[field.data] ??= issue.message;
    }
    return { kind: 'invalid', errors };
  }
  if (result.data.website) return { kind: 'spam' };
  return { kind: 'valid', message: { email: result.data.email, message: result.data.message } };
}
