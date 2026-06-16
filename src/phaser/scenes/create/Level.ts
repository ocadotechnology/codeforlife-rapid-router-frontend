import Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import HUD from "./HUD"

export type Direction = "top" | "bottom" | "left" | "right"

export interface RoadTileData {
  connections: Set<Direction>
}

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

  /**
   * Persistent 2D array [row][col] of all placed road tiles.
   * null means no road tile has been placed at that position.
   */
  roadTileGrid: (RoadTileData | null)[][] = []

  private isDragging = false
  /**
   * Full ordered sequence of tiles visited during the current drag, including
   * revisits. Revisits are necessary to accumulate all connections correctly
   * (e.g. a tile crossed twice in different directions gets both connections).
   */
  private dragSequence: Array<{ row: number; col: number }> = []
  /**
   * Set of unique tile keys visited in the current drag, used to efficiently
   * render highlights without duplicates.
   */
  private dragTileSet = new Set<string>()
  private dragHighlightGraphics!: Phaser.GameObjects.Graphics
  private lastDragTile: { row: number; col: number } | null = null

  create() {
    super.create()

    this.addLineGraphics()
    this.initRoadTileGrid()
    this.setupPointerEvents()

    this.scene.launch(HUD.KEY)
  }

  private initRoadTileGrid() {
    this.roadTileGrid = Array.from({ length: this.tilemap.height }, () =>
      Array<RoadTileData | null>(this.tilemap.width).fill(null),
    )
    // setDepth(1) ensures highlights render on top of the grid lines (depth 0).
    this.dragHighlightGraphics = this.add.graphics().setDepth(1)
  }

  private get hud(): HUD | null {
    return (this.scene.get(HUD.KEY) as HUD) ?? null
  }

  private worldToTile(
    worldX: number,
    worldY: number,
  ): { row: number; col: number } | null {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    const col = tileXY.x
    const row = tileXY.y
    if (
      row < 0 ||
      row >= this.tilemap.height ||
      col < 0 ||
      col >= this.tilemap.width
    )
      return null
    return { row, col }
  }

  /**
   * Returns the dominant direction of travel from one tile to another.
   * When the cursor jumps diagonally (fast movement), the axis with the larger
   * delta wins so we always produce a single cardinal direction.
   */
  private directionBetween(
    from: { row: number; col: number },
    to: { row: number; col: number },
  ): Direction {
    const dRow = to.row - from.row
    const dCol = to.col - from.col
    if (Math.abs(dRow) >= Math.abs(dCol)) {
      return dRow < 0 ? "top" : "bottom"
    }
    return dCol < 0 ? "left" : "right"
  }

  private oppositeOf(dir: Direction): Direction {
    const opposites: Record<Direction, Direction> = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    }
    return opposites[dir]
  }

  private tileKey(row: number, col: number): string {
    return `${row},${col}`
  }

  private setupPointerEvents() {
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        if (this.hud?.activeTool !== "add-road") return
        const tile = this.worldToTile(pointer.worldX, pointer.worldY)
        if (!tile) return

        this.isDragging = true
        this.dragSequence = [tile]
        this.dragTileSet = new Set([this.tileKey(tile.row, tile.col)])
        this.lastDragTile = tile
        this.redrawHighlights()
      },
    )

    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      (pointer: Phaser.Input.Pointer) => {
        if (!this.isDragging || this.hud?.activeTool !== "add-road") return
        const tile = this.worldToTile(pointer.worldX, pointer.worldY)
        if (!tile || !this.lastDragTile) return
        // Skip if still in the same tile.
        if (
          tile.row === this.lastDragTile.row &&
          tile.col === this.lastDragTile.col
        )
          return

        this.dragSequence.push(tile)
        this.dragTileSet.add(this.tileKey(tile.row, tile.col))
        this.lastDragTile = tile
        this.redrawHighlights()
      },
    )

    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.isDragging) return
      this.isDragging = false
      this.finalizeDrag()
      this.dragSequence = []
      this.dragTileSet.clear()
      this.lastDragTile = null
      this.dragHighlightGraphics.clear()
    })
  }

  private redrawHighlights() {
    this.dragHighlightGraphics.clear().fillStyle(0xffff00, 0.4)
    for (const key of this.dragTileSet) {
      const [row, col] = key.split(",").map(Number)
      const worldXY = this.tilemap.tileToWorldXY(col, row)
      if (!worldXY) continue
      this.dragHighlightGraphics.fillRect(
        worldXY.x,
        worldXY.y,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )
    }
  }

  /**
   * Derives the connections each visited tile gained from the drag, merges
   * them into roadTileGrid, then calls createRoad() for every affected tile.
   *
   * Connections are determined purely from the cursor's path:
   * - Moving from tile A → tile B adds an exit connection to A and an entry
   *   connection to B.
   * - A tile revisited from a different direction accumulates both connections,
   *   which is why an "8" shape requires tracing the inner crossing explicitly.
   */
  private finalizeDrag() {
    const pending = new Map<
      string,
      {
        row: number
        col: number
        connections: Set<Direction>
        firstFrom: Direction | undefined
      }
    >()

    for (let i = 0; i < this.dragSequence.length; i++) {
      const curr = this.dragSequence[i]
      const key = this.tileKey(curr.row, curr.col)

      if (!pending.has(key)) {
        pending.set(key, {
          row: curr.row,
          col: curr.col,
          connections: new Set(),
          firstFrom: undefined,
        })
      }

      const next = this.dragSequence[i + 1]
      if (next) {
        const exitDir = this.directionBetween(curr, next)
        const entryDir = this.oppositeOf(exitDir)

        pending.get(key)!.connections.add(exitDir)

        const nextKey = this.tileKey(next.row, next.col)
        if (!pending.has(nextKey)) {
          pending.set(nextKey, {
            row: next.row,
            col: next.col,
            connections: new Set(),
            firstFrom: entryDir,
          })
        } else if (pending.get(nextKey)!.firstFrom === undefined) {
          // Record the first entry direction (used by createRoad).
          pending.get(nextKey)!.firstFrom = entryDir
        }
        pending.get(nextKey)!.connections.add(entryDir)
      }
    }

    // Merge into the persistent grid and create road tiles.
    for (const { row, col, connections, firstFrom } of pending.values()) {
      if (!this.roadTileGrid[row][col]) {
        this.roadTileGrid[row][col] = { connections: new Set() }
      }
      for (const dir of connections) {
        this.roadTileGrid[row][col].connections.add(dir)
      }
      this.createRoad(row, col, firstFrom)
    }
  }

  private createRoad(
    _row: number,
    _col: number,
    _fromDirection?: Direction,
  ): void {
    // TODO: Implement road tile rendering.
    // - Inspect `this.roadTileGrid[_row][_col].connections` for all open sides.
    // - `_fromDirection` is the side the cursor first entered this tile from.
    // - Select and place the correct road tileset tile on `this.layers.road`.
    void [_row, _col, _fromDirection]
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
