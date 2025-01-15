import type { ChangeEvent, RefCallback, RefObject } from "react";
import type { AnyRecord, PathsFromObject } from "./types.js";
import type { Entries, UnknownRecord } from "type-fest";

type ValidationRule<Value extends boolean | number | string | RegExp> =
  | Value
  | {
      value: Value;
      message: string;
    };

interface ConstraintOptions {
  required?: ValidationRule<boolean> | undefined;
  min?: ValidationRule<string | number> | undefined;
  max?: ValidationRule<string | number> | undefined;
  step?: ValidationRule<string | number> | undefined;
  minLength?: ValidationRule<number> | undefined;
  maxLength?: ValidationRule<number> | undefined;
  pattern?: ValidationRule<string> | undefined;
}

interface ConstraintProps {
  required?: boolean | undefined;
  min?: string | number | undefined;
  max?: string | number | undefined;
  step?: string | number | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  pattern?: string | undefined;
}

export interface FieldOptions<FormValues extends UnknownRecord | undefined>
  extends ConstraintOptions {
  name: PathsFromObject<FormValues>;
  onChange?: (event: ChangeEvent<any>) => void;
  ref?: RefObject<unknown>;
}

export interface FieldProps extends ConstraintProps {
  name: string;
  onChange: (event: ChangeEvent<any>) => void;
  ref: RefCallback<unknown>;
}

export function getFieldProps<
  FormValues extends AnyRecord | undefined = UnknownRecord | undefined,
>(
  formRef: RefObject<HTMLFormElement | null>,
  options: FieldOptions<FormValues>,
): FieldProps {
  const { name, onChange, ref, ...constraints } = options;

  return {
    name,
    ...getConstraints(constraints),
    ref: getRefCallback(constraints, ref),
    onChange: getChangeHandler(constraints, onChange),
  };
}

function getConstraints(constraints: ConstraintOptions) {
  return Object.fromEntries(
    (Object.entries(constraints) as Entries<ConstraintOptions>).map(
      ([key, rule]) => [key, hasValidationMessage(rule) ? rule.value : rule],
    ),
  );
}

function getRefCallback(
  constraints: ConstraintOptions,
  ref?: RefObject<unknown>,
) {
  return (node: HTMLInputElement) => {
    if (node && hasValidationMessage(constraints.required)) {
      if (node.validity.valueMissing) {
        node.setCustomValidity(constraints.required.message);
      } else {
        node.setCustomValidity("");
      }
    }

    if (ref?.current) {
      ref.current = node;
    }
  };
}

function getChangeHandler(
  constraints: ConstraintOptions,
  onChange?: (event: ChangeEvent<any>) => void,
) {
  return (
    event: ChangeEvent<{
      validity: ValidityState;
      setCustomValidity(error: string): void;
    }>,
  ) => {
    Object.entries(constraints).forEach(([key, rule]) => {
      if (hasValidationMessage(rule)) {
        switch (key) {
          case "required":
            event.target.setCustomValidity(
              event.target.validity.valueMissing ? rule.message : "",
            );
            break;
          case "min":
            event.target.setCustomValidity(
              event.target.validity.rangeUnderflow ? rule.message : "",
            );
            break;
          case "max":
            event.target.setCustomValidity(
              event.target.validity.rangeOverflow ? rule.message : "",
            );
            break;
          case "step":
            event.target.setCustomValidity(
              event.target.validity.stepMismatch ? rule.message : "",
            );
            break;
          case "minLength":
            event.target.setCustomValidity(
              event.target.validity.tooShort ? rule.message : "",
            );
            break;
          case "maxLength":
            event.target.setCustomValidity(
              event.target.validity.tooLong ? rule.message : "",
            );
            break;
          case "pattern":
            event.target.setCustomValidity(
              event.target.validity.patternMismatch ? rule.message : "",
            );
            break;
        }
      }
    });

    if (onChange) {
      onChange(event);
    }
  };
}

function hasValidationMessage<Value extends boolean | number | string | RegExp>(
  rule: ValidationRule<Value> | undefined,
): rule is { value: Value; message: string } {
  return typeof rule === "object" && rule !== null && "message" in rule;
}
