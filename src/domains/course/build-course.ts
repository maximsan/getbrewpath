import { z } from 'zod';

/**
 * Turns the app's generated lesson, module and collectible files into the
 * course summary this site ships. The summary lists every module with its
 * lesson count, and every card with the text its shared page shows.
 * Source: brewpath repo, assets/content/generated/*.json.
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

export type Reward = z.infer<typeof rewardSchema>;

const courseModuleSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  lessonCount: z.number().int().positive(),
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

/** A Field Guide, earned by finishing a whole module. */
const fieldGuideCardSchema = z.object({ ...cardBase, source: z.literal('module') });

/** The course summary this site ships in `src/content/course.json`. */
export const courseSchema = z.object({
  modules: z.array(courseModuleSchema),
  cards: z.array(z.discriminatedUnion('source', [lessonCardSchema, fieldGuideCardSchema])),
});

export type CourseModule = z.infer<typeof courseModuleSchema>;
export type CourseCard = z.infer<typeof courseSchema>['cards'][number];
export type Course = z.infer<typeof courseSchema>;

export interface ContentBanks {
  lessons: unknown;
  modules: unknown;
  collectibles: unknown;
}

export function buildCourse(banks: ContentBanks): Course {
  const lessons = lessonsBankSchema.parse(banks.lessons).items;
  const modules = modulesBankSchema.parse(banks.modules).items;
  const collectibles = collectiblesBankSchema.parse(banks.collectibles).items;

  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const moduleById = new Map(modules.map((module) => [module.id, module]));
  const placeOfLesson = new Map(
    modules.flatMap((module) =>
      module.lessons.map((lesson, index) => [lesson.id, { module, number: index + 1 }] as const),
    ),
  );

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
    })),
    cards,
  };
}

function required<T>(value: T | undefined, cardId: string): T {
  if (value === undefined) throw new Error(`Card ${cardId} unlocks from content that is missing`);
  return value;
}
