import {
  type EnvironmentTileSetID,
  type MakeTileSetOptions,
  makeTileSet,
} from ".."
import type { CityEnvironmentTileSet } from "./city"
import type { CommonEnvironmentTileSet } from "./common"
import type { FarmEnvironmentTileSet } from "./farm"
import type { GrassEnvironmentTileSet } from "./grass"
import type { SnowEnvironmentTileSet } from "./snow"

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
>({
  properties = {},
  ...options
}: MakeEnvironmentTileSetOptions<GID, T>) =>
  makeTileSet({
    properties: [
      {
        name: "canDriveThrough",
        value: properties.canDriveThrough ?? (false as T),
        type: "bool",
      },
    ] as EnvironmentTileSetProperties<T>,
    ...options,
  })

export type EnvironmentTileSet =
  | CityEnvironmentTileSet
  | CommonEnvironmentTileSet
  | FarmEnvironmentTileSet
  | GrassEnvironmentTileSet
  | SnowEnvironmentTileSet
