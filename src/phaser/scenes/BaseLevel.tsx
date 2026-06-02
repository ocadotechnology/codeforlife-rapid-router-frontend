import Phaser from "phaser"

export default class extends Phaser.Scene {
  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTilesets!: Phaser.Tilemaps.Tileset[]
  backgroundLayer!:
    | Phaser.Tilemaps.TilemapLayer
    | Phaser.Tilemaps.TilemapGPULayer
  obstacleTilesets!: Phaser.Tilemaps.Tileset[]
  obstacleLayer!: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  sceneryObjects!: Phaser.GameObjects.GameObject[]

  createBackgroundLayer(tilesetNames: string[]) {
    this.backgroundTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.backgroundLayer = this.tilemap.createLayer(
      "Background", // This is hardcoded for consistency.
      this.backgroundTilesets,
    )!
  }

  createObstacleLayer(tilesetNames: string[]) {
    this.obstacleTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.obstacleLayer = this.tilemap.createLayer(
      "Obstacles", // This is hardcoded for consistency.
      this.obstacleTilesets,
    )!
  }

  createSceneryObjects(types: string[]) {
    this.sceneryObjects = this.tilemap.createFromObjects(
      "Scenery", // This is hardcoded for consistency.
      types.map(type => ({
        type,
        classType: Phaser.GameObjects.Image,
        key: type,
      })),
    )
  }

  createTilemap({
    key,
    backgroundTilesetNames,
    obstacleTilesetNames,
    sceneryObjectTypes,
  }: {
    key: string
    backgroundTilesetNames: string[]
    obstacleTilesetNames: string[]
    sceneryObjectTypes: string[]
  }) {
    this.tilemap = this.make.tilemap({ key })

    // NOTE: The order of these method calls matters.
    // 1. The background layer is created.
    // 2. The obstacle layer is created, on top of the background layer.
    // 3. The scenery objects are created, on top of both layers.
    this.createBackgroundLayer(backgroundTilesetNames)
    this.createObstacleLayer(obstacleTilesetNames)
    this.createSceneryObjects(sceneryObjectTypes)
  }
}
