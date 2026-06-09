import {
  type BackgroundTileSetID,
  type MakeTileSetOptions,
  TileSetIDs,
  makeTileSet,
} from ".."

export type MakeBackgroundTileSetOptions<GID extends BackgroundTileSetID> =
  MakeTileSetOptions<GID>

export const makeBackgroundTileSet = <GID extends BackgroundTileSetID>(
  options: MakeBackgroundTileSetOptions<GID>,
) => makeTileSet(options)

export const grass = makeBackgroundTileSet({
  image: new URL(`./grass.svg`, import.meta.url).href,
  firstgid: TileSetIDs.Background.GRASS,
})

export const snow = makeBackgroundTileSet({
  image: new URL(`./snow.svg`, import.meta.url).href,
  firstgid: TileSetIDs.Background.SNOW,
})

export const pavement = makeBackgroundTileSet({
  image: new URL(`./pavement.svg`, import.meta.url).href,
  firstgid: TileSetIDs.Background.PAVEMENT,
})

export type BackgroundTileSet = typeof grass | typeof snow | typeof pavement
