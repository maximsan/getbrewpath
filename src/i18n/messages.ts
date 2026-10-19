import lesson from '@messages/en/lesson.json';
import reward from '@messages/en/reward.json';
import site from '@messages/en/site.json';

/** All English strings. The site has one locale; a new one adds a folder beside `en/`. */
export const messages = { ...site, lesson, reward };

export type Messages = typeof messages;
