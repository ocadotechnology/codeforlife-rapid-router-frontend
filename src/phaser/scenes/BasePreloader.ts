import Phaser from "phaser"

import * as backgrounds from "../backgrounds"
import * as tilesets from "../tilesets"
import type { default as BaseLevel, BaseLevelData } from "./BaseLevel"
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"
import BaseScene from "./BaseScene"
import type { OrthogonalTilemap } from "../tilemaps"

export default class BasePreloader<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  static readonly KEY = "Preloader"
  levelData: BaseLevelData = {
    background: "grass",
    tilesets: { road: [], environment: [], scenery: [] },
  }

  init() {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // We loaded this image in our Boot Scene, so we can display it here
    const logo = this.add.image(centerX, centerY, "logo")

    // Render a tile sprite behind everything as the background.
    this.add
      .tileSprite(
        centerX,
        centerY,
        this.scale.width,
        this.scale.height,
        backgrounds.Backgrounds.GRASS,
      )
      .setDepth(-1) // Render behind everything

    // A simple progress bar. This is the outline of the bar.
    const barY = centerY + logo.height / 2
    this.add.rectangle(centerX, barY, 468, 32).setStrokeStyle(1, 0xffffff)

    // This is the progress bar itself. It will increase in size from the left
    // based on the % of progress.
    const bar = this.add.rectangle(centerX - 230, barY, 4, 28, 0xffffff)

    // Use the 'progress' event emitted by the LoaderPlugin to update the
    // loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  loadTilemap(tilemap: OrthogonalTilemap) {
    // Cache the tilemap data so that it can be accessed in the Level Scene.
    this.cache.tilemap.add("level", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: tilemap,
    })

    // Load the background image specified in the tilemap properties.
    const background = tilemap.properties[0].value
    this.load.svg(background, backgrounds.getSvgUrl(background), {
      width: tilemap.tilewidth ?? TILE_WIDTH,
      height: tilemap.tileheight ?? TILE_HEIGHT,
    })
    this.levelData.background = background

    // Load the tileset images and store relevant data in levelData for later
    // use in the Level Scene. This is necessary because Phaser needs the
    // tileset images to create the tilemap, but we also need to know which
    // tilesets belong to which layers in order to render the correct layers in
    // the correct order in the Level Scene.
    for (const {
      image,
      name,
      firstgid: id,
      imagewidth = TILE_WIDTH,
      imageheight = TILE_HEIGHT,
    } of tilemap.tilesets) {
      // Track each layer's tilesets.
      if (tilesets.road.IDs.includes(id as tilesets.road.ID)) {
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
      if (image.endsWith(".svg")) {
        this.load.svg(name, image, { width: imagewidth, height: imageheight })
      } else throw new Error(`Unsupported tileset image format: ${image}`)
    }
  }

  startLevel<LevelData extends BaseLevelData>(
    level: (new () => BaseLevel<LevelData>) & { KEY: string },
    data: LevelData = this.levelData as LevelData,
  ) {
    this.scene.start(level.KEY, data)
  }
}
