import Phaser from "phaser"

import type { Direction, DirectionSet, default as Level, Tile } from "."
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"
import type { Tool } from "../Toolbox"

export type DragEndEventData = {
  tool: Tool
  sequence: Tile[]
  set: Set<string>
}

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

    const onPointerDown = (pointer: Phaser.Input.Pointer) =>
      this.onPointerDown(pointer)
    level.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove = (pointer: Phaser.Input.Pointer) =>
      this.onPointerMove(pointer)
    level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onPointerUp = () => this.onPointerUp()
    level.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    const onPointerUpOutside = () => this.onPointerUpOutside()
    level.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUpOutside)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      level.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      level.input.off(
        Phaser.Input.Events.POINTER_UP_OUTSIDE,
        onPointerUpOutside,
      )
    })
  }

  private get toolConfig() {
    return !this._tool || !(this._tool in this.toolConfigs)
      ? null
      : this.toolConfigs[this._tool]
  }

  private get lastTile() {
    return this._sequence.at(-1) ?? null
  }

  /** Highlights a tile using the provided configuration. */
  private highlightTile(tile: Tile, config: HighlightConfig) {
    this.level.highlightTile(tile, config.color, config.alpha)
  }

  /**
   * Draws an arrow indicating the direction of travel from the center of a tile
   * to its edge.
   */
  private drawDir(tile: Tile, dir: Direction) {
    if (!this.level.validTileDirs(tile)[dir]) return

    const worldXY = this.level.tileToWorld(tile)
    if (!worldXY) return

    // Shorthands for readability.
    const tw = this.level.tilemap.tileWidth
    const th = this.level.tilemap.tileHeight

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

  private add(current: Tile, next: Tile, toolConfig: ToolConfig) {
    // Record the order of the tiles visited during the drag.
    this._sequence.push(next)

    // Records the unique tiles visited during the drag.
    const nextKey = this.level.tileToKey(next)
    if (!this._set.has(nextKey)) {
      this._set.add(nextKey)
      this.highlightTile(next, toolConfig.highlight)
    }

    if (!toolConfig.drawDirs) return

    // Determine the direction of travel from `current` → `next`.
    const dir = this.level.dirBetweenTiles(current, next)

    // If the next tile already has an exit back to the current tile, skip
    if (this._dirs.get(nextKey)?.has(this.level.dirOpposites[dir])) return null

    // Ensure the current tile has a direction set in the map.
    const currentKey = this.level.tileToKey(current)
    if (!this._dirs.has(currentKey))
      this._dirs.set(currentKey, new Set() as DirectionSet)

    // Get the direction set for the current tile.
    const currentDirs = this._dirs.get(currentKey)!

    // If the current tile already has an exit in this direction, skip.
    if (currentDirs.has(dir)) return null

    // Otherwise, record the new exit direction for the current tile.
    currentDirs.add(dir)

    this.drawDir(current, dir)
  }

  /** Start a drag operation at the nearest tile to the pointer. */
  private onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (!tool || !(tool in this.toolConfigs)) return
    const toolConfig = this.toolConfigs[tool]!

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    this._tool = tool
    this._sequence = [tile]
    this._set.clear()
    this._set.add(this.level.tileToKey(tile))
    this._dirs.clear()

    // Highlight the starting tile.
    this.highlightTile(tile, toolConfig.highlight)
  }

  /** Walk tiles from the last tile to the current tile. */
  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.toolConfig) return

    const tile = this.level.worldToNearestTile(pointer.worldX, pointer.worldY)
    if (
      !tile ||
      !this.lastTile ||
      // Skip if still in the same tile.
      (tile.row === this.lastTile.row && tile.col === this.lastTile.col)
    )
      return

    this.level.walkBetweenTiles(this.lastTile, tile, (current, next) => {
      this.add(current, next, this.toolConfig!)
    })
  }

  /** End a drag operation. */
  private onPointerUp() {
    if (!this._tool) return

    this.level.game.events.emit(Events.DRAG_END, {
      tool: this._tool,
      sequence: this._sequence,
      set: new Set(this._set),
    })

    this._tool = null
    this._sequence = []
    this._set.clear()
    this._dirs.clear()
    this.level.graphics.clear()
  }

  private onPointerUpOutside = () => this.onPointerUp()
}
