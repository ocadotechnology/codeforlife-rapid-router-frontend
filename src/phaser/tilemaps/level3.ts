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
      {
        image: SVGs.Road.Asphalt.TURN,
        firstgid: Tilesets.Road.Asphalt.TURN,
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
      {
        image: SVGs.Scenery.TREE2,
        firstgid: Tilesets.Scenery.TREE2,
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
            cols: 2,
          }),
          Tilesets.Road.Asphalt.TURN,
          ...fillRow({ cols: 7 }),
        ],
        //row 4
        [
          ...fillRow({ cols: 2 }),
          rotate(Tilesets.Road.Asphalt.DEAD_END, 180),
          ...fillRow({ cols: 7 }),
        ],
        // Row 5 to 8 - 10 columns of empty tiles
        ...fillManyRows({ rows: 4 }),
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
      objects: [
        { type: SVGs.Scenery.TREE2, x: 0, y: 64 },
        { type: SVGs.Scenery.TREE2, x: 64, y: 64 },
        { type: SVGs.Scenery.TREE2, x: 128, y: 68 },
        { type: SVGs.Scenery.TREE2, x: 192, y: 64 },
        { type: SVGs.Scenery.TREE2, x: 256, y: 68 },
        { type: SVGs.Scenery.TREE2, x: 320, y: 60 },
        { type: SVGs.Scenery.TREE2, x: 384, y: 64 },
        { type: SVGs.Scenery.TREE2, x: 448, y: 68 },
        { type: SVGs.Scenery.TREE2, x: 512, y: 60 },
        { type: SVGs.Scenery.TREE2, x: 576, y: 64 },
      ],
    },
  },
})
