import { type DeepStringsOf, createPathStrings } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledObject as _Object,
} from "tiled-types"

import type * as tilesets from "../../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../globals"

export type ID = tilesets.endpoints.ID | tilesets.scenery.ID

// Global registry of object names.
export const Names = createPathStrings({
  Endpoints: {
    CFC: {
      Barn: ["BLACK", "RED"],
      Warehouse: ["DEFAULT", "SNOW"],
    },
    House: {
      Snow: ["BLUE", "ORANGE", "STRAW"],
      Common: ["BLUE", "ORANGE", "STRAW", "WOOD"],
    },
  },
  Scenery: {
    Snow: ["BUSH", "POND", "TREE1", "TREE2"],
    Common: ["BUSH", "HAY", "POND", "TREE1", "TREE2"],
  },
} as const)
export type Name = DeepStringsOf<typeof Names>

export type ObjectBase<N extends Name, GID extends ID> = {
  type: N
  name: N
  gid: GID
  properties: Property[]
}
export type Object<N extends Name, GID extends ID> = ObjectBase<N, GID> &
  Omit<_Object, "type" | "name" | "gid">

type MakeBasePartials = "properties"
export type MakeBaseKwArgs<N extends Name, GID extends ID> = Omit<
  ObjectBase<N, GID>,
  "type" | MakeBasePartials
> &
  Partial<Pick<ObjectBase<N, GID>, MakeBasePartials>>

export const makeBase = <N extends Name, GID extends ID>({
  name,
  properties = [],
  ...obj
}: MakeBaseKwArgs<N, GID>): ObjectBase<N, GID> => ({
  type: name,
  name,
  properties,
  ...obj,
})

export const makeRotations = <
  const O extends Omit<object, "rotation">,
  const R extends Record<number, string>,
>(
  obj: O,
  rotations: R,
) =>
  Object.entries(rotations).reduce(
    (objects, [rotation, name]) => ({
      ...objects,
      [name]: { ...obj, rotation: Number(rotation) },
    }),
    {} as { [K in keyof R as R[K] & PropertyKey]: O & { rotation: K } },
  )

type MakePartials = "visible" | "width" | "height" | "rotation"
export type MakeKwArgs<N extends Name = Name, GID extends ID = ID> = Omit<
  Object<N, GID>,
  MakePartials
> &
  Partial<Pick<Object<N, GID>, MakePartials>>

export const make = <N extends Name, GID extends ID>({
  visible = true,
  width = TILE_WIDTH,
  height = TILE_HEIGHT,
  rotation = 0,
  ...obj
}: MakeKwArgs<N, GID>): Object<N, GID> => ({
  visible,
  width,
  height,
  rotation,
  ...obj,
})
