import { type MakeSceneryTileSetOptions, makeSceneryTileSet } from ".."
import { TileSetIDs, flattenIDs } from "../.."

export const CommonSceneryTileSetIDs = flattenIDs(TileSetIDs.Scenery.Common)
export type CommonSceneryTileSetID = (typeof CommonSceneryTileSetIDs)[number]

const makeCommonSceneryTileSet = <GID extends CommonSceneryTileSetID>(
  options: MakeSceneryTileSetOptions<GID>,
) => makeSceneryTileSet(import.meta.url, options)

export const bush = makeCommonSceneryTileSet({
  image: "./bush.svg",
  firstgid: TileSetIDs.Scenery.Common.BUSH,
})

export const hay = makeCommonSceneryTileSet({
  image: "./hay.svg",
  firstgid: TileSetIDs.Scenery.Common.HAY,
})

export const pond = makeCommonSceneryTileSet({
  image: "./pond.svg",
  firstgid: TileSetIDs.Scenery.Common.POND,
})

export const tree1 = makeCommonSceneryTileSet({
  image: "./tree1.svg",
  firstgid: TileSetIDs.Scenery.Common.TREE1,
})

export const tree2 = makeCommonSceneryTileSet({
  image: "./tree2.svg",
  firstgid: TileSetIDs.Scenery.Common.TREE2,
})

export type CommonSceneryTileSet =
  | typeof bush
  | typeof hay
  | typeof pond
  | typeof tree1
  | typeof tree2
