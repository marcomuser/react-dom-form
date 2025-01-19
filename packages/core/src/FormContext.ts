import { createContext, type Context, type RefObject } from "react";
import type { UnknownRecord } from "type-fest";
import type { FieldProps, FieldOptions } from "./getFieldProps.js";
import type { SerializedValue } from "./types.js";

export interface FormContextValue<
  DefaultValues extends UnknownRecord | undefined,
  Meta extends UnknownRecord | undefined,
> {
  /**
   * Serialized default values for use in the `defaultValue` or `defaultChecked` attribute of input elements.
   */
  defaultValues?: SerializedValue<DefaultValues> | undefined;
  /**
   * Meta data returned after form submission, intended for use with useActionState to manage and display submission feedback.
   */
  meta?: Meta | undefined;
  /**
   * A ref to the HTML form element.
   */
  formRef: RefObject<HTMLFormElement | null>;
  /**
   * Provides type-safe field configuration complying with the Constraint Validation API.
   * Returns the necessary props to validate and associate a form input element with a `<form>` element.
   *
   * @example
   * ```tsx
   * <form>
   *   <input {...getFieldProps({name: "username"})} />
   *   <input type="password" {...getFieldProps({name: "password", minLength: 5})} />
   * </form>
   * ```
   */
  getFieldProps: (options: FieldOptions<DefaultValues>) => FieldProps;
}

export const FormContext: Context<FormContextValue<
  any,
  UnknownRecord | undefined
> | null> = createContext<FormContextValue<
  UnknownRecord | undefined,
  UnknownRecord | undefined
> | null>(null);
