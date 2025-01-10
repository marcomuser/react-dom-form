import { useContext } from "react";
import { FormContext, type FormProviderProps } from "./FormProvider.js";
import type { UnknownRecord } from "type-fest";
import type { AnyRecord } from "./types.js";

interface TFormContext<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> extends FormProviderProps {
  defaultValues: DefaultValues;
  submitError: SubmitError;
}

export function useFormContext<
  DefaultValues extends AnyRecord | undefined = UnknownRecord | undefined,
  SubmitError extends AnyRecord | undefined = UnknownRecord | undefined,
>(): TFormContext<DefaultValues, SubmitError> {
  const value = useContext(FormContext);

  if (value === null) {
    throw new Error("useFormContext must be used under FormProvider");
  }

  return value as TFormContext<DefaultValues, SubmitError>;
}
