import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeSceneryTileSet } from "."

export const bush = makeSceneryTileSet({
  image: SVGs.Scenery.Snow.BUSH._,
  firstgid: TileSetIDs.Scenery.Snow.BUSH,
})

export const pond = makeSceneryTileSet({
  image: SVGs.Scenery.Snow.POND._,
  firstgid: TileSetIDs.Scenery.Snow.POND,
})

export const tree1 = makeSceneryTileSet({
  image: SVGs.Scenery.Snow.TREE1._,
  firstgid: TileSetIDs.Scenery.Snow.TREE1,
})

export const tree2 = makeSceneryTileSet({
  image: SVGs.Scenery.Snow.TREE2._,
  firstgid: TileSetIDs.Scenery.Snow.TREE2,
})

export type SnowSceneryTileSet =
  | typeof bush
  | typeof pond
  | typeof tree1
  | typeof tree2
