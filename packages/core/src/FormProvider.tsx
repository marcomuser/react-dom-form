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
  const props: FormContextValue<DefaultValues, SubmitError> = {
    defaultValues,
    submitError,
    formRef: ref,
    getFieldProps: (options) => getFieldProps(ref, options),
  };

  return (
    <FormContext value={props}>
      {typeof children === "function" ? children(props) : children}
    </FormContext>
  );
}
