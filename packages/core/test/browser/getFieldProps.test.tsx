import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { FormWithBrowserMessages } from "./fixtures/FormWithBrowserMessages.js";
import { FormWithCustomMessages } from "./fixtures/FormWithCustomMessages.js";

describe("getFieldProps with browser messages", () => {
  it("should render the inputs with constraint attributes", async () => {
    const screen = render(<FormWithBrowserMessages />);

    const username = screen.getByTestId("username");
    const password = screen.getByTestId("password");
    const age = screen.getByTestId("age");
    const color = screen.getByTestId("color");

    await expect.element(username).toHaveAttribute("name");
    await expect.element(username).toHaveAttribute("pattern");
    await expect.element(password).toHaveAttribute("name");
    await expect.element(password).toHaveAttribute("minLength");
    await expect.element(password).toHaveAttribute("maxLength");
    await expect.element(age).toHaveAttribute("name");
    await expect.element(age).toHaveAttribute("min");
    await expect.element(age).toHaveAttribute("max");
    await expect.element(age).toHaveAttribute("step");
    await expect.element(color).toHaveAttribute("name");
    await expect.element(color).toHaveAttribute("required");
  });

  it("should constraint username with pattern", async () => {
    const screen = render(<FormWithBrowserMessages />);
    const username = screen
      .getByTestId("username")
      .element() as HTMLInputElement;

    await userEvent.fill(username, "aa");
    expect(username.validity.valid).toBe(false);
    expect(username.validity.patternMismatch).toBe(true);
    expect(username.validationMessage).toBeTruthy();

    await userEvent.fill(username, "valid");
    expect(username.validity.valid).toBe(true);
    expect(username.validity.patternMismatch).toBe(false);
    expect(username.validationMessage).toBe("");
  });

  it("should constraint password length", async () => {
    const screen = render(<FormWithBrowserMessages />);
    const password = screen
      .getByTestId("password")
      .element() as HTMLInputElement;

    await userEvent.fill(password, "short");
    expect(password.validity.valid).toBe(false);
    expect(password.validity.tooShort).toBe(true);
    expect(password.validationMessage).toBeTruthy();

    await userEvent.fill(password, "validpass");
    expect(password.validity.valid).toBe(true);
    expect(password.validity.tooShort).toBe(false);
    expect(password.validationMessage).toBe("");
  });

  it("should constraint age range and step", async () => {
    const screen = render(<FormWithBrowserMessages />);
    const age = screen.getByTestId("age").element() as HTMLInputElement;

    await userEvent.fill(age, "-1");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.rangeUnderflow).toBe(true);
    expect(age.validationMessage).toBeTruthy();

    await userEvent.fill(age, "121");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.rangeOverflow).toBe(true);
    expect(age.validationMessage).toBeTruthy();

    await userEvent.fill(age, "2.5");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.stepMismatch).toBe(true);
    expect(age.validationMessage).toBeTruthy();

    await userEvent.fill(age, "50");
    expect(age.validity.valid).toBe(true);
    expect(age.validationMessage).toBe("");
  });

  it("should constraint required select", async () => {
    const screen = render(<FormWithBrowserMessages />);
    const color = screen.getByTestId("color").element() as HTMLSelectElement;

    expect(color.validity.valid).toBe(false);
    expect(color.validity.valueMissing).toBe(true);
    expect(color.validationMessage).toBeTruthy();

    await userEvent.selectOptions(color, "blue");
    expect(color.validity.valid).toBe(true);
    expect(color.validity.valueMissing).toBe(false);
    expect(color.validationMessage).toBe("");
  });
});

describe("getFieldProps with custom error messages", () => {
  it("should constraint username with pattern and set custom validationMessage", async () => {
    const screen = render(<FormWithCustomMessages />);
    const username = screen
      .getByTestId("username")
      .element() as HTMLInputElement;

    await userEvent.fill(username, "aa");
    expect(username.validity.valid).toBe(false);
    expect(username.validity.patternMismatch).toBe(true);
    expect(username.validationMessage).toBe("pattern error");

    await userEvent.fill(username, "valid");
    expect(username.validity.valid).toBe(true);
    expect(username.validity.patternMismatch).toBe(false);
    expect(username.validationMessage).toBe("");
  });

  it("should constraint password length and set custom validationMessage", async () => {
    const screen = render(<FormWithCustomMessages />);
    const password = screen
      .getByTestId("password")
      .element() as HTMLInputElement;

    await userEvent.fill(password, "short");
    expect(password.validity.valid).toBe(false);
    expect(password.validity.tooShort).toBe(true);
    expect(password.validationMessage).toBe("minLength error");

    await userEvent.fill(password, "validpass");
    expect(password.validity.valid).toBe(true);
    expect(password.validity.tooShort).toBe(false);
    expect(password.validationMessage).toBe("");
  });

  it("should constraint age range and step and set custom validationMessage", async () => {
    const screen = render(<FormWithCustomMessages />);
    const age = screen.getByTestId("age").element() as HTMLInputElement;

    await userEvent.fill(age, "-1");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.rangeUnderflow).toBe(true);
    expect(age.validationMessage).toBe("min error");

    await userEvent.fill(age, "121");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.rangeOverflow).toBe(true);
    expect(age.validationMessage).toBe("max error");

    await userEvent.fill(age, "2.5");
    expect(age.validity.valid).toBe(false);
    expect(age.validity.stepMismatch).toBe(true);
    expect(age.validationMessage).toBe("step error");

    await userEvent.fill(age, "50");
    expect(age.validity.valid).toBe(true);
    expect(age.validationMessage).toBe("");
  });

  it("should constraint required select and set custom validationMessage", async () => {
    const screen = render(<FormWithCustomMessages />);
    const color = screen.getByTestId("color").element() as HTMLSelectElement;

    expect(color.validity.valid).toBe(false);
    expect(color.validity.valueMissing).toBe(true);
    expect(color.validationMessage).toBe("required error");

    await userEvent.selectOptions(color, "blue");
    expect(color.validity.valid).toBe(true);
    expect(color.validity.valueMissing).toBe(false);
    expect(color.validationMessage).toBe("");
  });
});
