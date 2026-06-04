import {
  COLS,
  ROWS,
  type TileLayerManyRows,
  type TileLayerRow,
} from "../tilemaps"
import type { Tileset } from "../enums"

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

export type FillRowOptions<
  ID extends Tileset = 0,
  COLS extends number = typeof COLS,
> = Partial<{ id: ID; cols: COLS }>

/**
 * Creates a single row of tile data filled with the specified tile ID. This is
 * useful for quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `Tilesets.EMPTY` if
 *  not provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @returns A row of tile data with the specified tile ID.
 */
export function fillRow<
  ID extends Tileset = 0,
  COLS extends number = typeof COLS,
>(options: FillRowOptions<ID, COLS> = {}) {
  const { id = 0 as ID, cols = COLS as COLS } = options
  return Array(cols).fill(id) as TileLayerRow<ID, COLS>
}

export type FillManyRowsOptions<
  ID extends Tileset = 0,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = FillRowOptions<ID, COLS> & Partial<{ rows: ROWS }>

/**
 * Creates a tilemap filled with the specified tile ID. This is useful for
 * quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the tilemap with. Defaults to `Tilesets.EMPTY`
 *  if not provided.
 * @returns A tilemap with all rows filled with the specified tile ID.
 */
export function fillManyRows<
  ID extends Tileset = 0,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>(options: FillManyRowsOptions<ID, COLS, ROWS> = {}) {
  const { rows = ROWS as ROWS, ...fillRowOptions } = options
  return Array(rows).fill(fillRow(fillRowOptions)) as TileLayerManyRows<
    ID,
    COLS,
    ROWS
  >
}

/** Rotate a tile by 90° clockwise. */
export function rotateRight<T extends Tileset>(id: T): T {
  return (id | 0x80000000 | 0x20000000) as T
}

/** Rotate a tile by 180°. */
export function rotateDown<T extends Tileset>(id: T): T {
  return (id | 0x80000000 | 0x40000000) as T
}

/** Rotate a tile by 90° counterclockwise. */
export function rotateLeft<T extends Tileset>(id: T): T {
  return (id | 0x40000000 | 0x20000000) as T
}
