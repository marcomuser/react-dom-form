import type { StructuredFormValue } from "./types.js";

export function serialize<T>(value: T): StructuredFormValue<T> {
  if (value === null) {
    return undefined as StructuredFormValue<T>;
  }

  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return value.map((item) => serialize(item)) as StructuredFormValue<T>;
    } else {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value)) {
        if (Object.hasOwn(value, key)) {
          result[key] = serialize((value as Record<string, unknown>)[key]);
        }
      }
      return result as StructuredFormValue<T>;
    }
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value instanceof Date ||
    typeof value === "bigint"
  ) {
    return String(value) as StructuredFormValue<T>;
  }

  return value as StructuredFormValue<T>;
}
