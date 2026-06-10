import type {
  TiledProperty as Property,
  TiledTileset as _Tileset,
} from "tiled-types"

import { type DeepNumbersOf, setIDs } from "../utils"
import { TILE_HEIGHT, TILE_WIDTH } from "../constants"

/**
 * Tilesets are defined in a way that allows us to easily map numeric tile IDs
 * from the Tiled map editor to descriptive string paths that we can use to
 * reference the corresponding assets in our code. The `setIDs` function takes
 * care of converting the nested object structure into a flat mapping of string
 * paths to numeric IDs, while also ensuring type safety.
 *
 * WARNING: The numeric IDs assigned to each tileset must match the tile IDs
 * used in the Tiled map editor. 🚫You should not recycle numeric IDs🚫 across
 * different tilesets, as this can lead to confusion and bugs when referencing
 * tiles in the code. Each unique tile in Tiled should have a unique numeric ID
 * in this mapping.
 */
export const IDs = setIDs({
  0: "EMPTY", // Phaser treats 0 as a special "empty" tile.
  1: { Background: "GRASS" },
  2: { Background: "SNOW" },
  3: { Background: "PAVEMENT" },
  4: { Road: { Asphalt: "STRAIGHT" } },
  5: { Road: { Asphalt: "TURN" } },
  6: { Road: { Asphalt: "T_JUNCTION" } },
  7: { Road: { Asphalt: "CROSSROADS" } },
  8: { Road: { Asphalt: "DEAD_END" } },
  9: { Road: { Dirt: "STRAIGHT" } },
  10: { Road: { Dirt: "TURN" } },
  11: { Road: { Dirt: "T_JUNCTION" } },
  12: { Road: { Dirt: "CROSSROADS" } },
  13: { Road: { Dirt: "DEAD_END" } },
  14: { Environment: { City: "HOSPITAL" } },
  15: { Environment: { City: "HOUSE" } },
  16: { Environment: { City: "SCHOOL" } },
  17: { Environment: { City: "SHOP" } },
  18: { Environment: { City: "SOLAR_PANEL" } },
  19: { Environment: { Farm: "CFC_BLACK" } },
  20: { Environment: { Farm: "CFC" } },
  21: { Environment: { Farm: "CROPS" } },
  22: { Environment: { Farm: "HOUSE1" } },
  23: { Environment: { Farm: "HOUSE2" } },
  24: { Environment: { Farm: "SOLAR_PANEL" } },
  25: { Environment: { Grass: "CFC" } },
  26: { Environment: { Grass: "HOUSE" } },
  27: { Environment: { Grass: "SOLAR_PANEL" } },
  28: { Environment: { Snow: "BARN" } },
  29: { Environment: { Snow: "CFC" } },
  30: { Environment: { Snow: "CROPS" } },
  31: { Environment: { Snow: "HOSPITAL" } },
  32: { Environment: { Snow: "HOUSE1" } },
  33: { Environment: { Snow: "HOUSE2" } },
  34: { Environment: { Snow: "HOUSE3" } },
  35: { Environment: { Snow: "SCHOOL" } },
  36: { Environment: { Snow: "SHOP" } },
  37: { Environment: { Snow: "SOLAR_PANEL" } },
  38: { Environment: { Common: { TrafficLight: "GREEN" } } },
  39: { Environment: { Common: { TrafficLight: "RED" } } },
  40: { Environment: { Common: "PIGEON" } },
  41: { Scenery: { Snow: "BUSH" } },
  42: { Scenery: { Snow: "POND" } },
  43: { Scenery: { Snow: "TREE1" } },
  44: { Scenery: { Snow: "TREE2" } },
  45: { Scenery: { Common: "BUSH" } },
  46: { Scenery: { Common: "HAY" } },
  47: { Scenery: { Common: "POND" } },
  48: { Scenery: { Common: "TREE1" } },
  49: { Scenery: { Common: "TREE2" } },
} as const)
export type ID = DeepNumbersOf<typeof IDs>

export type Tileset<
  GID extends ID = ID,
  Props extends Property[] | undefined = undefined,
> = Omit<_Tileset, "firstgid" | "properties"> & {
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
