import Phaser from "phaser"

import * as layers from "../layers"
import * as objects from "../objects"
import BaseScene from "./BaseScene"

export interface BaseLevelData {
  backgroundTileSetNames: string[]
  roadTileSetNames: string[]
  environmentTileSetNames: string[]
  sceneryTileSetNames: string[]
}

export default class BaseLevel<
  Data extends BaseLevelData = BaseLevelData,
> extends BaseScene<Data> {
  static KEY = "Level"

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
  createTilemap({ key }: { key: string }) {
    this.tilemap = this.make.tilemap({ key })

    // 1. The background layer is created.
    this.backgroundTilesets = this.initData.backgroundTileSetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.backgroundLayer = this.tilemap.createLayer(
      layers.Names.Tile.BACKGROUND,
      this.backgroundTilesets,
    )

    // 2. The road layer is created, on top of the background layer.
    this.roadTilesets = this.initData.roadTileSetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.roadLayer = this.tilemap.createLayer(
      layers.Names.Tile.ROAD,
      this.roadTilesets,
    )

    // 3. The environment layer is created, on top of the road layer.
    this.environmentTilesets = this.initData.environmentTileSetNames.map(
      name => this.tilemap.addTilesetImage(name)!,
    )
    this.environmentLayer = this.tilemap.createLayer(
      layers.Names.Tile.ENVIRONMENT,
      this.environmentTilesets,
    )

    // 4. The scenery objects are created, on top of all layers.
    this.sceneryObjects = this.tilemap.createFromObjects(
      layers.Names.ObjectGroup.SCENERY,
      this.initData.sceneryTileSetNames.map(name => ({
        key: name,
        type: objects.scenery.TYPE,
        classType: Phaser.GameObjects.Image,
      })),
    )
  }
}
