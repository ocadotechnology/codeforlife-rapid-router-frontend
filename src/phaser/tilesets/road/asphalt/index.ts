import { flattenNumberValues } from "codeforlife/utils/object"

import * as road from "../road"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Road.Asphalt
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <
  GID extends ID,
  F extends boolean,
  B extends boolean,
  L extends boolean,
  R extends boolean,
>(
  kwArgs: road.MakeKwArgs<GID, F, B, L, R>,
) => road.make(import.meta.url, kwArgs)

export const crossroads = make({
  image: "./crossroads.svg",
  firstgid: _IDs.CROSSROADS,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const deadEnd = make({
  image: "./dead_end.svg",
  firstgid: _IDs.DEAD_END,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const straight = make({
  image: "./straight.svg",
  firstgid: _IDs.STRAIGHT,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const tJunction = make({
  image: "./t_junction.svg",
  firstgid: _IDs.T_JUNCTION,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const turn = make({
  image: "./turn.svg",
  firstgid: _IDs.TURN,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: false,
    canTurnLeft: true,
    canTurnRight: true,
  },
})
