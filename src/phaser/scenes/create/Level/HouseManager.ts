import type Phaser from "phaser"

import * as layers from "../../../layers"
import type { Direction, default as Level, Tile } from "."
import BaseManager from "./BaseManager"

type VariantKey =
  | keyof layers.objectGroup.objects.StraightRotationVariants
  | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants

export default class extends BaseManager {
  /**
   * Persistent 2D array [row][col] indicating whether each tile is occupied by
   * a house.
   */
  private readonly _occupied: boolean[][]

  constructor(level: Level) {
    super(level)

    this._occupied = Array.from({ length: this.level.tilemap.height }, () =>
      Array.from({ length: this.level.tilemap.width }, () => false),
    )
  }

  occupied(tile: Tile): boolean
  occupied(tile: Tile, value: boolean): void
  occupied(tile: Tile, value?: boolean) {
    if (value !== undefined) this._occupied[tile.row][tile.col] = value
    else return this._occupied[tile.row][tile.col]
  }

  get type() {
    // TODO: select the house type from the toolbox.
    return layers.objectGroup.objects.endpoints.house.common.orange
  }

  /** Checks if a house can be added at the given tile. */
  private canAdd = (tile: Tile) =>
    this.level.road.dirs(tile).size > 0 && !this.occupied(tile)

  /**
   * Places a house on the environment layer at the given tile.
   *
   * The house orientation depends on the road directions on the tile.
   */
  private add(tile: Tile) {
    // Require a road on this tile.
    if (!this.canAdd(tile)) return

    const roadId = this.level.road.getIdFromDirs(this.level.road.dirs(tile))

    const variantKeys = this.getVariantKeysFromRoadId(roadId)
    if (variantKeys.length === 0) return

    // TODO: choose the correct house variant based on whether other houses are
    // currently present on the tile.
    const variantKey = variantKeys[0]
    if (!variantKey) return

    this.occupied(tile, true)
    for (const cTile of this.getCrossoverTilesFromVariantKey(tile, variantKey))
      this.occupied(cTile, true)

    this.level.addObject(
      "ObjectGroup.ENDPOINTS",
      // TODO: fix the +1 offset so the house is centered on the tile.
      this.type[variantKey]({ col: tile.col + 1, row: tile.row + 1 }),
    )
  }

  /** Returns the house variants for a given road ID. */
  private getVariantKeysFromRoadId(
    roadId: layers.tile.data.RoadID,
  ): VariantKey[] {
    // Straight
    if (roadId === this.level.road.ids.Straight.HORIZONTAL)
      return ["top", "bottom"]
    if (roadId === this.level.road.ids.Straight.VERTICAL)
      return ["left", "right"]
    // Dead end
    if (roadId === this.level.road.ids.DeadEnd.TOP)
      return ["left", "top", "right"]
    if (roadId === this.level.road.ids.DeadEnd.BOTTOM)
      return ["left", "bottom", "right"]
    if (roadId === this.level.road.ids.DeadEnd.LEFT)
      return ["top", "left", "bottom"]
    if (roadId === this.level.road.ids.DeadEnd.RIGHT)
      return ["top", "right", "bottom"]
    // Turn
    if (roadId === this.level.road.ids.Turn.TOP_LEFT)
      return ["outTopLeft", "inBottomRight"]
    if (roadId === this.level.road.ids.Turn.TOP_RIGHT)
      return ["outTopRight", "inBottomLeft"]
    if (roadId === this.level.road.ids.Turn.BOTTOM_LEFT)
      return ["outBottomLeft", "inTopRight"]
    if (roadId === this.level.road.ids.Turn.BOTTOM_RIGHT)
      return ["outBottomRight", "inTopLeft"]
    // T-junction
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_RIGHT)
      return ["top", "inBottomLeft", "inBottomRight"]
    if (roadId === this.level.road.ids.TJunction.LEFT_RIGHT_BOTTOM)
      return ["bottom", "inTopLeft", "inTopRight"]
    if (roadId === this.level.road.ids.TJunction.TOP_RIGHT_BOTTOM)
      return ["right", "inBottomLeft", "inTopLeft"]
    if (roadId === this.level.road.ids.TJunction.TOP_LEFT_BOTTOM)
      return ["left", "inBottomRight", "inTopRight"]
    // Crossroads
    if (roadId === this.level.road.ids.CROSSROADS)
      return ["inTopLeft", "inTopRight", "inBottomLeft", "inBottomRight"]
    // No road tile means no house can be placed, so skip.
    return []
  }

  /** Returns the tiles that a house variant crosses over into. */
  private getCrossoverTilesFromVariantKey(
    tile: Tile,
    variantKey: VariantKey,
  ): Tile[] {
    const step = (dirs: Direction[]) => {
      const destination = this.level.moveFromTile(tile, dirs)
      return destination ? [destination] : []
    }

    // Precompute the neighbouring tiles in each direction.
    const left = step(["left"])
    const right = step(["right"])
    const top = step(["top"])
    const bottom = step(["bottom"])
    const topRight = step(["top", "right"])
    const topLeft = step(["top", "left"])
    const bottomRight = step(["bottom", "right"])
    const bottomLeft = step(["bottom", "left"])

    // Return the crossover tiles based on the house variant.
    if (variantKey === "top") return bottom
    if (variantKey === "bottom") return top
    if (variantKey === "left") return right
    if (variantKey === "right") return left
    if (variantKey === "inTopLeft") return [...bottom, ...right, ...bottomRight]
    if (variantKey === "inTopRight") return [...bottom, ...left, ...bottomLeft]
    if (variantKey === "inBottomLeft") return [...top, ...right, ...topRight]
    if (variantKey === "inBottomRight") return [...top, ...left, ...topLeft]

    return [] // No crossover tiles for variant.
  }

  onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (tile) {
      this.add(tile)
      this.level.graphics.clear() // Clear any previous hover highlight.
    }
  }

  onPointerMove(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house") return

    // Update the hover highlight for point tools (no drag involved).
    this.level.graphics.clear()
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (tile && this.canAdd(tile)) this.level.highlightTile(tile, 0x00ff00)
  }
}
