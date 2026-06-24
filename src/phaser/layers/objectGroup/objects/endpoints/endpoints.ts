import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Endpoints)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.endpoints.ID,
> = objects.FactoryKwArgs<N, GID>

export type FactoryVariants = {
  top: { rotation: number }
  topRight: { rotation: number }
  right: { rotation: number }
  bottomRight: { rotation: number }
  bottom: { rotation: number }
  bottomLeft: { rotation: number }
  left: { rotation: number }
  topLeft: { rotation: number }
}

export const factory = <N extends Name, GID extends tilesets.endpoints.ID>(
  kwArgs: FactoryKwArgs<N, GID>,
  variants: FactoryVariants,
) => objects.factory(kwArgs, variants)
