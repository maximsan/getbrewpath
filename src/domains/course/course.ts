import { cache } from 'react';

import { type Locale, routing } from '@i18n/routing';

import { type Course, type CourseCard, courseSchema } from './build-course';

/** Each language's course summary, written by `pnpm sync-cards`. */
const COURSE_FILES: Record<Locale, () => Promise<{ default: unknown }>> = {
  en: () => import('@content/en/course.json'),
};

/** The course in `locale`, checked once per request when the site loads it. */
export const getCourse = cache(async (locale: Locale): Promise<Course> =>
  courseSchema.parse((await COURSE_FILES[locale]()).default),
);

export const findCard = (course: Course, id: string): CourseCard | undefined =>
  course.cards.find((card) => card.id === id);

/** Route params for every card page, which are all built ahead of time. Card ids are the same in every language. */
export async function cardRouteParams() {
  const course = await getCourse(routing.defaultLocale);
  return course.cards.map((card) => ({ id: card.id }));
}

export const courseCounts = (course: Course) => ({
  modules: course.modules.length,
  lessons: course.modules.reduce((sum, module) => sum + module.lessonCount, 0),
  cards: course.cards.length,
  fieldGuides: course.cards.filter((card) => card.source === 'module').length,
});

/** Lesson one's card, which the home page demo awards. */
export const DEMO_REWARD_CARD_ID = 'c1';

export function rewardOf(course: Course, cardId: string) {
  const card = findCard(course, cardId);
  if (!card) throw new Error(`No card ${cardId} in the course`);
  return card.reward;
}
