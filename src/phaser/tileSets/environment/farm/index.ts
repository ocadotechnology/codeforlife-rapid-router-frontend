import { type MakeEnvironmentTileSetOptions, makeEnvironmentTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const FarmEnvironmentTileSetIDs = flattenIDs(TileSetIDs.Environment.Farm)
export type FarmEnvironmentTileSetID =
  (typeof FarmEnvironmentTileSetIDs)[number]

const makeFarmEnvironmentTileSet = <GID extends FarmEnvironmentTileSetID>(
  options: MakeEnvironmentTileSetOptions<GID, boolean>,
) => makeEnvironmentTileSet(import.meta.url, options)

export const cfcBlack = makeFarmEnvironmentTileSet({
  image: "./cfc_black.svg",
  firstgid: TileSetIDs.Environment.Farm.CFC_BLACK,
})

export const cfc = makeFarmEnvironmentTileSet({
  image: "./cfc.svg",
  firstgid: TileSetIDs.Environment.Farm.CFC,
})

export const crops = makeFarmEnvironmentTileSet({
  image: "./crops.svg",
  firstgid: TileSetIDs.Environment.Farm.CROPS,
})

export const house1 = makeFarmEnvironmentTileSet({
  image: "./house1.svg",
  firstgid: TileSetIDs.Environment.Farm.HOUSE1,
})

export const house2 = makeFarmEnvironmentTileSet({
  image: "./house2.svg",
  firstgid: TileSetIDs.Environment.Farm.HOUSE2,
})

export const solarPanel = makeFarmEnvironmentTileSet({
  image: "./solar_panel.svg",
  firstgid: TileSetIDs.Environment.Farm.SOLAR_PANEL,
})

export type FarmEnvironmentTileSet =
  | typeof cfcBlack
  | typeof cfc
  | typeof crops
  | typeof house1
  | typeof house2
  | typeof solarPanel
