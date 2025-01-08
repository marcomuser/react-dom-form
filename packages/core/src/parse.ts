import { set } from "./set/set.js";
import type { StructuredFormValue } from "./types.js";

export function parse<
  FormValues extends Record<PropertyKey, any> = Record<PropertyKey, unknown>,
>(formData: FormData): StructuredFormValue<FormValues> {
  let formValues = {} as StructuredFormValue<FormValues>;
  for (const [key, val] of formData.entries()) {
    formValues = set(formValues, key, val);
  }
  return formValues;
}
