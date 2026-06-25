import { flattenStringValues } from "codeforlife/utils/object"

import * as endpoints from "./endpoints"
import * as objects from "../objects"
import * as tilesets from "../../../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../../globals"

const _IDs = tilesets.IDs.Endpoints.House
const _Names = objects.Names.Endpoints.House
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.endpoints.house.ID>(
  kwArgs: Omit<endpoints.FactoryKwArgs<N, GID>, "width" | "height">,
  variants: endpoints.FactoryVariants & {
    topLeft: endpoints.FactoryVariant
    topRight: endpoints.FactoryVariant
    bottomRight: endpoints.FactoryVariant
    bottomLeft: endpoints.FactoryVariant
  },
) => {
  const straightOffset = { x: 0.25, y: 0.25 }
  const diagonalOffset = { x: 0.35, y: 0.7 }

  return endpoints.factory(
    { width: TILE_WIDTH * 0.5, height: TILE_HEIGHT * 0.5, ...kwArgs },
    {
      // Straight offsets.
      top: {
        x: TILE_WIDTH * straightOffset.y,
        y: TILE_HEIGHT * (1 - straightOffset.x),
        ...variants.top,
      },
      bottom: {
        x: TILE_WIDTH * (1 - straightOffset.y),
        y: TILE_HEIGHT * straightOffset.x,
        ...variants.bottom,
      },
      left: {
        x: TILE_WIDTH * (1 - straightOffset.x),
        y: TILE_HEIGHT * (1 - straightOffset.y),
        ...variants.left,
      },
      right: {
        x: TILE_WIDTH * straightOffset.x,
        y: TILE_HEIGHT * straightOffset.y,
        ...variants.right,
      },
      // Diagonal offsets.
      topLeft: {
        x: TILE_WIDTH * diagonalOffset.x,
        y: TILE_HEIGHT * diagonalOffset.y,
        ...variants.topLeft,
      },
      bottomRight: {
        x: TILE_WIDTH * (1 - diagonalOffset.x),
        y: TILE_HEIGHT * (1 - diagonalOffset.y),
        ...variants.bottomRight,
      },
      bottomLeft: {
        x: TILE_WIDTH * diagonalOffset.y,
        y: TILE_HEIGHT * (1 - diagonalOffset.x),
        ...variants.bottomLeft,
      },
      topRight: {
        x: TILE_WIDTH * (1 - diagonalOffset.y),
        y: TILE_HEIGHT * diagonalOffset.x,
        ...variants.topRight,
      },
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
