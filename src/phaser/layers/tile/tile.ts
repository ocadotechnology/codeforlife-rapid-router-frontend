import type { TiledLayerTilelayer as _Layer } from "tiled-types"

import type * as data from "./data"
import * as layers from "../layers"
import type { COLS, ROWS } from "../../globals"

export const Names = Object.values(layers.Names.Tile)
export type Name = (typeof Names)[number]
export type Layer = Omit<_Layer, "name"> & { name: Name }

export type MakeKwArgs<
  N extends Name,
  ID extends data.ID = data.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<layers.MakeKwArgs<N, "tilelayer">, "type"> &
  Omit<Layer, keyof layers.MakeKwArgs<N, "tilelayer"> | "data"> & {
    data: (ID[] & { length: COLS })[] & { length: ROWS }
  }

export const make = <
  N extends Name,
  ID extends data.ID = data.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  name,
  data,
}: MakeKwArgs<N, ID, COLS, ROWS>): Layer => ({
  ...layers.make({ name, type: "tilelayer" }),
  data: data.flat(),
})
