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
  /**
   * Default values for the form. This is typically used in conjunction with
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
  defaultValues?: UnknownRecord | undefined;
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
  submitError?: UnknownRecord | undefined;
  /**
   * A ref to the HTML form element. This is required for accessing the form
   * element directly, for example, to trigger form validation.
   * This ref should be created using `useRef` in the parent component.
   *
   * @example
   * ```tsx
   * const formRef = useRef<HTMLFormElement>(null);
   * <form ref={formRef}>
   *   <FormProvider formRef={formRef}>
   *     ...
   *   </FormProvider>
   * </form>
   * ```
   */
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
