import type { TiledProperty as Property } from "tiled-types"

import type * as common from "./common"
import * as objects from "../objects"
import type * as snow from "./snow"
import type * as tilesets from "../../tilesets"

export const TYPE = objects.Types.SCENERY
export type Name = common.Name | snow.Name

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
