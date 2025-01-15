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
    <form>
      <input
        data-testid="username"
        {...getFieldProps<FormValues>(formRef, {
          name: "username",
          pattern: "w{3,16}",
        })}
      />
      <input
        data-testid="password"
        {...getFieldProps<FormValues>(formRef, {
          name: "password",
          minLength: 6,
          maxLength: 10,
        })}
      />
      <input
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
        <option value="blue"></option>
        <option value="red"></option>
      </select>
    </form>
  );
}
