import type { TiledProperty as Property } from "tiled-types"

import * as objects from "../objects"
import type * as tilesets from "../../tilesets"
import { flattenStringValues } from "../../utils"

export const TYPE = objects.Types.SCENERY
export const Names = flattenStringValues(objects.Names.Scenery)
export type Name = (typeof Names)[number]

export type MakeBaseKwArgs<
  N extends Name,
  GID extends tilesets.scenery.ID,
> = Omit<
  objects.MakeBaseKwArgs<typeof TYPE, N, Property[], GID>,
  "type" | "gid"
> & { gid: GID }

export const makeBase = <N extends Name, GID extends tilesets.scenery.ID>(
  kwArgs: MakeBaseKwArgs<N, GID>,
) =>
  objects.makeBase({
    type: TYPE,
    properties: [],
    ...kwArgs,
  }) as Omit<objects.ObjectBase<typeof TYPE, N, Property[], GID>, "gid"> & {
    gid: GID
  }
