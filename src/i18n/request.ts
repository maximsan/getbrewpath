import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE } from './locale';
import { messages } from './messages';

export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  messages,
}));
