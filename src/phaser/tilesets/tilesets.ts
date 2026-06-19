import { type DeepNumbersOf, createIdRegistry } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledTileset as _Tileset,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

const road = <const V>(v: V) => ({ Road: v })
const asphalt = <const V>(v: V) => ({ Asphalt: v })
const dirt = <const V>(v: V) => ({ Dirt: v })
const env = <const V>(v: V) => ({ Environment: v })
const city = <const V>(v: V) => ({ City: v })
const farm = <const V>(v: V) => ({ Farm: v })
const grass = <const V>(v: V) => ({ Grass: v })
const snow = <const V>(v: V) => ({ Snow: v })
const common = <const V>(v: V) => ({ Common: v })
const scenery = <const V>(v: V) => ({ Scenery: v })
const trafficLight = <const V>(v: V) => ({ TrafficLight: v })

/**
 * Global registry of tile IDs.
 *
 * WARNING: 🚫You should not recycle numeric IDs🚫 across different tilesets,
 * as this can lead to confusion and bugs when referencing tiles in the code.
 */
export const IDs = createIdRegistry({
  // 0 is reserved by Phaser as a special "empty" tile.
  1: road(asphalt("STRAIGHT")),
  2: road(asphalt("TURN")),
  3: road(asphalt("T_JUNCTION")),
  4: road(asphalt("CROSSROADS")),
  5: road(asphalt("DEAD_END")),
  6: road(dirt("STRAIGHT")),
  7: road(dirt("TURN")),
  8: road(dirt("T_JUNCTION")),
  9: road(dirt("CROSSROADS")),
  10: road(dirt("DEAD_END")),
  11: env(city("HOSPITAL")),
  12: env(city("HOUSE")),
  13: env(city("SCHOOL")),
  14: env(city("SHOP")),
  15: env(city("SOLAR_PANEL")),
  16: env(farm("CFC_BLACK")),
  17: env(farm("CFC")),
  18: env(farm("CROPS")),
  19: env(farm("HOUSE1")),
  20: env(farm("HOUSE2")),
  21: env(farm("SOLAR_PANEL")),
  22: env(grass("CFC")),
  23: env(grass("HOUSE")),
  24: env(grass("SOLAR_PANEL")),
  25: env(snow("BARN")),
  26: env(snow("CFC")),
  27: env(snow("CROPS")),
  28: env(snow("HOSPITAL")),
  29: env(snow("HOUSE1")),
  30: env(snow("HOUSE2")),
  31: env(snow("HOUSE3")),
  32: env(snow("SCHOOL")),
  33: env(snow("SHOP")),
  34: env(snow("SOLAR_PANEL")),
  35: env(common(trafficLight("GREEN"))),
  36: env(common(trafficLight("RED"))),
  37: env(common("PIGEON")),
  38: scenery(snow("BUSH")),
  39: scenery(snow("POND")),
  40: scenery(snow("TREE1")),
  41: scenery(snow("TREE2")),
  42: scenery(common("BUSH")),
  43: scenery(common("HAY")),
  44: scenery(common("POND")),
  45: scenery(common("TREE1")),
  46: scenery(common("TREE2")),
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
