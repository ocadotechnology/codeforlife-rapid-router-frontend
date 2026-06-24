import * as layers from "../layers"
import * as tilemaps from "./tilemaps"
import * as tilesets from "../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

export default tilemaps.makeOrthogonal({
  properties: { background: "grass" },
  tilesets: [
    tilesets.road.asphalt.straight,
    tilesets.road.asphalt.deadEnd,
    tilesets.endpoints.cfc.warehouse.default,
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
          {
            ...layers.objectGroup.objects.endpoints.cfc.warehouse.default.RIGHT,
            x: TILE_WIDTH * 1,
            y: TILE_HEIGHT * 3,
          },
        ],
      },
      scenery: {
        objects: [
          {
            ...layers.objectGroup.objects.scenery.common.tree1,
            x: TILE_WIDTH * 1,
            y: TILE_HEIGHT * 4,
          },
        ],
      },
    },
  },
})
