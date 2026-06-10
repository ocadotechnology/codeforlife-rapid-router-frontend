import { type MakeSceneryTileSetOptions, makeSceneryTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const SnowSceneryTileSetIDs = flattenIDs(TileSetIDs.Scenery.Snow)
export type SnowSceneryTileSetID = (typeof SnowSceneryTileSetIDs)[number]

const makeSnowSceneryTileSet = <GID extends SnowSceneryTileSetID>(
  options: MakeSceneryTileSetOptions<GID>,
) => makeSceneryTileSet(import.meta.url, options)

export const bush = makeSnowSceneryTileSet({
  image: "./bush.svg",
  firstgid: TileSetIDs.Scenery.Snow.BUSH,
})

export const pond = makeSnowSceneryTileSet({
  image: "./pond.svg",
  firstgid: TileSetIDs.Scenery.Snow.POND,
})

export const tree1 = makeSnowSceneryTileSet({
  image: "./tree1.svg",
  firstgid: TileSetIDs.Scenery.Snow.TREE1,
})

export const tree2 = makeSnowSceneryTileSet({
  image: "./tree2.svg",
  firstgid: TileSetIDs.Scenery.Snow.TREE2,
})

export type SnowSceneryTileSet =
  | typeof bush
  | typeof pond
  | typeof tree1
  | typeof tree2
