import { flattenNumberValues } from "codeforlife/utils/object"

import * as endpoints from "../endpoints"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Endpoints.CFC
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: endpoints.MakeKwArgs<GID>) =>
  endpoints.make(import.meta.url, kwArgs)

export const barn = {
  black: make({
    image: "./barn/black.svg",
    firstgid: _IDs.Barn.BLACK,
  }),
  red: make({
    image: "./barn/red.svg",
    firstgid: _IDs.Barn.RED,
  }),
} as const

export const warehouse = {
  default: make({
    image: "./warehouse/default.svg",
    firstgid: _IDs.Warehouse.DEFAULT,
  }),
  snow: make({
    image: "./warehouse/snow.svg",
    firstgid: _IDs.Warehouse.SNOW,
  }),
} as const
