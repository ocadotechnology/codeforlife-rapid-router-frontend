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

type PathSpec = string | { readonly [key: string]: PathSpec }

type PathSpecToResult<T, ID extends number | string> = T extends string
  ? Record<T, ID>
  : { [K in keyof T]: PathSpecToResult<T[K], ID> }

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never

export type SetAtPath<T extends Record<number | string, PathSpec>> =
  UnionToIntersection<
    {
      [K in keyof T]: K extends number | string
        ? PathSpecToResult<T[K], K>
        : never
    }[keyof T]
  >

/**
 * Converts a mapping of numeric or string keys to path specifications into a
 * nested object structure where each path specification is replaced with the
 * corresponding numeric or string key. This allows to create a global registry
 * of unique keys that can be easily referenced in the code.
 *
 * @param specs A mapping of numeric or string keys to path specifications,
 *  where each path specification can be a string or a nested object of strings.
 * @returns A nested object structure where each path specification is replaced
 *  with the corresponding numeric or string key.
 */
export function setAtPath<T extends Record<number | string, PathSpec>>(
  specs: T,
): SetAtPath<T> {
  const result: Record<string, unknown> = {}

  function _setAtPath(
    target: Record<string, unknown>,
    pathSpec: PathSpec,
    id: number | string,
  ): void {
    if (typeof pathSpec === "string") {
      target[pathSpec] = id
    } else {
      for (const [key, nested] of Object.entries(pathSpec)) {
        if (!(key in target)) target[key] = {}
        _setAtPath(target[key] as Record<string, unknown>, nested, id)
      }
    }
  }

  for (const [idStr, pathSpec] of Object.entries(specs)) {
    const num = Number(idStr)
    const id: number | string = !isNaN(num) && idStr.trim() !== "" ? num : idStr
    _setAtPath(result, pathSpec, id)
  }

  return result as SetAtPath<T>
}

export function flattenNumberValues<T extends object>(
  obj: T,
): DeepNumbersOf<T>[] {
  return Object.values(obj).flatMap(v =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof v === "number"
      ? [v]
      : // @ts-expect-error Ignore infinite type recursion.
        flattenNumberValues(v),
  ) as DeepNumbersOf<T>[]
}

export function flattenStringValues<T extends object>(
  obj: T,
): DeepStringsOf<T>[] {
  return Object.values(obj).flatMap(v =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof v === "string"
      ? [v]
      : // @ts-expect-error Ignore infinite type recursion.
        flattenStringValues(v),
  ) as DeepStringsOf<T>[]
}
