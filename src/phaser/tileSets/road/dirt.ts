import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeRoadTileSet } from "."

export const crossroads = makeRoadTileSet({
  image: SVGs.Road.Dirt.CROSSROADS._,
  firstgid: TileSetIDs.Road.Dirt.CROSSROADS,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const deadEnd = makeRoadTileSet({
  image: SVGs.Road.Dirt.DEAD_END._,
  firstgid: TileSetIDs.Road.Dirt.DEAD_END,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const straight = makeRoadTileSet({
  image: SVGs.Road.Dirt.STRAIGHT._,
  firstgid: TileSetIDs.Road.Dirt.STRAIGHT,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const tJunction = makeRoadTileSet({
  image: SVGs.Road.Dirt.T_JUNCTION._,
  firstgid: TileSetIDs.Road.Dirt.T_JUNCTION,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const turn = makeRoadTileSet({
  image: SVGs.Road.Dirt.TURN._,
  firstgid: TileSetIDs.Road.Dirt.TURN,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: false,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export type DirtRoadTileSet =
  | typeof crossroads
  | typeof deadEnd
  | typeof straight
  | typeof tJunction
  | typeof turn
