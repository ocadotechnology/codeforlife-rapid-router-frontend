import Phaser from "phaser"

import * as layers from "../layers"
import BaseScene from "./BaseScene"

export interface BaseLevelData {
  tilesets: Record<layers.tile.Name, Array<{ name: string }>> &
    Record<layers.objectGroup.Name, Array<{ name: string; gid: number }>>
}

export default class BaseLevel<
  Data extends BaseLevelData = BaseLevelData,
> extends BaseScene<Data> {
  static KEY = "Level"

  tilemap!: Phaser.Tilemaps.Tilemap
  tilesets: Record<layers.Name, Phaser.Tilemaps.Tileset[]> = {
    background: [],
    road: [],
    environment: [],
    scenery: [],
  }
  layers: Record<
    layers.tile.Name,
    Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  > = {
    background: null as unknown as Phaser.Tilemaps.TilemapLayer,
    road: null as unknown as Phaser.Tilemaps.TilemapLayer,
    environment: null as unknown as Phaser.Tilemaps.TilemapLayer,
  }
  objects: Record<layers.objectGroup.Name, Phaser.GameObjects.GameObject[]> = {
    scenery: null as unknown as Phaser.GameObjects.GameObject[],
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
  createTilemap({ key }: { key: string }) {
    this.tilemap = this.make.tilemap({ key })

    // 1. The background layer is created.
    this.tilesets.background = this.initData.tilesets.background.map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers.background = this.tilemap.createLayer(
      layers.Names.Tile.BACKGROUND,
      this.tilesets.background,
    )

    // 2. The road layer is created, on top of the background layer.
    this.tilesets.road = this.initData.tilesets.road.map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers.road = this.tilemap.createLayer(
      layers.Names.Tile.ROAD,
      this.tilesets.road,
    )

    // 3. The environment layer is created, on top of the road layer.
    this.tilesets.environment = this.initData.tilesets.environment.map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers.environment = this.tilemap.createLayer(
      layers.Names.Tile.ENVIRONMENT,
      this.tilesets.environment,
    )

    // 4. The scenery objects are created, on top of all layers.
    this.objects.scenery = this.tilemap.createFromObjects(
      layers.Names.ObjectGroup.SCENERY,
      this.initData.tilesets.scenery.map(({ name: key, gid }) => ({
        key,
        gid,
        classType: Phaser.GameObjects.Image,
      })),
    )
  }
}
