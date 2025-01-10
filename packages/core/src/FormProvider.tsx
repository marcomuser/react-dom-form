import {
  createContext,
  type Context,
  type JSX,
  type PropsWithChildren,
  type RefObject,
} from "react";
import type { UnknownRecord } from "type-fest";

export const FormContext: Context<FormProviderProps | null> =
  createContext<FormProviderProps | null>(null);

export interface FormProviderProps {
  defaultValues?: UnknownRecord | undefined;
  submitError?: UnknownRecord | undefined;
  formRef: RefObject<HTMLFormElement | null>;
}

export function FormProvider({
  defaultValues,
  submitError,
  formRef,
  children,
}: PropsWithChildren<FormProviderProps>): JSX.Element {
  return (
    <FormContext value={{ defaultValues, submitError, formRef }}>
      {children}
    </FormContext>
  );
}
