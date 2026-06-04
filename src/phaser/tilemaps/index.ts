import type {
  default as TiledMap,
  TiledObject,
  TiledLayerObjectgroup as _TiledLayerObjectgroup,
  TiledLayerTilelayer as _TiledLayerTilelayer,
  TiledTileset as _TiledTileset,
} from "tiled-types"

import type {
  BackgroundTileset,
  ObstacleTileset,
  RoadTileset,
  SceneryTileset,
  Tileset,
} from "../enums"
import type { Tuple } from "../utils/general"

// Define the dimensions of the tilemap. These constants ensure that all layers
// and tilesets are created with consistent dimensions, which is crucial for
// proper rendering and interaction in the game.
export const COLS = 10
export const ROWS = 8

// Restrict the names of tile layers to ensure type safety when creating layers
// and accessing them later.
export type TiledLayerTilelayerName = "Background" | "Road" | "Obstacles"
export type TiledLayerObjectgroupName = "Scenery"
export type TileLayerName = TiledLayerTilelayerName | TiledLayerObjectgroupName
export type TiledLayerTilelayer = Omit<_TiledLayerTilelayer, "name"> & {
  name: TiledLayerTilelayerName
}
export type TiledLayerObjectgroup = Omit<_TiledLayerObjectgroup, "name"> & {
  name: TiledLayerObjectgroupName
}

// Define the structure of the tilemap data for our game, including the tilesets
// and layers. This structure will be used to create the tilemap in Phaser and
// ensure that all necessary information is provided in a type-safe manner.
export type TileLayerRow<
  ID extends Tileset = Tileset,
  COLS extends number = typeof COLS,
> = Tuple<ID, COLS>
export type TileLayerManyRows<
  ID extends Tileset = Tileset,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Tuple<Tuple<ID, COLS>, ROWS>
export type TiledTileset<ID extends Tileset = Tileset> = Omit<
  _TiledTileset,
  "firstgid"
> & { firstgid: ID }

type MakeLayerOptions<N extends TileLayerName, T extends string> = {
  name: N
  type: T
  x?: number
  y?: number
  width?: number
  height?: number
  opacity?: number
  visible?: boolean
}

const makeLayer = <N extends TileLayerName, T extends string>({
  x = 0,
  y = 0,
  width = COLS,
  height = ROWS,
  opacity = 1,
  visible = true,
  ...layer
}: MakeLayerOptions<N, T>) => ({
  x,
  y,
  width,
  height,
  opacity,
  visible,
  ...layer,
})

type MakeTilesetPartials =
  | "name"
  | "tilecount"
  | "columns"
  | "spacing"
  | "margin"
  | "imageheight"
  | "imagewidth"
  | "tileheight"
  | "tilewidth"
export type MakeTilesetOptions<ID extends Tileset> = Omit<
  TiledTileset<ID>,
  MakeTilesetPartials
> &
  Partial<Pick<TiledTileset<ID>, MakeTilesetPartials>> & {
    image: string
  }

export const makeTileset = <ID extends Tileset>({
  image,
  name,
  tilecount = 1,
  columns = 1,
  spacing = 0,
  margin = 0,
  imageheight = 64,
  imagewidth = 64,
  tileheight = 64,
  tilewidth = 64,
  ...tileset
}: MakeTilesetOptions<ID>): TiledTileset<ID> => ({
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
  ...tileset,
})

export type MakeTileLayerOptions<
  N extends TiledLayerTilelayerName,
  ID extends Tileset = Tileset,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<MakeLayerOptions<N, "tilelayer">, "type"> &
  Omit<TiledLayerTilelayer, keyof MakeLayerOptions<N, "tilelayer"> | "data"> & {
    data: TileLayerManyRows<ID, COLS, ROWS>
  }

export const makeTileLayer = <
  N extends TiledLayerTilelayerName,
  ID extends Tileset = Tileset,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  name,
  data,
}: MakeTileLayerOptions<N, ID, COLS, ROWS>): TiledLayerTilelayer => ({
  ...makeLayer({ name, type: "tilelayer" }),
  data: (data as ID[][]).flat(),
})

type MakeObjectPartials =
  | "name"
  | "visible"
  | "width"
  | "height"
  | "rotation"
  | "properties"
export type MakeObjectOptions = Omit<TiledObject, MakeObjectPartials> &
  Partial<Pick<TiledObject, MakeObjectPartials>>

export const makeObject = ({
  name,
  type,
  visible = true,
  width = 64,
  height = 64,
  rotation = 0,
  properties = [],
  ...obj
}: MakeObjectOptions): TiledObject => ({
  type,
  name: name ?? type, // Use the provided name or fallback to the type.
  visible,
  width,
  height,
  rotation,
  properties,
  ...obj,
})

type MakeObjectGroupLayerPartials = "draworder"
export type MakeObjectGroupLayerOptions<N extends TiledLayerObjectgroupName> =
  Omit<MakeLayerOptions<N, "objectgroup">, "type"> &
    Omit<
      TiledLayerObjectgroup,
      | keyof MakeLayerOptions<N, "objectgroup">
      | MakeObjectGroupLayerPartials
      | "objects"
    > &
    Partial<Pick<TiledLayerObjectgroup, MakeObjectGroupLayerPartials>> & {
      objects: Omit<MakeObjectOptions, "id">[]
    }

export const makeObjectGroupLayer = <N extends TiledLayerObjectgroupName>({
  name,
  draworder = "topdown",
  objects,
}: MakeObjectGroupLayerOptions<N>): TiledLayerObjectgroup => ({
  ...makeLayer({ name, type: "objectgroup" }),
  draworder,
  objects: objects.map((obj, index) => makeObject({ ...obj, id: index + 1 })),
})

export type MakeTilemapOptions = {
  tilesets: {
    background: MakeTilesetOptions<BackgroundTileset>[]
    road: MakeTilesetOptions<RoadTileset>[]
    obstacles: MakeTilesetOptions<ObstacleTileset>[]
    scenery: MakeTilesetOptions<SceneryTileset>[]
  }
  layers: {
    background: Omit<MakeTileLayerOptions<"Background">, "name">
    road: Omit<MakeTileLayerOptions<"Road">, "name">
    obstacles: Omit<MakeTileLayerOptions<"Obstacles">, "name">
    scenery: Omit<MakeObjectGroupLayerOptions<"Scenery">, "name">
  }
}

export const makeTilemap = ({
  tilesets,
  layers,
}: MakeTilemapOptions): TiledMap => ({
  orientation: "orthogonal",
  renderorder: "right-down",
  version: 1,
  nextobjectid: 0,
  infinite: false,
  width: COLS,
  height: ROWS,
  tilewidth: 64,
  tileheight: 64,
  tilesets: Object.values(tilesets).flat().map(makeTileset),
  layers: [
    makeTileLayer({ name: "Background", ...layers.background }),
    makeTileLayer({ name: "Road", ...layers.road }),
    makeTileLayer({ name: "Obstacles", ...layers.obstacles }),
    makeObjectGroupLayer({ name: "Scenery", ...layers.scenery }),
  ],
})
