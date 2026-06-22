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
  private readonly road = {
    /**
     * Persistent 2D array [row][col] of all placed road tiles.
     * null means no road tile has been placed at that position.
     */
    dirs: [] as DirectionSet[][],
    type: "Asphalt" as keyof typeof layers.tile.data.IDs.Road,
  }

  private readonly drag = {
    /** The tool that was active when the current drag started. */
    tool: null as "add-road" | "delete-road" | null,
    /**
     * Full ordered sequence of tiles visited during the current drag, including
     * revisits. Revisits are necessary to accumulate all directions correctly
     * (e.g. a tile crossed twice in different directions gets both directions).
     */
    sequence: [] as Phaser.Math.Vector2[],
    /**
     * Set of unique tile keys visited in the current drag, used to efficiently
     * render highlights without duplicates.
     */
    set: new Set<string>(),
    /** Graphics object used to render the drag highlights. */
    graphics: null as Phaser.GameObjects.CustomGraphics | null,
    /**
     * Maps a tile key to the direction of travel when the cursor last moved
     * through it. Both the source and destination tile of each step share the
     * same travel direction, so the last tile in a drag always shows the
     * correct direction (e.g. all tiles in a left→right sweep show "right").
     */
    dirs: new Map<string, DirectionSet>(),
  }

  private readonly dir = {
    opposites: {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    } as Record<Direction, Direction>,
    offsets: {
      top: [-1, 0],
      bottom: [1, 0],
      left: [0, -1],
      right: [0, 1],
    } as Record<Direction, [number, number]>,
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
    this.road.dirs = Array.from({ length: this.tilemap.height }, () =>
      Array.from(
        { length: this.tilemap.width },
        () => new Set() as DirectionSet,
      ),
    )
    // setDepth(1) ensures highlights render on top of the grid lines (depth 0).
    this.drag.graphics = this.add.customGraphics().setDepth(1)

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
    return this.drag.sequence.at(-1) ?? null
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
    // Record the new tile in the drag state.
    this.drag.sequence.push(to)
    this.drag.set.add(this.tileKey(to))

    const dir = this.directionBetween(from, to)
    const fromKey = this.tileKey(from)
    const toKey = this.tileKey(to)

    // If the destination tile already has an exit back to the source tile, skip
    if (this.drag.dirs.get(toKey)?.has(this.dir.opposites[dir])) return null

    // Ensure the source tile has a direction set in the map.
    if (!this.drag.dirs.has(fromKey))
      this.drag.dirs.set(fromKey, new Set() as DirectionSet)
    // Get the direction set for the source tile.
    const fromDirs = this.drag.dirs.get(fromKey)!

    // If the source tile already has an exit in this direction, skip.
    if (fromDirs.has(dir)) return null
    // Otherwise, record the new exit direction for the source tile.
    fromDirs.add(dir)

    return dir // Return the new exit direction so the caller can render it.
  }

  private drawStep(tile: Phaser.Math.Vector2, dir: Direction) {
    if (this.exitsMap(tile.y, tile.x, dir)) return

    const worldXY = this.tilemap.tileToWorldXY(tile.x, tile.y)
    if (!worldXY) return

    // Shorthands for readability.
    const tw = this.tilemap.tileWidth
    const th = this.tilemap.tileHeight

    // Only draw the background rect when this is the first arrow for the tile.
    if (this.drag.dirs.get(this.tileKey(tile))!.size === 1)
      this.drawDragHighlight(worldXY, 0xffff00)

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
    this.drag.graphics!.arrow(cx, cy, ex, ey, tw * 0.15, th * 0.2)
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.toolbox?.activeTool
    if (tool !== "add-road" && tool !== "delete-road") return

    const tile = this.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    this.drag.tool = tool
    this.drag.sequence = [tile]
    this.drag.set = new Set([this.tileKey(tile)])
    this.drag.dirs.clear()
    if (tool === "delete-road") this.drawDeleteHighlight(tile)
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.drag.tool) return

    const tile = this.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile || !this.lastDragTile) return
    // Skip if still in the same tile.
    if (tile.y === this.lastDragTile.y && tile.x === this.lastDragTile.x) return

    // Calculate the delta from the last tile to the current tile.
    const dRow = tile.y - this.lastDragTile.y
    const dCol = tile.x - this.lastDragTile.x

    // Diagonal movement is not allowed: the user must drag along a single
    // axis at a time.
    if (dRow !== 0 && dCol !== 0) return

    // Walk one step at a time so that leaps forward (fast drags) fill
    // intermediate tiles.
    const stepRow = dRow === 0 ? 0 : dRow > 0 ? 1 : -1
    const stepCol = dCol === 0 ? 0 : dCol > 0 ? 1 : -1
    let current = this.lastDragTile
    while (current.y !== tile.y || current.x !== tile.x) {
      // Calculate the next tile along the drag path.
      const next = new Phaser.Math.Vector2(
        current.x + stepCol,
        current.y + stepRow,
      )

      if (this.drag.tool === "add-road") {
        // Record the step and render the new exit direction, if any.
        const dir = this.advanceDragByOneStep(current, next)
        if (dir !== null) this.drawStep(current, dir)
      } else {
        // Highlight each new tile entered during a delete-road drag.
        const nextKey = this.tileKey(next)
        if (!this.drag.set.has(nextKey)) {
          this.drag.set.add(nextKey)
          this.drawDeleteHighlight(next)
        }
        this.drag.sequence.push(next)
      }
      current = next
    }
  }

  private onPointerUp() {
    if (!this.drag.tool) return

    if (this.drag.tool === "add-road") this.finalizeAddRoadDrag()
    else if (this.drag.tool === "delete-road") this.finalizeDeleteRoadDrag()

    this.drag.tool = null
    this.drag.sequence = []
    this.drag.set.clear()
    this.drag.dirs.clear()
    this.drag.graphics!.clear()
  }

  private onPointerUpOutside = () => this.onPointerUp()

  /**
   * Highlights a single tile with a transparent red overlay for the delete-road
   * tool.
   */
  private drawDeleteHighlight(tile: Phaser.Math.Vector2) {
    const worldXY = this.tilemap.tileToWorldXY(tile.x, tile.y)
    if (worldXY) this.drawDragHighlight(worldXY, 0xff0000)
  }

  private drawDragHighlight(
    worldXY: Phaser.Math.Vector2,
    color: number,
    alpha = 0.4,
  ) {
    this.drag
      .graphics!.fillStyle(color, alpha)
      .fillRect(
        worldXY.x,
        worldXY.y,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )
  }

  /**
   * Clears the road tile data and visual for every tile highlighted during a
   * delete-road drag. Neighbours of deleted tiles that had a connection into
   * the deleted tile also have that connection removed — so deleting a
   * crossroads turns the four previously-connected straights into dead ends
   * pointing away from where the crossroads was.
   */
  private finalizeDeleteRoadDrag() {
    // Collect every tile that needs to be redrawn (deleted tiles + affected
    // neighbours) so we only touch the minimum set.
    const toRedraw = new Set(this.drag.set)

    for (const key of this.drag.set) {
      const [row, col] = key.split(",").map(Number)
      const deletedDirs = this.road.dirs[row][col]

      // For each direction the deleted tile had, remove the back-connection
      // from the neighbouring tile and queue it for redraw.
      for (const dir of deletedDirs) {
        const [dRow, dCol] = this.dir.offsets[dir]
        const nRow = row + dRow
        const nCol = col + dCol

        if (
          nRow >= 0 &&
          nRow < this.tilemap.height &&
          nCol >= 0 &&
          nCol < this.tilemap.width
        ) {
          this.road.dirs[nRow][nCol].delete(this.dir.opposites[dir])
          toRedraw.add(`${nRow},${nCol}`)
        }
      }

      // Clear the deleted tile's own directions.
      this.road.dirs[row][col].clear()
    }

    // Redraw only the affected tiles.
    for (const key of toRedraw) {
      const [row, col] = key.split(",").map(Number)
      const dirs = this.road.dirs[row][col]
      // If the tile has no connections, remove the road tile entirely.
      if (dirs.size === 0) this.layers.road.putTileAt(-1, col, row)
      // Otherwise, redraw the road tile based on its current connections.
      else this.addRoad(row, col, dirs)
    }
  }

  /**
   * Derives the exit connections each visited tile gained from the drag, merges
   * them into roadDirs, then calls addRoad() for every affected tile.
   *
   * Only exit connections are recorded: moving from tile A → tile B adds an
   * exit connection to A only. Tile B is only connected when the cursor leaves
   * it. This means two adjacent tiles never force a shared connection on each
   * other.
   */
  private finalizeAddRoadDrag() {
    const pending = new Map<
      string,
      { row: number; col: number; dirs: DirectionSet }
    >()

    for (let i = 0; i < this.drag.sequence.length; i++) {
      const current = this.drag.sequence[i]
      const key = this.tileKey(current)

      if (!pending.has(key)) {
        pending.set(key, {
          row: current.y,
          col: current.x,
          dirs: new Set() as DirectionSet,
        })
      }

      const next = this.drag.sequence[i + 1]
      if (next) {
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
        const dir = this.directionBetween(current, next)
        if (!this.exitsMap(current.y, current.x, dir))
          pending.get(key)!.dirs.add(dir)
        const oppositeDir = this.dir.opposites[dir]
        if (!this.exitsMap(next.y, next.x, oppositeDir))
          pending.get(nextKey)!.dirs.add(oppositeDir)
      }
    }

    // Merge new connections into the persistent grid, then redraw each tile.
    for (const { row, col, dirs } of pending.values()) {
      const roadDirs = this.road.dirs[row][col]
      for (const dir of dirs) roadDirs.add(dir)
      this.addRoad(row, col, roadDirs)
    }
  }

  /**
   * Called whenever a tile's connections change. Classifies the tile based on
   * its full set of open sides and places the correct road tile. Connections
   * accumulate across drags, so a tile may be upgraded (e.g. turn → T-junction)
   * by a subsequent drag.
   */
  private addRoad(row: number, col: number, dirs: DirectionSet) {
    // Get the road tile IDs for the current road type (e.g. Asphalt).
    const roadIDs = layers.tile.data.IDs.Road[this.road.type]

    // Shorthands.
    const putTile = (id: layers.tile.data.RoadID) =>
      this.putTileAt("road", id, col, row)
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
