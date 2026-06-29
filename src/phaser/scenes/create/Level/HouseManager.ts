import type Phaser from "phaser"

import * as layers from "../../../layers"
import type { default as Level, Tile } from "."
import BaseManager from "./BaseManager"

export default class extends BaseManager {
  /**
   * Persistent 2D array [row][col] indicating whether each tile is occupied by
   * a house.
   */
  readonly occupied: boolean[][]

  constructor(level: Level) {
    super(level)

    this.occupied = Array.from({ length: this.level.tilemap.height }, () =>
      Array.from({ length: this.level.tilemap.width }, () => false),
    )
  }

  get type() {
    // TODO: select the house type from the toolbox.
    return layers.objectGroup.objects.endpoints.house.common.orange
  }

  /** Checks if a house can be added at the given tile. */
  private canAdd(row: number, col: number) {
    return this.level.road.dirs[row][col].size > 0
    //&& !this.road.hasHouse[row][col]
  }

  /**
   * Places a house on the environment layer at the given tile.
   *
   * The house orientation depends on the road directions on the tile.
   */
  add(row: number, col: number) {
    // Require a road on this tile.
    if (!this.canAdd(row, col)) return

    const roadId = this.level.road.getIdFromDirs(this.level.road.dirs[row][col])

    const variants = this.getVariantsFromRoadId(roadId)
    if (variants.length === 0) return

    // TODO: choose the correct house variant based on whether other houses are
    // currently present on the tile.
    const house = variants[0]
    if (!house) return

    this.occupied[row][col] = true
    for (const tile of this.getCrossoverTilesFromVariant(row, col, house))
      this.occupied[tile.row][tile.col] = true

    this.level.addObject(
      "ObjectGroup.ENDPOINTS",
      // TODO: fix the +1 offset so the house is centered on the tile.
      house({ col: col + 1, row: row + 1 }),
    )
  }

  /** Returns the house variants for a given road ID. */
  private getVariantsFromRoadId(
    roadId: layers.tile.data.RoadID,
  ): (typeof this.type)[
    | keyof layers.objectGroup.objects.StraightRotationVariants
    | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants][] {
    // Straight
    if (roadId === this.level.road.ids.Straight.HORIZONTAL)
      return [this.type.top, this.type.bottom]
    if (roadId === this.level.road.ids.Straight.VERTICAL)
      return [this.type.left, this.type.right]
    // Dead end
    if (roadId === this.level.road.ids.DeadEnd.TOP)
      return [this.type.left, this.type.top, this.type.right]
    if (roadId === this.level.road.ids.DeadEnd.BOTTOM)
      return [this.type.left, this.type.bottom, this.type.right]
    if (roadId === this.level.road.ids.DeadEnd.LEFT)
      return [this.type.top, this.type.left, this.type.bottom]
    if (roadId === this.level.road.ids.DeadEnd.RIGHT)
      return [this.type.top, this.type.right, this.type.bottom]
    // Turn
    if (roadId === this.level.road.ids.Turn.TOP_LEFT)
      return [this.type.outTopLeft, this.type.inBottomRight]
    if (roadId === this.level.road.ids.Turn.TOP_RIGHT)
      return [this.type.outTopRight, this.type.inBottomLeft]
    if (roadId === this.level.road.ids.Turn.BOTTOM_LEFT)
      return [this.type.outBottomLeft, this.type.inTopRight]
    if (roadId === this.level.road.ids.Turn.BOTTOM_RIGHT)
      return [this.type.outBottomRight, this.type.inTopLeft]
    // T-junction
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_RIGHT)
      return [this.type.top, this.type.inBottomLeft, this.type.inBottomRight]
    if (roadId === this.level.road.ids.TJunction.LEFT_RIGHT_BOTTOM)
      return [this.type.bottom, this.type.inTopLeft, this.type.inTopRight]
    if (roadId === this.level.road.ids.TJunction.TOP_RIGHT_BOTTOM)
      return [this.type.right, this.type.inBottomLeft, this.type.inTopLeft]
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_BOTTOM)
      return [this.type.left, this.type.inBottomRight, this.type.inTopRight]
    // Crossroads
    if (roadId === this.level.road.ids.CROSSROADS)
      return [
        this.type.inTopLeft,
        this.type.inTopRight,
        this.type.inBottomLeft,
        this.type.inBottomRight,
      ]
    // No road tile means no house can be placed, so skip.
    return []
  }

  /** Returns the tiles that a house variant crosses over into. */
  private getCrossoverTilesFromVariant(
    row: number,
    col: number,
    house: (typeof this.type)[
      | keyof layers.objectGroup.objects.StraightRotationVariants
      | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants],
  ): Tile[] {
    const exitsMap = this.level.exitsMap(row, col)

    // Create a mapping of the four cardinal directions.
    const step = {
      left: { col: col - 1 },
      right: { col: col + 1 },
      top: { row: row - 1 },
      bottom: { row: row + 1 },
    }

    // Precompute the adjacent tiles in each diagonal direction.
    const left = exitsMap.left ? [] : [{ ...step.left, row }]
    const right = exitsMap.right ? [] : [{ ...step.right, row }]
    const top = exitsMap.top ? [] : [{ col, ...step.top }]
    const bottom = exitsMap.bottom ? [] : [{ col, ...step.bottom }]
    const topRight =
      exitsMap.right || exitsMap.top ? [] : [{ ...step.right, ...step.top }]
    const topLeft =
      exitsMap.left || exitsMap.top ? [] : [{ ...step.left, ...step.top }]
    const bottomRight =
      exitsMap.right || exitsMap.bottom
        ? []
        : [{ ...step.right, ...step.bottom }]
    const bottomLeft =
      exitsMap.left || exitsMap.bottom ? [] : [{ ...step.left, ...step.bottom }]

    // Return the crossover tiles based on the house variant.
    if (house === this.type.top) return bottom
    if (house === this.type.bottom) return top
    if (house === this.type.left) return right
    if (house === this.type.right) return left
    if (house === this.type.inTopLeft)
      return [...bottom, ...right, ...bottomRight]
    if (house === this.type.inTopRight)
      return [...bottom, ...left, ...bottomLeft]
    if (house === this.type.inBottomLeft) return [...top, ...right, ...topRight]
    if (house === this.type.inBottomRight) return [...top, ...left, ...topLeft]

    return [] // No crossover tiles for variant.
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (tile) {
      this.add(tile.y, tile.x)
      this.level.graphics.clear() // Clear any previous hover highlight.
    }
  }

  onPointerMove(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    // Update the hover highlight for point tools (no drag involved).
    this.level.graphics.clear()
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile || !this.canAdd(tile.y, tile.x)) return
    const worldXY = this.level.tilemap.tileToWorldXY(tile.x, tile.y)
    if (worldXY) this.level.highlightTile(worldXY, 0x00ff00)
  }
}
