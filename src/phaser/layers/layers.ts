import type * as objectGroup from "./objectGroup"
import type * as tile from "./tile"
import { COLS, ROWS } from "../constants"

// Global registry of layer names.
export const Names = {
  Tile: { BACKGROUND: "Background", ROAD: "Road", ENVIRONMENT: "Environment" },
  ObjectGroup: { SCENERY: "Scenery" },
} as const
export type Name = tile.Name | objectGroup.Name

export type MakeKwArgs<N extends Name, T extends string> = {
  name: N
  type: T
  x?: number
  y?: number
  width?: number
  height?: number
  opacity?: number
  visible?: boolean
}

export const make = <N extends Name, T extends string>({
  x = 0,
  y = 0,
  width = COLS,
  height = ROWS,
  opacity = 1,
  visible = true,
  ...layer
}: MakeKwArgs<N, T>) => ({
  x,
  y,
  width,
  height,
  opacity,
  visible,
  ...layer,
})
