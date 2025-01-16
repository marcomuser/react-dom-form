import { useRef } from "react";
import { getFieldProps } from "../../../src/getFieldProps.js";

interface FormValues {
  username: string;
  password: string;
  age: number;
  color: "blue" | "red";
}

export function FormWithCustomMessages() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef}>
      <input
        data-testid="username"
        {...getFieldProps<FormValues>(formRef, {
          name: "username",
          pattern: { value: RegExp("[a-z]{4,8}"), message: "pattern error" },
        })}
      />
      <input
        data-testid="password"
        {...getFieldProps<FormValues>(formRef, {
          name: "password",
          minLength: { value: 6, message: "minLength error" },
          maxLength: { value: 9, message: "maxLength error" },
        })}
      />
      <input
        type="number"
        data-testid="age"
        {...getFieldProps<FormValues>(formRef, {
          name: "age",
          min: { value: 0, message: "min error" },
          max: { value: 120, message: "max error" },
          step: { value: 1, message: "step error" },
        })}
      />
      <select
        data-testid="color"
        {...getFieldProps<FormValues>(formRef, {
          name: "color",
          required: { value: true, message: "required error" },
        })}
      >
        <option value=""></option>
        <option value="blue"></option>
        <option value="red"></option>
      </select>
    </form>
  );
}
