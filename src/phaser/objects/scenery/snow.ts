import * as scenery from "./scenery"
import * as tilesets from "../../tileSets"

const _IDs = tilesets.IDs.Scenery.Snow

export const bush = scenery.makeBase({
  gid: _IDs.BUSH,
  name: "Bush",
})

export const pond = scenery.makeBase({
  gid: _IDs.POND,
  name: "Pond",
})

export const tree1 = scenery.makeBase({
  gid: _IDs.TREE1,
  name: "Tree 1",
})

export const tree2 = scenery.makeBase({
  gid: _IDs.TREE2,
  name: "Tree 2",
})
