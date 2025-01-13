import type { UnknownRecord } from "type-fest";
import type { StructuredFormValue } from "./types.js";

export function serialize<T>(value: T): StructuredFormValue<T> {
  if (value === null) {
    return undefined as StructuredFormValue<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item)) as StructuredFormValue<T>;
  }

  if (isPlainObject(value)) {
    const result: UnknownRecord = {};
    for (const key of Object.keys(value)) {
      if (Object.hasOwn(value, key)) {
        result[key] = serialize((value as UnknownRecord)[key]);
      }
    }
    return result as StructuredFormValue<T>;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return value.toString() as StructuredFormValue<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as StructuredFormValue<T>;
  }

  return value as StructuredFormValue<T>;
}

function isPlainObject(value: unknown): value is UnknownRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    value.constructor === Object &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
