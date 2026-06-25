import { type DeepStringsOf, createPathStrings } from "codeforlife/utils/object"
import type { TiledObject as _Object } from "tiled-types"

import type * as tilesets from "../../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../globals"

export type ID = tilesets.endpoints.ID | tilesets.scenery.ID

// Global registry of object names.
export const Names = createPathStrings({
  Endpoints: {
    CFC: {
      Barn: ["BLACK", "RED"],
      Warehouse: ["DEFAULT", "SNOW"],
    },
    House: {
      Snow: ["BLUE", "ORANGE", "STRAW"],
      Common: ["BLUE", "ORANGE", "STRAW", "WOOD"],
    },
  },
  Scenery: {
    Snow: ["BUSH", "POND", "TREE1", "TREE2"],
    Common: ["BUSH", "HAY", "POND", "TREE1", "TREE2"],
  },
} as const)
export type Name = DeepStringsOf<typeof Names>

export type Object<N extends Name, GID extends ID> = Omit<
  _Object,
  "type" | "name" | "gid"
> & { type: N; name: N; gid: GID }
export type FactoryObject<N extends Name, GID extends ID> = Omit<
  Object<N, GID>,
  "id"
>

export type FactoryBaseKwArgs<N extends Name, GID extends ID> = Partial<
  Omit<FactoryObject<N, GID>, "type" | "name" | "gid">
> & { col?: number; row?: number }
type FactoryBase<N extends Name, GID extends ID> = (
  kwArgs: FactoryBaseKwArgs<N, GID>,
) => FactoryObject<N, GID>

type FactoryVariantSpecs<N extends Name, GID extends ID> = Record<
  string,
  FactoryBaseKwArgs<N, GID>
>
type FactoryVariants<
  N extends Name,
  GID extends ID,
  V extends FactoryVariantSpecs<N, GID>,
> = {
  [K in keyof V]: (
    kwArgs: Omit<FactoryBaseKwArgs<N, GID>, keyof V[K]>,
  ) => FactoryObject<N, GID> & V[K]
}

export type FactoryKwArgs<N extends Name, GID extends ID> = {
  name: N
  gid: GID
} & FactoryBaseKwArgs<N, GID>
export type Factory<
  N extends Name,
  GID extends ID,
  V extends FactoryVariantSpecs<N, GID> = {},
> = FactoryBase<N, GID> & FactoryVariants<N, GID, V>

export const factory = <
  N extends Name,
  GID extends ID,
  const V extends FactoryVariantSpecs<N, GID> = {},
>(
  {
    name,
    x: baseX = 0,
    y: baseY = 0,
    col: baseCol = 1,
    row: baseRow = 1,
    width: baseWidth = TILE_WIDTH,
    height: baseHeight = TILE_HEIGHT,
    properties: baseProperties = [],
    visible: baseVisible = true,
    rotation: baseRotation = 0,
    ...objBase
  }: FactoryKwArgs<N, GID>,
  variants: V = {} as V,
): Factory<N, GID, V> => {
  baseX += (baseCol - 1) * TILE_WIDTH
  baseY += (baseRow - 1) * TILE_HEIGHT

  const base: FactoryBase<N, GID> = ({
    x,
    y,
    col,
    row,
    width,
    height,
    properties,
    visible = baseVisible,
    rotation,
    ...obj
  }) => ({
    type: name,
    name,
    x: (x ? baseX + x : baseX) + (col ? (col - 1) * TILE_WIDTH : 0),
    y: (y ? baseY + y : baseY) + (row ? (row - 1) * TILE_HEIGHT : 0),
    width: width ? baseWidth + width : baseWidth,
    height: height ? baseHeight + height : baseHeight,
    properties: properties
      ? [...baseProperties, ...properties]
      : baseProperties,
    visible,
    rotation: rotation ? baseRotation + rotation : baseRotation,
    ...objBase,
    ...obj,
  })

  return (Object.entries(variants) as [keyof V, V[keyof V]][]).reduce(
    (f, [variantName, variantKwArgs]) => {
      ;(f as unknown as FactoryVariants<N, GID, V>)[variantName] = kwArgs =>
        f({ ...variantKwArgs, ...kwArgs }) as FactoryObject<N, GID> & V[keyof V]

      return f
    },
    base,
  ) as Factory<N, GID, V>
}
