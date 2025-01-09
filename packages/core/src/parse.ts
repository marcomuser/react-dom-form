import { setPath } from "./path.js";
import type { StructuredFormValue } from "./types.js";

/**
 * Parses a `FormData` object into a structured object with typed values.
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append('name', 'John Doe');
 * formData.append('age', '30');
 * formData.append('hobbies', 'Music');
 * formData.append('hobbies', 'Coding');
 *
 * parse<{ name: string; age: string; hobbies: string[] }>(formData);
 * // Returns { name: 'John Doe', age: '30', hobbies: ['Music', 'Coding'] }
 * ```
 *
 * @param formData A `FormData` object.
 * @returns An object representing the form data, with types derived from the `FormValues` generic.
 */
export function parse<
  FormValues extends Record<PropertyKey, any> = Record<PropertyKey, unknown>,
>(formData: FormData): StructuredFormValue<FormValues> {
  let formValues = {} as StructuredFormValue<FormValues>;
  const keys = new Set(formData.keys());

  for (const key of keys) {
    const allVal = formData.getAll(key);
    const val = allVal.length > 1 ? allVal : allVal.at(0);
    formValues = setPath(formValues, key, val);
  }

  return formValues;
}
