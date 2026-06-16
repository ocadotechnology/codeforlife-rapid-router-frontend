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
  /**
   * Maps a tile key to the direction of travel when the cursor last moved
   * through it. Both the source and destination tile of each step share the
   * same travel direction, so the last tile in a drag always shows the correct
   * direction (e.g. all tiles in a left→right sweep show "right").
   */
  private dragArrowDirs = new Map<string, Set<Direction>>()

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

  /**
   * Converts world coordinates to a tile position, clamping to the nearest
   * edge tile when the cursor is outside the tilemap bounds. Returns null only
   * if the tilemap conversion itself fails.
   */
  private worldToTile(
    worldX: number,
    worldY: number,
  ): { row: number; col: number } | null {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    const col = Phaser.Math.Clamp(tileXY.x, 0, this.tilemap.width - 1)
    const row = Phaser.Math.Clamp(tileXY.y, 0, this.tilemap.height - 1)
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

  private tileKey(row: number, col: number): string {
    return `${row},${col}`
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

  /**
   * Returns true if moving in `dir` from the given tile would leave the
   * tilemap — i.e. the direction is not a valid exit for that tile.
   */
  private exitsMap(row: number, col: number, dir: Direction): boolean {
    if (dir === "top" && row === 0) return true
    if (dir === "bottom" && row === this.tilemap.height - 1) return true
    if (dir === "left" && col === 0) return true
    if (dir === "right" && col === this.tilemap.width - 1) return true
    return false
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
        this.dragArrowDirs.clear()
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
        // Only the tile being exited gets an exit arrow — the destination tile
        // has not been exited yet and will get its arrow when the cursor leaves it.
        // Also skip if the destination already exits back toward us (no mutual exits).
        const travelDir = this.directionBetween(this.lastDragTile, tile)
        const prevKey = this.tileKey(
          this.lastDragTile.row,
          this.lastDragTile.col,
        )
        const currKey = this.tileKey(tile.row, tile.col)
        const backDir = this.oppositeOf(travelDir)
        if (!this.dragArrowDirs.get(currKey)?.has(backDir)) {
          if (!this.dragArrowDirs.has(prevKey))
            this.dragArrowDirs.set(prevKey, new Set())
          this.dragArrowDirs.get(prevKey)!.add(travelDir)
        }
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
      this.dragArrowDirs.clear()
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

    // Draw a travel-direction arrow for each highlighted tile.
    const tw = this.tilemap.tileWidth
    const th = this.tilemap.tileHeight
    const headWidth = tw * 0.15
    const headHeight = th * 0.2
    this.dragHighlightGraphics.lineStyle(2, 0xffffff, 1).fillStyle(0xffffff, 1)
    for (const [key, dirs] of this.dragArrowDirs) {
      const [row, col] = key.split(",").map(Number)
      const worldXY = this.tilemap.tileToWorldXY(col, row)
      if (!worldXY) continue
      const cx = worldXY.x + tw / 2
      const cy = worldXY.y + th / 2
      const edgeMidpoint: Record<Direction, { x: number; y: number }> = {
        top: { x: cx, y: worldXY.y },
        bottom: { x: cx, y: worldXY.y + th },
        left: { x: worldXY.x, y: cy },
        right: { x: worldXY.x + tw, y: cy },
      }
      for (const dir of dirs) {
        // Don't draw an arrow that points off the edge of the tilemap.
        if (this.exitsMap(row, col, dir)) continue
        const { x: ex, y: ey } = edgeMidpoint[dir]
        this.drawArrow(
          this.dragHighlightGraphics,
          cx,
          cy,
          ex,
          ey,
          headWidth,
          headHeight,
        )
      }
    }
  }

  /**
   * Derives the exit connections each visited tile gained from the drag, merges
   * them into roadTileGrid, then calls createRoad() for every affected tile.
   *
   * Only exit connections are recorded: moving from tile A → tile B adds an
   * exit connection to A only. Tile B is only connected when the cursor leaves
   * it. This means two adjacent tiles never force a shared connection on each
   * other.
   */
  private finalizeDrag() {
    const pending = new Map<
      string,
      { row: number; col: number; connections: Set<Direction> }
    >()

    for (let i = 0; i < this.dragSequence.length; i++) {
      const curr = this.dragSequence[i]
      const key = this.tileKey(curr.row, curr.col)

      if (!pending.has(key)) {
        pending.set(key, {
          row: curr.row,
          col: curr.col,
          connections: new Set(),
        })
      }

      const next = this.dragSequence[i + 1]
      if (next) {
        const exitDir = this.directionBetween(curr, next)
        // Don't add this exit if the destination tile already exits back toward
        // us — two tiles must not exit into each other.
        const nextKey = this.tileKey(next.row, next.col)
        const backDir = this.oppositeOf(exitDir)
        const nextPending = pending.get(nextKey)
        if (!nextPending?.connections.has(backDir)) {
          pending.get(key)!.connections.add(exitDir)
        }
        // Always register the destination so it gets processed (even if the
        // cursor never leaves it, i.e. it is the final tile in the drag).
        if (!pending.has(nextKey)) {
          pending.set(nextKey, {
            row: next.row,
            col: next.col,
            connections: new Set(),
          })
        }
      }
    }

    // Merge new connections into the persistent grid, then redraw each tile.
    for (const { row, col, connections } of pending.values()) {
      if (!this.roadTileGrid[row][col]) {
        this.roadTileGrid[row][col] = { connections: new Set() }
      }
      const tileData = this.roadTileGrid[row][col]
      for (const dir of connections) {
        // Discard any connection that would exit off the edge of the tilemap.
        if (!this.exitsMap(row, col, dir)) {
          tileData.connections.add(dir)
        }
      }
      this.createRoad(row, col, tileData.connections)
    }
  }

  /**
   * Called whenever a tile's connections change. Classifies the tile based on
   * its full set of open sides and places the correct road tile.
   * Connections accumulate across drags, so a tile may be upgraded
   * (e.g. turn → T-junction) by a subsequent drag.
   */
  private createRoad(
    row: number,
    col: number,
    directions: Set<Direction>,
  ): void {
    // row and col will be used when placing the actual tileset tile.
    void [row, col]

    const has = (dir: Direction) => directions.has(dir)

    if (directions.size === 1) {
      // ── Dead end ──────────────────────────────────────────────────────────
      if (has("top")) {
        /* TODO: place dead-end tile, open side: top    */
      }
      if (has("bottom")) {
        /* TODO: place dead-end tile, open side: bottom */
      }
      if (has("left")) {
        /* TODO: place dead-end tile, open side: left   */
      }
      if (has("right")) {
        /* TODO: place dead-end tile, open side: right  */
      }
    } else if (directions.size === 2) {
      if (has("top") && has("bottom")) {
        // ── Straight (vertical) ─────────────────────────────────────────────
        // TODO: place straight vertical road tile
      } else if (has("left") && has("right")) {
        // ── Straight (horizontal) ───────────────────────────────────────────
        // TODO: place straight horizontal road tile
      } else if (has("top") && has("right")) {
        // ── Turn ────────────────────────────────────────────────────────────
        // TODO: place turn tile, open sides: top, right
      } else if (has("top") && has("left")) {
        // ── Turn ────────────────────────────────────────────────────────────
        // TODO: place turn tile, open sides: top, left
      } else if (has("bottom") && has("right")) {
        // ── Turn ────────────────────────────────────────────────────────────
        // TODO: place turn tile, open sides: bottom, right
      } else if (has("bottom") && has("left")) {
        // ── Turn ────────────────────────────────────────────────────────────
        // TODO: place turn tile, open sides: bottom, left
      }
    } else if (directions.size === 3) {
      if (!has("top")) {
        // ── T-junction ──────────────────────────────────────────────────────
        // TODO: place T-junction tile, open sides: bottom, left, right
      } else if (!has("bottom")) {
        // ── T-junction ──────────────────────────────────────────────────────
        // TODO: place T-junction tile, open sides: top, left, right
      } else if (!has("left")) {
        // ── T-junction ──────────────────────────────────────────────────────
        // TODO: place T-junction tile, open sides: top, bottom, right
      } else {
        // ── T-junction ──────────────────────────────────────────────────────
        // TODO: place T-junction tile, open sides: top, bottom, left
      }
    } else if (directions.size === 4) {
      // ── Crossroads ────────────────────────────────────────────────────────
      // TODO: place crossroads tile, open sides: top, bottom, left, right
    }
  }

  /**
   * Draws an arrow from (x1, y1) to (x2, y2) on the given Graphics object.
   * The arrowhead is a filled isosceles triangle of the given width and height.
   * The Graphics object must already have lineStyle and fillStyle set.
   *
   * Based on: https://phaser.discourse.group/t/graphics-arrow/15193
   */
  private drawArrow(
    graphics: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    headWidth: number,
    headHeight: number,
  ): void {
    graphics.lineBetween(x1, y1, x2, y2)

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

    graphics.fillTriangle(x2, y2, x3, y3, x4, y4)
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
