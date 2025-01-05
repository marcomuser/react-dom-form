export type StructuredFormValue<Schema> =
  Schema extends Record<PropertyKey, unknown>
    ? { [Key in keyof Schema]: StructuredFormValue<Schema[Key]> }
    : Schema extends Array<infer Item>
      ? Array<StructuredFormValue<Item>>
      : Schema extends number | boolean | Date | bigint
        ? string
        : Schema extends null
          ? undefined
          : Schema;
