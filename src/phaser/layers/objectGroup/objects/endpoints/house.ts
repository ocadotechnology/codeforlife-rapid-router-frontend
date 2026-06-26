import { flattenStringValues } from "codeforlife/utils/object"

import * as endpoints from "./endpoints"
import * as objects from "../objects"
import * as tilesets from "../../../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../../globals"

const _IDs = tilesets.IDs.Endpoints.House
const _Names = objects.Names.Endpoints.House
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

export type DiagonalRotationVariants = {
  inTopLeft: objects.DiagonalRotationVariant
  inTopRight: objects.DiagonalRotationVariant
  inBottomRight: objects.DiagonalRotationVariant
  inBottomLeft: objects.DiagonalRotationVariant
  outTopLeft: objects.DiagonalRotationVariant
  outTopRight: objects.DiagonalRotationVariant
  outBottomRight: objects.DiagonalRotationVariant
  outBottomLeft: objects.DiagonalRotationVariant
}

const factory = <N extends Name, GID extends tilesets.endpoints.house.ID>(
  kwArgs: Omit<endpoints.FactoryKwArgs<N, GID>, "width" | "height">,
  {
    left,
    top,
    right,
    bottom,
    ...diagonal
  }: objects.BaseStraightRotationVariants &
    objects.BaseDiagonalRotationVariants,
) => {
  // The inside of a turn is further from the tile's center; bigger offset.
  const inside = objects.makeDiagonalRotationVariants({
    tileOffset: { col: 0.65, row: 1 },
    ...diagonal,
  })
  // The outside of a turn is closer to the tile's center; smaller offset.
  const outside = objects.makeDiagonalRotationVariants({
    tileOffset: { col: 0.35, row: 0.7 },
    ...diagonal,
  })
  const diagonalRotationVariants: DiagonalRotationVariants = {
    inTopLeft: inside.topLeft,
    inTopRight: inside.topRight,
    inBottomRight: inside.bottomRight,
    inBottomLeft: inside.bottomLeft,
    outTopLeft: outside.topLeft,
    outTopRight: outside.topRight,
    outBottomRight: outside.bottomRight,
    outBottomLeft: outside.bottomLeft,
  }

  return endpoints.factory(
    { width: TILE_WIDTH * 0.5, height: TILE_HEIGHT * 0.5, ...kwArgs },
    {
      tileOffset: { col: 0.275, row: 0.275 },
      left,
      top,
      right,
      bottom,
      ...diagonalRotationVariants,
    },
  )
}

export const common = {
  blue: factory(
    { gid: _IDs.Common.BLUE, name: _Names.Common.BLUE },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
  orange: factory(
    { gid: _IDs.Common.ORANGE, name: _Names.Common.ORANGE },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
  straw: factory(
    { gid: _IDs.Common.STRAW, name: _Names.Common.STRAW },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
  wood: factory(
    { gid: _IDs.Common.WOOD, name: _Names.Common.WOOD },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
} as const

export const snow = {
  blue: factory(
    { gid: _IDs.Snow.BLUE, name: _Names.Snow.BLUE },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
  orange: factory(
    { gid: _IDs.Snow.ORANGE, name: _Names.Snow.ORANGE },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
  straw: factory(
    { gid: _IDs.Snow.STRAW, name: _Names.Snow.STRAW },
    {
      left: { rotation: 0 },
      topLeft: { rotation: 45 },
      top: { rotation: 90 },
      topRight: { rotation: 135 },
      right: { rotation: 180 },
      bottomRight: { rotation: 225 },
      bottom: { rotation: 270 },
      bottomLeft: { rotation: 315 },
    },
  ),
} as const
