import { flattenStringValues } from "codeforlife/utils/object"

import * as endpoints from "./endpoints"
import * as objects from "../objects"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Endpoints.House
const _Names = objects.Names.Endpoints.House
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const makeBaseRotations = <
  N extends Name,
  GID extends tilesets.endpoints.house.ID,
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

export const common = {
  blue: makeBaseRotations(
    { gid: _IDs.Common.BLUE, name: _Names.Common.BLUE },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
  orange: makeBaseRotations(
    { gid: _IDs.Common.ORANGE, name: _Names.Common.ORANGE },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
  straw: makeBaseRotations(
    { gid: _IDs.Common.STRAW, name: _Names.Common.STRAW },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
  wood: makeBaseRotations(
    { gid: _IDs.Common.WOOD, name: _Names.Common.WOOD },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
} as const

export const snow = {
  blue: makeBaseRotations(
    { gid: _IDs.Snow.BLUE, name: _Names.Snow.BLUE },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
  orange: makeBaseRotations(
    { gid: _IDs.Snow.ORANGE, name: _Names.Snow.ORANGE },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
  straw: makeBaseRotations(
    { gid: _IDs.Snow.STRAW, name: _Names.Snow.STRAW },
    {
      0: "LEFT",
      45: "TOP_LEFT",
      90: "TOP",
      135: "TOP_RIGHT",
      180: "RIGHT",
      225: "BOTTOM_RIGHT",
      270: "BOTTOM",
      315: "BOTTOM_LEFT",
    },
  ),
} as const
