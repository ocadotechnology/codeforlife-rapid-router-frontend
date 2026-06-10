import * as environment from "../environment"
import * as tilesets from "../../tilesets"
import { flattenIDs } from "../../../utils"

const _IDs = tilesets.IDs.Environment.Grass
export const IDs = flattenIDs(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const cfc = make({
  image: "./cfc.svg",
  firstgid: _IDs.CFC,
})

export const house = make({
  image: "./house.svg",
  firstgid: _IDs.HOUSE,
})

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
})
