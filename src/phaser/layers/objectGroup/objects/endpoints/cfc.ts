import { flattenStringValues } from "codeforlife/utils/object"

import * as endpoints from "./endpoints"
import * as objects from "../objects"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Endpoints.CFC
const _Names = objects.Names.Endpoints.CFC
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.endpoints.cfc.ID>(
  kwArgs: endpoints.FactoryKwArgs<N, GID>,
  variants: objects.StraightRotationVariants,
) =>
  endpoints.factory(kwArgs, { offset: { x: -0.1, y: -0.03125 }, ...variants })

export const barn = {
  black: factory(
    { gid: _IDs.Barn.BLACK, name: _Names.Barn.BLACK },
    {
      top: { rotation: 0 },
      right: { rotation: 90 },
      bottom: { rotation: 180 },
      left: { rotation: 270 },
    },
  ),
  red: factory(
    { gid: _IDs.Barn.RED, name: _Names.Barn.RED },
    {
      top: { rotation: 0 },
      right: { rotation: 90 },
      bottom: { rotation: 180 },
      left: { rotation: 270 },
    },
  ),
} as const

export const warehouse = {
  default: factory(
    { gid: _IDs.Warehouse.DEFAULT, name: _Names.Warehouse.DEFAULT },
    {
      top: { rotation: 0 },
      right: { rotation: 90 },
      bottom: { rotation: 180 },
      left: { rotation: 270 },
    },
  ),
  snow: factory(
    { gid: _IDs.Warehouse.SNOW, name: _Names.Warehouse.SNOW },
    {
      top: { rotation: 0 },
      right: { rotation: 90 },
      bottom: { rotation: 180 },
      left: { rotation: 270 },
    },
  ),
} as const
