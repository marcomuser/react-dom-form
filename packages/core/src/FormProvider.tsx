import { type JSX, type ReactNode, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import { getFieldProps } from "./getFieldProps.js";
import { FormContext, type FormContextValue } from "./FormContext.js";
import type { AnyRecord } from "./types.js";
import { serialize } from "./serialize.js";

interface FormProviderProps<
  DefaultValues extends UnknownRecord | undefined,
  Meta extends UnknownRecord | undefined,
> {
  /**
   * Default values for the form. Values will be serialized internally. This is typically used in conjunction with
   * `useActionState` to display initial values.
   *
   * @example
   * ```tsx
   * const [actionState, submitAction] = useActionState(
   *   async (prevState, formData) => {
   *     const formValues = parse(formData);
   *     // ... form submission logic
   *     return redirect("/success")
   *   },
   *   { defaultValues, meta: {submitError: undefined} }
   * );
   *
   * return <FormProvider defaultValues={actionState.defaultValues}>...</FormProvider>;
   * ```
   */
  defaultValues?: DefaultValues;
  /**
   * Meta data returned after form submission, intended for use with useActionState to manage and display submission feedback.
   *
   * @example
   * ```tsx
   * const [actionState, submitAction] = useActionState(
   *   async (prevState, formData) => {
   *     const formValues = parse(formData);
   *     try {
   *       // ... form submission logic
   *     } catch (error) {
   *       return { defaultValues: formValues, meta: {submitError: error.message} };
   *     }
   *   },
   *   { defaultValues, meta: {submitError: undefined} }
   * );
   *
   * return <FormProvider meta={actionState.meta}>...</FormProvider>;
   * ```
   */
  meta?: Meta;
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
    | ((props: FormContextValue<DefaultValues, Meta>) => ReactNode);
}

export function FormProvider<
  DefaultValues extends AnyRecord | undefined = UnknownRecord | undefined,
  Meta extends AnyRecord | undefined = UnknownRecord | undefined,
>({
  defaultValues,
  meta,
  ref,
  children,
}: FormProviderProps<DefaultValues, Meta>): JSX.Element {
  const props: FormContextValue<DefaultValues, Meta> = {
    defaultValues: serialize(defaultValues),
    meta,
    formRef: ref,
    getFieldProps: (options) => getFieldProps(ref, options),
  };

  return (
    <FormContext value={props}>
      {typeof children === "function" ? children(props) : children}
    </FormContext>
  );
}
