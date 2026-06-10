import { type MakeRoadTileSetOptions, makeRoadTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const AsphaltRoadTileSetIDs = flattenIDs(TileSetIDs.Road.Asphalt)
export type AsphaltRoadTileSetID = (typeof AsphaltRoadTileSetIDs)[number]

const makeAsphaltRoadTileSet = <GID extends AsphaltRoadTileSetID>(
  options: MakeRoadTileSetOptions<GID, boolean, boolean, boolean, boolean>,
) => makeRoadTileSet(import.meta.url, options)

export const crossroads = makeAsphaltRoadTileSet({
  image: "./crossroads.svg",
  firstgid: TileSetIDs.Road.Asphalt.CROSSROADS,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const deadEnd = makeAsphaltRoadTileSet({
  image: "./dead_end.svg",
  firstgid: TileSetIDs.Road.Asphalt.DEAD_END,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const straight = makeAsphaltRoadTileSet({
  image: "./straight.svg",
  firstgid: TileSetIDs.Road.Asphalt.STRAIGHT,
  properties: {
    canDriveForwards: true,
    canDriveBackwards: true,
    canTurnLeft: false,
    canTurnRight: false,
  },
})

export const tJunction = makeAsphaltRoadTileSet({
  image: "./t_junction.svg",
  firstgid: TileSetIDs.Road.Asphalt.T_JUNCTION,
  properties: {
    canDriveForwards: false,
    canDriveBackwards: true,
    canTurnLeft: true,
    canTurnRight: true,
  },
})

export const turn = makeAsphaltRoadTileSet({
  image: "./turn.svg",
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
