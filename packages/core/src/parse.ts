import { setPath } from "./path.js";
import type { StructuredFormValue } from "./types.js";

export function parse<
  FormValues extends Record<PropertyKey, any> = Record<PropertyKey, unknown>,
>(formData: FormData): StructuredFormValue<FormValues> {
  let formValues = {} as StructuredFormValue<FormValues>;
  for (const [key, val] of formData.entries()) {
    formValues = setPath(formValues, key, val);
  }
  return formValues;
}
