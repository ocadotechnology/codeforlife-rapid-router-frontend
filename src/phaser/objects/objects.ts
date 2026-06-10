import type {
  TiledProperty as Property,
  TiledObject as _Object,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../constants"

export type ObjectBase<
  T extends string,
  N extends string,
  P extends Property[],
  GID extends number | undefined = undefined,
> = { type: T; name: N; properties: P; gid?: GID }
export type Object<
  T extends string,
  N extends string,
  P extends Property[],
  GID extends number | undefined = undefined,
> = Omit<_Object, "type" | "name" | "properties" | "gid"> &
  ObjectBase<T, N, P, GID>

type MakeBasePartials = "properties"
export type MakeBaseKwArgs<
  T extends string,
  N extends string,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
> = Omit<ObjectBase<T, N, P, GID>, MakeBasePartials> &
  Partial<Pick<ObjectBase<T, N, P, GID>, MakeBasePartials>>

export const makeBase = <
  T extends string,
  N extends string,
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
  T extends string,
  N extends string,
  P extends Property[] = Property[],
  GID extends number | undefined = undefined,
> = Omit<Object<T, N, P, GID>, MakePartials> &
  Partial<Pick<Object<T, N, P, GID>, MakePartials>>

export const make = <
  T extends string,
  N extends string,
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
