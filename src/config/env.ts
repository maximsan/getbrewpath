import 'server-only';

import { z } from 'zod';

import { EMAIL_HI, EMAIL_SUPPORT_SENDER } from '@domains/site/site';

const serverEnvSchema = z.object({
  /** Usually unset in local development. Without it, the support form reports that sending failed. */
  RESEND_API_KEY: z.string().min(1).optional(),
  SUPPORT_FROM_EMAIL: z.string().min(1).default(EMAIL_SUPPORT_SENDER),
  SUPPORT_TO_EMAIL: z.email().default(EMAIL_HI),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = (): ServerEnv => serverEnvSchema.parse(process.env);
