import { flattenNumberValues } from "codeforlife/utils/object"

import * as environment from "../environment"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Environment.Farm
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const cfcBlack = make({
  image: "./cfc_black.svg",
  firstgid: _IDs.CFC_BLACK,
})

export const cfc = make({
  image: "./cfc.svg",
  firstgid: _IDs.CFC,
})

export const crops = make({
  image: "./crops.svg",
  firstgid: _IDs.CROPS,
})

export const house1 = make({
  image: "./house1.svg",
  firstgid: _IDs.HOUSE1,
})

export const house2 = make({
  image: "./house2.svg",
  firstgid: _IDs.HOUSE2,
})

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
})
