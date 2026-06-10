import * as scenery from "./scenery"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Scenery.Common

export const bush = scenery.makeBase({
  gid: _IDs.BUSH,
  name: "Bush",
})

export const hay = scenery.makeBase({
  gid: _IDs.HAY,
  name: "Hay",
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
