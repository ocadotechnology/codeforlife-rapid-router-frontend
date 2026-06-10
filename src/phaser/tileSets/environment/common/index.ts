import * as environment from "../environment"
import * as tilesets from "../../tilesets"
import { flattenIDs } from "../../../utils"

const _IDs = tilesets.IDs.Environment.Common
export const IDs = flattenIDs(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const trafficLight = {
  red: make({
    image: "./trafficLight/red.svg",
    firstgid: _IDs.TrafficLight.RED,
  }),
  green: make({
    image: "./trafficLight/green.svg",
    firstgid: _IDs.TrafficLight.GREEN,
    properties: { canDriveThrough: true },
  }),
} as const

export const pigeon = make({
  image: "./pigeon.svg",
  firstgid: _IDs.PIGEON,
})
