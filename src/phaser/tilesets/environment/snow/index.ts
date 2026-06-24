import { flattenNumberValues } from "codeforlife/utils/object"

import * as environment from "../environment"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Environment.Snow
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const barn = make({
  image: "./barn.svg",
  firstgid: _IDs.BARN,
})

export const crops = make({
  image: "./crops.svg",
  firstgid: _IDs.CROPS,
})

export const hospital = make({
  image: "./hospital.svg",
  firstgid: _IDs.HOSPITAL,
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
