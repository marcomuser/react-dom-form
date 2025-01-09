import {
  createContext,
  type Context,
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
} from "react";

export const FormContext: Context<FormProviderProps | null> =
  createContext<FormProviderProps | null>(null);

export interface FormProviderProps {
  defaultValues?: Record<PropertyKey, unknown>;
  submitError?: Record<PropertyKey, unknown>;
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
