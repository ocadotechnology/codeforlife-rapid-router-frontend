import type Phaser from "phaser"

import BaseLevel from "../BaseLevel"
import { SVGs } from "../../enums"
import { Scenes } from "."

/**
 * The Level Scene is responsible for providing a user interface and tools for
 * designing and creating game levels. This scene allows developers or players
 * to place game objects, set up the environment, and define the layout of a
 * level. It typically includes features such as a grid system, object placement
 * tools, and options for saving and loading created levels. The Level Scene is
 * an essential part of the game development process, enabling the creation of
 * engaging and diverse gameplay experiences.
 */
export default class extends BaseLevel {
  lineGraphics!: Phaser.GameObjects.Graphics

  constructor() {
    super(Scenes.LEVEL)
  }

  create() {
    const COLS = 10
    const ROWS = 8
    const CELL_SIZE = 64
    const gridWidth = COLS * CELL_SIZE
    const gridHeight = ROWS * CELL_SIZE

    this.cameras.main.setZoom(1)

    this.createTilemap({
      key: "level",
      backgroundTilesetNames: [SVGs.Background.GRASS._],
      roadTilesetNames: [
        SVGs.Road.Asphalt.CROSSROADS._,
        SVGs.Road.Asphalt.DEAD_END._,
        SVGs.Road.Asphalt.STRAIGHT._,
        SVGs.Road.Asphalt.T_JUNCTION._,
        SVGs.Road.Asphalt.TURN._,
      ],
      environmentTilesetNames: [
        SVGs.Environment.Grass.CFC._,
        SVGs.Environment.Grass.HOUSE._,
        SVGs.Environment.Grass.SOLAR_PANEL._,
        SVGs.Environment.TrafficLight.RED._,
      ],
      sceneryObjectTypes: [
        SVGs.Scenery.BUSH._,
        SVGs.Scenery.POND._,
        SVGs.Scenery.TREE1._,
        SVGs.Scenery.TREE2._,
      ],
    })

    this.addLineGraphics(COLS, ROWS, gridWidth, gridHeight, CELL_SIZE)

    // ── Camera ───────────────────────────────────────────────────────────────
    this.cameras.main.centerOn(gridWidth / 2, gridHeight / 2)
  }

  private addLineGraphics(
    cols: number,
    rows: number,
    gridWidth: number,
    gridHeight: number,
    cellSize: number,
  ) {
    // The tilemap has no built-in renderer, so draw grid lines explicitly.
    this.lineGraphics = this.add.graphics().lineStyle(1, 0x000000, 1)

    // Draw vertical lines.
    for (let col = 0; col <= cols; col++) {
      this.lineGraphics.moveTo(col * cellSize, 0)
      this.lineGraphics.lineTo(col * cellSize, gridHeight)
    }

    // Draw horizontal lines.
    for (let row = 0; row <= rows; row++) {
      this.lineGraphics.moveTo(0, row * cellSize)
      this.lineGraphics.lineTo(gridWidth, row * cellSize)
    }

    // Stroke the grid lines to render them on the scene.
    this.lineGraphics.strokePath()
  }
}
