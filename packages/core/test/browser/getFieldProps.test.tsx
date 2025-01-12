import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { FormProvider } from "../../src/FormProvider.js";
import { useFormContext } from "../../src/useFormContext.js";
import type { ValidationRule } from "../../src/getFieldProps.js";

function Form({
  required,
  minLength,
}: {
  required: ValidationRule<boolean>;
  minLength: ValidationRule<number>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form aria-label="form" ref={formRef}>
      <FormProvider ref={formRef}>
        <Fields required={required} minLength={minLength} />
      </FormProvider>
    </form>
  );
}

function Fields({
  required,
  minLength,
}: {
  required: ValidationRule<boolean>;
  minLength: ValidationRule<number>;
}) {
  const { getFieldProps } = useFormContext<{
    email: string;
    password: string;
  }>();

  return (
    <>
      <label>
        Email
        <input type="email" {...getFieldProps({ name: "email", required })} />
      </label>
      <label>
        Password
        <input
          type="password"
          {...getFieldProps({ name: "password", minLength })}
        />
      </label>
    </>
  );
}

describe("getFieldProps", () => {
  it("renders the input fields with constraints", async () => {
    const screen = render(<Form required={true} minLength={6} />);

    const email = screen.getByLabelText("email");
    const password = screen.getByLabelText("password");

    await expect.element(email).toBeInTheDocument();
    await expect.element(email).toHaveAttribute("name");
    await expect.element(email).toHaveAttribute("required");
    await expect.element(email).not.toHaveAttribute("minLength");
    await expect.element(password).toBeInTheDocument();
    await expect.element(password).toHaveAttribute("name");
    await expect.element(password).not.toHaveAttribute("required");
    await expect.element(password).toHaveAttribute("minLength");
  });

  it("updates the validity state on user input", async () => {
    const screen = render(<Form required={true} minLength={6} />);

    const email = screen.getByLabelText("email").element() as HTMLInputElement;
    const password = screen
      .getByLabelText("password")
      .element() as HTMLInputElement;

    expect(email.validity.valueMissing).toBe(true);
    expect(email.validity.valid).toBe(false);
    expect(password.validity.valueMissing).toBe(false);
    expect(password.validity.tooShort).toBe(false);
    expect(password.validity.valid).toBe(true);

    await userEvent.type(email, "test@test.com");
    expect(email.validity.valueMissing).toBe(false);
    expect(email.validity.valid).toBe(true);

    await userEvent.type(password, "12345");
    expect(password.validity.tooShort).toBe(true);
    expect(password.validity.valid).toBe(false);

    await userEvent.type(password, "6");
    expect(password.value).toBe("123456");
    expect(password.validity.tooShort).toBe(false);
    expect(password.validity.valid).toBe(true);
  });

  it("sets the custom validity message", async () => {
    const screen = render(
      <Form
        required={{ value: true, message: "Required very much indeed" }}
        minLength={{ value: 6, message: "Minimum 6 characters" }}
      />,
    );

    const email = screen.getByLabelText("email").element() as HTMLInputElement;
    const password = screen
      .getByLabelText("password")
      .element() as HTMLInputElement;

    expect(email.validity.valid).toBe(false);
    expect(email.validationMessage).toBe("Required very much indeed");
    expect(password.validity.valid).toBe(true);
    expect(password.validationMessage).toBe("");

    await userEvent.type(email, "test@test.com");
    expect(email.validity.valid).toBe(true);
    expect(email.validationMessage).toBe("");
    expect(password.validity.valid).toBe(true);
    expect(password.validationMessage).toBe("");

    await userEvent.type(password, "12345");
    expect(password.validity.valid).toBe(false);
    expect(password.validationMessage).toBe("Minimum 6 characters");

    await userEvent.type(password, "6");
    expect(password.value).toBe("123456");
    expect(password.validity.valid).toBe(true);
    expect(password.validationMessage).toBe("");
  });
});
