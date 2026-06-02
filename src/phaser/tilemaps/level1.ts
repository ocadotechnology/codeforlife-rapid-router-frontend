import type { TiledTileset } from "tiled-types"

import { SVGs, Tilesets } from "../enums"
import {
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
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
])

const obstaclesTileLayer = makeObstaclesTileLayer([
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 0, 0, 0, 4, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 4, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
])

const sceneryObjectGroupLayer = makeSceneryObjectGroupLayer([
  {
    type: SVGs.Scenery.TREE1,
    x: 128,
    y: 128,
    width: 64,
    height: 64,
    rotation: 0,
    properties: [],
  },
  {
    type: SVGs.Scenery.TREE2,
    x: 256,
    y: 128,
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
