import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Endpoints)
export type Name = (typeof Names)[number]

export type MakeBaseKwArgs<
  N extends Name,
  GID extends tilesets.endpoints.ID,
> = objects.MakeBaseKwArgs<N, GID>

export const makeBaseRotations = <
  N extends Name,
  GID extends tilesets.endpoints.ID,
  R0 extends string,
  R45 extends string,
  R90 extends string,
  R135 extends string,
  R180 extends string,
  R225 extends string,
  R270 extends string,
  R315 extends string,
>(
  kwArgs: MakeBaseKwArgs<N, GID>,
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
) => objects.makeRotations(objects.makeBase(kwArgs), rotations)
