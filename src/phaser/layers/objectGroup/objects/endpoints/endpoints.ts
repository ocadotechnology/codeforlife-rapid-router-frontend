import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Endpoints)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.endpoints.ID,
> = objects.FactoryKwArgs<N, GID>

export type FactoryVariantSpecs<
  N extends Name,
  GID extends tilesets.endpoints.ID,
> = objects.FactoryVariantSpecs<N, GID>

export const factory = <
  N extends Name,
  GID extends tilesets.endpoints.ID,
  const V extends FactoryVariantSpecs<N, GID>,
>(
  kwArgs: FactoryKwArgs<N, GID>,
  variants: V,
) => objects.factory(kwArgs, variants)
