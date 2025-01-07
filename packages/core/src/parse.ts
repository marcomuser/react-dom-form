import { set } from "./set/set.js";
import type { StructuredFormValue } from "./types.js";

export function parse<
  FormValues extends Record<PropertyKey, any> = Record<PropertyKey, unknown>,
>(formData: FormData): StructuredFormValue<FormValues> {
  return formData.entries().reduce((acc, [key, val]) => {
    return set(acc, key, val);
  }, {} as StructuredFormValue<FormValues>);
}
