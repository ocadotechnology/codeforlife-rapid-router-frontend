import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeEnvironmentTileSet } from "."

export const barn = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.BARN._,
  firstgid: TileSetIDs.Environment.Snow.BARN,
})

export const cfc = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.CFC._,
  firstgid: TileSetIDs.Environment.Snow.CFC,
})

export const crops = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.CROPS._,
  firstgid: TileSetIDs.Environment.Snow.CROPS,
})

export const hospital = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.HOSPITAL._,
  firstgid: TileSetIDs.Environment.Snow.HOSPITAL,
})

export const house1 = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.HOUSE1._,
  firstgid: TileSetIDs.Environment.Snow.HOUSE1,
})

export const house2 = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.HOUSE2._,
  firstgid: TileSetIDs.Environment.Snow.HOUSE2,
})

export const house3 = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.HOUSE3._,
  firstgid: TileSetIDs.Environment.Snow.HOUSE3,
})

export const school = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.SCHOOL._,
  firstgid: TileSetIDs.Environment.Snow.SCHOOL,
})

export const shop = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.SHOP._,
  firstgid: TileSetIDs.Environment.Snow.SHOP,
})

export const solarPanel = makeEnvironmentTileSet({
  image: SVGs.Environment.Snow.SOLAR_PANEL._,
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
