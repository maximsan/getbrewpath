import { z } from 'zod';

/**
 * Turns the app's generated content banks (brewpath repo,
 * `assets/content/generated/*.json`) into the small course summary this site
 * ships: every module with its lesson count, and every collectible card with
 * the text its shared page shows.
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

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  lessonCount: number;
}

interface CardBase {
  id: string;
  reward: Reward;
  moduleNumber: number;
  moduleTitle: string;
}

/** A card earned by a perfect score on one lesson. */
export interface LessonCard extends CardBase {
  source: 'lesson';
  lessonTitle: string;
  /** 1-based position of the lesson inside its module. */
  lessonNumber: number;
}

/** A Field Guide, earned by finishing a whole module. */
export interface FieldGuideCard extends CardBase {
  source: 'module';
}

export type CourseCard = LessonCard | FieldGuideCard;

export interface Course {
  modules: CourseModule[];
  cards: CourseCard[];
}

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
