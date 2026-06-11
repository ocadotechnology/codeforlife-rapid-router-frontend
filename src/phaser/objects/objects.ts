import type {
  TiledProperty as Property,
  TiledObject as _Object,
} from "tiled-types"

import { type DeepStringsOf, setAtPath } from "../utils"
import { TILE_HEIGHT, TILE_WIDTH } from "../constants"

// Global registry of object names.
export const Names = setAtPath({
  "scenery.snow.bush": { Scenery: { Snow: "BUSH" } },
  "scenery.snow.pond": { Scenery: { Snow: "POND" } },
  "scenery.snow.tree1": { Scenery: { Snow: "TREE1" } },
  "scenery.snow.tree2": { Scenery: { Snow: "TREE2" } },
  "scenery.common.bush": { Scenery: { Common: "BUSH" } },
  "scenery.common.hay": { Scenery: { Common: "HAY" } },
  "scenery.common.pond": { Scenery: { Common: "POND" } },
  "scenery.common.tree1": { Scenery: { Common: "TREE1" } },
  "scenery.common.tree2": { Scenery: { Common: "TREE2" } },
} as const)
export type Name = DeepStringsOf<typeof Names>

// Global registry of object types.
export const Types = {
  SCENERY: "scenery",
} as const
export type Type = (typeof Types)[keyof typeof Types]

export type ObjectBase<
  T extends Type,
  N extends Name,
  P extends Property[],
  GID extends number | undefined = undefined,
> = { type: T; name: N; properties: P; gid?: GID }
export type Object<
  T extends Type,
  N extends Name,
  P extends Property[],
  GID extends number | undefined = undefined,
> = Omit<_Object, "type" | "name" | "properties" | "gid"> &
  ObjectBase<T, N, P, GID>

type MakeBasePartials = "properties"
export type MakeBaseKwArgs<
  T extends Type,
  N extends Name,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
> = Omit<ObjectBase<T, N, P, GID>, MakeBasePartials> &
  Partial<Pick<ObjectBase<T, N, P, GID>, MakeBasePartials>>

export const makeBase = <
  T extends Type,
  N extends Name,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
>({
  properties = [] as unknown as P,
  ...options
}: MakeBaseKwArgs<T, N, P, GID>): ObjectBase<T, N, P, GID> => ({
  properties,
  ...options,
})

type MakePartials = "visible" | "width" | "height" | "rotation"
export type MakeKwArgs<
  T extends Type,
  N extends Name,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
> = Omit<Object<T, N, P, GID>, MakePartials> &
  Partial<Pick<Object<T, N, P, GID>, MakePartials>>

export const make = <
  T extends Type,
  N extends Name,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
>({
  visible = true,
  width = TILE_WIDTH,
  height = TILE_HEIGHT,
  rotation = 0,
  ...obj
}: MakeKwArgs<T, N, P, GID>): Object<T, N, P, GID> => ({
  visible,
  width,
  height,
  rotation,
  ...obj,
})
