import type { TiledMapOrthogonal as OrthogonalTilemap } from "tiled-types"

import * as layers from "../layers"
import type * as tilesets from "../tilesets"
import { COLS, ROWS, TILE_HEIGHT, TILE_WIDTH } from "../constants"

type MakeOrthogonalTilemapPartials =
  | "renderorder"
  | "version"
  | "nextobjectid"
  | "tilewidth"
  | "tileheight"
export type MakeOrthogonalTilemapKwArgs<
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<
  OrthogonalTilemap,
  MakeOrthogonalTilemapPartials | "orientation" | "layers" | "width" | "height"
> &
  Partial<Pick<OrthogonalTilemap, MakeOrthogonalTilemapPartials>> & {
    width?: COLS
    height?: ROWS
    layers: {
      background: Omit<
        layers.tile.MakeKwArgs<
          "background",
          tilesets.background.ID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >,
        "name"
      >
      road: Omit<
        layers.tile.MakeKwArgs<
          "road",
          // Road tiles can be empty.
          typeof tilesets.IDs.EMPTY | tilesets.road.ID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >,
        "name"
      >
      environment: Omit<
        layers.tile.MakeKwArgs<
          "environment",
          // Environment tiles can be empty.
          typeof tilesets.IDs.EMPTY | tilesets.environment.ID,
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
  tilesets: _tilesets,
  layers: _layers,
  ...tilemap
}: MakeOrthogonalTilemapKwArgs<COLS, ROWS>): OrthogonalTilemap => {
  // Provide default values for layer dimensions based on the tilemap
  // dimensions. This ensures that if any layer is missing width or height, it
  // will default to the tilemap's width and height, maintaining consistency
  // across the map.
  const {
    width: backgroundWidth = mapWidth,
    height: backgroundHeight = mapHeight,
    ...backgroundLayer
  } = _layers.background
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
        name: layers.Names.Tile.BACKGROUND,
        width: backgroundWidth,
        height: backgroundHeight,
        ...backgroundLayer,
      }),
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
