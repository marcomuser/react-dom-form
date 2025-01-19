import { use } from "react";
import type { UnknownRecord } from "type-fest";
import type { AnyRecord } from "./types.js";
import { FormContext, type FormContextValue } from "./FormContext.js";

/**
 * A custom hook to access the form context.
 *
 * @example
 * ```tsx
 * interface FormValues {
 *   email: string;
 *   password: string;
 * }
 *
 * function EmailInput() {
 *   const { defaultValues, getFieldProps } = useFormContext<FormValues>();
 *   return <input defaultValue={defaultValues?.email} {...getFieldProps({name: "email"})} />;
 * }
 */
export function useFormContext<
  DefaultValues extends AnyRecord | undefined = UnknownRecord | undefined,
  Meta extends AnyRecord | undefined = UnknownRecord | undefined,
>(): FormContextValue<DefaultValues, Meta> {
  const value = use(FormContext);

  if (value === null) {
    throw new Error("useFormContext must be used under FormProvider");
  }

  return value as FormContextValue<DefaultValues, Meta>;
}
