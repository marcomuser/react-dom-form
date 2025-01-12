import { describe, expectTypeOf, it } from "vitest";
import type { StructuredFormValue } from "../../src/types.js";

describe("StructuredFormValue", () => {
  it("should handle primitive types", () => {
    expectTypeOf<StructuredFormValue<string>>().toEqualTypeOf<string>();
    expectTypeOf<StructuredFormValue<number>>().toEqualTypeOf<string>();
    expectTypeOf<StructuredFormValue<boolean>>().toEqualTypeOf<string>();
    expectTypeOf<StructuredFormValue<Date>>().toEqualTypeOf<string>();
    expectTypeOf<StructuredFormValue<bigint>>().toEqualTypeOf<string>();
  });

  it("should handle null", () => {
    expectTypeOf<StructuredFormValue<null>>().toEqualTypeOf<undefined>();
  });

  it("should handle Blob and File", () => {
    expectTypeOf<StructuredFormValue<Blob>>().toEqualTypeOf<File>();
    expectTypeOf<StructuredFormValue<File>>().toEqualTypeOf<File>();
  });

  it("should handle File in array", () => {
    expectTypeOf<StructuredFormValue<File[]>>().toEqualTypeOf<File[]>();
  });

  it("should handle flat object", () => {
    type TestSchema = {
      name: string;
      age: number;
    };
    type ExpectedType = {
      name: string;
      age: string;
    };
    expectTypeOf<
      StructuredFormValue<TestSchema>
    >().toEqualTypeOf<ExpectedType>();
  });

  it("should handle nested objects", () => {
    type TestSchema = {
      person: {
        name: string;
        address: {
          street: string;
        };
      };
    };
    type ExpectedType = {
      person: {
        name: string;
        address: {
          street: string;
        };
      };
    };
    expectTypeOf<
      StructuredFormValue<TestSchema>
    >().toEqualTypeOf<ExpectedType>();
  });

  it("should handle arrays of primitives", () => {
    expectTypeOf<StructuredFormValue<string[]>>().toEqualTypeOf<string[]>();
    expectTypeOf<StructuredFormValue<number[]>>().toEqualTypeOf<string[]>();
  });

  it("should handle arrays of objects", () => {
    type TestSchema = { value: number };
    type ExpectedType = { value: string }[];
    expectTypeOf<
      StructuredFormValue<TestSchema[]>
    >().toEqualTypeOf<ExpectedType>();
  });

  it("should handle complex nested structure", () => {
    type TestSchema = {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: number[];
        };
        meta:
          | {
              active: boolean;
            }[]
          | null;
      };
    };

    type ExpectedType = {
      name: string;
      tags: string[];
      details: {
        address: {
          street: string;
          numbers: string[];
        };
        meta:
          | {
              active: string;
            }[]
          | undefined;
      };
    };

    expectTypeOf<
      StructuredFormValue<TestSchema>
    >().toEqualTypeOf<ExpectedType>();
  });

  it("should handle union types in objects", () => {
    type TestSchema = {
      value: string | number;
    };
    type ExpectedType = {
      value: string;
    };

    expectTypeOf<
      StructuredFormValue<TestSchema>
    >().toEqualTypeOf<ExpectedType>();
  });
});
