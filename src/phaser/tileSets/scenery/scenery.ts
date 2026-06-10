import * as tilesets from "../tilesets"
import { flattenIDs } from "../../utils"

export const IDs = flattenIDs(tilesets.IDs.Scenery)
export type ID = (typeof IDs)[number]

export type MakeKwArgs<GID extends ID> = tilesets.MakeKwArgs<GID>

export const make = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) => tilesets.make(importMetaUrl, kwArgs)
