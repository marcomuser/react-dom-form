import { setPath } from "./path.js";
import type { StructuredFormValue } from "./types.js";

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
