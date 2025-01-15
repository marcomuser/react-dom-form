import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function FormWithBrowserMessages() {
  return (
    <form>
      <input data-testid="username" name="username" pattern="[a-z]{4,8}" />
      <input
        data-testid="password"
        name="password"
        minLength={6}
        maxLength={9}
      />
      <input
        type="number"
        data-testid="age"
        name="age"
        min="0"
        max="120"
        step="1"
      />
      <select data-testid="color" name="color" required>
        <option value=""></option>
        <option value="blue"></option>
        <option value="red"></option>
      </select>
    </form>
  );
}

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
    const colorSelect = screen
      .getByTestId("color")
      .element() as HTMLSelectElement;

    expect(colorSelect.validity.valid).toBe(false);
    expect(colorSelect.validity.valueMissing).toBe(true);
    expect(colorSelect.validationMessage).toBeTruthy();

    await userEvent.selectOptions(colorSelect, "blue");
    expect(colorSelect.validity.valid).toBe(true);
    expect(colorSelect.validity.valueMissing).toBe(false);
    expect(colorSelect.validationMessage).toBe("");
  });
});

// describe.skip("getFieldProps with custom error messages", () => {
//   it("should set validationMessage after user input when constraint is violated", async () => {
//     const screen = render(
//       <Form minLength={{ value: 6, message: "Minimum 6 characters" }} />,
//     );

//     const password = screen
//       .getByLabelText("password")
//       .element() as HTMLInputElement;

//     expect(password.validity.valid).toBe(true);
//     expect(password.validationMessage).toBe("");

//     await userEvent.type(password, "12345");
//     expect(password.validity.valid).toBe(false);
//     expect(password.validity.tooShort).toBe(true);
//     expect(password.validationMessage).toBe("Minimum 6 characters");
//   });

//   it("should reset validationMessage when input becomes valid", async () => {
//     const screen = render(
//       <Form minLength={{ value: 6, message: "Minimum 6 characters" }} />,
//     );

//     const password = screen
//       .getByLabelText("password")
//       .element() as HTMLInputElement;

//     await userEvent.type(password, "12345");
//     expect(password.validity.valid).toBe(false);
//     expect(password.validity.tooShort).toBe(true);
//     expect(password.validationMessage).toBe("Minimum 6 characters");

//     await userEvent.type(password, "6");
//     expect(password.value).toBe("123456");
//     expect(password.validity.valid).toBe(true);
//     expect(password.validationMessage).toBe("");
//   });

//   it("should set required validity already on first render", async () => {
//     const screen = render(
//       <Form required={{ value: true, message: "Required very much indeed" }} />,
//     );

//     const email = screen.getByLabelText("email").element() as HTMLInputElement;

//     expect(email.validity.valid).toBe(false);
//     expect(email.validity.valueMissing).toBe(true);
//     expect(email.validationMessage).toBe("Required very much indeed");

//     await userEvent.type(email, "test@test.com");
//     expect(email.validity.valid).toBe(true);
//     expect(email.validity.valueMissing).toBe(false);
//     expect(email.validationMessage).toBe("");
//   });
// });
