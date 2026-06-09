import { type MakeTileSetOptions, type SceneryTileSetID, makeTileSet } from ".."
import type { CommonSceneryTileSet } from "./common"
import type { SnowSceneryTileSet } from "./snow"

export type MakeSceneryTileSetOptions<GID extends SceneryTileSetID> =
  MakeTileSetOptions<GID>

export const makeSceneryTileSet = <GID extends SceneryTileSetID>(
  options: MakeSceneryTileSetOptions<GID>,
) => makeTileSet(options)

export type SceneryTileSet = CommonSceneryTileSet | SnowSceneryTileSet
