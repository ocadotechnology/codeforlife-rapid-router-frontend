import type { TiledProperty, TiledTileset } from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../constants"
import { type DeepNumbersOf } from "../utils"

type PathSpec = string | { readonly [key: string]: PathSpec }

type PathSpecToResult<T, ID extends number> = T extends string
  ? Record<T, ID>
  : { [K in keyof T]: PathSpecToResult<T[K], ID> }

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never

export type SetIDs<T extends Record<number, PathSpec>> = UnionToIntersection<
  {
    [K in keyof T]: K extends number ? PathSpecToResult<T[K], K> : never
  }[keyof T]
>

/**
 * Converts a mapping of numeric IDs to path specifications into a nested object
 * structure where each path specification is replaced with the corresponding
 * numeric ID. This allows us to define our tilesets in a way that is easy to
 * read and maintain, while still providing a convenient way to reference tile
 * IDs in our code.
 *
 * @param specs A mapping of numeric IDs to path specifications, where each path
 *  specification can be a string or a nested object of strings.
 * @returns A nested object structure where each path specification is replaced
 *  with the corresponding numeric ID.
 */
export function setIDs<T extends Record<number, PathSpec>>(
  specs: T,
): SetIDs<T> {
  const result: Record<string, unknown> = {}

  function setAtPath(
    target: Record<string, unknown>,
    pathSpec: PathSpec,
    id: number,
  ): void {
    if (typeof pathSpec === "string") {
      target[pathSpec] = id
    } else {
      for (const [key, nested] of Object.entries(pathSpec)) {
        if (!(key in target)) target[key] = {}
        setAtPath(target[key] as Record<string, unknown>, nested, id)
      }
    }
  }

  for (const [idStr, pathSpec] of Object.entries(specs)) {
    setAtPath(result, pathSpec, Number(idStr))
  }

  return result as SetIDs<T>
}

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
export const TileSetIDs = setIDs({
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
  38: { Environment: { TrafficLight: "GREEN" } },
  39: { Environment: { TrafficLight: "RED" } },
  40: { Environment: "PIGEON" },
  41: { Scenery: { Snow: "BUSH" } },
  42: { Scenery: { Snow: "POND" } },
  43: { Scenery: { Snow: "TREE1" } },
  44: { Scenery: { Snow: "TREE2" } },
  45: { Scenery: "BUSH" },
  46: { Scenery: "HAY" },
  47: { Scenery: "POND" },
  48: { Scenery: "TREE1" },
  49: { Scenery: "TREE2" },
} as const)
export type TileSetID = DeepNumbersOf<typeof TileSetIDs>
// NOTE: Background tiles cannot be empty.
export type BackgroundTileSetID = DeepNumbersOf<typeof TileSetIDs.Background>
export type RoadTileSetID =
  | typeof TileSetIDs.EMPTY
  | DeepNumbersOf<typeof TileSetIDs.Road>
export type EnvironmentTileSetID =
  | typeof TileSetIDs.EMPTY
  | DeepNumbersOf<typeof TileSetIDs.Environment>
// NOTE: Scenery tiles cannot be empty.
export type SceneryTileSetID = DeepNumbersOf<typeof TileSetIDs.Scenery>

export type TileSet<
  GID extends TileSetID = TileSetID,
  Props extends TiledProperty[] | undefined = undefined,
> = Omit<TiledTileset, "firstgid" | "properties"> & {
  firstgid: GID
  properties: Props
}

type MakeTileSetPartials =
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
export type MakeTileSetOptions<
  GID extends TileSetID,
  Props extends TiledProperty[] | undefined = undefined,
> = Omit<TileSet<GID, Props>, MakeTileSetPartials> &
  Partial<Pick<TileSet<GID, Props>, MakeTileSetPartials>> & { image: string }

export const makeTileSet = <
  GID extends TileSetID,
  Props extends TiledProperty[] | undefined = undefined,
>({
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
}: MakeTileSetOptions<GID, Props>): TileSet<GID, Props> => ({
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
})

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

export function flipTileSetH<T extends TileSetID>(id: T): T {
  const [h, v, d] = extract(id)
  return encode(id, h ^ 1, v, d)
}

export function flipTileSetV<T extends TileSetID>(id: T): T {
  const [h, v, d] = extract(id)
  return encode(id, h, v ^ 1, d)
}

export function rotateTileSet<T extends TileSetID>(
  id: T,
  degrees: 90 | 180 | 270,
): T {
  const [h, v, d] = extract(id)
  if (degrees === 90) return encode(id, v ^ 1, h, d ^ 1)
  if (degrees === 180) return encode(id, h ^ 1, v ^ 1, d)
  return encode(id, v, h ^ 1, d ^ 1) // 270
}
