import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"

export const IDs = flattenNumberValues(tilesets.IDs.Environment)
export type ID = (typeof IDs)[number]

type Properties<T extends boolean> = [
  { name: "canDriveThrough"; value: T; type: "bool" },
]

export type MakeKwArgs<GID extends ID, T extends boolean = false> = Omit<
  tilesets.MakeKwArgs<GID, Properties<T>>,
  "properties"
> & { properties?: { canDriveThrough: T } }

export const make = <GID extends ID, T extends boolean = false>(
  importMetaUrl: string,
  {
    properties: { canDriveThrough } = { canDriveThrough: false as T },
    ...options
  }: MakeKwArgs<GID, T>,
) =>
  tilesets.make(importMetaUrl, {
    properties: [
      {
        name: "canDriveThrough",
        value: canDriveThrough,
        type: "bool",
      },
    ] as Properties<T>,
    ...options,
  })
