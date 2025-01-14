import type { ChangeEvent, RefCallback, RefObject } from "react";
import type { AnyRecord, PathsFromObject } from "./types.js";
import type { UnknownRecord } from "type-fest";

type ValidationRule<Value extends boolean | number | string | RegExp> =
  | Value
  | {
      value: Value;
      message: string;
    };

export interface Constraints {
  required?: ValidationRule<boolean> | undefined;
  min?: ValidationRule<string | number> | undefined;
  max?: ValidationRule<string | number> | undefined;
  step?: ValidationRule<string | number> | undefined;
  minLength?: ValidationRule<number> | undefined;
  maxLength?: ValidationRule<number> | undefined;
  pattern?: ValidationRule<RegExp> | undefined;
}

export interface FieldOptions<FormValues extends UnknownRecord | undefined>
  extends Constraints {
  name: PathsFromObject<FormValues>;
  onChange?: (event: ChangeEvent<any>) => void;
}

export interface FieldProps {
  name: string;
  onChange: (event: any) => void;
  ref: RefCallback<unknown>;
  required?: boolean | undefined;
  min?: string | number | undefined;
  max?: string | number | undefined;
  step?: string | number | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  pattern?: string | undefined;
}

export function getFieldProps<
  FormValues extends AnyRecord | undefined = UnknownRecord | undefined,
>(
  ref: RefObject<HTMLFormElement | null>,
  options: FieldOptions<FormValues>,
): FieldProps {
  const { name, onChange, ...constraints } = options;

  return {
    name,
    ...Object.fromEntries(
      Object.entries(constraints).map(([key, rule]) => [
        key,
        hasValidationMessage(rule) ? rule.value : rule,
      ]),
    ),
    ref: (node: HTMLInputElement) => {
      if (node && hasValidationMessage(constraints.required)) {
        if (node.validity.valueMissing) {
          node.setCustomValidity(constraints.required.message);
        } else {
          node.setCustomValidity("");
        }
      }
    },
    onChange: (
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
    },
  };
}

function hasValidationMessage<Value extends boolean | number | string | RegExp>(
  rule: ValidationRule<Value> | undefined,
): rule is { value: Value; message: string } {
  return typeof rule === "object" && rule !== null && "message" in rule;
}
