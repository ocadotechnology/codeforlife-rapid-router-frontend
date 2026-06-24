import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Scenery)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.scenery.ID,
> = objects.FactoryKwArgs<N, GID>

export const factory = <N extends Name, GID extends tilesets.scenery.ID>(
  kwArgs: FactoryKwArgs<N, GID>,
) => objects.factory(kwArgs)
