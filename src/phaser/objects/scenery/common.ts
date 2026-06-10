import { TileSetIDs } from "../../tileSets"
import { makeSceneryObjectBase } from "."

export const bush = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Common.BUSH,
  name: "Bush",
})

export const hay = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Common.HAY,
  name: "Hay",
})

export const pond = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Common.POND,
  name: "Pond",
})

export const tree1 = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Common.TREE1,
  name: "Tree 1",
})

export const tree2 = makeSceneryObjectBase({
  gid: TileSetIDs.Scenery.Common.TREE2,
  name: "Tree 2",
})

export type CommonSceneryObjectBase =
  | typeof bush
  | typeof hay
  | typeof pond
  | typeof tree1
  | typeof tree2
