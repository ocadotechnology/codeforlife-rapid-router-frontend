import type {
  TiledLayerObjectgroup,
  TiledLayerTilelayer,
  default as TiledMap,
  TiledObject,
  TiledTileset,
} from "tiled-types"

import type { Tilesets } from "../enums"

export const width = 10
export const height = 8

// type TileLayerRow = Tilesets[] & { length: typeof width }
type TileLayerRow = number[] & { length: typeof width }
type TileLayerData = TileLayerRow[] & { length: typeof height }
type TiledLayerObjectGroupObjects = Pick<
  TiledObject,
  "type" | "x" | "y" | "width" | "height" | "rotation" | "properties"
>

function makeLayer<T extends string>({
  name,
  type,
}: {
  name: string
  type: T
}) {
  return {
    name,
    type,
    x: 0,
    y: 0,
    width,
    height,
    opacity: 1,
    visible: true,
  }
}

export function fillTileLayerRow(gid: Tilesets): TileLayerRow {
  return Array<Tilesets>(width).fill(gid) as TileLayerRow
}

export function makeTileLayer({
  name,
  data,
}: Pick<TiledLayerTilelayer, "name"> & {
  data: TileLayerData
}): TiledLayerTilelayer {
  return { ...makeLayer({ name, type: "tilelayer" }), data: data.flat() }
}

export function makeObjectGroupLayer({
  name,
  objects,
}: Pick<TiledLayerObjectgroup, "name"> & {
  objects: TiledLayerObjectGroupObjects[]
}): TiledLayerObjectgroup {
  return {
    ...makeLayer({ name, type: "objectgroup" }),
    draworder: "topdown",
    objects: objects.map((obj, index) => ({
      id: index + 1, // Auto-increment unique IDs for objects starting from 1.
      name: obj.type, // Use the object's type as its name for consistency.
      visible: true, // Set all objects to be visible by default.
      ...obj,
    })),
  }
}

export function makeBackgroundTileLayer(data: TileLayerData) {
  return makeTileLayer({ name: "Background", data })
}

export function makeObstaclesTileLayer(data: TileLayerData) {
  return makeTileLayer({ name: "Obstacles", data })
}

export function makeSceneryObjectGroupLayer(
  objects: TiledLayerObjectGroupObjects[],
) {
  return makeObjectGroupLayer({ name: "Scenery", objects })
}

export function makeTileset(
  tiledTileset: Pick<
    TiledTileset,
    | "firstgid"
    | "imageheight"
    | "imagewidth"
    | "tileheight"
    | "tilewidth"
    | "image"
  >,
): TiledTileset {
  return {
    name: tiledTileset.image as string, // Use the image path as the name for simplicity.
    tilecount: 1,
    columns: 1,
    spacing: 0,
    margin: 0,
    tiles: [],
    ...tiledTileset,
  }
}

export function makeTilemap(
  tiledMap: Pick<TiledMap, "tilesets" | "layers">,
): TiledMap {
  return {
    orientation: "orthogonal",
    renderorder: "right-down",
    version: 1,
    nextobjectid: 0,
    infinite: false,
    width,
    height,
    tilewidth: 64,
    tileheight: 64,
    ...tiledMap,
  }
}
