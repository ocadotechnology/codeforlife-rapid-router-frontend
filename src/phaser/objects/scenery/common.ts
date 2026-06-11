import * as objects from "../objects"
import * as scenery from "./scenery"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Scenery.Common
const _Names = objects.Names.Scenery.Common
export const Names = Object.values(_Names)
export type Name = (typeof Names)[number]

const makeBase = <N extends Name, GID extends tilesets.scenery.common.ID>(
  kwArgs: scenery.MakeBaseKwArgs<N, GID>,
) => scenery.makeBase(kwArgs)

export const bush = makeBase({
  gid: _IDs.BUSH,
  name: _Names.BUSH,
})

export const hay = makeBase({
  gid: _IDs.HAY,
  name: _Names.HAY,
})

export const pond = makeBase({
  gid: _IDs.POND,
  name: _Names.POND,
})

export const tree1 = makeBase({
  gid: _IDs.TREE1,
  name: _Names.TREE1,
})

export const tree2 = makeBase({
  gid: _IDs.TREE2,
  name: _Names.TREE2,
})
