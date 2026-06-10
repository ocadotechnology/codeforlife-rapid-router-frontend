import { type MakeEnvironmentTileSetOptions, makeEnvironmentTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const CommonEnvironmentTileSetIDs = flattenIDs(
  TileSetIDs.Environment.Common,
)
export type CommonEnvironmentTileSetID =
  (typeof CommonEnvironmentTileSetIDs)[number]

const makeCommonEnvironmentTileSet = <GID extends CommonEnvironmentTileSetID>(
  options: MakeEnvironmentTileSetOptions<GID, boolean>,
) => makeEnvironmentTileSet(import.meta.url, options)

export const trafficLight = {
  red: makeCommonEnvironmentTileSet({
    image: "./trafficLight/red.svg",
    firstgid: TileSetIDs.Environment.Common.TrafficLight.RED,
  }),
  green: makeCommonEnvironmentTileSet({
    image: "./trafficLight/green.svg",
    firstgid: TileSetIDs.Environment.Common.TrafficLight.GREEN,
    properties: { canDriveThrough: true },
  }),
} as const

export const pigeon = makeCommonEnvironmentTileSet({
  image: "./pigeon.svg",
  firstgid: TileSetIDs.Environment.Common.PIGEON,
})

export type CommonEnvironmentTileSet =
  | typeof trafficLight.red
  | typeof trafficLight.green
  | typeof pigeon
