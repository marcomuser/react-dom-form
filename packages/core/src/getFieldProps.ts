import type { ChangeEvent, RefObject } from "react";
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
    ...constraints,
    name,
    onChange: (
      event: ChangeEvent<{
        validity: ValidityState;
        setCustomValidity(error: string): void;
      }>,
    ) => {
      const { validity, setCustomValidity } = event.target;

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
