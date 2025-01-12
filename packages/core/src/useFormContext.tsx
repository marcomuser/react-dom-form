import { use } from "react";
import { FormContext, type FormProviderProps } from "./FormProvider.js";
import type { UnknownRecord } from "type-fest";
import type { AnyRecord } from "./types.js";

interface FormContextValue<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> extends FormProviderProps {
  defaultValues?: DefaultValues;
  submitError?: SubmitError;
}

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
