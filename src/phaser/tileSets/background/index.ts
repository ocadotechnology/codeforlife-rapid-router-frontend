import {
  type MakeTileSetOptions,
  TileSetIDs,
  flattenIDs,
  makeTileSet,
} from ".."

export const BackgroundTileSetIDs = flattenIDs(TileSetIDs.Background)
export type BackgroundTileSetID = (typeof BackgroundTileSetIDs)[number]

export type MakeBackgroundTileSetOptions<GID extends BackgroundTileSetID> =
  MakeTileSetOptions<GID>

export const makeBackgroundTileSet = <GID extends BackgroundTileSetID>(
  options: MakeBackgroundTileSetOptions<GID>,
) => makeTileSet(import.meta.url, options)

export const grass = makeBackgroundTileSet({
  image: "./grass.svg",
  firstgid: TileSetIDs.Background.GRASS,
})

export const snow = makeBackgroundTileSet({
  image: "./snow.svg",
  firstgid: TileSetIDs.Background.SNOW,
})

export const pavement = makeBackgroundTileSet({
  image: "./pavement.svg",
  firstgid: TileSetIDs.Background.PAVEMENT,
})

export type BackgroundTileSet = typeof grass | typeof snow | typeof pavement
