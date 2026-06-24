import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import * as scenery from "./scenery"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Common
const _Names = objects.Names.Scenery.Common
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.scenery.common.ID>(
  kwArgs: scenery.FactoryKwArgs<N, GID>,
) => scenery.factory(kwArgs)

export const bush = factory({
  gid: _IDs.BUSH,
  name: _Names.BUSH,
})

export const hay = factory({
  gid: _IDs.HAY,
  name: _Names.HAY,
})

export const pond = factory({
  gid: _IDs.POND,
  name: _Names.POND,
})

export const tree1 = factory({
  gid: _IDs.TREE1,
  name: _Names.TREE1,
})

export const tree2 = factory({
  gid: _IDs.TREE2,
  name: _Names.TREE2,
})
