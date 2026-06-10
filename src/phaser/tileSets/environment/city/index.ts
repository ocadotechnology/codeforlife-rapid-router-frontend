import { type MakeEnvironmentTileSetOptions, makeEnvironmentTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const CityEnvironmentTileSetIDs = flattenIDs(TileSetIDs.Environment.City)
export type CityEnvironmentTileSetID =
  (typeof CityEnvironmentTileSetIDs)[number]

const makeCityEnvironmentTileSet = <GID extends CityEnvironmentTileSetID>(
  options: MakeEnvironmentTileSetOptions<GID, boolean>,
) => makeEnvironmentTileSet(import.meta.url, options)

export const hospital = makeCityEnvironmentTileSet({
  image: "./hospital.svg",
  firstgid: TileSetIDs.Environment.City.HOSPITAL,
})

export const house = makeCityEnvironmentTileSet({
  image: "./house.svg",
  firstgid: TileSetIDs.Environment.City.HOUSE,
})

export const school = makeCityEnvironmentTileSet({
  image: "./school.svg",
  firstgid: TileSetIDs.Environment.City.SCHOOL,
})

export const shop = makeCityEnvironmentTileSet({
  image: "./shop.svg",
  firstgid: TileSetIDs.Environment.City.SHOP,
})

export const solarPanel = makeCityEnvironmentTileSet({
  image: "./solar_panel.svg",
  firstgid: TileSetIDs.Environment.City.SOLAR_PANEL,
})

export type CityEnvironmentTileSet =
  | typeof hospital
  | typeof house
  | typeof school
  | typeof shop
  | typeof solarPanel
