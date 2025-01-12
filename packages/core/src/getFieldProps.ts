import type { RefObject } from "react";
import type { AnyRecord, PathsFromObject } from "./types.js";
import type { UnknownRecord } from "type-fest";

export interface Options<FormValues extends UnknownRecord | undefined> {
  name: PathsFromObject<FormValues>;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  onChange?: (event: any) => void;
}

export interface FieldProps<FormValues extends UnknownRecord | undefined> {
  name: PathsFromObject<FormValues>;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  onChange: (event: any) => void;
}

export function getFieldProps<
  FormValues extends AnyRecord | undefined = UnknownRecord | undefined,
>(
  ref: RefObject<HTMLFormElement | null>,
  options: Options<FormValues>,
): FieldProps<FormValues> {
  const { onChange, ...rest } = options;

  return {
    ...rest,
    onChange: (event) => {
      if (onChange) {
        onChange(event);
      }
    },
  };
}
