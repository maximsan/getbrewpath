import type lesson from '@messages/en/lesson.json';
import type reward from '@messages/en/reward.json';
import type site from '@messages/en/site.json';

import type { Locale } from './routing';

/** The shape every language's strings must have: English's. */
export type Messages = typeof site & { lesson: typeof lesson; reward: typeof reward };

type JsonModule<T> = Promise<{ default: T }>;

interface MessageFiles {
  site: JsonModule<typeof site>;
  lesson: JsonModule<typeof lesson>;
  reward: JsonModule<typeof reward>;
}

/** One language's files as the single strings object next-intl reads. */
async function bundle(files: MessageFiles): Promise<Messages> {
  const [siteStrings, lessonStrings, rewardStrings] = await Promise.all([
    files.site,
    files.lesson,
    files.reward,
  ]);
  return { ...siteStrings.default, lesson: lessonStrings.default, reward: rewardStrings.default };
}

/**
 * Each language's strings, loaded only when a page in that language renders.
 * A language whose files miss an English key fails the type check here.
 */
export const MESSAGES: Record<Locale, () => Promise<Messages>> = {
  en: () =>
    bundle({
      site: import('@messages/en/site.json'),
      lesson: import('@messages/en/lesson.json'),
      reward: import('@messages/en/reward.json'),
    }),
};
