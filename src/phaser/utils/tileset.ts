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

const H = 0x80000000
const V = 0x40000000
const D = 0x20000000
const MASK = H | V | D

function extract(id: number): [number, number, number] {
  return [(id >>> 31) & 1, (id >>> 30) & 1, (id >>> 29) & 1]
}

function encode<T extends number>(id: T, h: number, v: number, d: number): T {
  return ((id & ~MASK) | (h * H) | (v * V) | (d * D)) as T
}

export function flipH<T extends Tileset>(id: T): T {
  const [h, v, d] = extract(id)
  return encode(id, h ^ 1, v, d)
}

export function flipV<T extends Tileset>(id: T): T {
  const [h, v, d] = extract(id)
  return encode(id, h, v ^ 1, d)
}

export function rotate<T extends Tileset>(id: T, degrees: 90 | 180 | 270): T {
  const [h, v, d] = extract(id)
  if (degrees === 90) return encode(id, v ^ 1, h, d ^ 1)
  if (degrees === 180) return encode(id, h ^ 1, v ^ 1, d)
  return encode(id, v, h ^ 1, d ^ 1) // 270
}
