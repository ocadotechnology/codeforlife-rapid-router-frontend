import type {
  TiledLayerObjectgroup as _ObjectGroupLayer,
  TiledLayerTilelayer as _TileLayer,
} from "tiled-types"

import { COLS, ROWS } from "./constants"
import { type MakeObjectOptions, makeObject } from "./objects"
import { type TileSetID } from "./tileSets"

// TODO: remove
import type { Tuple } from "./utils"

export const tileLayerNames = ["Background", "Road", "Environment"] as const
export type TileLayerName = (typeof tileLayerNames)[number]
export type TileLayer = Omit<_TileLayer, "name"> & {
  name: TileLayerName
}

export const objectGroupLayerNames = ["Scenery"] as const
export type ObjectGroupLayerName = (typeof objectGroupLayerNames)[number]
export type ObjectGroupLayer = Omit<_ObjectGroupLayer, "name"> & {
  name: ObjectGroupLayerName
}

export type LayerName = TileLayerName | ObjectGroupLayerName

export type MakeLayerOptions<N extends LayerName, T extends string> = {
  name: N
  type: T
  x?: number
  y?: number
  width?: number
  height?: number
  opacity?: number
  visible?: boolean
}

export const makeLayer = <N extends LayerName, T extends string>({
  x = 0,
  y = 0,
  width = COLS,
  height = ROWS,
  opacity = 1,
  visible = true,
  ...layer
}: MakeLayerOptions<N, T>) => ({
  x,
  y,
  width,
  height,
  opacity,
  visible,
  ...layer,
})

export type MakeTileLayerOptions<
  N extends TileLayerName,
  ID extends TileSetID = TileSetID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<MakeLayerOptions<N, "tilelayer">, "type"> &
  Omit<TileLayer, keyof MakeLayerOptions<N, "tilelayer"> | "data"> & {
    data: (ID[] & { length: COLS })[] & { length: ROWS }
  }

export const makeTileLayer = <
  N extends TileLayerName,
  ID extends TileSetID = TileSetID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  name,
  data,
}: MakeTileLayerOptions<N, ID, COLS, ROWS>): TileLayer => ({
  ...makeLayer({ name, type: "tilelayer" }),
  data: data.flat(),
})

type MakeObjectGroupLayerPartials = "draworder"
export type MakeObjectGroupLayerOptions<N extends ObjectGroupLayerName> = Omit<
  MakeLayerOptions<N, "objectgroup">,
  "type"
> &
  Omit<
    ObjectGroupLayer,
    | keyof MakeLayerOptions<N, "objectgroup">
    | MakeObjectGroupLayerPartials
    | "objects"
  > &
  Partial<Pick<ObjectGroupLayer, MakeObjectGroupLayerPartials>> & {
    objects: Omit<MakeObjectOptions, "id">[]
  }

export const makeObjectGroupLayer = <N extends ObjectGroupLayerName>({
  name,
  draworder = "topdown",
  objects,
}: MakeObjectGroupLayerOptions<N>): ObjectGroupLayer => ({
  ...makeLayer({ name, type: "objectgroup" }),
  draworder,
  objects: objects.map((obj, index) => makeObject({ ...obj, id: index + 1 })),
})

// Define the structure of the tilemap data for our game, including the tilesets
// and layers. This structure will be used to create the tilemap in Phaser and
// ensure that all necessary information is provided in a type-safe manner.
export type TileLayerRow<
  ID extends TileSetID = TileSetID,
  COLS extends number = typeof COLS,
> = Tuple<ID, COLS>
export type ManyTileLayerRows<
  ID extends TileSetID = TileSetID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Tuple<Tuple<ID, COLS>, ROWS>

export type FillTileLayerRowOptions<
  ID extends TileSetID = 0,
  COLS extends number = typeof COLS,
> = Partial<{ id: ID; cols: COLS }>

/**
 * Creates a single row of tile data filled with the specified tile ID. This is
 * useful for quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `TileSetIDs.EMPTY` if
 *  not provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @returns A row of tile data with the specified tile ID.
 */
export function fillTileLayerRow<
  ID extends TileSetID = 0,
  COLS extends number = typeof COLS,
>(options: FillTileLayerRowOptions<ID, COLS> = {}) {
  const { id = 0 as ID, cols = COLS as COLS } = options
  return Array(cols).fill(id) as TileLayerRow<ID, COLS>
}

export type FillManyTileLayerRowsOptions<
  ID extends TileSetID = 0,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = FillTileLayerRowOptions<ID, COLS> & Partial<{ rows: ROWS }>

/**
 * Creates a tilemap filled with the specified tile ID. This is useful for
 * quickly generating uniform layers in the tilemap.
 *
 * @param id The tile ID to fill the row with. Defaults to `TileSetIDs.EMPTY` if
 *  not provided.
 * @param cols The number of columns in the row. Defaults to the width of the
 *  tilemap if not provided.
 * @param rows The number of rows in the tilemap. Defaults to the height of the
 *  tilemap if not provided.
 * @returns A tilemap with all rows filled with the specified tile ID.
 */
export function fillManyTileLayerRows<
  ID extends TileSetID = 0,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>(options: FillManyTileLayerRowsOptions<ID, COLS, ROWS> = {}) {
  const { rows = ROWS as ROWS, ...fillRowOptions } = options
  return Array(rows).fill(
    fillTileLayerRow(fillRowOptions),
  ) as ManyTileLayerRows<ID, COLS, ROWS>
}
