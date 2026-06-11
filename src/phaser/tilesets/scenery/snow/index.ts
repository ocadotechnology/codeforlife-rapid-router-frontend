import * as scenery from "../scenery"
import * as tilesets from "../../tilesets"
import { flattenNumberValues } from "../../../utils"

const _IDs = tilesets.IDs.Scenery.Snow
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: scenery.MakeKwArgs<GID>) =>
  scenery.make(import.meta.url, kwArgs)

export const bush = make({
  image: "./bush.svg",
  firstgid: _IDs.BUSH,
})

export const pond = make({
  image: "./pond.svg",
  firstgid: _IDs.POND,
})

export const tree1 = make({
  image: "./tree1.svg",
  firstgid: _IDs.TREE1,
})

export const tree2 = make({
  image: "./tree2.svg",
  firstgid: _IDs.TREE2,
})
