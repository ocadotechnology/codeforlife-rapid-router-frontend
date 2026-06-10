import { TileSetIDs } from "../../tileSets"
import { makeSceneryObjectBase } from "."

export const bush = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Snow.BUSH,
  name: "Bush",
})

export const pond = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Snow.POND,
  name: "Pond",
})

export const tree1 = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Snow.TREE1,
  name: "Tree 1",
})

export const tree2 = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Snow.TREE2,
  name: "Tree 2",
})

export type SnowSceneryObjectBase =
  | typeof bush
  | typeof pond
  | typeof tree1
  | typeof tree2
