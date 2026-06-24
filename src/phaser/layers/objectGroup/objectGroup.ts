import type { TiledLayerObjectgroup as _Layer } from "tiled-types"

import * as layers from "../layers"
import type * as objects from "./objects"

export const Names = Object.values(layers.Names.ObjectGroup)
export type Name = (typeof Names)[number]
export type Layer = Omit<_Layer, "name"> & { name: Name }

type MakePartials = "draworder"
export type MakeKwArgs<
  OGN extends Name = Name,
  ON extends objects.Name = objects.Name,
  OID extends objects.ID = objects.ID,
> = Omit<layers.MakeKwArgs<OGN, "objectgroup">, "type"> &
  Omit<
    Layer,
    keyof layers.MakeKwArgs<OGN, "objectgroup"> | MakePartials | "objects"
  > &
  Partial<Pick<Layer, MakePartials>> & {
    objects: objects.Object<ON, OID>[]
  }

export const make = <
  OGN extends Name,
  ON extends objects.Name,
  OID extends objects.ID,
>({
  name,
  draworder = "topdown",
  ...layer
}: MakeKwArgs<OGN, ON, OID>): Layer => ({
  ...layers.make({ name, type: "objectgroup" }),
  draworder,
  ...layer,
})
