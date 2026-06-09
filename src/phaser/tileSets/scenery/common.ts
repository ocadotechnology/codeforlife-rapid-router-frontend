import { SVGs } from "../../enums"
import { TileSetIDs } from ".."
import { makeSceneryTileSet } from "."

export const bush = makeSceneryTileSet({
  image: SVGs.Scenery.BUSH._,
  firstgid: TileSetIDs.Scenery.BUSH,
})

export const hay = makeSceneryTileSet({
  image: SVGs.Scenery.HAY._,
  firstgid: TileSetIDs.Scenery.HAY,
})

export const pond = makeSceneryTileSet({
  image: SVGs.Scenery.POND._,
  firstgid: TileSetIDs.Scenery.POND,
})

export const tree1 = makeSceneryTileSet({
  image: SVGs.Scenery.TREE1._,
  firstgid: TileSetIDs.Scenery.TREE1,
})

export const tree2 = makeSceneryTileSet({
  image: SVGs.Scenery.TREE2._,
  firstgid: TileSetIDs.Scenery.TREE2,
})

export type CommonSceneryTileSet =
  | typeof bush
  | typeof hay
  | typeof pond
  | typeof tree1
  | typeof tree2
