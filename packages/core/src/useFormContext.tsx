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
 *   name: string;
 *   email: string;
 * }
 *
 * interface SubmitError {
 *   errorMessage: string;
 * }
 *
 * function Fields() {
 *   const { defaultValues, submitError, formRef } = useFormContext<FormValues, SubmitError>();
 *
 *   return <input name="email" defaultValue={defaultValues?.email} />;
 * }
 */
export function useFormContext<
  DefaultValues extends AnyRecord | undefined = UnknownRecord | undefined,
  SubmitError extends AnyRecord | undefined = UnknownRecord | undefined,
>(): FormContextValue<DefaultValues, SubmitError> {
  const value = use(FormContext);

  if (value === null) {
    throw new Error("useFormContext must be used under FormProvider");
  }

  return value as FormContextValue<DefaultValues, SubmitError>;
}
