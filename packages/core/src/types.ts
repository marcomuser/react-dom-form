import type { Get, Paths, UnknownRecord } from "type-fest";

export type StructuredFormValue<Schema> = Schema extends UnknownRecord
  ? { [Key in keyof Schema]: StructuredFormValue<Schema[Key]> }
  : Schema extends Array<infer Item>
    ? Array<StructuredFormValue<Item>>
    : Schema extends number | boolean | Date | bigint
      ? string
      : Schema extends Blob
        ? File
        : Schema extends null
          ? undefined
          : Schema;

export type PathsFromObject<BaseType> = Paths<
  BaseType,
  { bracketNotation: true }
>;

export type GetFromObject<
  BaseType,
  Path extends PathsFromObject<BaseType>,
> = Get<BaseType, Path, { strict: true }>;

export type AnyRecord = Record<PropertyKey, any>;
