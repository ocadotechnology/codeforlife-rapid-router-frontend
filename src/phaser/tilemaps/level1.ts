import * as layers from "../layers"
import * as tilemaps from "./tilemaps"
import * as tilesets from "../tilesets"

export default tilemaps.makeOrthogonal({
  properties: { background: "grass" },
  tilesets: [
    tilesets.road.asphalt.straight,
    tilesets.road.asphalt.deadEnd,
    tilesets.endpoints.cfc.warehouse.default,
    tilesets.endpoints.house.common.orange,
    tilesets.scenery.common.tree1,
  ],
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 2 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
          // Row 3
          [
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 4 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 5 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 3,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.common.tree1({ col: 2, row: 4 }),
        ],
      },
    },
  },
})
