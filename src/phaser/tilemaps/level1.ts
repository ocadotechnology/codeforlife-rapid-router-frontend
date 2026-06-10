import * as layers from "../layers"
import * as objects from "../objects"
import * as tilemaps from "./tilemaps"
import * as tilesets from "../tilesets"

export default tilemaps.makeOrthogonal({
  tilesets: [
    tilesets.background.grass,
    tilesets.road.asphalt.straight,
    tilesets.road.asphalt.deadEnd,
    tilesets.environment.common.trafficLight.red,
    tilesets.scenery.common.tree1,
    tilesets.scenery.common.tree2,
  ],
  layers: {
    // Rows 1 to 8 - 10 columns of grass tiles
    background: {
      data: layers.tile.fillManyRows({ id: tilesets.IDs.Background.GRASS }),
    },
    road: {
      data: [
        // Row 1
        [
          tilesets.IDs.EMPTY,
          tilesets.rotateC(tilesets.IDs.Road.Asphalt.STRAIGHT, 90),
          tilesets.rotateC(tilesets.IDs.Road.Asphalt.DEAD_END, 90),
          ...layers.tile.fillRow({ cols: 7 }),
        ],
        // Row 2 to 8 - 10 columns of empty tiles
        ...layers.tile.fillManyRows({ rows: 7 }),
      ],
    },
    environment: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...layers.tile.fillManyRows({ rows: 2 }),
        // Row 3
        [
          ...layers.tile.fillRow({ cols: 5 }), // 5 columns of empty tiles
          tilesets.IDs.Environment.Common.TrafficLight.RED,
          ...layers.tile.fillRow({ cols: 4 }), // 4 columns of empty tiles
        ],
        layers.tile.fillRow(), // Row 4 - 10 columns of empty tiles
        // Row 5
        [
          ...layers.tile.fillRow({ cols: 2 }), // 2 columns of empty tiles
          tilesets.IDs.Environment.Common.TrafficLight.RED,
          ...layers.tile.fillRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 6
        [
          ...layers.tile.fillRow({ cols: 9 }), // 9 columns of empty tiles
          tilesets.IDs.Environment.Common.TrafficLight.RED,
        ],
        // Row 7 to 8 - 10 columns of empty tiles
        ...layers.tile.fillManyRows({ rows: 2 }),
      ],
    },
    scenery: {
      objects: [
        { ...objects.scenery.common.tree1, x: 128, y: 128 },
        { ...objects.scenery.common.tree2, x: 256, y: 128 },
      ],
    },
  },
})
