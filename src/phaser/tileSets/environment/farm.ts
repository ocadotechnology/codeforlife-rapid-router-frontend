import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeEnvironmentTileSet } from "."

export const cfcBlack = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.CFC_BLACK._,
  firstgid: TileSetIDs.Environment.Farm.CFC_BLACK,
})

export const cfc = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.CFC._,
  firstgid: TileSetIDs.Environment.Farm.CFC,
})

export const crops = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.CROPS._,
  firstgid: TileSetIDs.Environment.Farm.CROPS,
})

export const house1 = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.HOUSE1._,
  firstgid: TileSetIDs.Environment.Farm.HOUSE1,
})

export const house2 = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.HOUSE2._,
  firstgid: TileSetIDs.Environment.Farm.HOUSE2,
})

export const solarPanel = makeEnvironmentTileSet({
  image: SVGs.Environment.Farm.SOLAR_PANEL._,
  firstgid: TileSetIDs.Environment.Farm.SOLAR_PANEL,
})

export type FarmEnvironmentTileSet =
  | typeof cfcBlack
  | typeof cfc
  | typeof crops
  | typeof house1
  | typeof house2
  | typeof solarPanel
