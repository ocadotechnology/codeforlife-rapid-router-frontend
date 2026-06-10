import { type MakeRoadTileSetOptions, makeRoadTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const DirtRoadTileSetIDs = flattenIDs(TileSetIDs.Road.Dirt)
export type DirtRoadTileSetID = (typeof DirtRoadTileSetIDs)[number]

const makeDirtRoadTileSet = <GID extends DirtRoadTileSetID>(
  options: MakeRoadTileSetOptions<GID, boolean, boolean, boolean, boolean>,
) => makeRoadTileSet(import.meta.url, options)

export const crossroads = makeDirtRoadTileSet({
  image: "./crossroads.svg",
  firstgid: TileSetIDs.Road.Dirt.CROSSROADS,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const deadEnd = makeDirtRoadTileSet({
  image: "./dead_end.svg",
  firstgid: TileSetIDs.Road.Dirt.DEAD_END,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const straight = makeDirtRoadTileSet({
  image: "./straight.svg",
  firstgid: TileSetIDs.Road.Dirt.STRAIGHT,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const tJunction = makeDirtRoadTileSet({
  image: "./t_junction.svg",
  firstgid: TileSetIDs.Road.Dirt.T_JUNCTION,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const turn = makeDirtRoadTileSet({
  image: "./turn.svg",
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
