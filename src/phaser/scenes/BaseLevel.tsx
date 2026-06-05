import Phaser from "phaser"

import type {
  BackgroundSVG,
  EnvironmentSVG,
  RoadSVG,
  ScenerySVG,
} from "../enums"

export default class extends Phaser.Scene {
  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTilesets!: Phaser.Tilemaps.Tileset[]
  backgroundLayer!:
    | Phaser.Tilemaps.TilemapLayer
    | Phaser.Tilemaps.TilemapGPULayer
  roadTilesets!: Phaser.Tilemaps.Tileset[]
  roadLayer!: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  environmentTilesets!: Phaser.Tilemaps.Tileset[]
  environmentLayer!:
    | Phaser.Tilemaps.TilemapLayer
    | Phaser.Tilemaps.TilemapGPULayer
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
  createBackgroundLayer(tilesetNames: BackgroundSVG[]) {
    this.backgroundTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.backgroundLayer = this.tilemap.createLayer(
      "Background", // This is hardcoded for consistency.
      this.backgroundTilesets,
    )!
  }

  /**
   * Creates the road layer of the tilemap using the specified tileset names.
   * The road layer is typically rendered on top of the background layer and
   * serves as the navigable paths for the player and other entities in the
   * level. It is important to create this layer after the background layer but
   * before the obstacle layer to ensure proper rendering order and interaction
   * between layers.
   *
   * @param tilesetNames The names of the tilesets to use for the road layer.
   */
  createRoadLayer(tilesetNames: RoadSVG[]) {
    this.roadTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.roadLayer = this.tilemap.createLayer(
      "Road", // This is hardcoded for consistency.
      this.roadTilesets,
    )
  }

  /**
   * Creates the environment layer of the tilemap using the specified tileset
   * names. The environment layer is typically rendered on top of the background
   * and road layers and serves as the world objects that the player can see and
   * potentially interact with in the level, such as traffic lights, buildings,
   * and other interactive elements.
   *
   * @param tilesetNames The names of the tilesets to use for the environment.
   * layer.
   */
  createEnvironmentLayer(tilesetNames: EnvironmentSVG[]) {
    this.environmentTilesets = tilesetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.environmentLayer = this.tilemap.createLayer(
      "Environment", // This is hardcoded for consistency.
      this.environmentTilesets,
    )!
  }

  /**
   * Creates the scenery objects of the tilemap using the specified types.
   * Scenery objects are typically rendered on top of all layers and serve as
   * decorative elements in the level.
   *
   * @param types The types of the scenery objects to create.
   */
  createSceneryObjects(types: ScenerySVG[]) {
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
   * @param roadTilesetNames The names of the tilesets to use for the road
   * layer.
   * @param environmentTilesetNames The names of the tilesets to use for the
   * environment layer.
   * @param sceneryObjectTypes The types of the scenery objects to create.
   */
  createTilemap({
    key,
    backgroundTilesetNames,
    roadTilesetNames,
    environmentTilesetNames,
    sceneryObjectTypes,
  }: {
    key: string
    backgroundTilesetNames: BackgroundSVG[]
    roadTilesetNames: RoadSVG[]
    environmentTilesetNames: EnvironmentSVG[]
    sceneryObjectTypes: ScenerySVG[]
  }) {
    this.tilemap = this.make.tilemap({ key })

    // NOTE: The order of these method calls matters.
    // 1. The background layer is created.
    // 2. The road layer is created, on top of the background layer.
    // 3. The environment layer is created, on top of the road layer.
    // 4. The scenery objects are created, on top of all layers.
    this.createBackgroundLayer(backgroundTilesetNames)
    this.createRoadLayer(roadTilesetNames)
    this.createEnvironmentLayer(environmentTilesetNames)
    this.createSceneryObjects(sceneryObjectTypes)
  }
}
