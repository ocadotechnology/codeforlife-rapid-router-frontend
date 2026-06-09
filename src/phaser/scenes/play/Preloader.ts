import Phaser from "phaser"
import type { TiledMap } from "tiled-types"

import { SVGs, Variables } from "../../enums"
import { TILE_HEIGHT, TILE_WIDTH } from "../../constants"
import BasePreloader from "../BasePreloader"
import { Scenes } from "."

// Background SVGs.
import GrassBackground from "../../../images/background/grass.svg?raw"

// Road SVGs.
import CrossroadsRoad from "../../../images/road/asphalt/crossroads.svg?raw"
import DeadEndRoad from "../../../images/road/asphalt/dead_end.svg?raw"
import StraightRoad from "../../../images/road/asphalt/straight.svg?raw"
import TJunctionRoad from "../../../images/road/asphalt/t_junction.svg?raw"
import TurnRoad from "../../../images/road/asphalt/turn.svg?raw"

// Environment SVGs.
import CFCEnvironment from "../../../images/environment/grass/cfc.svg?raw"
import GreenTrafficLightEnvironment from "../../../images/environment/trafficLight/green.svg?raw"
import HouseEnvironment from "../../../images/environment/grass/house.svg?raw"
import RedTrafficLightEnvironment from "../../../images/environment/trafficLight/red.svg?raw"
import SolarPanelEnvironment from "../../../images/environment/grass/solar_panel.svg??raw"

// Scenery SVGs.
import BushScenery from "../../../images/scenery/bush.svg?raw"
import PondScenery from "../../../images/scenery/pond.svg?raw"
import Tree1Scenery from "../../../images/scenery/tree1.svg?raw"
import Tree2Scenery from "../../../images/scenery/tree2.svg?raw"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Gameplay Scene.
 */
export default class extends BasePreloader {
  constructor() {
    super(Scenes.PRELOADER)
  }

  preload() {
    this.loadSVGs()
  }

  private loadSVGs() {
    // Background
    this.load.svg(
      SVGs.Background.GRASS._,
      this.makeSvgBlobUrl(GrassBackground),
      {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
      },
    )

    // Roads
    this.load.svg(
      SVGs.Road.Asphalt.CROSSROADS._,
      this.makeSvgBlobUrl(CrossroadsRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.DEAD_END._,
      this.makeSvgBlobUrl(DeadEndRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.STRAIGHT._,
      this.makeSvgBlobUrl(StraightRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Road.Asphalt.T_JUNCTION._,
      this.makeSvgBlobUrl(TJunctionRoad),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(SVGs.Road.Asphalt.TURN._, this.makeSvgBlobUrl(TurnRoad), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })

    // Environment
    this.load.svg(
      SVGs.Environment.TrafficLight.RED._,
      this.makeSvgBlobUrl(RedTrafficLightEnvironment),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Environment.TrafficLight.GREEN._,
      this.makeSvgBlobUrl(GreenTrafficLightEnvironment),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )
    this.load.svg(
      SVGs.Environment.Grass.CFC._,
      this.makeSvgBlobUrl(CFCEnvironment),
      {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
      },
    )
    this.load.svg(
      SVGs.Environment.Grass.HOUSE._,
      this.makeSvgBlobUrl(HouseEnvironment),
      {
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
      },
    )
    this.load.svg(
      SVGs.Environment.Grass.SOLAR_PANEL._,
      this.makeSvgBlobUrl(SolarPanelEnvironment),
      { width: TILE_WIDTH, height: TILE_HEIGHT },
    )

    // Scenery
    this.load.svg(SVGs.Scenery.BUSH._, this.makeSvgBlobUrl(BushScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })

    this.load.svg(SVGs.Scenery.POND._, this.makeSvgBlobUrl(PondScenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.TREE1._, this.makeSvgBlobUrl(Tree1Scenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
    this.load.svg(SVGs.Scenery.TREE2._, this.makeSvgBlobUrl(Tree2Scenery), {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
  }

  create() {
    // When all the assets have loaded, it's often worth creating global objects
    // here that the rest of the game can use. For example, you can define
    // global animations here, so we can use them in other scenes.

    // Call the base class's create() method to perform any necessary cleanup.
    super.create()

    void (async () => {
      const levelId = this.game.registry.get(Variables.LEVEL_ID) as number
      console.log("Preloader: Loading assets for level", levelId)
      const { default: data } = (await import(
        `../../tilemaps/level${levelId}`
      )) as { default: TiledMap }

      this.cache.tilemap.add("level", {
        format: Phaser.Tilemaps.Formats.TILED_JSON,
        data,
      })

      // Start the game.
      this.scene.start(Scenes.LEVEL)
    })()
  }
}
