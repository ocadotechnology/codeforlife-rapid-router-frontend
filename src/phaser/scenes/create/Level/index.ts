import Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../../BaseLevel"
import HouseManager from "./HouseManager"
import RoadManager from "./RoadManager"
import Toolbox from "../Toolbox"

export type Tile = { col: number; row: number }
export type Direction = "top" | "bottom" | "left" | "right"
export type DirectionSet = Set<Direction> & { readonly size: 0 | 1 | 2 | 3 | 4 }

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
  /** Road manager responsible for handling road tiles and their connections. */
  road!: RoadManager

  /** House manager responsible for handling house tiles and their occupancy. */
  house!: HouseManager

  /** Graphics used to render tile highlights for tools. */
  graphics!: Phaser.GameObjects.CustomGraphics

  create() {
    // Create the tilemap, layers, and other essentials of the level scene.
    super.create()

    // Draw a permanent grid over the tilemap to visualize the tile boundaries.
    this.add
      .customGraphics()
      .grid(
        this.tilemap.width,
        this.tilemap.height,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )

    // Create a configurable graphics objects for tools to use.
    // Set the depth to 1 so it renders above the grid and tilemap layers.
    this.graphics = this.add.customGraphics().setDepth(1)

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
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, () =>
      this.onPointerUpOutside(),
    )

    // Launch the Toolbox scene, providing the active tool.
    this.scene.launch(Toolbox.KEY)

    // Initialize the managers.
    this.road = new RoadManager(this)
    this.house = new HouseManager(this)
  }

  /** Get the toolbox scene instance. */
  get toolbox() {
    return this.scene.get<Toolbox>(Toolbox.KEY)
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.road.onPointerDown(pointer)
    this.house.onPointerDown(pointer)
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    this.road.onPointerMove(pointer)
    this.house.onPointerMove(pointer)
  }

  private onPointerUp() {
    this.road.onPointerUp()
    this.graphics.clear()
  }

  private onPointerUpOutside = () => this.onPointerUp()

  /**
   * Converts world coordinates to a tile position, clamping to the nearest edge
   * tile when the cursor is outside the tilemap bounds. Returns null only if
   * the tilemap conversion itself fails.
   */
  worldToNearestTile(worldX: number, worldY: number) {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    const x = Phaser.Math.Clamp(tileXY.x, 0, this.tilemap.width - 1)
    const y = Phaser.Math.Clamp(tileXY.y, 0, this.tilemap.height - 1)
    return new Phaser.Math.Vector2(x, y)
  }

  /**
   * Returns the tile at the given world coordinates without clamping to the
   * tilemap bounds. Returns null when the cursor is outside the tilemap.
   */
  worldToTile(worldX: number, worldY: number) {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    if (
      tileXY.x < 0 ||
      tileXY.x >= this.tilemap.width ||
      tileXY.y < 0 ||
      tileXY.y >= this.tilemap.height
    )
      return null
    return new Phaser.Math.Vector2(Math.floor(tileXY.x), Math.floor(tileXY.y))
  }

  /**
   * Returns true if moving in `dir` from the given tile would leave the tilemap
   * — i.e. the direction is not a valid exit for that tile.
   */
  exitsMap = (row: number, col: number): Record<Direction, boolean> => ({
    left: col === 0,
    right: col === this.tilemap.width - 1,
    top: row === 0,
    bottom: row === this.tilemap.height - 1,
  })

  highlightTile(worldXY: Phaser.Math.Vector2, color: number, alpha = 0.4) {
    this.graphics
      .fillStyle(color, alpha)
      .fillRect(
        worldXY.x,
        worldXY.y,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )
  }
}
