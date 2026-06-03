import type { TiledTileset } from "tiled-types"

import { SVGs, Tilesets } from "../enums"
import {
  fillTileLayerRow,
  makeBackgroundTileLayer,
  makeObstaclesTileLayer,
  makeSceneryObjectGroupLayer,
  makeTilemap,
  makeTileset,
} from "."

const backgroundTilesets: TiledTileset[] = [
  makeTileset({
    image: SVGs.Background.GRASS,
    firstgid: Tilesets.GRASS,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Background.SNOW,
    firstgid: Tilesets.SNOW,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Background.Road.STRAIGHT,
    firstgid: Tilesets.ROAD_STRAIGHT,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Background.Road.DEAD_END,
    firstgid: Tilesets.ROAD_DEAD_END,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Background.Road.TURN,
    firstgid: Tilesets.ROAD_TURN,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
]

const obstacleTilesets: TiledTileset[] = [
  makeTileset({
    image: SVGs.Obstacles.PIGEON,
    firstgid: Tilesets.PIGEON,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Obstacles.TrafficLight.RED,
    firstgid: Tilesets.TRAFFIC_LIGHT_RED,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Obstacles.TrafficLight.GREEN,
    firstgid: Tilesets.TRAFFIC_LIGHT_GREEN,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
]

const sceneryTilesets: TiledTileset[] = [
  makeTileset({
    image: SVGs.Scenery.TREE1,
    firstgid: Tilesets.TREE1,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
  makeTileset({
    image: SVGs.Scenery.TREE2,
    firstgid: Tilesets.TREE2,
    tilewidth: 64,
    tileheight: 64,
    imagewidth: 64,
    imageheight: 64,
  }),
]

const backgroundTileLayer = makeBackgroundTileLayer([
  // Row 1
  fillTileLayerRow(Tilesets.GRASS),
  // Row 2
  fillTileLayerRow(Tilesets.GRASS),
  // Row 3
  [
    Tilesets.GRASS,
    Tilesets.ROAD_STRAIGHT | Tilesets.Rotate[90],
    Tilesets.ROAD_TURN,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 4
  [
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.ROAD_DEAD_END | Tilesets.Rotate[180],
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 5
  fillTileLayerRow(Tilesets.GRASS),
  // Row 6
  fillTileLayerRow(Tilesets.GRASS),
  // Row 7
  fillTileLayerRow(Tilesets.GRASS),
  // Row 8
  fillTileLayerRow(Tilesets.GRASS),
])

const obstaclesTileLayer = makeObstaclesTileLayer([
  // Row 1
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 2
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 3
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 4
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 5
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 6
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 7
  fillTileLayerRow(Tilesets.EMPTY),
  // Row 8
  fillTileLayerRow(Tilesets.EMPTY),
])

const sceneryObjectGroupLayer = makeSceneryObjectGroupLayer([
  {
    type: SVGs.Scenery.TREE2,
    x: 0,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 64,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 128,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 192,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 256,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 320,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 384,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 448,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 512,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 576,
    y: 64,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
])

export default makeTilemap({
  tilesets: [...backgroundTilesets, ...obstacleTilesets, ...sceneryTilesets],
  layers: [backgroundTileLayer, obstaclesTileLayer, sceneryObjectGroupLayer],
})
