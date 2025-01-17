import type { ChangeEvent, RefCallback, RefObject } from "react";
import type { PathsFromObject } from "./types.js";
import type { Entries } from "type-fest";

type ValidationRule<Value extends boolean | number | RegExp> =
  | Value
  | {
      value: Value;
      message: string;
    };

interface ConstraintOptions {
  required?: ValidationRule<boolean>;
  min?: ValidationRule<number>;
  max?: ValidationRule<number>;
  step?: ValidationRule<number>;
  minLength?: ValidationRule<number>;
  maxLength?: ValidationRule<number>;
  pattern?: ValidationRule<RegExp>;
}

interface ConstraintProps {
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface FieldOptions<FormValues> extends ConstraintOptions {
  name: PathsFromObject<FormValues>;
  onChange?: (event: ChangeEvent<any>) => void;
  ref?: RefObject<unknown>;
}

export interface FieldProps extends ConstraintProps {
  name: string;
  onChange: (event: ChangeEvent<any>) => void;
  ref: RefCallback<unknown>;
}

export function getFieldProps<FormValues>(
  formRef: RefObject<HTMLFormElement | null>,
  options: FieldOptions<FormValues>,
): FieldProps {
  const { name, onChange, ref, ...constraints } = options;

  return {
    name,
    ...getConstraintProps(constraints),
    ref: getRefCallback(constraints, ref),
    onChange: getChangeHandler(constraints, onChange),
  };
}

function getConstraintProps(constraints: ConstraintOptions): ConstraintProps {
  const props: Record<PropertyKey, string | number | boolean> = {};

  for (const [key, rule] of Object.entries(
    constraints,
  ) as Entries<ConstraintOptions>) {
    const value = hasValidationMessage(rule) ? rule.value : rule;
    if (value !== undefined) {
      props[key] = value instanceof RegExp ? value.source : value;
    }
  }

  return props;
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
    const { target } = event;

    Object.entries(constraints).forEach(([key, rule]) => {
      if (hasValidationMessage(rule)) {
        switch (key) {
          case "required":
            target.setCustomValidity(
              target.validity.valueMissing ? rule.message : "",
            );
            break;
          case "min":
            target.setCustomValidity(
              target.validity.rangeUnderflow ? rule.message : "",
            );
            break;
          case "max":
            target.setCustomValidity(
              target.validity.rangeOverflow ? rule.message : "",
            );
            break;
          case "step":
            target.setCustomValidity(
              target.validity.stepMismatch ? rule.message : "",
            );
            break;
          case "minLength":
            target.setCustomValidity(
              target.validity.tooShort ? rule.message : "",
            );
            break;
          case "maxLength":
            target.setCustomValidity(
              target.validity.tooLong ? rule.message : "",
            );
            break;
          case "pattern":
            target.setCustomValidity(
              target.validity.patternMismatch ? rule.message : "",
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

function hasValidationMessage<Value extends boolean | number | RegExp>(
  rule: ValidationRule<Value> | undefined,
): rule is { value: Value; message: string } {
  return typeof rule === "object" && rule !== null && "message" in rule;
}
