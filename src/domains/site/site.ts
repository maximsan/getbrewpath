import { getYear } from '@shared/utils/date';

import { APP_LINKS_HOST } from './site-config';

export {
  APP_LINKS_HOST,
  APP_STORE_ID,
  APP_STORE_URL,
  SITE_HOST,
  SITE_URL,
  WEB_ANALYTICS_ENDPOINT,
  WEB_ANALYTICS_SCRIPT,
} from './site-config';

export const EMAIL_HI = 'hi@getbrewpath.com';

export const mailtoHref = (email: string) => `mailto:${email}`;
export const MAILTO_HI = mailtoHref(EMAIL_HI);

export const PHONE = '+48 571 033 267';

export const MINUTES_PER_LESSON = 3;

export const COPYRIGHT_YEAR = getYear(new Date()).toString();

export const WEB_ANALYTICS_SITE_ID = '3dae933cda004cb198b689159f1ff8d7';
export const APP_LINKS_URL = `https://${APP_LINKS_HOST}`;
export const appCardLink = (cardId: string) => `${APP_LINKS_URL}/card/${cardId}`;

export const APPLE_APP_ID = '7FXR6TDMDM.dev.maximsan.brewPath';
