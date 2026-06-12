import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"

export const IDs = flattenNumberValues(tilesets.IDs.Road)
export type ID = (typeof IDs)[number]

type Properties<
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

export type MakeKwArgs<
  GID extends ID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
> = Omit<tilesets.MakeKwArgs<GID, Properties<F, B, L, R>>, "properties"> & {
  properties: {
    canDriveForwards: F
    canDriveBackwards: B
    canTurnLeft: L
    canTurnRight: R
  }
}

export const make = <
  GID extends ID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
>(
  importMetaUrl: string,
  {
    properties: {
      canDriveForwards,
      canDriveBackwards,
      canTurnLeft,
      canTurnRight,
    },
    ...kwArgs
  }: MakeKwArgs<GID, F, B, L, R>,
) =>
  tilesets.make(importMetaUrl, {
    properties: [
      { name: "canDriveForwards", value: canDriveForwards, type: "bool" },
      { name: "canDriveBackwards", value: canDriveBackwards, type: "bool" },
      { name: "canTurnLeft", value: canTurnLeft, type: "bool" },
      { name: "canTurnRight", value: canTurnRight, type: "bool" },
    ] as Properties<F, B, L, R>,
    ...kwArgs,
  })
