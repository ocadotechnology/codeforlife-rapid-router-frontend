import Phaser from "phaser"

import * as layers from "../layers"
import type { Background } from "../backgrounds"
import BaseScene from "./BaseScene"

export interface BaseLevelData {
  background: Background
  tilesets: Record<layers.tile.Name, Array<{ name: string }>> &
    Record<layers.objectGroup.Name, Array<{ name: string; gid: number }>>
}

export default class BaseLevel<
  Data extends BaseLevelData = BaseLevelData,
> extends BaseScene<Data> {
  static KEY = "Level"

  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTileSprite!: Phaser.GameObjects.TileSprite
  tilesets: Record<layers.Name, Phaser.Tilemaps.Tileset[]> = {
    road: [],
    environment: [],
    scenery: [],
  }
  layers: Record<
    layers.tile.Name,
    Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  > = {
    road: null as unknown as Phaser.Tilemaps.TilemapLayer,
    environment: null as unknown as Phaser.Tilemaps.TilemapLayer,
  }
  objects: Record<layers.objectGroup.Name, Phaser.GameObjects.GameObject[]> = {
    scenery: null as unknown as Phaser.GameObjects.GameObject[],
  }

  create() {
    this.createTilemap()
  }

  /**
   * Creates the tilemap for the level using the specified key and tileset
   * names.The tilemap is the main structure that holds all the layers and
   * objects in the level. This method ensures that the layers and objects are
   * created in the correct order for proper rendering.
   */
  createTilemap() {
    // 1. Create a tilemap from the cached tilemap data.
    this.tilemap = this.make.tilemap({ key: "level" })
    const centerX = this.tilemap.widthInPixels / 2
    const centerY = this.tilemap.heightInPixels / 2

    // 2. Render a tile sprite behind everything as the background.
    this.backgroundTileSprite = this.add.tileSprite(
      centerX,
      centerY,
      this.scale.width * 3,
      this.scale.height * 3,
      this.initData.background,
    )
    this.backgroundTileSprite
      .setOrigin(0.5, 0.5)
      // Shift the tile pattern so it aligns with world (0, 0). The sprite's
      // top-left corner is at (widthInPixels/2 - spriteW/2, ...) in world
      // space. If that position isn't a multiple of tileWidth/tileHeight, the
      // repeating pattern will be offset relative to the tilemap layer.
      .setTilePosition(
        (((this.backgroundTileSprite.x - this.backgroundTileSprite.width / 2) %
          this.tilemap.tileWidth) +
          this.tilemap.tileWidth) %
          this.tilemap.tileWidth,
        (((this.backgroundTileSprite.y - this.backgroundTileSprite.height / 2) %
          this.tilemap.tileHeight) +
          this.tilemap.tileHeight) %
          this.tilemap.tileHeight,
      )
      .setDepth(-1) // Render behind everything

    // 3. The road layer is created, on top of the background layer.
    this.tilesets.road = this.initData.tilesets.road.map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers.road = this.tilemap.createLayer(
      layers.Names.Tile.ROAD,
      this.tilesets.road,
    )

    // 4. The environment layer is created, on top of the road layer.
    this.tilesets.environment = this.initData.tilesets.environment.map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers.environment = this.tilemap.createLayer(
      layers.Names.Tile.ENVIRONMENT,
      this.tilesets.environment,
    )

    // 5. The scenery objects are created, on top of all layers.
    this.objects.scenery = this.tilemap.createFromObjects(
      layers.Names.ObjectGroup.SCENERY,
      this.initData.tilesets.scenery.map(({ name: key, gid }) => ({
        key,
        gid,
        classType: Phaser.GameObjects.Image,
      })),
    )

    // 6. Center the camera on the tilemap.
    this.cameras.main.centerOn(centerX, centerY)
  }
}
