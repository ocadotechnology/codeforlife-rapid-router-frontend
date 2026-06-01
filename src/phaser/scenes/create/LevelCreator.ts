import Phaser from "phaser"

import { Scenes } from "../../enums"

/**
 * The Level Creator Scene is responsible for providing a user interface and
 * tools for designing and creating game levels. This scene allows developers or
 * players to place game objects, set up the environment, and define the layout
 * of a level. It typically includes features such as a grid system, object
 * placement tools, and options for saving and loading created levels. The Level
 * Creator Scene is an essential part of the game development process, enabling
 * the creation of engaging and diverse gameplay experiences.
 */
export default class extends Phaser.Scene {
  tilemap!: Phaser.Tilemaps.Tilemap
  tileset!: Phaser.Tilemaps.Tileset
  roadLayer!: Phaser.Tilemaps.TilemapLayer
  obstacleLayer!: Phaser.Tilemaps.TilemapLayer
  sceneryObjects!: Phaser.GameObjects.GameObject[]

  constructor() {
    super(Scenes.Create.LEVEL_CREATOR)
  }

  create() {
    this.cameras.main.setZoom(1)

    // Create a grid for snapping objects to. This grid is not rendered in the
    // game, but it allows us to use Phaser's built-in tilemap features for grid
    // management.
    this.tilemap = this.add.tilemap()

    // The "grid" tileset is a single transparent tile that we use to create a
    // grid for snapping objects to. It is not rendered in the game, but it
    // allows us to use Phaser's built-in tilemap features for grid management.
    this.tileset = this.tilemap.addTilesetImage("grid", undefined, 1, 1)

    // These are our grid-restricted layers. They will automatically resize to
    // fit the grid and will be used to snap objects to the grid when they are
    // placed on top of them.
    this.roadLayer = this.tilemap.createLayer("Roads", this.tileset)
    this.obstacleLayer = this.tilemap.createLayer("Obstacles", this.tileset)

    // This is our layer for scenery objects. It will not automatically resize
    // to fit the grid and will be used for decorative elements that do not
    // interact with the grid.
    this.sceneryObjects = this.tilemap.createFromObjects("Scenery", [])

    // .setFillStyle(0xffffff, 0) // transparent cell fill
    // .setStrokeStyle(0x000000, 1) // black cell outlines

    // Update the grid's dimensions whenever the canvas is resized.
    // this.resizeGrid()
    // const resizeGrid = () => this.resizeGrid()
    // this.scale.on(Phaser.Scale.Events.RESIZE, resizeGrid)
    // this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    //   this.scale.off(Phaser.Scale.Events.RESIZE, resizeGrid)
    // })
  }

  // private resizeGrid() {
  //   const COLS = 10
  //   const ROWS = 8
  //   const MIN_CELL_SIZE = 64
  //   const { width, height } = this.scale

  //   const cellSize = Math.max(
  //     Math.min(width / COLS, height / ROWS),
  //     MIN_CELL_SIZE,
  //   )

  //   const gridWidth = COLS * cellSize
  //   const gridHeight = ROWS * cellSize

  //   this.grid.setPosition(gridWidth / 2, gridHeight / 2)
  //   this.grid.setDisplaySize(gridWidth, gridHeight)
  //   this.grid.cellWidth = cellSize
  //   this.grid.cellHeight = cellSize

  //   this.cameras.main.centerOn(gridWidth / 2, gridHeight / 2)
  // }
}
