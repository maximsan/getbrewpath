import courseJson from '@content/course.json';

import type { Course, CourseCard } from './build-course';

/** Written by `pnpm sync-cards` from the app's own content, so its shape is `Course`. */
export const course = courseJson as Course;

export const findCard = (id: string): CourseCard | undefined =>
  course.cards.find((card) => card.id === id);

export const courseCounts = {
  modules: course.modules.length,
  lessons: course.modules.reduce((sum, module) => sum + module.lessonCount, 0),
  cards: course.cards.length,
  fieldGuides: course.cards.filter((card) => card.source === 'module').length,
};

/** Lesson one's card, which the home page demo awards. */
export const DEMO_REWARD_CARD_ID = 'c1';

export function rewardOf(cardId: string) {
  const card = findCard(cardId);
  if (!card) throw new Error(`No card ${cardId} in the course`);
  return card.reward;
}
