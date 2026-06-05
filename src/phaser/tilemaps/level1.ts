import { SVGs, Tilesets } from "../enums"
import { fillManyRows, fillRow, rotate } from "../utils/tileset"
import { makeOrthogonalTilemap } from "."

export default makeOrthogonalTilemap({
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
    environment: [
      {
        image: SVGs.Environment.TrafficLight.RED,
        firstgid: Tilesets.Environment.TrafficLight.RED,
      },
    ],
    scenery: [
      {
        image: SVGs.Scenery.TREE1,
        firstgid: Tilesets.Scenery.TREE1,
      },
      {
        image: SVGs.Scenery.TREE2,
        firstgid: Tilesets.Scenery.TREE2,
      },
    ],
  },
  layers: {
    // Rows 1 to 8 - 10 columns of grass tiles
    background: {
      data: fillManyRows({ id: Tilesets.Background.GRASS }),
    },
    road: {
      data: [
        // Row 1
        [
          Tilesets.EMPTY,
          rotate(Tilesets.Road.Asphalt.STRAIGHT, 90),
          ...fillRow({ cols: 8 }),
        ],
        // Row 2 to 8 - 10 columns of empty tiles
        ...fillManyRows({ rows: 7 }),
      ],
    },
    environment: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...fillManyRows({ rows: 2 }),
        // Row 3
        [
          ...fillRow({ cols: 5 }), // 5 columns of empty tiles
          Tilesets.Environment.TrafficLight.RED,
          ...fillRow({ cols: 4 }), // 4 columns of empty tiles
        ],
        fillRow(), // Row 4 - 10 columns of empty tiles
        // Row 5
        [
          ...fillRow({ cols: 2 }), // 2 columns of empty tiles
          Tilesets.Environment.TrafficLight.RED,
          ...fillRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 6
        [
          ...fillRow({ cols: 9 }), // 9 columns of empty tiles
          Tilesets.Environment.TrafficLight.RED,
        ],
        // Row 7 to 8 - 10 columns of empty tiles
        ...fillManyRows({ rows: 2 }),
      ],
    },
    scenery: {
      objects: [
        {
          type: SVGs.Scenery.TREE1,
          x: 128,
          y: 128,
        },
        {
          type: SVGs.Scenery.TREE2,
          x: 256,
          y: 128,
        },
      ],
    },
  },
})
