import type Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import HUD from "./HUD"

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
    super.create()

    this.addLineGraphics()

    this.scene.launch(HUD.KEY)
  }

  private addLineGraphics() {
    // The tilemap has no built-in renderer, so draw grid lines explicitly.
    this.lineGraphics = this.add.graphics().lineStyle(1, 0x000000, 1)

    // Draw vertical lines.
    const mapHeight = this.tilemap.height * this.tilemap.tileHeight
    for (let col = 0; col <= this.tilemap.width; col++) {
      const x = col * this.tilemap.tileWidth
      this.lineGraphics.moveTo(x, 0)
      this.lineGraphics.lineTo(x, mapHeight)
    }

    // Draw horizontal lines.
    const mapWidth = this.tilemap.width * this.tilemap.tileWidth
    for (let row = 0; row <= this.tilemap.height; row++) {
      const y = row * this.tilemap.tileHeight
      this.lineGraphics.moveTo(0, y)
      this.lineGraphics.lineTo(mapWidth, y)
    }

    // Stroke the grid lines to render them on the scene.
    this.lineGraphics.strokePath()
  }
}
