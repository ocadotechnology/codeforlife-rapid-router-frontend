import Phaser from "phaser"

import type BaseScene from "./scenes/BaseScene"

export default class extends Phaser.GameObjects.Graphics {
  constructor(scene: BaseScene) {
    super(scene)
  }

  /**
   * Draws an arrow from (x1, y1) to (x2, y2).
   * The arrowhead is a filled isosceles triangle of the given width and height.
   * The Graphics object must already have lineStyle and fillStyle set.
   *
   * @param x1 - The x-coordinate of the start point of the arrow.
   * @param y1 - The y-coordinate of the start point of the arrow.
   * @param x2 - The x-coordinate of the end point of the arrow.
   * @param y2 - The y-coordinate of the end point of the arrow.
   * @param headWidth - The width of the arrowhead triangle.
   * @param headHeight - The height of the arrowhead triangle.
   * @returns The Graphics object for chaining.
   */
  arrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    headWidth: number,
    headHeight: number,
  ) {
    this.lineBetween(x1, y1, x2, y2)

    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)

    // Line unit vector.
    const udx = dx / len
    const udy = dy / len

    // Perpendicular unit vector.
    const pdx = -udy
    const pdy = udx

    // Arrowhead base vertices.
    const x3 = x2 - headHeight * udx + headWidth * pdx
    const y3 = y2 - headHeight * udy + headWidth * pdy
    const x4 = x2 - headHeight * udx - headWidth * pdx
    const y4 = y2 - headHeight * udy - headWidth * pdy

    this.fillTriangle(x2, y2, x3, y3, x4, y4)

    return this
  }

  /**
   * Draws a grid with the given cell dimensions and number of columns and rows.
   * The Graphics object must already have lineStyle set.
   *
   * @param cols - The number of columns in the grid.
   * @param rows - The number of rows in the grid.
   * @param cellWidth - The width of each cell in the grid.
   * @param cellHeight - The height of each cell in the grid.
   * @returns The Graphics object for chaining.
   */
  grid(cols: number, rows: number, cellWidth: number, cellHeight: number) {
    // Draw vertical lines.
    const gridHeight = rows * cellHeight
    for (let col = 0; col <= cols; col++) {
      const x = col * cellWidth
      this.moveTo(x, 0)
      this.lineTo(x, gridHeight)
    }

    // Draw horizontal lines.
    const gridWidth = cols * cellWidth
    for (let row = 0; row <= rows; row++) {
      const y = row * cellHeight
      this.moveTo(0, y)
      this.lineTo(gridWidth, y)
    }

    // Stroke the grid lines to render them on the scene.
    this.strokePath()

    return this
  }
}
