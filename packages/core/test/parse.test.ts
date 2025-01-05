import { describe, expect, it } from "vitest";
import { parse } from "../src/parse.js";

describe("parse", () => {
  it("should handle simple key-value pairs", () => {
    const file = new File(["test content"], "test.txt");
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("age", "30");
    formData.append("file", file);

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ name: "John Doe", age: "30", file });
  });

  it("should handle nested objects", () => {
    const formData = new FormData();
    formData.append("address.street", "123 Main St");
    formData.append("address.city", "Anytown");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      address: { street: "123 Main St", city: "Anytown" },
    });
  });

  it("should handle arrays", () => {
    const formData = new FormData();
    formData.append("items[0]", "apple");
    formData.append("items[1]", "banana");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ items: ["apple", "banana"] });
  });

  it("should handle nested objects and arrays combined", () => {
    const formData = new FormData();
    formData.append("tasks[0].content", "Write code");
    formData.append("tasks[0].completed", "true");
    formData.append("tasks[1].content", "Test code");
    formData.append("tasks[1].details.priority", "high");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      tasks: [
        { content: "Write code", completed: "true" },
        { content: "Test code", details: { priority: "high" } },
      ],
    });
  });

  it("should handle empty form data", () => {
    const formData = new FormData();
    const parsedData = parse(formData);
    expect(parsedData).toEqual({});
  });

  it("should handle array with non-consecutive indexes", () => {
    const formData = new FormData();
    formData.append("items[0]", "apple");
    formData.append("items[2]", "orange");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({ items: ["apple", undefined, "orange"] });
  });

  it("should handle multiple nested objects", () => {
    const formData = new FormData();
    formData.append("level1.level2.level3.value", "deep value");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      level1: { level2: { level3: { value: "deep value" } } },
    });
  });

  it("should handle multiple nested arrays", () => {
    const formData = new FormData();
    formData.append("level1[0].level2[0].level3.value", "deep value 1");
    formData.append("level1[0].level2[1].level3.value", "deep value 2");
    formData.append("level1[1].level2[0].level3.value", "deep value 3");

    const parsedData = parse(formData);
    expect(parsedData).toEqual({
      level1: [
        {
          level2: [
            { level3: { value: "deep value 1" } },
            { level3: { value: "deep value 2" } },
          ],
        },
        { level2: [{ level3: { value: "deep value 3" } }] },
      ],
    });
  });
});
