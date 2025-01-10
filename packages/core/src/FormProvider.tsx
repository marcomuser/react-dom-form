import {
  createContext,
  type Context,
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
} from "react";
import type { UnknownRecord } from "type-fest";

export const FormContext: Context<FormProviderProps | null> =
  createContext<FormProviderProps | null>(null);

export interface FormProviderProps {
  defaultValues?: UnknownRecord;
  submitError?: UnknownRecord;
  formRef: RefObject<HTMLFormElement | null>;
}

export function FormProvider({
  defaultValues,
  submitError,
  formRef,
  children,
}: PropsWithChildren<FormProviderProps>): ReactElement {
  return (
    <FormContext value={{ defaultValues, submitError, formRef }}>
      {children}
    </FormContext>
  );
}
