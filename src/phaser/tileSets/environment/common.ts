import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeEnvironmentTileSet } from "."

export const trafficLight = {
  red: makeEnvironmentTileSet({
    image: SVGs.Environment.TrafficLight.RED._,
    firstgid: TileSetIDs.Environment.TrafficLight.RED,
  }),
  green: makeEnvironmentTileSet({
    image: SVGs.Environment.TrafficLight.GREEN._,
    firstgid: TileSetIDs.Environment.TrafficLight.GREEN,
    properties: { canDriveThrough: true },
  }),
} as const

export const pigeon = makeEnvironmentTileSet({
  image: SVGs.Environment.PIGEON._,
  firstgid: TileSetIDs.Environment.PIGEON,
})

export type CommonEnvironmentTileSet =
  | typeof trafficLight.red
  | typeof trafficLight.green
  | typeof pigeon
