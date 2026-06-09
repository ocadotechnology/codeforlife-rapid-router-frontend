import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeRoadTileSet } from "."

export const crossroads = makeRoadTileSet({
  image: SVGs.Road.Asphalt.CROSSROADS._,
  firstgid: TileSetIDs.Road.Asphalt.CROSSROADS,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const deadEnd = makeRoadTileSet({
  image: SVGs.Road.Asphalt.DEAD_END._,
  firstgid: TileSetIDs.Road.Asphalt.DEAD_END,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const straight = makeRoadTileSet({
  image: SVGs.Road.Asphalt.STRAIGHT._,
  firstgid: TileSetIDs.Road.Asphalt.STRAIGHT,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const tJunction = makeRoadTileSet({
  image: SVGs.Road.Asphalt.T_JUNCTION._,
  firstgid: TileSetIDs.Road.Asphalt.T_JUNCTION,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const turn = makeRoadTileSet({
  image: SVGs.Road.Asphalt.TURN._,
  firstgid: TileSetIDs.Road.Asphalt.TURN,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: false,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export type AsphaltRoadTileSet =
  | typeof crossroads
  | typeof deadEnd
  | typeof straight
  | typeof tJunction
  | typeof turn
