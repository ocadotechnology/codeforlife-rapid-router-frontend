import { flattenStringValues } from "codeforlife/utils/object"

import * as endpoints from "./endpoints"
import * as objects from "../objects"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Endpoints.CFC
const _Names = objects.Names.Endpoints.CFC
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const makeBaseRotations = <
  N extends Name,
  GID extends tilesets.endpoints.cfc.ID,
  R0 extends string,
  R45 extends string,
  R90 extends string,
  R135 extends string,
  R180 extends string,
  R225 extends string,
  R270 extends string,
  R315 extends string,
>(
  kwArgs: endpoints.MakeBaseKwArgs<N, GID>,
  rotations: {
    0: R0
    45: R45
    90: R90
    135: R135
    180: R180
    225: R225
    270: R270
    315: R315
  },
) => endpoints.makeBaseRotations(kwArgs, rotations)

export const barn = {
  black: makeBaseRotations(
    { gid: _IDs.Barn.BLACK, name: _Names.Barn.BLACK },
    {
      0: "TOP",
      45: "TOP_RIGHT",
      90: "RIGHT",
      135: "BOTTOM_RIGHT",
      180: "BOTTOM",
      225: "BOTTOM_LEFT",
      270: "LEFT",
      315: "TOP_LEFT",
    },
  ),
  red: makeBaseRotations(
    { gid: _IDs.Barn.RED, name: _Names.Barn.RED },
    {
      0: "TOP",
      45: "TOP_RIGHT",
      90: "RIGHT",
      135: "BOTTOM_RIGHT",
      180: "BOTTOM",
      225: "BOTTOM_LEFT",
      270: "LEFT",
      315: "TOP_LEFT",
    },
  ),
} as const

export const warehouse = {
  default: makeBaseRotations(
    { gid: _IDs.Warehouse.DEFAULT, name: _Names.Warehouse.DEFAULT },
    {
      0: "TOP",
      45: "TOP_RIGHT",
      90: "RIGHT",
      135: "BOTTOM_RIGHT",
      180: "BOTTOM",
      225: "BOTTOM_LEFT",
      270: "LEFT",
      315: "TOP_LEFT",
    },
  ),
  snow: makeBaseRotations(
    { gid: _IDs.Warehouse.SNOW, name: _Names.Warehouse.SNOW },
    {
      0: "TOP",
      45: "TOP_RIGHT",
      90: "RIGHT",
      135: "BOTTOM_RIGHT",
      180: "BOTTOM",
      225: "BOTTOM_LEFT",
      270: "LEFT",
      315: "TOP_LEFT",
    },
  ),
} as const
