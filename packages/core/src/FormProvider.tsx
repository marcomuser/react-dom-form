import { type JSX, type ReactNode, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import { getFieldProps } from "./getFieldProps.js";
import { FormContext, type FormContextValue } from "./FormContext.js";
import type { AnyRecord } from "./types.js";
import { serialize } from "./serialize.js";

interface FormProviderProps<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> {
  /**
   * Default values for the form. Values will be serialized internally. This is typically used in conjunction with
   * `useActionState` to display initial values.
   *
   * @example
   * ```tsx
   * const [formState, submitAction] = useActionState(
   *   async (prevState, formData) => {
   *     const formValues = parse(formData);
   *     // ... form submission logic
   *     return redirect("/success")
   *   },
   *   { defaultValues, submitError: undefined }
   * );
   *
   * return <FormProvider defaultValues={formState.defaultValues}>...</FormProvider>;
   * ```
   */
  defaultValues?: DefaultValues;
  /**
   * Error object returned from a form submission. This is meant to be used with
   * `useActionState` to display submit errors to the user.
   *
   * @example
   * ```tsx
   * const [formState, submitAction] = useActionState(
   *   async (prevState, formData) => {
   *     const formValues = parse(formData);
   *     try {
   *       // ... form submission logic
   *     } catch (error) {
   *       return { defaultValues: formValues, submitError: error.message };
   *     }
   *   },
   *   { defaultValues, submitError: undefined }
   * );
   *
   * return <FormProvider submitError={formState.submitError}>...</FormProvider>;
   * ```
   */
  submitError?: SubmitError;
  /**
   * A ref to the HTML form element. This is required for accessing the form
   * element directly, for example, to report form validity to the user.
   * This ref should be created using `useRef` in the parent component.
   *
   * @example
   * ```tsx
   * const formRef = useRef<HTMLFormElement>(null);
   *
   * <FormProvider ref={formRef}>
   *   <form ref={formRef}>
   *     ...
   *   </form>
   * </FormProvider>
   * ```
   */
  ref: RefObject<HTMLFormElement | null>;
  children:
    | ReactNode
    | ((props: FormContextValue<DefaultValues, SubmitError>) => ReactNode);
}

export function FormProvider<
  DefaultValues extends AnyRecord | undefined = UnknownRecord | undefined,
  SubmitError extends AnyRecord | undefined = UnknownRecord | undefined,
>({
  defaultValues,
  submitError,
  ref,
  children,
}: FormProviderProps<DefaultValues, SubmitError>): JSX.Element {
  const props: FormContextValue<DefaultValues, SubmitError> = {
    defaultValues: serialize(defaultValues),
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
