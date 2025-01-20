import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { FormWithNativeReporting } from "./fixtures/FormWithNativeReporting.js";
import { userEvent } from "@vitest/browser/context";

describe("UI integration tests with native validity reporting", () => {
  it("displays success message after successful submit", async () => {
    const screen = render(<FormWithNativeReporting />);

    const name = screen.getByLabelText("name");
    const animal = screen.getByLabelText("animal");
    const color = screen.getByLabelText("color");
    const comment = screen.getByLabelText("comment");
    const agreement = screen.getByLabelText("agreement");

    await userEvent.fill(name, "Max Mustermann");
    await userEvent.selectOptions(animal.element(), "birds");
    await userEvent.fill(color, "red");
    await userEvent.fill(comment, "This is a long enough comment");
    await userEvent.click(agreement);

    const submitButton = screen.getByRole("button", { name: "submit" });
    await userEvent.click(submitButton);

    const successMessage = screen.getByRole("status").element();
    expect(successMessage).toBeInTheDocument();
  });

  it("displays error message after unsuccessful submit", async () => {
    const screen = render(<FormWithNativeReporting />);

    const name = screen.getByLabelText("name");
    const animal = screen.getByLabelText("animal");
    const color = screen.getByLabelText("color");
    const comment = screen.getByLabelText("comment");
    const agreement = screen.getByLabelText("agreement");

    await userEvent.fill(name, "John Doe");
    await userEvent.selectOptions(animal.element(), "birds");
    await userEvent.fill(color, "red");
    await userEvent.fill(comment, "This is a long enough comment");
    await userEvent.click(agreement);

    const submitButton = screen.getByRole("button", { name: "submit" });
    await userEvent.click(submitButton);

    const errorMessage = screen.getByRole("alert").element();
    expect(errorMessage).toBeInTheDocument();
  });

  it("blocks submit when form has client-side validation errors and focuses on first element with error", async () => {
    const screen = render(<FormWithNativeReporting />);

    const submitButton = screen.getByRole("button", { name: "submit" });
    await userEvent.click(submitButton);

    const name = screen.getByLabelText("name");
    const successMessage = screen.getByRole("status").query();
    const errorMessage = screen.getByRole("alert").query();
    await expect.element(name).toHaveFocus();
    expect(successMessage).not.toBeInTheDocument();
    expect(errorMessage).not.toBeInTheDocument();
  });

  it("resets the form to default values", async () => {
    const screen = render(<FormWithNativeReporting />);

    const name = screen.getByLabelText("name");
    const animal = screen.getByLabelText("animal");
    const color = screen.getByLabelText("color");
    const comment = screen.getByLabelText("comment");
    const agreement = screen.getByLabelText("agreement");

    await userEvent.fill(name, "Max Mustermann");
    await userEvent.selectOptions(animal.element(), "birds");
    await userEvent.fill(color, "red");
    await userEvent.fill(comment, "This is a long enough comment");
    await userEvent.click(agreement);

    const resetButton = screen.getByRole("button", { name: "reset" });
    await userEvent.click(resetButton);

    await expect.element(name).toHaveValue("");
    await expect.element(animal).toHaveValue("");
    await expect.element(color).toHaveValue("");
    await expect.element(comment).toHaveValue("");
    await expect.element(agreement).not.toBeChecked();
  });

  it("resets the form to previously submitted values", async () => {
    const screen = render(<FormWithNativeReporting />);

    const name = screen.getByLabelText("name");
    const animal = screen.getByLabelText("animal");
    const color = screen.getByLabelText("color");
    const comment = screen.getByLabelText("comment");
    const agreement = screen.getByLabelText("agreement");

    await userEvent.fill(name, "Max Mustermann");
    await userEvent.selectOptions(animal.element(), "birds");
    await userEvent.fill(color, "red");
    await userEvent.fill(comment, "This is a long enough comment");
    await userEvent.click(agreement);

    const submitButton = screen.getByRole("button", { name: "submit" });
    await userEvent.click(submitButton);

    await userEvent.fill(name, "John Doe");

    const resetButton = screen.getByRole("button", { name: "reset" });
    await userEvent.click(resetButton);

    await expect.element(name).toHaveValue("Max Mustermann");
    await expect.element(animal).toHaveValue("birds");
    await expect.element(color).toHaveValue("red");
    await expect.element(comment).toHaveValue("This is a long enough comment");
    await expect.element(agreement).toBeChecked();
  });

  it("disables all associated fields when disabled prop in FormProvider is true", async () => {
    const screen = render(<FormWithNativeReporting disabled />);

    const name = screen.getByLabelText("name");
    const animal = screen.getByLabelText("animal");
    const color = screen.getByLabelText("color");
    const comment = screen.getByLabelText("comment");
    const agreement = screen.getByLabelText("agreement");

    await expect.element(name).toBeDisabled();
    await expect.element(animal).toBeDisabled();
    await expect.element(color).toBeDisabled();
    await expect.element(comment).toBeDisabled();
    await expect.element(agreement).toBeDisabled();
  });
});
