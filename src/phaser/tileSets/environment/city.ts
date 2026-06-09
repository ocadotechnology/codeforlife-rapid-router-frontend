import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeEnvironmentTileSet } from "."

export const hospital = makeEnvironmentTileSet({
  image: SVGs.Environment.City.HOSPITAL._,
  firstgid: TileSetIDs.Environment.City.HOSPITAL,
})

export const house = makeEnvironmentTileSet({
  image: SVGs.Environment.City.HOUSE._,
  firstgid: TileSetIDs.Environment.City.HOUSE,
})

export const school = makeEnvironmentTileSet({
  image: SVGs.Environment.City.SCHOOL._,
  firstgid: TileSetIDs.Environment.City.SCHOOL,
})

export const shop = makeEnvironmentTileSet({
  image: SVGs.Environment.City.SHOP._,
  firstgid: TileSetIDs.Environment.City.SHOP,
})

export const solarPanel = makeEnvironmentTileSet({
  image: SVGs.Environment.City.SOLAR_PANEL._,
  firstgid: TileSetIDs.Environment.City.SOLAR_PANEL,
})

export type CityEnvironmentTileSet =
  | typeof hospital
  | typeof house
  | typeof school
  | typeof shop
  | typeof solarPanel
