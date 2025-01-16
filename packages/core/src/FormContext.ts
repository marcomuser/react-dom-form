import { createContext, type Context, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import type { FieldProps, FieldOptions } from "./getFieldProps.js";

export interface FormContextValue<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> {
  defaultValues?: DefaultValues | undefined;
  submitError?: SubmitError | undefined;
  formRef: RefObject<HTMLFormElement | null>;
  getFieldProps: (options: FieldOptions<DefaultValues>) => FieldProps;
}

export const FormContext: Context<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null> = createContext<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null>(null);
