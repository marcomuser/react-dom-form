import { useContext } from "react";
import { FormContext, type FormProviderProps } from "./FormProvider.js";

interface TFormContext<
  DefaultValues extends Record<PropertyKey, unknown> | undefined,
  SubmitError extends Record<PropertyKey, unknown> | undefined,
> extends FormProviderProps {
  defaultValues: DefaultValues;
  submitError: SubmitError;
}

export function useFormContext<
  DefaultValues extends Record<PropertyKey, any> | undefined =
    | Record<PropertyKey, unknown>
    | undefined,
  SubmitError extends Record<PropertyKey, any> | undefined =
    | Record<PropertyKey, unknown>
    | undefined,
>(): TFormContext<DefaultValues, SubmitError> {
  const value = useContext(FormContext);

  if (value === null) {
    throw new Error("useFormContext must be used under FormProvider");
  }

  return value as TFormContext<DefaultValues, SubmitError>;
}
