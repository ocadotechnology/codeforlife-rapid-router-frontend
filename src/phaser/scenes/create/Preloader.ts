import Phaser from "phaser"

import { SVGs, Scenes } from "../../enums"
import { TILE_HEIGHT, TILE_WIDTH } from "../../tilemaps"
import BasePreloader from "../BasePreloader"

// Tilemaps
import level1 from "../../tilemaps/level1"

// Background SVGs.
import GrassBackground from "../../../images/background/grass.svg?raw"

// Road SVGs.
import CrossroadsRoad from "../../../images/road/asphalt/crossroads.svg?raw"
import DeadEndRoad from "../../../images/road/asphalt/dead_end.svg?raw"
import StraightRoad from "../../../images/road/asphalt/straight.svg?raw"
import TJunctionRoad from "../../../images/road/asphalt/t_junction.svg?raw"
import TurnRoad from "../../../images/road/asphalt/turn.svg?raw"

// Obstacle SVGs.
import GreenTrafficLightObstacle from "../../../images/obstacles/trafficLight/green.svg?raw"
import RedTrafficLightObstacle from "../../../images/obstacles/trafficLight/red.svg?raw"

// Scenery SVGs.
import BushScenery from "../../../images/scenery/grass/bush.svg?raw"
import CFCScenery from "../../../images/scenery/grass/cfc.svg?raw"
import HouseScenery from "../../../images/scenery/grass/house.svg?raw"
import PondScenery from "../../../images/scenery/grass/pond.svg?raw"
import SolarPanelScenery from "../../../images/scenery/grass/solar_panel.svg??raw"
import Tree1Scenery from "../../../images/scenery/grass/tree1.svg?raw"
import Tree2Scenery from "../../../images/scenery/grass/tree2.svg?raw"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Level Scene.
 */
export default class extends BasePreloader {
  constructor() {
    super(Scenes.Create.PRELOADER)
  }

  preload() {
    this.cache.tilemap.add("level", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: level1,
    })

    this.loadSVGs()
  }

  private loadSVGs() {
    // Background
    this.load.svg(SVGs.Background.GRASS, this.makeSvgBlobUrl(GrassBackground), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })

    // Roads
    this.load.svg(
      SVGs.Road.Asphalt.CROSSROADS,
      this.makeSvgBlobUrl(CrossroadsRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.DEAD_END,
      this.makeSvgBlobUrl(DeadEndRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.STRAIGHT,
      this.makeSvgBlobUrl(StraightRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.T_JUNCTION,
      this.makeSvgBlobUrl(TJunctionRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(SVGs.Road.Asphalt.TURN, this.makeSvgBlobUrl(TurnRoad), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })

    // Obstacles
    this.load.svg(
      SVGs.Obstacles.TrafficLight.RED,
      this.makeSvgBlobUrl(RedTrafficLightObstacle),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Obstacles.TrafficLight.GREEN,
      this.makeSvgBlobUrl(GreenTrafficLightObstacle),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )

    // Scenery
    this.load.svg(SVGs.Scenery.Grass.BUSH, this.makeSvgBlobUrl(BushScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.Grass.CFC, this.makeSvgBlobUrl(CFCScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.Grass.HOUSE, this.makeSvgBlobUrl(HouseScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.Grass.POND, this.makeSvgBlobUrl(PondScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(
      SVGs.Scenery.Grass.SOLAR_PANEL,
      this.makeSvgBlobUrl(SolarPanelScenery),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(SVGs.Scenery.Grass.TREE1, this.makeSvgBlobUrl(Tree1Scenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.Grass.TREE2, this.makeSvgBlobUrl(Tree2Scenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
  }

  create() {
    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    // Start the level creator.
    this.scene.start(Scenes.Create.LEVEL)
  }
}
