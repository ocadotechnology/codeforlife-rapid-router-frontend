import Phaser from "phaser"

import * as layers from "../../layers"
import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import Toolbox from "./Toolbox"

type Direction = "top" | "bottom" | "left" | "right"
type DirectionSet = Set<Direction> & { readonly size: 0 | 1 | 2 | 3 | 4 }

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
  /**
   * Persistent 2D array [row][col] of all placed road tiles.
   * null means no road tile has been placed at that position.
   */
  private roadDirs: DirectionSet[][] = []

  private isDragging = false
  /**
   * Full ordered sequence of tiles visited during the current drag, including
   * revisits. Revisits are necessary to accumulate all connections correctly
   * (e.g. a tile crossed twice in different directions gets both connections).
   */
  private dragSequence: Phaser.Math.Vector2[] = []
  /**
   * Set of unique tile keys visited in the current drag, used to efficiently
   * render highlights without duplicates.
   */
  private dragSet = new Set<string>()
  private dragGraphics!: Phaser.GameObjects.CustomGraphics
  /**
   * Maps a tile key to the direction of travel when the cursor last moved
   * through it. Both the source and destination tile of each step share the
   * same travel direction, so the last tile in a drag always shows the correct
   * direction (e.g. all tiles in a left→right sweep show "right").
   */
  private dragDirs = new Map<string, DirectionSet>()

  private readonly directionOpposites: Record<Direction, Direction> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }

  create() {
    // Create the tilemap, layers, and other essentials of the level scene.
    super.create()

    // Draw a grid over the tilemap to help visualize the tile boundaries.
    this.add
      .customGraphics()
      .grid(
        this.tilemap.width,
        this.tilemap.height,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )

    // Initialize the persistent road tile grid to match the tilemap dimensions.
    this.roadDirs = Array.from({ length: this.tilemap.height }, () =>
      Array.from(
        { length: this.tilemap.width },
        () => new Set() as DirectionSet,
      ),
    )
    // setDepth(1) ensures highlights render on top of the grid lines (depth 0).
    this.dragGraphics = this.add.customGraphics().setDepth(1)

    // Register pointer events.
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => this.onPointerDown(pointer),
    )
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      (pointer: Phaser.Input.Pointer) => this.onPointerMove(pointer),
    )
    this.input.on(Phaser.Input.Events.POINTER_UP, () => this.onPointerUp())
    // Also handle the mouse being released outside the canvas so the
    // highlights are always cleared even when the drag ends off-screen.
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, () =>
      this.onPointerUpOutside(),
    )

    // Launch the Toolbox scene, providing the toolbox.
    this.scene.launch(Toolbox.KEY)
  }

  private get toolbox() {
    return (this.scene.get(Toolbox.KEY) as Toolbox) ?? null
  }

  private get lastDragTile() {
    return this.dragSequence.at(-1) ?? null
  }

  /**
   * Converts world coordinates to a tile position, clamping to the nearest edge
   * tile when the cursor is outside the tilemap bounds. Returns null only if
   * the tilemap conversion itself fails.
   */
  private worldToTile(worldX: number, worldY: number) {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    const x = Phaser.Math.Clamp(tileXY.x, 0, this.tilemap.width - 1)
    const y = Phaser.Math.Clamp(tileXY.y, 0, this.tilemap.height - 1)
    return new Phaser.Math.Vector2(x, y)
  }

  /**
   * Returns the dominant direction of travel from one tile to another. When the
   * cursor jumps diagonally (fast movement), the axis with the larger delta
   * wins so we always produce a single cardinal direction.
   */
  private directionBetween(
    from: Phaser.Math.Vector2,
    to: Phaser.Math.Vector2,
  ): Direction {
    const dRow = to.y - from.y
    const dCol = to.x - from.x
    return Math.abs(dRow) >= Math.abs(dCol)
      ? dRow < 0
        ? "top"
        : "bottom"
      : dCol < 0
        ? "left"
        : "right"
  }

  /** Returns a unique key for the given tile position. */
  private tileKey = (tile: Phaser.Math.Vector2) => `${tile.y},${tile.x}`

  /**
   * Returns true if moving in `dir` from the given tile would leave the tilemap
   * — i.e. the direction is not a valid exit for that tile.
   */
  private exitsMap(y: number, x: number, dir: Direction) {
    if (dir === "top" && y === 0) return true
    if (dir === "bottom" && y === this.tilemap.height - 1) return true
    if (dir === "left" && x === 0) return true
    if (dir === "right" && x === this.tilemap.width - 1) return true
    return false
  }

  /**
   * Records a single cardinal step `from` → `to` (always exactly 1 tile apart)
   * into the drag state: adds `to` to the sequence and tile set, and records
   * the exit arrow on `from` (unless a mutual-exit would result).
   */
  private advanceDragByOneStep(
    from: Phaser.Math.Vector2,
    to: Phaser.Math.Vector2,
  ) {
    this.dragSequence.push(to)
    this.dragSet.add(this.tileKey(to))

    // Only the tile being exited gets an exit arrow — the destination tile
    // has not been exited yet and will get its arrow when the cursor leaves it.
    // Also skip if the destination already exits back toward us (no mutual exits).
    const travelDir = this.directionBetween(from, to)
    const fromKey = this.tileKey(from)
    const toKey = this.tileKey(to)
    const backDir = this.directionOpposites[travelDir]
    if (!this.dragDirs.get(toKey)?.has(backDir)) {
      if (!this.dragDirs.has(fromKey))
        this.dragDirs.set(fromKey, new Set() as DirectionSet)
      const fromDirs = this.dragDirs.get(fromKey)!
      if (fromDirs.has(travelDir)) return null // already drawn, skip
      fromDirs.add(travelDir)
      return travelDir
    }
    return null
  }

  private drawStep(tile: Phaser.Math.Vector2, dir: Direction) {
    if (this.exitsMap(tile.y, tile.x, dir)) return
    const worldXY = this.tilemap.tileToWorldXY(tile.x, tile.y)
    if (!worldXY) return

    const tw = this.tilemap.tileWidth
    const th = this.tilemap.tileHeight

    // Only draw the background rect when this is the first arrow for the tile.
    if (this.dragDirs.get(this.tileKey(tile))!.size === 1)
      this.dragGraphics
        .fillStyle(0xffff00, 0.4)
        .fillRect(worldXY.x, worldXY.y, tw, th)

    const cx = worldXY.x + tw / 2
    const cy = worldXY.y + th / 2
    const edgeMidpoint: Record<Direction, { x: number; y: number }> = {
      top: { x: cx, y: worldXY.y },
      bottom: { x: cx, y: worldXY.y + th },
      left: { x: worldXY.x, y: cy },
      right: { x: worldXY.x + tw, y: cy },
    }
    const { x: ex, y: ey } = edgeMidpoint[dir]
    this.dragGraphics.arrow(cx, cy, ex, ey, tw * 0.15, th * 0.2)
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (this.toolbox?.activeTool !== "add-road") return
    const tile = this.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    this.isDragging = true
    this.dragSequence = [tile]
    this.dragSet = new Set([this.tileKey(tile)])
    this.dragDirs.clear()
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging || this.toolbox?.activeTool !== "add-road") return
    const tile = this.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile || !this.lastDragTile) return
    // Skip if still in the same tile.
    if (tile.y === this.lastDragTile.y && tile.x === this.lastDragTile.x) return

    const dRow = tile.y - this.lastDragTile.y
    const dCol = tile.x - this.lastDragTile.x

    // Diagonal movement is not allowed: the user must drag along a single
    // axis at a time.
    if (dRow !== 0 && dCol !== 0) return

    // Walk one step at a time so that fast drags fill every intermediate
    // tile and connections always form a continuous path.
    const stepRow = dRow === 0 ? 0 : dRow > 0 ? 1 : -1
    const stepCol = dCol === 0 ? 0 : dCol > 0 ? 1 : -1
    let current = this.lastDragTile
    while (current.y !== tile.y || current.x !== tile.x) {
      const next = new Phaser.Math.Vector2(
        current.x + stepCol,
        current.y + stepRow,
      )
      const newDir = this.advanceDragByOneStep(current, next)
      if (newDir !== null) this.drawStep(current, newDir)
      current = next
    }
  }

  private onPointerUp() {
    if (!this.isDragging) return
    this.isDragging = false
    this.finalizeDrag()
    this.dragSequence = []
    this.dragSet.clear()
    this.dragDirs.clear()
    this.dragGraphics.clear()
  }

  private onPointerUpOutside = () => this.onPointerUp()

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
      { row: number; col: number; dirs: DirectionSet }
    >()

    for (let i = 0; i < this.dragSequence.length; i++) {
      const curr = this.dragSequence[i]
      const key = this.tileKey(curr)

      if (!pending.has(key)) {
        pending.set(key, {
          row: curr.y,
          col: curr.x,
          dirs: new Set() as DirectionSet,
        })
      }

      const next = this.dragSequence[i + 1]
      if (next) {
        const exitDir = this.directionBetween(curr, next)
        const backDir = this.directionOpposites[exitDir]
        const nextKey = this.tileKey(next)
        if (!pending.has(nextKey)) {
          pending.set(nextKey, {
            row: next.y,
            col: next.x,
            dirs: new Set() as DirectionSet,
          })
        }
        // Bidirectional connection: curr exits toward next, and next connects
        // back to curr. Both are needed for correct road tile classification
        // (e.g. a middle tile needs both its entry and exit directions so it
        // becomes a straight road rather than two dead ends).
        pending.get(key)!.dirs.add(exitDir)
        pending.get(nextKey)!.dirs.add(backDir)
      }
    }

    // Merge new connections into the persistent grid, then redraw each tile.
    for (const { row, col, dirs } of pending.values()) {
      if (!this.roadDirs[row][col].size) {
        this.roadDirs[row][col] = new Set() as DirectionSet
      }
      const roadDirs = this.roadDirs[row][col]
      for (const dir of dirs) {
        // Discard any connection that would exit off the edge of the tilemap.
        if (!this.exitsMap(row, col, dir)) roadDirs.add(dir)
      }
      this.createRoad(row, col, roadDirs)
    }
  }

  private putTileAt(
    layer: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer,
    id: layers.tile.data.ID,
    col: number,
    row: number,
  ) {
    const { index, flipX, flipY, rotation } = layers.tile.data.decode(id)

    const tile = layer.putTileAt(index, col, row)
    tile.flipX = flipX
    tile.flipY = flipY
    tile.rotation = rotation

    return tile
  }

  /**
   * Called whenever a tile's connections change. Classifies the tile based on
   * its full set of open sides and places the correct road tile. Connections
   * accumulate across drags, so a tile may be upgraded (e.g. turn → T-junction)
   * by a subsequent drag.
   */
  private createRoad(row: number, col: number, dirs: DirectionSet) {
    // TODO: select asphalt or dirt tileset based in the Toolbox.
    const roadIDs = layers.tile.data.IDs.Road.Asphalt

    // Shorthands.
    const putTile = (id: layers.tile.data.RoadID) =>
      this.putTileAt(this.layers.road, id, col, row)
    const hasDir = (dir: Direction) => dirs.has(dir)

    // No connections, no road tile.
    if (dirs.size === 0) return
    // Dead end
    else if (dirs.size === 1)
      if (hasDir("top")) putTile(roadIDs.DeadEnd.TOP)
      else if (hasDir("bottom")) putTile(roadIDs.DeadEnd.BOTTOM)
      else if (hasDir("left")) putTile(roadIDs.DeadEnd.LEFT)
      else putTile(roadIDs.DeadEnd.RIGHT)
    // Straight or turn
    else if (dirs.size === 2)
      if (hasDir("top"))
        if (hasDir("bottom")) putTile(roadIDs.Straight.VERTICAL)
        else if (hasDir("left")) putTile(roadIDs.Turn.TOP_LEFT)
        else putTile(roadIDs.Turn.TOP_RIGHT)
      else if (hasDir("bottom"))
        if (hasDir("left")) putTile(roadIDs.Turn.BOTTOM_LEFT)
        else putTile(roadIDs.Turn.BOTTOM_RIGHT)
      else putTile(roadIDs.Straight.HORIZONTAL)
    // T-junction
    else if (dirs.size === 3)
      if (!hasDir("top")) putTile(roadIDs.TJunction.LEFT_RIGHT_BOTTOM)
      else if (!hasDir("bottom")) putTile(roadIDs.TJunction.TOP_LEFT_RIGHT)
      else if (!hasDir("left")) putTile(roadIDs.TJunction.TOP_RIGHT_BOTTOM)
      else putTile(roadIDs.TJunction.TOP_LEFT_BOTTOM)
    // Crossroads
    else putTile(roadIDs.CROSSROADS)
  }
}
