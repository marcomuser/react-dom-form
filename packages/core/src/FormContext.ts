import { createContext, type Context, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import type { FieldProps, FieldOptions } from "./getFieldProps.js";
import type { FilterBrowserBuiltIns, SerializedValue } from "./types.js";

export interface FormContextValue<
  DefaultValues extends UnknownRecord | undefined,
  SubmitError extends UnknownRecord | undefined,
> {
  /**
   * Serialized default values for the form. This is typically used in conjunction with
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
  defaultValues?: SerializedValue<DefaultValues> | undefined;
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
  submitError?: SubmitError | undefined;
  /**
   * A ref to the HTML form element. This is required for accessing the form
   * element directly, for example, to trigger form validation.
   * This ref should be created using `useRef` in the parent component.
   *
   * @example
   * ```tsx
   * const formRef = useRef<HTMLFormElement>(null);
   * <form ref={formRef}>
   *   <FormProvider ref={formRef}>
   *     ...
   *   </FormProvider>
   * </form>
   * ```
   */
  formRef: RefObject<HTMLFormElement | null>;
  getFieldProps: (
    options: FieldOptions<FilterBrowserBuiltIns<DefaultValues>>,
  ) => FieldProps;
}

export const FormContext: Context<FormContextValue<
  any,
  UnknownRecord | undefined
> | null> = createContext<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null>(null);
