import type { TiledProperty as Property } from "tiled-types"

import { type MakeObjectBaseOptions, type ObjectBase, makeObjectBase } from ".."
import type { CommonSceneryObjectBase } from "./common"
import type { SceneryTileSetID } from "../../tileSets/scenery"
import type { SnowSceneryObjectBase } from "./snow"

export type SceneryObjectBase = CommonSceneryObjectBase | SnowSceneryObjectBase

export const SCENERY_OBJECT_TYPE = "scenery"

export type MakeSceneryObjectBaseOptions<
  N extends string,
  GID extends SceneryTileSetID,
> = Omit<
  MakeObjectBaseOptions<typeof SCENERY_OBJECT_TYPE, N, Property[], GID>,
  "type" | "gid"
> & { gid: GID }

export const makeSceneryObjectBase = <
  N extends string,
  GID extends SceneryTileSetID,
>(
  options: MakeSceneryObjectBaseOptions<N, GID>,
) =>
  makeObjectBase({
    type: SCENERY_OBJECT_TYPE,
    properties: [],
    ...options,
  }) as Omit<
    ObjectBase<typeof SCENERY_OBJECT_TYPE, N, Property[], GID>,
    "gid"
  > & { gid: GID }
