import {
  type MakeTileSetOptions,
  TileSetIDs,
  flattenIDs,
  makeTileSet,
} from ".."
import type { CityEnvironmentTileSet } from "./city"
import type { CommonEnvironmentTileSet } from "./common"
import type { FarmEnvironmentTileSet } from "./farm"
import type { GrassEnvironmentTileSet } from "./grass"
import type { SnowEnvironmentTileSet } from "./snow"

export const EnvironmentTileSetIDs = [
  TileSetIDs.EMPTY, // Environment tiles can be empty.
  ...flattenIDs(TileSetIDs.Environment),
]
export type EnvironmentTileSetID = (typeof EnvironmentTileSetIDs)[number]

export type EnvironmentTileSet =
  | CityEnvironmentTileSet
  | CommonEnvironmentTileSet
  | FarmEnvironmentTileSet
  | GrassEnvironmentTileSet
  | SnowEnvironmentTileSet

type EnvironmentTileSetProperties<T extends boolean> = [
  { name: "canDriveThrough"; value: T; type: "bool" },
]

export type MakeEnvironmentTileSetOptions<
  GID extends EnvironmentTileSetID,
  T extends boolean = false,
> = Omit<
  MakeTileSetOptions<GID, EnvironmentTileSetProperties<T>>,
  "properties"
> & {
  properties?: { canDriveThrough?: T }
}

export const makeEnvironmentTileSet = <
  GID extends EnvironmentTileSetID,
  T extends boolean = false,
>(
  importMetaUrl: string,
  { properties = {}, ...options }: MakeEnvironmentTileSetOptions<GID, T>,
) =>
  makeTileSet(importMetaUrl, {
    properties: [
      {
        name: "canDriveThrough",
        value: properties.canDriveThrough ?? (false as T),
        type: "bool",
      },
    ] as EnvironmentTileSetProperties<T>,
    ...options,
  })
