import type { TiledMapOrthogonal as OrthogonalTileMap } from "tiled-types"

import type {
  BackgroundTileSetID,
  EnvironmentTileSetID,
  RoadTileSetID,
} from "../tileSets"
import { COLS, ROWS, TILE_HEIGHT, TILE_WIDTH } from "../constants"
import {
  type MakeObjectGroupLayerOptions,
  type MakeTileLayerOptions,
  makeObjectGroupLayer,
  makeTileLayer,
} from "../layers"

type MakeOrthogonalTileMapPartials =
  | "renderorder"
  | "version"
  | "nextobjectid"
  | "tilewidth"
  | "tileheight"
export type MakeOrthogonalTileMapOptions<
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<
  OrthogonalTileMap,
  MakeOrthogonalTileMapPartials | "orientation" | "layers" | "width" | "height"
> &
  Partial<Pick<OrthogonalTileMap, MakeOrthogonalTileMapPartials>> & {
    width?: COLS
    height?: ROWS
    layers: {
      background: Omit<
        MakeTileLayerOptions<"Background", BackgroundTileSetID, COLS, ROWS>,
        "name"
      >
      road: Omit<
        MakeTileLayerOptions<"Road", RoadTileSetID, COLS, ROWS>,
        "name"
      >
      environment: Omit<
        MakeTileLayerOptions<"Environment", EnvironmentTileSetID, COLS, ROWS>,
        "name"
      >
      scenery: Omit<MakeObjectGroupLayerOptions<"Scenery">, "name">
    }
  }

export const makeOrthogonalTileMap = <
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
  tilesets,
  layers,
  ...tilemap
}: MakeOrthogonalTileMapOptions<COLS, ROWS>): OrthogonalTileMap => {
  // Provide default values for layer dimensions based on the tilemap
  // dimensions. This ensures that if any layer is missing width or height, it
  // will default to the tilemap's width and height, maintaining consistency
  // across the map.
  const {
    width: backgroundWidth = mapWidth,
    height: backgroundHeight = mapHeight,
    ...backgroundLayer
  } = layers.background
  const {
    width: roadWidth = mapWidth,
    height: roadHeight = mapHeight,
    ...roadLayer
  } = layers.road
  const {
    width: environmentWidth = mapWidth,
    height: environmentHeight = mapHeight,
    ...environmentLayer
  } = layers.environment
  const {
    width: sceneryWidth = mapWidth,
    height: sceneryHeight = mapHeight,
    objects: sceneryObjects,
    ...sceneryLayer
  } = layers.scenery

  return {
    orientation: "orthogonal",
    renderorder,
    version,
    nextobjectid,
    width: mapWidth,
    height: mapHeight,
    tilewidth: mapTileWidth,
    tileheight: mapTileHeight,
    tilesets: tilesets.map(
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
      makeTileLayer({
        name: "Background",
        width: backgroundWidth,
        height: backgroundHeight,
        ...backgroundLayer,
      }),
      makeTileLayer({
        name: "Road",
        width: roadWidth,
        height: roadHeight,
        ...roadLayer,
      }),
      makeTileLayer({
        name: "Environment",
        width: environmentWidth,
        height: environmentHeight,
        ...environmentLayer,
      }),
      makeObjectGroupLayer({
        name: "Scenery",
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
