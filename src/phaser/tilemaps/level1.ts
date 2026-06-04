import * as TilesetUtils from "../utils/tileset"
import { SVGs, Tilesets } from "../enums"
import { makeTilemap } from "."

export default makeTilemap({
  tilesets: {
    background: [
      {
        image: SVGs.Background.GRASS,
        firstgid: Tilesets.Background.GRASS,
      },
    ],
    road: [
      {
        image: SVGs.Road.Asphalt.STRAIGHT,
        firstgid: Tilesets.Road.Asphalt.STRAIGHT,
      },
    ],
    obstacles: [
      {
        image: SVGs.Obstacles.TrafficLight.RED,
        firstgid: Tilesets.Obstacles.TrafficLight.RED,
      },
    ],
    scenery: [
      {
        image: SVGs.Scenery.Grass.TREE1,
        firstgid: Tilesets.Scenery.Grass.TREE1,
      },
      {
        image: SVGs.Scenery.Grass.TREE2,
        firstgid: Tilesets.Scenery.Grass.TREE2,
      },
    ],
  },
  layers: {
    // Rows 1 to 8 - 10 columns of grass tiles
    background: {
      data: TilesetUtils.fillManyRows({ id: Tilesets.Background.GRASS }),
    },
    road: {
      data: [
        // Row 1
        [
          Tilesets.EMPTY,
          TilesetUtils.rotateRight(Tilesets.Road.Asphalt.STRAIGHT),
          ...TilesetUtils.fillRow({ cols: 8 }),
        ],
        // Row 2 to 8 - 10 columns of empty tiles
        ...TilesetUtils.fillManyRows({ rows: 7 }),
      ],
    },
    obstacles: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...TilesetUtils.fillManyRows({ rows: 2 }),
        // Row 3
        [
          ...TilesetUtils.fillRow({ cols: 5 }), // 5 columns of empty tiles
          Tilesets.Obstacles.TrafficLight.RED,
          ...TilesetUtils.fillRow({ cols: 4 }), // 4 columns of empty tiles
        ],
        TilesetUtils.fillRow(), // Row 4 - 10 columns of empty tiles
        // Row 5
        [
          ...TilesetUtils.fillRow({ cols: 2 }), // 2 columns of empty tiles
          Tilesets.Obstacles.TrafficLight.RED,
          ...TilesetUtils.fillRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 6
        [
          ...TilesetUtils.fillRow({ cols: 9 }), // 9 columns of empty tiles
          Tilesets.Obstacles.TrafficLight.RED,
        ],
        // Row 7 to 8 - 10 columns of empty tiles
        ...TilesetUtils.fillManyRows({ rows: 2 }),
      ],
    },
    scenery: {
      objects: [
        {
          type: SVGs.Scenery.Grass.TREE1,
          x: 128,
          y: 128,
        },
        {
          type: SVGs.Scenery.Grass.TREE2,
          x: 256,
          y: 128,
        },
      ],
    },
  },
})
