import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeEnvironmentTileSet } from "."

export const cfc = makeEnvironmentTileSet({
  image: SVGs.Environment.Grass.CFC._,
  firstgid: TileSetIDs.Environment.Grass.CFC,
})

export const house = makeEnvironmentTileSet({
  image: SVGs.Environment.Grass.HOUSE._,
  firstgid: TileSetIDs.Environment.Grass.HOUSE,
})

export const solarPanel = makeEnvironmentTileSet({
  image: SVGs.Environment.Grass.SOLAR_PANEL._,
  firstgid: TileSetIDs.Environment.Grass.SOLAR_PANEL,
})

export type GrassEnvironmentTileSet =
  | typeof cfc
  | typeof house
  | typeof solarPanel
