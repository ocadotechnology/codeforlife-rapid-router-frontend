import Phaser from "phaser"

import { SVGs, Scenes, Tilemaps } from "../../enums"
import BasePreloader from "../BasePreloader"

// Tilemaps
import level1 from "./level1.jsonc"

// Background SVGs.
import GrassTileset from "../../../images/background/grass.svg?raw"
import SnowTileset from "../../../images/background/snow.svg?raw"

// Obstacle SVGs.
import GreenTrafficLightObstacle from "../../../images/obstacles/traffic_light_green.svg?raw"
import PigeonObstacle from "../../../images/obstacles/pigeon.svg?raw"
import RedTrafficLightObstacle from "../../../images/obstacles/traffic_light_red.svg?raw"

// Scenery SVGs.
import Tree1Scenery from "../../../images/scenery/tree1.svg?raw"
import Tree2Scenery from "../../../images/scenery/tree2.svg?raw"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the LevelCreator Scene.
 */
export default class extends BasePreloader {
  constructor() {
    super(Scenes.Create.PRELOADER)
  }

  preload() {
    this.cache.tilemap.add(Tilemaps.LEVEL1, {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: level1,
    })

    this.loadSVGs()
  }

  private loadSVGs() {
    // Background
    this.load.svg(SVGs.Background.GRASS, this.makeSvgBlobUrl(GrassTileset), {
      width: 64,
      height: 64,
    })
    this.load.svg(SVGs.Background.SNOW, this.makeSvgBlobUrl(SnowTileset), {
      width: 64,
      height: 64,
    })

    // Obstacles
    this.load.svg(SVGs.Obstacles.PIGEON, this.makeSvgBlobUrl(PigeonObstacle), {
      width: 64,
      height: 64,
    })
    this.load.svg(
      SVGs.Obstacles.TrafficLight.RED,
      this.makeSvgBlobUrl(RedTrafficLightObstacle),
      { width: 64, height: 64 },
    )
    this.load.svg(
      SVGs.Obstacles.TrafficLight.GREEN,
      this.makeSvgBlobUrl(GreenTrafficLightObstacle),
      { width: 64, height: 64 },
    )

    // Scenery
    this.load.svg(SVGs.Scenery.TREE1, this.makeSvgBlobUrl(Tree1Scenery), {
      width: 64,
      height: 64,
    })
    this.load.svg(SVGs.Scenery.TREE2, this.makeSvgBlobUrl(Tree2Scenery), {
      width: 64,
      height: 64,
    })
  }

  create() {
    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    // Start the level creator.
    this.scene.start(Scenes.Create.LEVEL_CREATOR)
  }
}
