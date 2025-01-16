import { useRef } from "react";
import { getFieldProps } from "../../../src/getFieldProps.js";

interface FormValues {
  username: string;
  password: string;
  age: number;
  color: "blue" | "red";
}

export function FormWithBrowserMessages() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef}>
      <input
        data-testid="username"
        {...getFieldProps<FormValues>(formRef, {
          name: "username",
          pattern: RegExp("[a-z]{4,8}"),
        })}
      />
      <input
        data-testid="password"
        {...getFieldProps<FormValues>(formRef, {
          name: "password",
          minLength: 6,
          maxLength: 9,
        })}
      />
      <input
        type="number"
        data-testid="age"
        {...getFieldProps<FormValues>(formRef, {
          name: "age",
          min: 0,
          max: 120,
          step: 1,
        })}
      />
      <select
        data-testid="color"
        {...getFieldProps<FormValues>(formRef, {
          name: "color",
          required: true,
        })}
      >
        <option value=""></option>
        <option value="blue"></option>
        <option value="red"></option>
      </select>
    </form>
  );
}
