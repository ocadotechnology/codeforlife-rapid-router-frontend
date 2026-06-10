import type Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import {
  COLS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ROWS,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "../../constants"

export interface LevelData extends BaseLevelData {}

/**
 * The Level Scene is responsible for providing a user interface and tools for
 * designing and creating game levels. This scene allows developers or players
 * to place game objects, set up the environment, and define the layout of a
 * level. It typically includes features such as a grid system, object placement
 * tools, and options for saving and loading created levels. The Level Scene is
 * an essential part of the game development process, enabling the creation of
 * engaging and diverse gameplay experiences.
 */
export default class extends BaseLevel<LevelData> {
  lineGraphics!: Phaser.GameObjects.Graphics

  create() {
    this.cameras.main.setZoom(1)

    this.createTilemap({ key: "level" })

    this.addLineGraphics()

    // ── Camera ───────────────────────────────────────────────────────────────
    this.cameras.main.centerOn(MAP_WIDTH / 2, MAP_HEIGHT / 2)
  }

  private addLineGraphics() {
    // The tilemap has no built-in renderer, so draw grid lines explicitly.
    this.lineGraphics = this.add.graphics().lineStyle(1, 0x000000, 1)

    // Draw vertical lines.
    for (let col = 0; col <= COLS; col++) {
      this.lineGraphics.moveTo(col * TILE_WIDTH, 0)
      this.lineGraphics.lineTo(col * TILE_WIDTH, MAP_HEIGHT)
    }

    // Draw horizontal lines.
    for (let row = 0; row <= ROWS; row++) {
      this.lineGraphics.moveTo(0, row * TILE_HEIGHT)
      this.lineGraphics.lineTo(MAP_WIDTH, row * TILE_HEIGHT)
    }

    // Stroke the grid lines to render them on the scene.
    this.lineGraphics.strokePath()
  }
}
