import 'server-only';

import { z } from 'zod';

const serverEnvSchema = z.object({
  /** Unset in local development: the support form then reports that sending failed. */
  RESEND_API_KEY: z.string().min(1).optional(),
  SUPPORT_FROM_EMAIL: z.string().min(1).default('BrewPath Support <support@getbrewpath.com>'),
  SUPPORT_TO_EMAIL: z.email().default('hello@getbrewpath.com'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = (): ServerEnv => serverEnvSchema.parse(process.env);
