import type { TiledLayerObjectgroup as _Layer } from "tiled-types"

import * as layers from "./layers"
import * as objects from "../objects"
import type * as tilesets from "../tilesets"

export const Names = Object.values(layers.Names.ObjectGroup)
export type Name = (typeof Names)[number]
export type Layer = Omit<_Layer, "name"> & { name: Name }

type MakePartials = "draworder"
export type MakeKwArgs<
  N extends Name,
  ID extends tilesets.ID | undefined = undefined,
> = Omit<layers.MakeKwArgs<N, "objectgroup">, "type"> &
  Omit<
    Layer,
    keyof layers.MakeKwArgs<N, "objectgroup"> | MakePartials | "objects"
  > &
  Partial<Pick<Layer, MakePartials>> & {
    objects: Omit<
      objects.MakeKwArgs<objects.Type, objects.Name, any, ID>,
      "id"
    >[]
  }

export const make = <
  N extends Name,
  ID extends tilesets.ID | undefined = undefined,
>({
  name,
  draworder = "topdown",
  objects: _objects,
}: MakeKwArgs<N, ID>): Layer => ({
  ...layers.make({ name, type: "objectgroup" }),
  draworder,
  objects: _objects.map((obj, index) =>
    objects.make({ ...obj, id: index + 1 }),
  ),
})
