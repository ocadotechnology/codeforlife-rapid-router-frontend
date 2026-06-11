import type { TiledLayerTilelayer as _Layer } from "tiled-types"

import * as layers from "./layers"
import * as tilesets from "../tilesets"
import { COLS, ROWS } from "../globals"
import type { Tuple } from "../utils"

export const Names = Object.values(layers.Names.Tile)
export type Name = (typeof Names)[number]
export type Layer = Omit<_Layer, "name"> & { name: Name }

export type MakeKwArgs<
  N extends Name,
  ID extends tilesets.ID = tilesets.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<layers.MakeKwArgs<N, "tilelayer">, "type"> &
  Omit<Layer, keyof layers.MakeKwArgs<N, "tilelayer"> | "data"> & {
    data: (ID[] & { length: COLS })[] & { length: ROWS }
  }

export const make = <
  N extends Name,
  ID extends tilesets.ID = tilesets.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  name,
  data,
}: MakeKwArgs<N, ID, COLS, ROWS>): Layer => ({
  ...layers.make({ name, type: "tilelayer" }),
  data: data.flat(),
})

// Define the structure of the tilemap data for our game, including the tilesets
// and layers. This structure will be used to create the tilemap in Phaser and
// ensure that all necessary information is provided in a type-safe manner.
export type Row<
  ID extends tilesets.ID = tilesets.ID,
  COLS extends number = typeof COLS,
> = Tuple<ID, COLS>
export type ManyRows<
  ID extends tilesets.ID = tilesets.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Tuple<Tuple<ID, COLS>, ROWS>

export type FillRowOptions<
  ID extends tilesets.ID = typeof tilesets.IDs.EMPTY,
  COLS extends number = typeof COLS,
> = Partial<{ id: ID; cols: COLS }>

/**
 * Creates a single row of tile data filled with the specified tile ID. This is
 * useful for quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `IDs.EMPTY` if not
 *  provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @returns A row of tile data with the specified tile ID.
 */
export function fillRow<
  ID extends tilesets.ID = typeof tilesets.IDs.EMPTY,
  COLS extends number = typeof COLS,
>(options: FillRowOptions<ID, COLS> = {}) {
  const { id = tilesets.IDs.EMPTY as ID, cols = COLS as COLS } = options
  return Array(cols).fill(id) as Row<ID, COLS>
}

export type FillManyRowsOptions<
  ID extends tilesets.ID = typeof tilesets.IDs.EMPTY,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = FillRowOptions<ID, COLS> & Partial<{ rows: ROWS }>

/**
 * Creates a tilemap filled with the specified tile ID. This is useful for
 * quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `IDs.EMPTY` if not
 *  provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @param rows The number of rows in the tilemap. Defaults to the height of the
 *  tilemap if not provided.
 * @returns A tilemap with all rows filled with the specified tile ID.
 */
export function fillManyRows<
  ID extends tilesets.ID = typeof tilesets.IDs.EMPTY,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>(options: FillManyRowsOptions<ID, COLS, ROWS> = {}) {
  const { rows = ROWS as ROWS, ...fillRowOptions } = options
  return Array(rows).fill(fillRow(fillRowOptions)) as ManyRows<ID, COLS, ROWS>
}
