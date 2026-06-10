import {
  type MakeTileSetOptions,
  TileSetIDs,
  flattenIDs,
  makeTileSet,
} from ".."
import type { CommonSceneryTileSet } from "./common"
import type { SnowSceneryTileSet } from "./snow"

export const SceneryTileSetIDs = flattenIDs(TileSetIDs.Scenery)
export type SceneryTileSetID = (typeof SceneryTileSetIDs)[number]

export type SceneryTileSet = CommonSceneryTileSet | SnowSceneryTileSet

export type MakeSceneryTileSetOptions<GID extends SceneryTileSetID> =
  MakeTileSetOptions<GID>

export const makeSceneryTileSet = <GID extends SceneryTileSetID>(
  importMetaUrl: string,
  options: MakeSceneryTileSetOptions<GID>,
) => makeTileSet(importMetaUrl, options)
