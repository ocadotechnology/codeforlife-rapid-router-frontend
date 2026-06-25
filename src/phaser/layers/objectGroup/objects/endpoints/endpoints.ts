import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Endpoints)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.endpoints.ID,
> = objects.FactoryKwArgs<N, GID>

type FactoryVariant = { rotation: number; x: number; y: number }

export type FactoryVariants = {
  top: FactoryVariant
  topRight: FactoryVariant
  right: FactoryVariant
  bottomRight: FactoryVariant
  bottom: FactoryVariant
  bottomLeft: FactoryVariant
  left: FactoryVariant
  topLeft: FactoryVariant
}

export const factory = <N extends Name, GID extends tilesets.endpoints.ID>(
  kwArgs: FactoryKwArgs<N, GID>,
  variants: FactoryVariants,
) => objects.factory(kwArgs, variants)
