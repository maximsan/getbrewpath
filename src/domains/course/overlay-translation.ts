/**
 * Lays a language folder's records over the app's English content, the way
 * the app does. Source: brewpath repo, lib/shared/repositories/language_overlay.dart.
 *
 * Per field at every depth: a translated field wins and anything left out
 * stays English. A list is translated whole or not at all. A field English
 * lacks, or an id English no longer has, is refused, because it means the
 * translation was drafted against an older English text.
 */

type JsonRecord = Record<string, unknown>;

/** The translation tool's own notes, which the app strips before reading a record. */
const BOOKKEEPING_FIELDS = new Set(['translatedFrom', 'nativeReviewed']);

/** Whether `value` holds fields or items rather than being text. */
const isNested = (value: unknown): value is object => typeof value === 'object' && value !== null;
const isRecord = (value: unknown): value is JsonRecord => isNested(value) && !Array.isArray(value);

/** `where` names the bank in error messages, e.g. "be/lessons". */
export function overlayTranslation(
  master: readonly JsonRecord[],
  translated: readonly JsonRecord[],
  where: string,
): JsonRecord[] {
  const byId = new Map<unknown, JsonRecord>();

  for (const record of translated) {
    if (byId.has(record.id)) {
      throw new Error(`${where} translates "${String(record.id)}" twice`);
    }
    byId.set(record.id, record);
  }
  const merged = master.map((record) => {
    const translation = byId.get(record.id);

    byId.delete(record.id);

    return translation
      ? mergeRecord(record, translation, `${where} "${String(record.id)}"`)
      : record;
  });

  if (byId.size > 0) {
    const [orphan] = byId.keys();

    throw new Error(`${where} translates "${String(orphan)}", which English no longer has`);
  }

  return merged;
}

function mergeRecord(master: JsonRecord, translation: JsonRecord, where: string): JsonRecord {
  const merged: JsonRecord = { ...master };

  for (const [field, value] of Object.entries(translation)) {
    if (BOOKKEEPING_FIELDS.has(field)) {
      continue;
    }
    if (!(field in master)) {
      throw new Error(`${where} translates "${field}", which English lacks`);
    }
    merged[field] = mergeValue(master[field], value, `${where} field "${field}"`);
  }

  return merged;
}

function mergeValue(master: unknown, translation: unknown, where: string): unknown {
  if (translation === null || translation === undefined) {
    return master;
  }
  if (isRecord(master) && isRecord(translation)) {
    return mergeRecord(master, translation, where);
  }
  if (Array.isArray(master) && Array.isArray(translation)) {
    if (master.length !== translation.length) {
      throw new Error(`${where} lists ${translation.length} where English lists ${master.length}`);
    }

    return master.map((item, index) =>
      mergeValue(item, translation[index], `${where} item ${index + 1}`),
    );
  }
  if (isNested(master) || isNested(translation)) {
    throw new Error(`${where} has a different shape from English`);
  }

  return translation;
}
