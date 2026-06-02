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

  /**
   * Creates the background layer of the tilemap using the specified tileset
   * names. The background layer is typically the bottom-most layer of the
   * tilemap and is rendered first, serving as the visual foundation for the
   * level. It is important to create this layer before other layers to ensure
   * proper rendering order.
   *
   * @param tilesetNames The names of the tilesets to use for the background
   * layer.
   */
  createBackgroundLayer(tilesetNames: string[]) {
    this.backgroundTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.backgroundLayer = this.tilemap.createLayer(
      "Background", // This is hardcoded for consistency.
      this.backgroundTilesets,
    )!
  }

  /**
   * Creates the obstacle layer of the tilemap using the specified tileset
   * names. The obstacle layer is typically rendered on top of the background
   * layer and serves as the interactive or impassable elements in the level.
   *
   * @param tilesetNames The names of the tilesets to use for the obstacle
   * layer.
   */
  createObstacleLayer(tilesetNames: string[]) {
    this.obstacleTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.obstacleLayer = this.tilemap.createLayer(
      "Obstacles", // This is hardcoded for consistency.
      this.obstacleTilesets,
    )!
  }

  /**
   * Creates the scenery objects of the tilemap using the specified types.
   * Scenery objects are typically rendered on top of both the background and
   * obstacle layers and serve as decorative elements in the level.
   *
   * @param types The types of the scenery objects to create.
   */
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

  /**
   * Creates the tilemap for the level using the specified key and tileset
   * names.The tilemap is the main structure that holds all the layers and
   * objects in the level. This method ensures that the layers and objects are
   * created in the correct order for proper rendering.
   *
   * @param key The key of the tilemap to create.
   * @param backgroundTilesetNames The names of the tilesets to use for the
   * background layer.
   * @param obstacleTilesetNames The names of the tilesets to use for the
   * obstacle layer.
   * @param sceneryObjectTypes The types of the scenery objects to create.
   */
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
