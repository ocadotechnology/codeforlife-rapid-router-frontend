import type { TiledMapOrthogonal as _OrthogonalTilemap } from "tiled-types"

import * as layers from "../layers"
import type * as tilesets from "../tilesets"
import { COLS, ROWS, TILE_HEIGHT, TILE_WIDTH } from "../globals"
import type { Background } from "../backgrounds"

export type OrthogonalTilemap = Omit<
  _OrthogonalTilemap,
  "layers" | "tilesets" | "properties"
> & {
  layers: layers.Layer[]
  tilesets: tilesets.Tileset<tilesets.ID, any>[]
  properties: [
    {
      name: "background"
      type: "string"
      value: Background
    },
  ]
}

type MakeOrthogonalPartials =
  | "renderorder"
  | "version"
  | "nextobjectid"
  | "tilewidth"
  | "tileheight"
export type MakeOrthogonalKwArgs<
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<
  OrthogonalTilemap,
  | MakeOrthogonalPartials
  | "orientation"
  | "layers"
  | "width"
  | "height"
  | "properties"
> &
  Partial<Pick<OrthogonalTilemap, MakeOrthogonalPartials>> & {
    width?: COLS
    height?: ROWS
    properties: { background: Background }
    layers: {
      road: Omit<
        layers.tile.MakeKwArgs<
          "road",
          layers.tile.data.RoadID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >,
        "name"
      >
      environment: Omit<
        layers.tile.MakeKwArgs<
          "environment",
          layers.tile.data.EnvironmentID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >,
        "name"
      >
      scenery: Omit<
        layers.objectGroup.MakeKwArgs<"scenery", tilesets.scenery.ID>,
        "name"
      >
    }
  }

export const makeOrthogonal = <
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  renderorder = "right-down",
  version = 1,
  nextobjectid = 0,
  width: mapWidth = COLS as COLS,
  height: mapHeight = ROWS as ROWS,
  tilewidth: mapTileWidth = TILE_WIDTH,
  tileheight: mapTileHeight = TILE_HEIGHT,
  properties,
  tilesets: _tilesets,
  layers: _layers,
  ...tilemap
}: MakeOrthogonalKwArgs<COLS, ROWS>): OrthogonalTilemap => {
  // Provide default values for layer dimensions based on the tilemap
  // dimensions. This ensures that if any layer is missing width or height, it
  // will default to the tilemap's width and height, maintaining consistency
  // across the map.
  const {
    width: roadWidth = mapWidth,
    height: roadHeight = mapHeight,
    ...roadLayer
  } = _layers.road
  const {
    width: environmentWidth = mapWidth,
    height: environmentHeight = mapHeight,
    ...environmentLayer
  } = _layers.environment
  const {
    width: sceneryWidth = mapWidth,
    height: sceneryHeight = mapHeight,
    objects: sceneryObjects,
    ...sceneryLayer
  } = _layers.scenery

  return {
    orientation: "orthogonal",
    renderorder,
    version,
    nextobjectid,
    width: mapWidth,
    height: mapHeight,
    tilewidth: mapTileWidth,
    tileheight: mapTileHeight,
    properties: [
      { name: "background", type: "string", value: properties.background },
    ],
    tilesets: _tilesets.map(
      ({
        // Provide default values for width and height based on the tilewidth
        // and tileheight of the tilemap.
        imagewidth = mapTileWidth,
        imageheight = mapTileHeight,
        tilewidth = mapTileWidth,
        tileheight = mapTileHeight,
        ...tileset
      }) => ({
        imagewidth,
        imageheight,
        tilewidth,
        tileheight,
        ...tileset,
      }),
    ),
    layers: [
      layers.tile.make({
        name: layers.Names.Tile.ROAD,
        width: roadWidth,
        height: roadHeight,
        ...roadLayer,
      }),
      layers.tile.make({
        name: layers.Names.Tile.ENVIRONMENT,
        width: environmentWidth,
        height: environmentHeight,
        ...environmentLayer,
      }),
      layers.objectGroup.make({
        name: layers.Names.ObjectGroup.SCENERY,
        width: sceneryWidth,
        height: sceneryHeight,
        objects: sceneryObjects.map(
          // Provide default values for width and height based on the tilewidth
          // and tileheight of the tilemap.
          ({ width = mapTileWidth, height = mapTileHeight, ...obj }) => ({
            width,
            height,
            ...obj,
          }),
        ),
        ...sceneryLayer,
      }),
    ],
    ...tilemap,
  }
}
