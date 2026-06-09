import { type MakeTileSetOptions, type RoadTileSetID, makeTileSet } from ".."
import type { AsphaltRoadTileSet } from "./asphalt"
import type { DirtRoadTileSet } from "./dirt"

type RoadTileSetProperties<
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
> = [
  { name: "canDriveForwards"; value: F; type: "bool" },
  { name: "canDriveBackwards"; value: B; type: "bool" },
  { name: "canTurnLeft"; value: L; type: "bool" },
  { name: "canTurnRight"; value: R; type: "bool" },
]

export type MakeRoadTileSetOptions<
  GID extends RoadTileSetID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
> = Omit<
  MakeTileSetOptions<GID, RoadTileSetProperties<F, B, L, R>>,
  "properties"
> & {
  properties: {
    canDriveForwards: F
    canDriveBackwards: B
    canTurnLeft: L
    canTurnRight: R
  }
}

export const makeRoadTileSet = <
  GID extends RoadTileSetID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
>({
  properties: {
    canDriveForwards,
    canDriveBackwards,
    canTurnLeft,
    canTurnRight,
  },
  ...options
}: MakeRoadTileSetOptions<GID, F, B, L, R>) =>
  makeTileSet({
    properties: [
      { name: "canDriveForwards", value: canDriveForwards, type: "bool" },
      { name: "canDriveBackwards", value: canDriveBackwards, type: "bool" },
      { name: "canTurnLeft", value: canTurnLeft, type: "bool" },
      { name: "canTurnRight", value: canTurnRight, type: "bool" },
    ] as RoadTileSetProperties<F, B, L, R>,
    ...options,
  })

export type RoadTileSet = AsphaltRoadTileSet | DirtRoadTileSet
