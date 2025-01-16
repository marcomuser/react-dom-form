import { type JSX, type ReactNode, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import { getFieldProps } from "./getFieldProps.js";
import { FormContext, type FormContextValue } from "./FormContext.js";

interface FormProviderProps<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> {
  defaultValues?: DefaultValues;
  submitError?: SubmitError;
  ref: RefObject<HTMLFormElement | null>;
  children:
    | ReactNode
    | ((props: FormContextValue<DefaultValues, SubmitError>) => ReactNode);
}

export function FormProvider<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
>({
  defaultValues,
  submitError,
  ref,
  children,
}: FormProviderProps<DefaultValues, SubmitError>): JSX.Element {
  return (
    <FormContext
      value={{
        defaultValues,
        submitError,
        formRef: ref,
        getFieldProps: (options) => getFieldProps(ref, options),
      }}
    >
      {typeof children === "function"
        ? children({
            defaultValues,
            submitError,
            formRef: ref,
            getFieldProps: (options) => getFieldProps(ref, options),
          })
        : children}
    </FormContext>
  );
}
