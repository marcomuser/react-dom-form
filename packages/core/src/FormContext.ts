import { createContext, type Context, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import type { FieldProps, Options } from "./getFieldProps.js";

export interface FormContextValue<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> {
  defaultValues?: DefaultValues;
  submitError?: SubmitError;
  formRef: RefObject<HTMLFormElement | null>;
  getFieldProps: (options: Options<DefaultValues>) => FieldProps<DefaultValues>;
}

export const FormContext: Context<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null> = createContext<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null>(null);
