import Phaser from "phaser"

import { SVGs, Scenes, Tilemaps } from "../../enums"

/**
 * The Level Scene is responsible for providing a user interface and tools for
 * designing and creating game levels. This scene allows developers or players
 * to place game objects, set up the environment, and define the layout of a
 * level. It typically includes features such as a grid system, object placement
 * tools, and options for saving and loading created levels. The Level Scene is
 * an essential part of the game development process, enabling the creation of
 * engaging and diverse gameplay experiences.
 */
export default class extends Phaser.Scene {
  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTilesets!: Phaser.Tilemaps.Tileset[]
  backgroundLayer!:
    | Phaser.Tilemaps.TilemapLayer
    | Phaser.Tilemaps.TilemapGPULayer
  obstacleTilesets!: Phaser.Tilemaps.Tileset[]
  obstacleLayer!: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  sceneryObjects!: Phaser.GameObjects.GameObject[]
  lineGraphics!: Phaser.GameObjects.Graphics

  constructor() {
    super(Scenes.Create.LEVEL)
  }

  create() {
    const COLS = 10
    const ROWS = 8
    const CELL_SIZE = 64
    const gridWidth = COLS * CELL_SIZE
    const gridHeight = ROWS * CELL_SIZE

    this.cameras.main.setZoom(1)

    this.tilemap = this.make.tilemap({ key: Tilemaps.LEVEL1 })

    // NOTE: The order of these method calls matters.
    // 1. The background layer is created.
    // 2. The obstacle layer is created, on top of the background layer.
    // 3. The scenery objects are created, on top of both layers.
    this.createBackgroundLayer()
    this.createObstacleLayer()
    this.createSceneryObjects()

    this.addLineGraphics(COLS, ROWS, gridWidth, gridHeight, CELL_SIZE)

    // ── Camera ───────────────────────────────────────────────────────────────
    this.cameras.main.centerOn(gridWidth / 2, gridHeight / 2)
  }

  private createBackgroundLayer() {
    this.backgroundTilesets = [
      this.tilemap.addTilesetImage(SVGs.Background.GRASS)!,
      this.tilemap.addTilesetImage(SVGs.Background.SNOW)!,
    ]

    this.backgroundLayer = this.tilemap.createLayer(
      "Background",
      this.backgroundTilesets,
    )!
  }

  private createObstacleLayer() {
    this.obstacleTilesets = [
      this.tilemap.addTilesetImage(SVGs.Obstacles.PIGEON)!,
      this.tilemap.addTilesetImage(SVGs.Obstacles.TrafficLight.RED)!,
      this.tilemap.addTilesetImage(SVGs.Obstacles.TrafficLight.GREEN)!,
    ]

    this.obstacleLayer = this.tilemap.createLayer(
      "Obstacles",
      this.obstacleTilesets,
    )!
  }

  private createSceneryObjects() {
    this.sceneryObjects = this.tilemap.createFromObjects("Scenery", [
      {
        type: SVGs.Scenery.TREE1,
        classType: Phaser.GameObjects.Image,
        key: SVGs.Scenery.TREE1,
      },
      {
        type: SVGs.Scenery.TREE2,
        classType: Phaser.GameObjects.Image,
        key: SVGs.Scenery.TREE2,
      },
    ])
  }

  private addLineGraphics(
    cols: number,
    rows: number,
    gridWidth: number,
    gridHeight: number,
    cellSize: number,
  ) {
    // The tilemap has no built-in renderer, so draw grid lines explicitly.
    this.lineGraphics = this.add.graphics().lineStyle(1, 0x000000, 1)

    // Draw vertical lines.
    for (let col = 0; col <= cols; col++) {
      this.lineGraphics.moveTo(col * cellSize, 0)
      this.lineGraphics.lineTo(col * cellSize, gridHeight)
    }

    // Draw horizontal lines.
    for (let row = 0; row <= rows; row++) {
      this.lineGraphics.moveTo(0, row * cellSize)
      this.lineGraphics.lineTo(gridWidth, row * cellSize)
    }

    // Stroke the grid lines to render them on the scene.
    this.lineGraphics.strokePath()
  }
}
