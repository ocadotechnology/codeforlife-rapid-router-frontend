import type { TiledMapOrthogonal as _OrthogonalTilemap } from "tiled-types"

import * as layers from "../layers"
import type * as tilesets from "../tilesets"
import { COLS, ROWS, TILE_HEIGHT, TILE_WIDTH } from "../globals"
import type { Background } from "../backgrounds"

type MakeTileLayerKwArgs<
  N extends layers.tile.Name,
  ID extends layers.tile.data.ID,
  COLS extends number,
  ROWS extends number,
> = Omit<layers.tile.MakeKwArgs<N, ID, NoInfer<COLS>, NoInfer<ROWS>>, "name">

type MakeObjectGroupLayerKwArgs<
  OGN extends layers.objectGroup.Name,
  ON extends layers.objectGroup.objects.Name,
  OID extends layers.objectGroup.objects.ID,
> = Omit<layers.objectGroup.MakeKwArgs<OGN, ON, OID>, "name" | "objects"> & {
  objects: Omit<layers.objectGroup.objects.MakeKwArgs<ON, OID>, "id">[]
}

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
      tile: {
        road: MakeTileLayerKwArgs<
          "Tile.ROAD",
          layers.tile.data.RoadID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >
        environment?: MakeTileLayerKwArgs<
          "Tile.ENVIRONMENT",
          layers.tile.data.EnvironmentID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >
      }
      objectGroup: {
        endpoints: MakeObjectGroupLayerKwArgs<
          "ObjectGroup.ENDPOINTS",
          layers.objectGroup.objects.endpoints.Name,
          tilesets.endpoints.ID
        >
        scenery?: MakeObjectGroupLayerKwArgs<
          "ObjectGroup.SCENERY",
          layers.objectGroup.objects.scenery.Name,
          tilesets.scenery.ID
        >
      }
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
  const makeTileLayer = <
    Name extends layers.tile.Name,
    ID extends layers.tile.data.ID,
  >(
    name: Name,
    {
      // Provide default values for width and height based on the tilemap.
      width = mapWidth,
      height = mapHeight,
      ...layer
    }: MakeTileLayerKwArgs<Name, ID, NoInfer<COLS>, NoInfer<ROWS>> = {
      data: layers.tile.data.fillManyRows({
        rows: mapHeight,
        cols: mapWidth,
      }) as (ID[] & { length: COLS })[] & { length: ROWS },
    },
  ) => layers.tile.make({ name, width, height, ...layer })

  let objectIdCounter = 1
  const makeObjectGroupLayer = <
    OGN extends layers.objectGroup.Name,
    ON extends layers.objectGroup.objects.Name,
    OID extends layers.objectGroup.objects.ID,
  >(
    name: OGN,
    {
      // Provide default values for width and height based on the tilemap.
      width = mapWidth,
      height = mapHeight,
      objects: _objects,
      ...layer
    }: MakeObjectGroupLayerKwArgs<OGN, ON, OID> = { objects: [] },
  ) =>
    layers.objectGroup.make({
      name,
      width,
      height,
      objects: _objects.map(
        // Provide default values for width and height based on the tilemap.
        ({ width = mapTileWidth, height = mapTileHeight, ...obj }) => ({
          id: objectIdCounter++,
          width,
          height,
          ...obj,
        }),
      ),
      ...layer,
    })

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
        // Provide default values for width and height based on the tilemap.
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
      makeTileLayer(layers.Names.Tile.ROAD, _layers.tile.road),
      makeTileLayer(layers.Names.Tile.ENVIRONMENT, _layers.tile.environment),
      makeObjectGroupLayer(
        layers.Names.ObjectGroup.ENDPOINTS,
        _layers.objectGroup.endpoints,
      ),
      makeObjectGroupLayer(
        layers.Names.ObjectGroup.SCENERY,
        _layers.objectGroup.scenery,
      ),
    ],
    ...tilemap,
  }
}
