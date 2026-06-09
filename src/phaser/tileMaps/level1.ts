import * as asphaltRoadTileSets from "../tileSets/road/asphalt"
import * as backgroundTileSets from "../tileSets/background"
import * as commonEnvironmentTileSets from "../tileSets/environment/common"
import * as commonSceneryTileSets from "../tileSets/scenery/common"
import { TileSetIDs, rotateTileSet } from "../tileSets"
import { fillManyTileLayerRows, fillTileLayerRow } from "../layers"
import { SVGs } from "../enums"
import { makeOrthogonalTileMap } from "."

export default makeOrthogonalTileMap({
  tilesets: [
    backgroundTileSets.grass,
    asphaltRoadTileSets.straight,
    commonEnvironmentTileSets.trafficLight.red,
    commonEnvironmentTileSets.trafficLight.green,
    commonSceneryTileSets.tree1,
    commonSceneryTileSets.tree2,
  ],
  layers: {
    // Rows 1 to 8 - 10 columns of grass tiles
    background: {
      data: fillManyTileLayerRows({ id: TileSetIDs.Background.GRASS }),
    },
    road: {
      data: [
        // Row 1
        [
          TileSetIDs.EMPTY,
          rotateTileSet(TileSetIDs.Road.Asphalt.STRAIGHT, 90),
          ...fillTileLayerRow({ cols: 8 }),
        ],
        // Row 2 to 8 - 10 columns of empty tiles
        ...fillManyTileLayerRows({ rows: 7 }),
      ],
    },
    environment: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...fillManyTileLayerRows({ rows: 2 }),
        // Row 3
        [
          ...fillTileLayerRow({ cols: 5 }), // 5 columns of empty tiles
          TileSetIDs.Environment.TrafficLight.RED,
          ...fillTileLayerRow({ cols: 4 }), // 4 columns of empty tiles
        ],
        fillTileLayerRow(), // Row 4 - 10 columns of empty tiles
        // Row 5
        [
          ...fillTileLayerRow({ cols: 2 }), // 2 columns of empty tiles
          TileSetIDs.Environment.TrafficLight.RED,
          ...fillTileLayerRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 6
        [
          ...fillTileLayerRow({ cols: 9 }), // 9 columns of empty tiles
          TileSetIDs.Environment.TrafficLight.RED,
        ],
        // Row 7 to 8 - 10 columns of empty tiles
        ...fillManyTileLayerRows({ rows: 2 }),
      ],
    },
    scenery: {
      objects: [
        {
          type: SVGs.Scenery.TREE1._,
          x: 128,
          y: 128,
        },
        {
          type: SVGs.Scenery.TREE2._,
          x: 256,
          y: 128,
        },
      ],
    },
  },
})
