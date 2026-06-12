import { type DeepNumbersOf, createIdRegistry } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledTileset as _Tileset,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

/**
 * Global registry of tile IDs.
 *
 * WARNING: 🚫You should not recycle numeric IDs🚫 across different tilesets,
 * as this can lead to confusion and bugs when referencing tiles in the code.
 */
export const IDs = createIdRegistry({
  0: "EMPTY", // Phaser treats 0 as a special "empty" tile.
  1: { Road: { Asphalt: "STRAIGHT" } },
  2: { Road: { Asphalt: "TURN" } },
  3: { Road: { Asphalt: "T_JUNCTION" } },
  4: { Road: { Asphalt: "CROSSROADS" } },
  5: { Road: { Asphalt: "DEAD_END" } },
  6: { Road: { Dirt: "STRAIGHT" } },
  7: { Road: { Dirt: "TURN" } },
  8: { Road: { Dirt: "T_JUNCTION" } },
  9: { Road: { Dirt: "CROSSROADS" } },
  10: { Road: { Dirt: "DEAD_END" } },
  11: { Environment: { City: "HOSPITAL" } },
  12: { Environment: { City: "HOUSE" } },
  13: { Environment: { City: "SCHOOL" } },
  14: { Environment: { City: "SHOP" } },
  15: { Environment: { City: "SOLAR_PANEL" } },
  16: { Environment: { Farm: "CFC_BLACK" } },
  17: { Environment: { Farm: "CFC" } },
  18: { Environment: { Farm: "CROPS" } },
  19: { Environment: { Farm: "HOUSE1" } },
  20: { Environment: { Farm: "HOUSE2" } },
  21: { Environment: { Farm: "SOLAR_PANEL" } },
  22: { Environment: { Grass: "CFC" } },
  23: { Environment: { Grass: "HOUSE" } },
  24: { Environment: { Grass: "SOLAR_PANEL" } },
  25: { Environment: { Snow: "BARN" } },
  26: { Environment: { Snow: "CFC" } },
  27: { Environment: { Snow: "CROPS" } },
  28: { Environment: { Snow: "HOSPITAL" } },
  29: { Environment: { Snow: "HOUSE1" } },
  30: { Environment: { Snow: "HOUSE2" } },
  31: { Environment: { Snow: "HOUSE3" } },
  32: { Environment: { Snow: "SCHOOL" } },
  33: { Environment: { Snow: "SHOP" } },
  34: { Environment: { Snow: "SOLAR_PANEL" } },
  35: { Environment: { Common: { TrafficLight: "GREEN" } } },
  36: { Environment: { Common: { TrafficLight: "RED" } } },
  37: { Environment: { Common: "PIGEON" } },
  38: { Scenery: { Snow: "BUSH" } },
  39: { Scenery: { Snow: "POND" } },
  40: { Scenery: { Snow: "TREE1" } },
  41: { Scenery: { Snow: "TREE2" } },
  42: { Scenery: { Common: "BUSH" } },
  43: { Scenery: { Common: "HAY" } },
  44: { Scenery: { Common: "POND" } },
  45: { Scenery: { Common: "TREE1" } },
  46: { Scenery: { Common: "TREE2" } },
} as const)
export type ID = DeepNumbersOf<typeof IDs>

export type Tileset<
  GID extends ID = ID,
  Props extends Property[] | undefined = undefined,
> = Omit<_Tileset, "firstgid" | "properties"> & {
  image: string
  firstgid: GID
  properties: Props
}

type MakePartials =
  | "name"
  | "tilecount"
  | "columns"
  | "spacing"
  | "margin"
  | "imageheight"
  | "imagewidth"
  | "tileheight"
  | "tilewidth"
  | "properties"
export type MakeKwArgs<
  GID extends ID,
  Props extends Property[] | undefined = undefined,
> = Omit<Tileset<GID, Props>, MakePartials> &
  Partial<Pick<Tileset<GID, Props>, MakePartials>> & { image: string }

export const make = <
  GID extends ID,
  Props extends Property[] | undefined = undefined,
>(
  importMetaUrl: string,
  {
    image,
    name,
    tilecount = 1,
    columns = 1,
    spacing = 0,
    margin = 0,
    imageheight = TILE_HEIGHT,
    imagewidth = TILE_WIDTH,
    tileheight = TILE_HEIGHT,
    tilewidth = TILE_WIDTH,
    properties,
    ...tileset
  }: MakeKwArgs<GID, Props>,
): Tileset<GID, Props> => {
  image = new URL(image, importMetaUrl).href

  return {
    image,
    name: name ?? image, // Use the provided name or fallback to the image path.
    tilecount,
    columns,
    spacing,
    margin,
    imageheight,
    imagewidth,
    tileheight,
    tilewidth,
    properties: properties as Props,
    ...tileset,
  }
}

const H = 0x80000000
const V = 0x40000000
const D = 0x20000000
const MASK = H | V | D

function extract(id: number): [number, number, number] {
  return [(id >>> 31) & 1, (id >>> 30) & 1, (id >>> 29) & 1]
}

function encode<T extends number>(id: T, h: number, v: number, d: number): T {
  return ((id & ~MASK) | (h * H) | (v * V) | (d * D)) as T
}

/** Flip a tile horizontally. */
export function flipH<GID extends ID>(id: GID): GID {
  const [h, v, d] = extract(id)
  return encode(id, h ^ 1, v, d)
}

/** Flip a tile vertically. */
export function flipV<GID extends ID>(id: GID): GID {
  const [h, v, d] = extract(id)
  return encode(id, h, v ^ 1, d)
}

/** Rotate a tile clockwise. */
export function rotateC<GID extends ID>(id: GID, degrees: 90 | 180 | 270): GID {
  const [h, v, d] = extract(id)
  if (degrees === 90) return encode(id, v ^ 1, h, d ^ 1)
  if (degrees === 180) return encode(id, h ^ 1, v ^ 1, d)
  return encode(id, v, h ^ 1, d ^ 1) // 270
}
