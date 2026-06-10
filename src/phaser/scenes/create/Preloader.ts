import Phaser from "phaser"
import type { TiledTileset as TileSet } from "tiled-types"

import * as tilesets from "../../tileSets"
import Level, { type LevelData } from "./Level"
import { TILE_HEIGHT, TILE_WIDTH } from "../../constants"
import BasePreloader from "../BasePreloader"

// Tilemaps TODO: remove
import level1 from "../../tileMaps/level1"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Level Scene.
 */
export default class extends BasePreloader {
  private levelData: LevelData = {
    tilesets: { background: [], road: [], environment: [], scenery: [] },
  }

  preload() {
    this.cache.tilemap.add("level", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: level1,
    })

    this.loadTileSetImages(level1.tilesets)
  }

  private loadTileSetImages(tileSets: TileSet[]) {
    for (const {
      image,
      name,
      firstgid: id,
      imagewidth = TILE_WIDTH,
      imageheight = TILE_HEIGHT,
    } of tileSets) {
      // Categorize the tileset based on its GID and store the relevant data in
      // levelData for later use in the Level Scene.
      if (tilesets.background.IDs.includes(id as tilesets.background.ID)) {
        this.levelData.tilesets.background.push({ name })
      } else if (tilesets.road.IDs.includes(id as tilesets.road.ID)) {
        this.levelData.tilesets.road.push({ name })
      } else if (
        tilesets.environment.IDs.includes(id as tilesets.environment.ID)
      ) {
        this.levelData.tilesets.environment.push({ name })
      } else if (tilesets.scenery.IDs.includes(id as tilesets.scenery.ID)) {
        this.levelData.tilesets.scenery.push({ name, gid: id })
      } else {
        throw new Error(`Unknown tileset GID: ${id} (tileset name: ${name})`)
      }

      // Load the image.
      if (image!.endsWith(".svg")) {
        this.load.svg(name, image, { width: imagewidth, height: imageheight })
      } else throw new Error(`Unsupported tileset image format: ${image}`)
    }
  }

  create() {
    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    // Start the level creator.
    this.scene.start(Level.KEY, this.levelData)
  }
}
