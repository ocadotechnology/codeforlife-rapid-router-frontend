import type Phaser from "phaser"

import type { Direction, DirectionSet, default as Level, Tile } from "."
import BaseManager from "./BaseManager"
import type { Tool } from "../Toolbox"

export type HighlightConfig = { color: number; alpha?: number }
export type ToolConfig = { drawDirs: boolean; highlight: HighlightConfig }
export type ToolConfigs = Partial<Record<Tool, ToolConfig>>

export default class extends BaseManager {
  /** Configuration for each tool that will use the drag manager. */
  private readonly toolConfigs: ToolConfigs

  /** The tool that was active when the current drag started. */
  private _tool: Tool | null = null

  /**
   * Full ordered sequence of tiles visited during the current drag, including
   * revisits. Revisits are necessary to accumulate all directions correctly
   * (e.g. a tile crossed twice in different directions gets both directions).
   */
  private _sequence: Tile[] = []

  /**
   * Set of unique tile keys visited in the current drag, used to efficiently
   * render highlights without duplicates.
   */
  private readonly _set = new Set<string>()

  /**
   * Maps a tile key to the direction of travel when the cursor last moved
   * through it. Both the source and destination tile of each step share the
   * same travel direction, so the last tile in a drag always shows the
   * correct direction (e.g. all tiles in a left→right sweep show "right").
   */
  private readonly _dirs = new Map<string, DirectionSet>()

  constructor(level: Level, toolConfigs: ToolConfigs) {
    super(level)

    this.toolConfigs = toolConfigs
  }

  private get toolConfig() {
    return !this._tool || !(this._tool in this.toolConfigs)
      ? null
      : this.toolConfigs[this._tool]
  }

  private get lastTile() {
    return this._sequence.at(-1) ?? null
  }

  get tool() {
    return this._tool
  }

  get sequence() {
    return this._sequence
  }

  get set() {
    return new Set(this._set)
  }

  get dirs() {
    return new Map(this._dirs)
  }

  /** Highlights a tile using the provided configuration. */
  private highlightTile(tile: Tile, config: HighlightConfig) {
    this.level.highlightTile(tile, config.color, config.alpha)
  }

  /**
   * Records a single cardinal step `from` → `to` (always exactly 1 tile apart)
   * into the drag state: adds `to` to the sequence and tile set, and records
   * the exit arrow on `from` (unless a mutual-exit would result).
   */
  private recordDir(from: Tile, to: Tile): Direction | null {
    // Record the order of the tiles visited during the drag.
    this._sequence.push(to)

    // Convert the tile positions to unique keys for use in the drag state maps.
    const fromKey = this.level.tileToKey(from)
    const toKey = this.level.tileToKey(to)

    // Record the unique tiles visited during the drag.
    this._set.add(toKey)

    // Determine the direction of travel from `from` → `to`.
    const dir = this.level.dirBetweenTiles(from, to)

    // If the destination tile already has an exit back to the source tile, skip
    if (this._dirs.get(toKey)?.has(this.level.dirOpposites[dir])) return null

    // Ensure the source tile has a direction set in the map.
    if (!this._dirs.has(fromKey))
      this._dirs.set(fromKey, new Set() as DirectionSet)

    // Get the direction set for the source tile.
    const fromDirs = this._dirs.get(fromKey)!

    // If the source tile already has an exit in this direction, skip.
    if (fromDirs.has(dir)) return null

    // Otherwise, record the new exit direction for the source tile.
    fromDirs.add(dir)

    return dir
  }

  private drawDir(tile: Tile, dir: Direction, highlight: HighlightConfig) {
    if (!this.level.validTileDirs(tile)[dir]) return

    const worldXY = this.level.tileToWorld(tile)
    if (!worldXY) return

    // Shorthands for readability.
    const tw = this.level.tilemap.tileWidth
    const th = this.level.tilemap.tileHeight

    // Only draw the background rect when this is the first arrow for the tile.
    if (this._dirs.get(this.level.tileToKey(tile))!.size === 1)
      this.highlightTile(tile, highlight)

    // Calculate the center of the tile in world coordinates.
    const cx = worldXY.x + tw / 2
    const cy = worldXY.y + th / 2

    // Calculate the midpoint of the edge in the direction of travel.
    const edgeMidpoint: Record<Direction, { x: number; y: number }> = {
      top: { x: cx, y: worldXY.y },
      bottom: { x: cx, y: worldXY.y + th },
      left: { x: worldXY.x, y: cy },
      right: { x: worldXY.x + tw, y: cy },
    }
    const { x: ex, y: ey } = edgeMidpoint[dir]

    // Draw an arrow from the center of the tile to the midpoint of the edge.
    this.level.graphics.arrow(cx, cy, ex, ey, tw * 0.15, th * 0.2)
  }

  /** Walk tiles from the last tile to the current tile. */
  private walkTiles(from: Tile, to: Tile, toolConfig: ToolConfig) {
    // Calculate the delta from the last tile to the current tile.
    const dRow = to.row - from.row
    const dCol = to.col - from.col

    // Diagonal movement is not allowed: the user must drag along a single
    // axis at a time.
    if (dRow !== 0 && dCol !== 0) return

    // Determine the step direction for each axis: -1, 0, or +1.
    const step: Tile = {
      row: dRow === 0 ? 0 : dRow > 0 ? 1 : -1,
      col: dCol === 0 ? 0 : dCol > 0 ? 1 : -1,
    }

    // Walk one step at a time so that leaps forward (fast drags) fill
    // intermediate tiles.
    let current = from
    while (current.row !== to.row || current.col !== to.col) {
      // Calculate the next tile along the drag path.
      const next: Tile = {
        row: current.row + step.row,
        col: current.col + step.col,
      }

      if (toolConfig.drawDirs) {
        // Record the dir and draw it (if any).
        const dir = this.recordDir(current, next)
        if (dir !== null) this.drawDir(current, dir, toolConfig.highlight)
      } else {
        // Highlight each new tile entered during a delete-road drag.
        const nextKey = this.level.tileToKey(next)
        if (!this._set.has(nextKey)) {
          this._set.add(nextKey)
          this.highlightTile(next, toolConfig.highlight)
        }

        this._sequence.push(next) // ?
      }
      current = next
    }
  }

  /** Start a drag operation at the nearest tile to the pointer. */
  onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (!tool || !(tool in this.toolConfigs)) return
    const toolConfig = this.toolConfigs[tool]!

    const tile = this.level.worldToNearestTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    this._tool = tool
    this._sequence = [tile]
    this._set.clear()
    this._set.add(this.level.tileToKey(tile))
    this._dirs.clear()

    if (!toolConfig.drawDirs) this.highlightTile(tile, toolConfig.highlight)
  }

  /** Walk tiles from the last tile to the current tile. */
  onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.toolConfig) return

    const tile = this.level.worldToNearestTile(pointer.worldX, pointer.worldY)
    if (
      !tile ||
      !this.lastTile ||
      // Skip if still in the same tile.
      (tile.row === this.lastTile.row && tile.col === this.lastTile.col)
    )
      return

    this.walkTiles(this.lastTile, tile, this.toolConfig)
  }

  /** End a drag operation. */
  onPointerUp() {
    if (!this._tool) return

    this._tool = null
    this._sequence = []
    this._set.clear()
    this._dirs.clear()
  }
}
