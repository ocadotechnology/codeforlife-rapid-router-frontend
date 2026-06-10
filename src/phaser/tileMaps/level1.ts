import * as asphaltRoadTileSets from "../tileSets/road/asphalt"
import * as backgroundTileSets from "../tileSets/background"
import * as commonEnvironmentTileSets from "../tileSets/environment/common"
import * as commonSceneryObjects from "../objects/scenery/common"
import * as commonSceneryTileSets from "../tileSets/scenery/common"
import { fillManyTileLayerRows, fillTileLayerRow } from "../layers"
import { makeOrthogonalTileMap } from "."
import { rotateTileSet } from "../tileSets"

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
      data: fillManyTileLayerRows({ id: backgroundTileSets.grass.firstgid }),
    },
    road: {
      data: [
        // Row 1
        [
          0,
          rotateTileSet(asphaltRoadTileSets.straight.firstgid, 90),
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
          commonEnvironmentTileSets.trafficLight.red.firstgid,
          ...fillTileLayerRow({ cols: 4 }), // 4 columns of empty tiles
        ],
        fillTileLayerRow(), // Row 4 - 10 columns of empty tiles
        // Row 5
        [
          ...fillTileLayerRow({ cols: 2 }), // 2 columns of empty tiles
          commonEnvironmentTileSets.trafficLight.red.firstgid,
          ...fillTileLayerRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 6
        [
          ...fillTileLayerRow({ cols: 9 }), // 9 columns of empty tiles
          commonEnvironmentTileSets.trafficLight.red.firstgid,
        ],
        // Row 7 to 8 - 10 columns of empty tiles
        ...fillManyTileLayerRows({ rows: 2 }),
      ],
    },
    scenery: {
      objects: [
        { ...commonSceneryObjects.tree1, x: 128, y: 128 },
        { ...commonSceneryObjects.tree2, x: 256, y: 128 },
      ],
    },
  },
})
