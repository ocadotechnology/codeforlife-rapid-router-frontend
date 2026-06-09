// TODO: move to cfl package.
/** Recursively extracts all numeric values from a nested object structure. */
export type DeepNumbersOf<T> = T extends number ? T : DeepNumbersOf<T[keyof T]>
/** Recursively extracts all string values from a nested object structure. */
export type DeepStringsOf<T> = T extends string ? T : DeepStringsOf<T[keyof T]>
/** Creates a tuple type of length N with elements of type T. */
export type Tuple<
  T,
  N extends number,
  A extends T[] = [],
> = A["length"] extends N ? A : Tuple<T, N, [...A, T]>
