import { type MakeEnvironmentTileSetOptions, makeEnvironmentTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const SnowEnvironmentTileSetIDs = flattenIDs(TileSetIDs.Environment.Snow)
export type SnowEnvironmentTileSetID =
  (typeof SnowEnvironmentTileSetIDs)[number]

const makeSnowEnvironmentTileSet = <GID extends SnowEnvironmentTileSetID>(
  options: MakeEnvironmentTileSetOptions<GID, boolean>,
) => makeEnvironmentTileSet(import.meta.url, options)

export const barn = makeSnowEnvironmentTileSet({
  image: "./barn.svg",
  firstgid: TileSetIDs.Environment.Snow.BARN,
})

export const cfc = makeSnowEnvironmentTileSet({
  image: "./cfc.svg",
  firstgid: TileSetIDs.Environment.Snow.CFC,
})

export const crops = makeSnowEnvironmentTileSet({
  image: "./crops.svg",
  firstgid: TileSetIDs.Environment.Snow.CROPS,
})

export const hospital = makeSnowEnvironmentTileSet({
  image: "./hospital.svg",
  firstgid: TileSetIDs.Environment.Snow.HOSPITAL,
})

export const house1 = makeSnowEnvironmentTileSet({
  image: "./house1.svg",
  firstgid: TileSetIDs.Environment.Snow.HOUSE1,
})

export const house2 = makeSnowEnvironmentTileSet({
  image: "./house2.svg",
  firstgid: TileSetIDs.Environment.Snow.HOUSE2,
})

export const house3 = makeSnowEnvironmentTileSet({
  image: "./house3.svg",
  firstgid: TileSetIDs.Environment.Snow.HOUSE3,
})

export const school = makeSnowEnvironmentTileSet({
  image: "./school.svg",
  firstgid: TileSetIDs.Environment.Snow.SCHOOL,
})

export const shop = makeSnowEnvironmentTileSet({
  image: "./shop.svg",
  firstgid: TileSetIDs.Environment.Snow.SHOP,
})

export const solarPanel = makeSnowEnvironmentTileSet({
  image: "./solar_panel.svg",
  firstgid: TileSetIDs.Environment.Snow.SOLAR_PANEL,
})

export type SnowEnvironmentTileSet =
  | typeof barn
  | typeof cfc
  | typeof crops
  | typeof hospital
  | typeof house1
  | typeof house2
  | typeof house3
  | typeof school
  | typeof shop
  | typeof solarPanel
