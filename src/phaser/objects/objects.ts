import { type DeepStringsOf, createPathStrings } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledObject as _Object,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

// Global registry of object names.
export const Names = createPathStrings({
  Scenery: {
    Snow: ["BUSH", "POND", "TREE1", "TREE2"],
    Common: ["BUSH", "HAY", "POND", "TREE1", "TREE2"],
  },
} as const)
export type Name = DeepStringsOf<typeof Names>

// Global registry of object types.
export const Types = createPathStrings(["SCENERY"] as const)
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
