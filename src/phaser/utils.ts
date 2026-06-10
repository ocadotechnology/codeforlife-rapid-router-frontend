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

type PathSpecToResult<T, ID extends number> = T extends string
  ? Record<T, ID>
  : { [K in keyof T]: PathSpecToResult<T[K], ID> }

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never

export type SetIDs<T extends Record<number, PathSpec>> = UnionToIntersection<
  {
    [K in keyof T]: K extends number ? PathSpecToResult<T[K], K> : never
  }[keyof T]
>

/**
 * Converts a mapping of numeric IDs to path specifications into a nested object
 * structure where each path specification is replaced with the corresponding
 * numeric ID. This allows us to define our tilesets in a way that is easy to
 * read and maintain, while still providing a convenient way to reference tile
 * IDs in our code.
 *
 * @param specs A mapping of numeric IDs to path specifications, where each path
 *  specification can be a string or a nested object of strings.
 * @returns A nested object structure where each path specification is replaced
 *  with the corresponding numeric ID.
 */
export function setIDs<T extends Record<number, PathSpec>>(
  specs: T,
): SetIDs<T> {
  const result: Record<string, unknown> = {}

  function setAtPath(
    target: Record<string, unknown>,
    pathSpec: PathSpec,
    id: number,
  ): void {
    if (typeof pathSpec === "string") {
      target[pathSpec] = id
    } else {
      for (const [key, nested] of Object.entries(pathSpec)) {
        if (!(key in target)) target[key] = {}
        setAtPath(target[key] as Record<string, unknown>, nested, id)
      }
    }
  }

  for (const [idStr, pathSpec] of Object.entries(specs)) {
    setAtPath(result, pathSpec, Number(idStr))
  }

  return result as SetIDs<T>
}

export function flattenIDs<T extends object>(obj: T): DeepNumbersOf<T>[] {
  return Object.values(obj).flatMap(v =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof v === "number"
      ? [v]
      : // @ts-expect-error Ignore infinite type recursion.
        flattenIDs(v),
  ) as DeepNumbersOf<T>[]
}
