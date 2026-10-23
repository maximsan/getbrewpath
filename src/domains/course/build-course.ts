import { z } from 'zod';

/**
 * Turns the app's generated lesson, module, collectible and free tier files
 * into the course summary this site ships. The summary holds:
 * - every module, with its lesson count and how many of those lessons are free;
 * - every Coffee Card, with the text its share page shows;
 * - the free daily limit.
 * Source: brewpath repo, assets/content/generated/*.json and
 * assets/content/generated/website/free_tier.json.
 */

const specRowSchema = z.tuple([z.string(), z.string()]);

const rewardSchema = z.object({
  title: z.string(),
  summary: z.string(),
  fact: z.string(),
  meta: z.array(specRowSchema).optional(),
  badge: z.string().optional(),
});

const lessonsBankSchema = z.object({
  items: z.array(z.object({ id: z.string(), title: z.string(), reward: rewardSchema })),
});

const modulesBankSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      n: z.number().int().positive(),
      title: z.string(),
      lessons: z.array(z.object({ id: z.string() })),
      reward: rewardSchema,
    }),
  ),
});

const collectiblesBankSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      unlock: z.union([z.object({ lesson: z.string() }), z.object({ module: z.string() })]),
    }),
  ),
});

/** The free lessons and the free daily limit, exported by the app from its own code. */
const freeTierSchema = z.object({
  freeLessonIds: z.array(z.string()).min(1),
  freeDailyActivities: z.number().int().positive(),
});

export type Reward = z.infer<typeof rewardSchema>;

const courseModuleSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  lessonCount: z.number().int().positive(),
  /** How many of the module's lessons anyone can take without Foundations. */
  freeLessonCount: z.number().int().nonnegative(),
});

const cardBase = {
  id: z.string(),
  reward: rewardSchema,
  moduleNumber: z.number().int().positive(),
  moduleTitle: z.string(),
};

/** A card earned by a perfect score on one lesson. */
const lessonCardSchema = z.object({
  ...cardBase,
  source: z.literal('lesson'),
  lessonTitle: z.string(),
  /** 1-based position of the lesson inside its module. */
  lessonNumber: z.number().int().positive(),
});

/** A Module Reward, earned by finishing a whole module. */
const moduleRewardCardSchema = z.object({ ...cardBase, source: z.literal('module') });

/** The course summary this site ships in `src/content/<language>/course.json`. */
export const courseSchema = z.object({
  modules: z.array(courseModuleSchema),
  cards: z.array(z.discriminatedUnion('source', [lessonCardSchema, moduleRewardCardSchema])),
  /** How many lessons, replays or practice games a day the app allows without Foundations. */
  freeDailyActivities: z.number().int().positive(),
});

export type CourseModule = z.infer<typeof courseModuleSchema>;
export type CourseCard = z.infer<typeof courseSchema>['cards'][number];
export type Course = z.infer<typeof courseSchema>;

export interface ContentBanks {
  lessons: unknown;
  modules: unknown;
  collectibles: unknown;
  freeTier: unknown;
}

export function buildCourse(banks: ContentBanks): Course {
  const lessons = lessonsBankSchema.parse(banks.lessons).items;
  const modules = modulesBankSchema.parse(banks.modules).items;
  const collectibles = collectiblesBankSchema.parse(banks.collectibles).items;
  const freeTier = freeTierSchema.parse(banks.freeTier);

  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const moduleById = new Map(modules.map((module) => [module.id, module]));
  const placeOfLesson = new Map(
    modules.flatMap((module) =>
      module.lessons.map((lesson, index) => [lesson.id, { module, number: index + 1 }] as const),
    ),
  );

  // The copy says "the first lessons are free", so the summary refuses any other list.
  const freeLessonIds = new Set(freeTier.freeLessonIds);
  const firstLessonIds = modules
    .flatMap((module) => module.lessons.map((lesson) => lesson.id))
    .slice(0, freeLessonIds.size);
  if (!firstLessonIds.every((lessonId) => freeLessonIds.has(lessonId))) {
    throw new Error(
      `The free lessons must be the first lessons of the course, got ${freeTier.freeLessonIds.join(', ')}`,
    );
  }

  const cards = collectibles.map((collectible): CourseCard => {
    if ('module' in collectible.unlock) {
      const courseModule = required(moduleById.get(collectible.unlock.module), collectible.id);
      return {
        id: collectible.id,
        source: 'module',
        reward: courseModule.reward,
        moduleNumber: courseModule.n,
        moduleTitle: courseModule.title,
      };
    }
    const lessonId = collectible.unlock.lesson;
    const lesson = required(lessonById.get(lessonId), collectible.id);
    const place = required(placeOfLesson.get(lessonId), collectible.id);
    return {
      id: collectible.id,
      source: 'lesson',
      reward: lesson.reward,
      moduleNumber: place.module.n,
      moduleTitle: place.module.title,
      lessonTitle: lesson.title,
      lessonNumber: place.number,
    };
  });

  return {
    modules: modules.map((module) => ({
      id: module.id,
      number: module.n,
      title: module.title,
      lessonCount: module.lessons.length,
      freeLessonCount: module.lessons.filter((lesson) => freeLessonIds.has(lesson.id)).length,
    })),
    cards,
    freeDailyActivities: freeTier.freeDailyActivities,
  };
}

function required<T>(value: T | undefined, cardId: string): T {
  if (value === undefined) throw new Error(`Card ${cardId} unlocks from content that is missing`);
  return value;
}
