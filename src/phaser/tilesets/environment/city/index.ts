import * as environment from "../environment"
import * as tilesets from "../../tilesets"
import { flattenIDs } from "../../../utils"

const _IDs = tilesets.IDs.Environment.City
export const IDs = flattenIDs(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const hospital = make({
  image: "./hospital.svg",
  firstgid: _IDs.HOSPITAL,
})

export const house = make({
  image: "./house.svg",
  firstgid: _IDs.HOUSE,
})

export const school = make({
  image: "./school.svg",
  firstgid: _IDs.SCHOOL,
})

export const shop = make({
  image: "./shop.svg",
  firstgid: _IDs.SHOP,
})

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
})
