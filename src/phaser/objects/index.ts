import type { TiledObject as Object } from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../constants"

type MakeObjectPartials =
  | "name"
  | "visible"
  | "width"
  | "height"
  | "rotation"
  | "properties"
export type MakeObjectOptions = Omit<Object, MakeObjectPartials> &
  Partial<Pick<Object, MakeObjectPartials>>

export const makeObject = ({
  name,
  type,
  visible = true,
  width = TILE_WIDTH,
  height = TILE_HEIGHT,
  rotation = 0,
  properties = [],
  ...obj
}: MakeObjectOptions): Object => ({
  type,
  name: name ?? type, // Use the provided name or fallback to the type.
  visible,
  width,
  height,
  rotation,
  properties,
  ...obj,
})
