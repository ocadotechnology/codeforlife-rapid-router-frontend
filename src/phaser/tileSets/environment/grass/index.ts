import { type MakeEnvironmentTileSetOptions, makeEnvironmentTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const GrassEnvironmentTileSetIDs = flattenIDs(
  TileSetIDs.Environment.Grass,
)
export type GrassEnvironmentTileSetID =
  (typeof GrassEnvironmentTileSetIDs)[number]

const makeGrassEnvironmentTileSet = <GID extends GrassEnvironmentTileSetID>(
  options: MakeEnvironmentTileSetOptions<GID, boolean>,
) => makeEnvironmentTileSet(import.meta.url, options)

export const cfc = makeGrassEnvironmentTileSet({
  image: "./cfc.svg",
  firstgid: TileSetIDs.Environment.Grass.CFC,
})

export const house = makeGrassEnvironmentTileSet({
  image: "./house.svg",
  firstgid: TileSetIDs.Environment.Grass.HOUSE,
})

export const solarPanel = makeGrassEnvironmentTileSet({
  image: "./solar_panel.svg",
  firstgid: TileSetIDs.Environment.Grass.SOLAR_PANEL,
})

export type GrassEnvironmentTileSet =
  | typeof cfc
  | typeof house
  | typeof solarPanel
