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
      {
        image: SVGs.Road.Asphalt.DEAD_END,
        firstgid: Tilesets.Road.Asphalt.DEAD_END,
      },
    ],
    environment: [
      {
        image: SVGs.Environment.Grass.CFC,
        firstgid: Tilesets.Environment.Grass.CFC,
      },
    ],
    scenery: [
      {
        image: SVGs.Scenery.TREE1,
        firstgid: Tilesets.Scenery.TREE1,
      },
    ],
  },
  layers: {
    background: {
      // Rows 1 to 8 - 10 columns of grass tiles
      data: fillManyRows({ tileset: Tilesets.Background.GRASS }),
    },
    road: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...fillManyRows({ rows: 2 }),
        // Row 3
        [
          // 2 columns of straight road tiles rotated 90° to be horizontal
          ...fillRow({
            tileset: rotate(Tilesets.Road.Asphalt.STRAIGHT, 90),
            cols: 3,
          }),
          rotate(Tilesets.Road.Asphalt.DEAD_END, 90),
          ...fillRow({ cols: 7 }), // 7 columns of empty tiles
        ],
        // Row 4 to 8 - 10 columns of empty tiles
        ...fillManyRows({ rows: 5 }),
      ],
    },
    environment: {
      data: [
        // Row 1 to 2 - 10 columns of empty tiles
        ...fillManyRows({ rows: 2 }),
        // Row 3
        [
          rotate(Tilesets.Environment.Grass.CFC, 90),
          ...fillRow({ cols: 9 }), // 9 columns of empty tiles
        ],
        // Row 4 to 8 - 10 columns of empty tiles
        ...fillManyRows({ rows: 5 }),
      ],
    },
    scenery: {
      objects: [{ type: SVGs.Scenery.TREE1, x: 48, y: 208 }],
    },
  },
})
