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
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.ROAD_TURN | Tilesets.Rotate[270],
    Tilesets.ROAD_STRAIGHT | Tilesets.Rotate[90],
    Tilesets.ROAD_TURN,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 4
  [
    Tilesets.GRASS,
    Tilesets.ROAD_STRAIGHT | Tilesets.Rotate[90],
    Tilesets.ROAD_STRAIGHT | Tilesets.Rotate[90],
    Tilesets.ROAD_TURN | Tilesets.Rotate[90],
    Tilesets.GRASS,
    Tilesets.ROAD_STRAIGHT,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 5
  [
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.ROAD_STRAIGHT,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 6
  [
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.ROAD_STRAIGHT,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
  // Row 7
  [
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.ROAD_TURN | Tilesets.Rotate[180],
    Tilesets.ROAD_DEAD_END | Tilesets.Rotate[90],
    Tilesets.GRASS,
    Tilesets.GRASS,
    Tilesets.GRASS,
  ],
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
  // forest above house
  {
    type: SVGs.Scenery.TREE1,
    x: 448,
    y: 120,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE1,
    x: 396,
    y: 142,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE1,
    x: 380,
    y: 300,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 448,
    y: 280,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 464,
    y: 220,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 400,
    y: 205,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },

  // forest above warehouse
  {
    type: SVGs.Scenery.TREE2,
    x: 64,
    y: 128,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 104,
    y: 88,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 168,
    y: 24,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 40,
    y: 24,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE1,
    x: 104,
    y: 24,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE1,
    x: 40,
    y: 80,
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
