import * as tilesets from "../tilesets"
import { flattenIDs } from "../../utils"

const _IDs = tilesets.IDs.Background
export const IDs = flattenIDs(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: tilesets.MakeKwArgs<GID>) =>
  tilesets.make(import.meta.url, kwArgs)

export const grass = make({
  image: "./grass.svg",
  firstgid: _IDs.GRASS,
})

export const snow = make({
  image: "./snow.svg",
  firstgid: _IDs.SNOW,
})

export const pavement = make({
  image: "./pavement.svg",
  firstgid: _IDs.PAVEMENT,
})
